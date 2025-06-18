<template>
    <section class="bg-card size-fit border rounded-xl p-10 drop-shadow-xl absolute z-10 scale-75">
        <h1 class="text-xl font-medium text-center mb-1">{{ tank.tankId || 'TK-XXX' }}</h1>

        <section class="relative flex w-full justify-center items-center">
            <div class="relative w-[80px] h-[100px] bg-contain bg-no-repeat bg-center">
                <img src="/src/assets/img/waterTank.png" alt="Tank" class="absolute top-0 left-0 w-full h-full">
                <div class="absolute bottom-0 left-0 w-full bg-blue-400 rounded-b-md opacity-70 transition-all duration-500 ease-in-out"
                    :style="{ height: waterLevelPercentage + '%' }"></div>
            </div>

            <p class="absolute text-lg font-bold text-black drop-shadow-sm">
                {{ tank.currentLevelCm ? tank.currentLevelCm.toFixed(1) : '0.0' }} cm
            </p>
        </section>
    </section>
</template>

<script setup>
import { computed } from 'vue';

// 1. Ubah 'props' untuk menerima satu objek 'tank'
const props = defineProps({
    tank: {
        type: Object,
        required: true,
        // Contoh objek tank yang diharapkan: 
        // { tankId: 'TK-001', currentLevelCm: 45.8, sensorStatus: 'WORKING' }
    },
    // Prop ini bisa digunakan jika Anda ingin membedakan tampilan antara TK-001 dan TK-002
    isSecondary: {
        type: Boolean,
        default: false
    }
});

// 2. 'computed property' untuk menghitung persentase ketinggian air secara dinamis.
const waterLevelPercentage = computed(() => {
    // Pastikan props.tank dan currentLevelCm ada untuk menghindari error
    if (!props.tank || typeof props.tank.currentLevelCm !== 'number') {
        return 0;
    }

    // Asumsi kapasitas maksimal tanki adalah 70 cm (sesuai skala chart)
    const maxLevel = 70;
    const percentage = (props.tank.currentLevelCm / maxLevel) * 100;

    // Batasi nilainya antara 0 dan 100
    return Math.min(100, Math.max(0, percentage));
});
</script>

<style scoped>
/* Menambahkan style agar drop shadow pada teks lebih terlihat */
.drop-shadow-sm {
    filter: drop-shadow(0 1px 1px rgb(255 255 255 / 0.5));
}
</style>