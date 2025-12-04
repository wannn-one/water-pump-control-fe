<template>
    <section class="bg-card w-fit h-fit border rounded-xl p-5 drop-shadow-xl absolute z-10 scale-50" :class="{
        'bg-ongreen text-white': isPumpOn,
        'bg-neutral text-black': !isPumpOn
    }" style="transform: translateX(-60%) translateY(10%);">
        <h1 class="text-sm font-medium">{{ pump.pumpId }}</h1>
        <section class="flex w-full justify-between mt-1">
            <img class="bg-cover h-12" :class="{ 'animate-pump': isPumpOn }" src="/src/assets/img/Pump.png" alt="Pompa">
        </section>
    </section>
</template>

<script setup>
import { computed } from 'vue';

// 1. Komponen menerima dua props dari induknya:
//    - 'pump': Objek yang berisi info spesifik pompa (ID dan status)
//    - 'controlMode': String yang berisi mode kontrol sistem saat ini
const props = defineProps({
    pump: {
        type: Object,
        required: true,
        // Contoh: { pumpId: 'P-001', status: 'ON' }
    },
    controlMode: {
        type: String,
        required: true,
        // Contoh: 'SIAGA', 'MANUAL_OVERRIDE'
    }
});

// 2. Computed property untuk mengubah status 'ON'/'OFF' menjadi nilai boolean (true/false)
const isPumpOn = computed(() => props.pump.status === 'ON');

// 3. Computed property untuk menampilkan mode kontrol yang lebih ramah pengguna
const displayControlMode = computed(() => {
    if (props.controlMode === 'MANUAL_OVERRIDE') {
        return 'MANUAL';
    }
    return 'AUTO';
});

// Tidak ada lagi method 'data', 'mounted', 'fetchPumpStatus', 'updatePumpStatus', dll.
// Komponen ini murni untuk tampilan, sangat ringan dan efisien.
</script>

<style scoped>
@keyframes pumpScale {
    0% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(0.8);
    }

    100% {
        transform: scaleY(1);
    }
}

.animate-pump {
    animation: pumpScale 2s ease-in-out infinite;
}
</style>