<template>
  <div ref="mountPoint" class="relative w-full h-full rounded-xl overflow-hidden">
    <div v-if="isLoading" class="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-80 z-20">
      <p class="text-gray-600">Memuat model 3D...</p>
    </div>
    <div v-if="loadError" class="absolute inset-0 flex justify-center items-center bg-red-100 bg-opacity-80 z-20">
      <p class="text-red-600">{{ loadError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const props = defineProps({
    pumps: { type: Array, required: true },
    tank: { type: Object, required: true },
    systemCondition: { type: String, required: true }
});

const mountPoint = ref(null);
const isLoading = ref(true);
const loadError = ref('');
let renderer, scene, camera, controls, loadedModel, colorUpdateInterval;

const colorOn = new THREE.Color(0x4ade80);
const colorOff = new THREE.Color(0x9ca3af);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  camera = new THREE.PerspectiveCamera(50, mountPoint.value.clientWidth / mountPoint.value.clientHeight, 0.1, 10000);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mountPoint.value.clientWidth, mountPoint.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mountPoint.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(
    '/PumpDesign.glb',
    (gltf) => {
      loadedModel = gltf.scene;
      
      loadedModel.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
        }
      });

      const initialBox = new THREE.Box3().setFromObject(loadedModel);
      const center = initialBox.getCenter(new THREE.Vector3());
      loadedModel.position.sub(center);
      loadedModel.rotation.x = Math.PI / 2;
      const rotatedBox = new THREE.Box3().setFromObject(loadedModel);
      loadedModel.position.y -= rotatedBox.min.y;
      const verticalOffset = 0;
      loadedModel.position.y += verticalOffset;

      const size = rotatedBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraDistance = Math.abs(maxDim / 1.5 / Math.tan(fov / 2));
      cameraDistance *= 0.9;
      controls.target.set(maxDim * 0.2, size.y / 2 + verticalOffset, 0);
      camera.position.set(
        cameraDistance * 0.5,
        cameraDistance * 0.5 + verticalOffset,
        cameraDistance * 0.5
      );
      controls.update();

      scene.add(loadedModel);
      isLoading.value = false;

      updatePumpColors();

      colorUpdateInterval = setInterval(() => {
        updatePumpColors();
      }, 5000);
    },
    undefined,
    (error) => {
      console.error('Gagal memuat model 3D:', error);
      loadError.value = 'Gagal memuat file model 3D.';
      isLoading.value = false;
    }
  );

  animate();
}

function updatePumpColors() {
    if (!loadedModel || !scene || props.pumps.length === 0) {
        return;
    }

    props.pumps.forEach(pump => {
        const objectNameInModel = pump.pumpId
        if (!objectNameInModel) {
            console.warn(`Tidak ada pemetaan nama untuk pumpId '${pump.pumpId}'`);
            return;
        }

        const pumpObject = loadedModel.getObjectByName(objectNameInModel);

        if (pumpObject) {
            const targetColor = pump.status === 'ON' ? colorOn : colorOff;
            
            pumpObject.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material = child.material.clone();
                    child.material.color.copy(targetColor);
                }
            });
        } else {
            console.warn(`Objek 3D dengan nama '${objectNameInModel}' tidak ditemukan di dalam model.`);
        }
    });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
    if (mountPoint.value && renderer) {
        camera.aspect = mountPoint.value.clientWidth / mountPoint.value.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountPoint.value.clientWidth, mountPoint.value.clientHeight);
    }
}

onMounted(async () => {
  await nextTick();
  if (mountPoint.value) {
    init();
    window.addEventListener('resize', onWindowResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  
  if (colorUpdateInterval) {
    clearInterval(colorUpdateInterval);
  }
  
  if (renderer) {
    renderer.dispose();
    const canvas = renderer.domElement;
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
});

watch(props.pumps, (newPumps) => {
    updatePumpColors();
}, { deep: true });

</script>
