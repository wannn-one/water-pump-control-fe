<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import Navbar from "./components//partials/Navbar.vue";
import Chart from "./components/Chart.vue"
import pump from "./components/Pump.vue";
import Schema from "./components/Schema.vue";

const waterLevels = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 10;
let fetchInterval = null;

const fetchWaterLevels = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://103.127.137.40/api/waterlevel/history/all?page=${page}&limit=${limit}`);
    const result = await response.json();
    waterLevels.value = result.data;
    currentPage.value = result.pagination.currentPage;
    totalPages.value = result.pagination.totalPages;
  } catch (error) {
    console.error("Error fetching water levels:", error);
  }
};

const downloadCSV = () => {
  window.location.href = "http://103.127.137.40/api/waterlevel/history/download/csv";
};

onMounted(() => {
  setTimeout(() => {
    window.HSStaticMethods.autoInit();
  }, 100);

  // Initial fetch
  fetchWaterLevels();

  // Set up interval for fetching water levels every 10 seconds
  fetchInterval = setInterval(() => {
    fetchWaterLevels(currentPage.value, pageSize);
  }, 10000); // 10 seconds
});

// Clear interval when component is unmounted
onUnmounted(() => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
  }
});
</script>

<template>
  <header class="bg-card w-full h-16 shadow border-b-4 border-main fixed z-10">
    <Navbar />
  </header>
  <main class="p-12 py-6 overflow-x-hidden pt-20">
    <article class="w-full grid grid-cols-4 gap-6">
      <section class="col-span-4 flex gap-4">
        <section class="bg-card w-full h-full rounded-xl p-4 drop-shadow-2xl grid gap-6">
          <h1 class="text-xl font-medium">Grafik Pembacaan Level Air</h1>
          <Chart />
        </section>
        <section class="bg-card min-w-[615px] h-full rounded-xl p-4 drop-shadow-2xl relative">
          <Schema />
        </section>
      </section>
      <section class="bg-card w-full border border-main col-span-3 rounded-xl p-6 drop-shadow-2xl">
        <h1 class="text-xl font-medium">Sistem Pengendali Pompa</h1>
        <article class="w-full rounded-xl py-4 grid grid-cols-3 gap-4">
          <pump :id="1" :content="{ title: 'P-001' }" />
          <pump :id="2" :content="{ title: 'P-002' }" />
          <pump :id="3" :content="{ title: 'P-003' }" />
        </article>
      </section>
      <section class="bg-card w-full border border-main col-span-1 rounded-xl p-6 drop-shadow-2xl">
        <h1 class="text-xl font-medium">Pompa Sirkulasi</h1>
        <article class="w-full rounded-xl py-4 grid grid-cols-1 gap-4">
          <pump :id="4" :content="{ title: 'P-004' }" />
        </article>

      </section>
      <section class="bg-card w-full border border-main col-span-4 rounded-xl p-6 drop-shadow-2xl">
        <h1 class="text-xl font-medium">Histori Pembacaan Level Air</h1>
        <!-- Table -->
        <table class="w-full">
          <thead>
            <tr>
              <th class="border border-main">No</th>
              <th class="border border-main">Sensor ID</th>
              <th class="border border-main">Level Air</th>
              <th class="border border-main">Kondisi</th>
              <th class="border border-main">Terakhir Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in waterLevels" :key="item._id">
              <td class="border border-main">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="border border-main">{{ item.sensorId }}</td>
              <td class="border border-main">{{ item.reading }}</td>
              <td class="border border-main">{{ item.condition }}</td>
              <td class="border border-main">{{ new Date(item.lastUpdated).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="flex justify-between mt-4">
          <button
            class="bg-main text-white px-4 py-2 rounded-lg"
            :disabled="currentPage === 1"
            @click="fetchWaterLevels(currentPage - 1)"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="bg-main text-white px-4 py-2 rounded-lg"
            :disabled="currentPage === totalPages"
            @click="fetchWaterLevels(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </section>

       <!-- Button Download CSV Centered -->
       <section class="col-span-4 flex justify-center mt-4">
        <button class="bg-main text-white px-4 py-2 rounded-lg" @click="downloadCSV">
          Download CSV
        </button>
      </section>

    </article>
  </main>
</template>
