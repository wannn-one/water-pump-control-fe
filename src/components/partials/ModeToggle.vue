<template>
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium" :class="isAuto ? 'text-gray-400' : 'text-black font-bold'">
        MANUAL
      </span>
      <button
        @click="emit('toggle')"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
        :class="isAuto ? 'bg-green-500' : 'bg-gray-300'"
        role="switch"
        :aria-checked="isAuto"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          :class="{ 'translate-x-5': isAuto, 'translate-x-0': !isAuto }"
        ></span>
      </button>
      <span class="text-sm font-medium" :class="isAuto ? 'text-green-600 font-bold' : 'text-gray-400'">
        AUTO
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Komponen ini menerima 'mode' saat ini ('AUTO' atau 'MANUAL')
  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['AUTO', 'MANUAL'].includes(value)
    }
  });
  
  // Memberi sinyal 'toggle' ke parent saat diklik
  const emit = defineEmits(['toggle']);
  
  // Menentukan posisi switch berdasarkan prop 'mode'
  const isAuto = computed(() => props.mode === 'AUTO');
  </script>