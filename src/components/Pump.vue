<template>
  <section class="bg-card w-full h-fit border border-t-main rounded-xl p-6 drop-shadow-xl relative overflow-hidden">

    <div class="flex justify-between items-start mb-2">
      <h1 class="text-xl font-medium">{{ pump.pumpId }}</h1>

      <div class="flex flex-col items-center gap-1">
        <div class="w-4 h-4 rounded-full shadow-sm transition-all duration-300 border border-gray-300"
          :class="isIndicatorOn ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-none'">
        </div>
        <span class="text-[10px] font-bold text-gray-500">
          {{ isIndicatorOn ? 'RUNNING' : 'STOPPED' }}
        </span>
      </div>
    </div>

    <section class="flex w-full justify-between items-end">
      <img class="bg-cover h-20 transition-all duration-500"
        :class="{ 'animate-pump': isIndicatorOn, 'grayscale': !isIndicatorOn, 'opacity-80': !isIndicatorOn }"
        src="/src/assets/img/Pump.png" alt="Pompa">

      <section class="flex flex-col justify-end items-center w-28">
        <button @click="togglePump"
          class="text-white p-1 rounded-lg w-full flex gap-2 transition-all duration-300 ease-in-out items-center shadow-md active:scale-95"
          :class="{ 'bg-ongreen flex-row-reverse': isButtonOn, 'bg-secondary': !isButtonOn }">

          <div class="bg-white size-6 rounded-md p-1 shadow-sm"></div>
          <p class="font-semibold text-sm mx-auto">{{ isButtonOn ? 'ON' : 'OFF' }}</p>
        </button>
      </section>
    </section>

  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  pump: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['toggle']);

// --- LOGIKA 1: ACTUAL / REAL (Indikator) ---
// Indikator HANYA nyala kalau Backend bilang ON.
const isIndicatorOn = computed(() => props.pump.status === 'ON');


// --- LOGIKA 2: MANUAL BUTTON (Optimistic) ---
// Kita inisialisasi status tombol dengan status awal, TAPI...
// Kita TIDAK pasang 'watch' ke props. 
// Efeknya: Kalau tiba-tiba sistem AUTO menyalakan pompa (props berubah jadi ON), 
// tombol ini bakal CUEK saja (tetap OFF), sesuai permintaanmu.
const localStatus = ref(props.pump.status);

const isButtonOn = computed(() => localStatus.value === 'ON');

function togglePump() {
  // 1. Ubah tampilan tombol SEKETIKA (Optimistic UI) saat diklik user
  localStatus.value = localStatus.value === 'ON' ? 'OFF' : 'ON';

  // 2. Kirim request ke backend via parent
  emit('toggle', props.pump.pumpId);
}
</script>

<style>
/* Style Helper jika belum ada di Tailwind */
.bg-ongreen {
  background-color: #22c55e;
}

/* Green-500 */
.bg-secondary {
  background-color: #9ca3af;
}

/* Gray-400 */

@keyframes pumpScale {
  0% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.9) scaleX(1.02);
  }

  100% {
    transform: scaleY(1);
  }
}

.animate-pump {
  animation: pumpScale 1s ease-in-out infinite;
}
</style>