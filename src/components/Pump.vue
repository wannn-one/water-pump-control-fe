<template>
    <section class="bg-card w-full h-fit border border-t-main rounded-xl p-6 drop-shadow-xl">
      <h1 class="text-xl font-medium">{{ pump.pumpId }}</h1>
      <section class="flex w-full justify-between">
        <img class="bg-cover h-20" :class="{ 'animate-pump': isPumpOn }" src="/src/assets/img/Pump.png" alt="Pompa">
        <section class="flex flex-col justify-end items-center">
          <button @click="togglePump"
            class="text-white p-1 rounded-lg w-full flex gap-2 transition-all duration-300 ease-in-out"
            :class="{ 'bg-ongreen flex-row-reverse': isPumpOn, 'bg-secondary': !isPumpOn }">
            <div class="bg-white size-6 rounded-md p-1"></div>
            <p>{{ isPumpOn ? 'ON' : 'OFF' }}</p>
          </button>
        </section>
      </section>
    </section>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // 1. Komponen menerima seluruh objek 'pump' sebagai prop dari induknya
  const props = defineProps({
    pump: {
      type: Object,
      required: true,
      // Contoh objek pump: { pumpId: 'P-001', status: 'ON' }
    }
  });
  
  // 2. Komponen akan memberitahu induknya saat ada event 'toggle'
  const emit = defineEmits(['toggle']);
  
  // 3. 'computed property' untuk mengubah status 'ON'/'OFF' menjadi nilai boolean (true/false)
  //    Ini berguna untuk class binding di template.
  const isPumpOn = computed(() => props.pump.status === 'ON');
  
  // 4. Method yang dipanggil saat tombol diklik
  function togglePump() {
    // Komponen ini tidak lagi membuat API call sendiri.
    // Ia hanya mengirim sinyal (emit) ke komponen induk, membawa ID pompa yang perlu diubah.
    emit('toggle', props.pump.pumpId);
  }
  </script>
  
  <style>
  @keyframes pumpScale {
    0% { transform: scaleY(1); }
    50% { transform: scaleY(0.8); }
    100% { transform: scaleY(1); }
  }
  
  .animate-pump {
    animation: pumpScale 2s ease-in-out infinite;
  }
  </style>