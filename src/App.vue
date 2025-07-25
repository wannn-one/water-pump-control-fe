<template>
  <header class="bg-card w-full h-16 shadow border-b-4 border-main fixed z-10">
    <Navbar />
  </header>

  <main class="p-4 sm:p-8 lg:p-12 py-6 overflow-x-hidden pt-20">

    <div v-if="isLoading" class="flex justify-center items-center h-64 text-gray-500 text-xl">
      <p>Memuat data sistem...</p>
    </div>
    <div v-else-if="errorMessage" class="flex justify-center items-center h-64 text-red-500 text-xl p-4 bg-red-100 rounded-lg">
      <p>{{ errorMessage }}</p>
    </div>
    
    <article v-else class="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">

      <section class="col-span-1 lg:col-span-4 flex justify-between items-center mb-2">
        <h1 class="text-2xl font-bold text-gray-700">Dashboard Sistem Monitoring</h1>
        <ModeToggle 
          :mode="currentSystemMode"
          @toggle="toggleSystemMode"
          :disabled="isModeLoading"
        />
      </section>

      <section class="col-span-1 lg:col-span-4 flex flex-col xl:flex-row gap-6">
        <section class="bg-card w-full h-full rounded-xl p-4 drop-shadow-2xl grid gap-6">
          <h1 class="text-xl font-medium">Grafik Pembacaan Level Air</h1>
          <Chart />
        </section>
        <section class="bg-card min-w-[300px] xl:min-w-[615px] h-full rounded-xl p-4 drop-shadow-2xl relative">
          <Schema 
            :pumps="pumps" 
            :tank="tank"
            :systemCondition="systemCondition"
          />
        </section>
      </section>

      <section class="bg-card w-full border border-main col-span-1 lg:col-span-4 rounded-xl p-6 drop-shadow-2xl">
        <h1 class="text-xl font-medium">Sistem Pengendali Pompa</h1>
        <article class="w-full rounded-xl py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Pump 
            v-for="pump in pumps" 
            :key="pump.pumpId" 
            :pump="pump"
            @toggle="handlePumpToggle"
          />
        </article>
      </section>
      
      <section class="bg-card w-full border border-main col-span-1 lg:col-span-4 rounded-xl p-6 drop-shadow-2xl">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 class="text-xl font-medium">Histori Pembacaan Level Air</h1>
          <div class="flex items-center gap-2 mt-3 sm:mt-0">
            <label for="pageSize" class="text-sm">Tampilkan:</label>
            <select id="pageSize" v-model="pageSize" @change="fetchHistoryTable(1)" class="border border-gray-300 rounded p-1">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <span class="text-sm">data</span>
          </div>
        </div>
        
        <div class="overflow-x-auto mt-4">
          <table class="w-full text-center text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-main p-2">No</th>
                <th class="border border-main p-2">Waktu Pencatatan</th>
                <th class="border border-main p-2">Level Air (cm)</th>
                <th class="border border-main p-2">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="history.length === 0">
                <td colspan="4" class="text-center border border-main py-4">Tidak ada data histori...</td>
              </tr>
              <tr v-else v-for="(item, index) in history" :key="item._id" class="hover:bg-gray-50">
                <td class="border border-main p-2">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="border border-main p-2">{{ new Date(item.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' }) }}</td>
                <td class="border border-main p-2 font-semibold">{{ item.level.toFixed(2) }}</td>
                <td class="border border-main p-2">
                    <span 
                      class="px-2 py-1 text-xs font-bold rounded-full"
                      :class="getConditionClass(item.level)"
                    >
                      {{ getConditionForLevel(item.level) }}
                    </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center mt-4">
          <button @click="fetchHistoryTable(currentPage - 1)" :disabled="currentPage === 1" class="bg-main text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
          <span class="text-sm font-medium">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <button @click="fetchHistoryTable(currentPage + 1)" :disabled="currentPage === totalPages" class="bg-main text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
        </div>
      </section>

      <section class="bg-card w-full border border-main col-span-1 lg:col-span-4 rounded-xl p-6 drop-shadow-2xl">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 class="text-xl font-medium">Histori Aksi Kontrol</h1>
          <div class="flex items-center gap-2 mt-3 sm:mt-0">
            <label for="actionLogPageSize" class="text-sm">Tampilkan:</label>
            <select id="actionLogPageSize" v-model="actionLogPageSize" @change="fetchActionLogs(1)" class="border border-gray-300 rounded p-1">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <span class="text-sm">data</span>
          </div>
        </div>
        
        <div class="overflow-x-auto mt-4">
          <table class="w-full text-center text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-main p-2">Waktu</th>
                <th class="border border-main p-2">Sumber Aksi</th>
                <th class="border border-main p-2">Tipe Aksi</th>
                <th class="border border-main p-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="actionLogs.length === 0">
                <td colspan="4" class="text-center border border-main py-4">Tidak ada data log aksi...</td>
              </tr>
              <tr v-else v-for="log in actionLogs" :key="log._id" class="hover:bg-gray-50">
                <td class="border border-main p-2">{{ new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' }) }}</td>
                <td class="border border-main p-2">
                  <span class="px-2 py-1 text-xs font-bold rounded-full" :class="log.source === 'USER_DASHBOARD' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                    {{ log.source }}
                  </span>
                </td>
                <td class="border border-main p-2">{{ log.actionType }}</td>
                <td class="border border-main p-2 text-left">{{ formatActionLogDetails(log) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center mt-4">
          <button @click="fetchActionLogs(actionLogCurrentPage - 1)" :disabled="actionLogCurrentPage === 1" class="bg-main text-white px-4 py-2 rounded-lg disabled:opacity-50">Previous</button>
          <span class="text-sm font-medium">Halaman {{ actionLogCurrentPage }} dari {{ actionLogTotalPages }}</span>
          <button @click="fetchActionLogs(actionLogCurrentPage + 1)" :disabled="actionLogCurrentPage === actionLogTotalPages" class="bg-main text-white px-4 py-2 rounded-lg disabled:opacity-50">Next</button>
        </div>
      </section>
      
      <section class="col-span-1 lg:col-span-4 flex flex-wrap justify-center gap-4 mt-4">
        <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold" @click="downloadSensorHistoryCSV">
          Unduh Histori Sensor (CSV)
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold" @click="downloadActionLogCSV">
          Unduh Log Aksi Kontrol (CSV)
        </button>
      </section>

    </article>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from "./components/partials/Navbar.vue";
import Chart from "./components/Chart.vue";
import Pump from "./components/Pump.vue";
import Schema from "./components/Schema.vue";
import ModeToggle from './components/partials/ModeToggle.vue';

const systemStatus = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');
let pollingInterval = null;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const history = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(5);

const actionLogs = ref([]);
const actionLogCurrentPage = ref(1);
const actionLogTotalPages = ref(1);
const actionLogPageSize = ref(5);

const isModeLoading = ref(false);

const pumps = computed(() => systemStatus.value ? systemStatus.value.pumps : []);
const tank = computed(() => systemStatus.value ? systemStatus.value.tank : null);
const systemCondition = computed(() => systemStatus.value ? systemStatus.value.systemCondition : 'UNKNOWN');
const currentSystemMode = computed(() => systemStatus.value?.systemCondition === 'MANUAL_OVERRIDE' ? 'MANUAL' : 'AUTO');

function getConditionForLevel(level) {
    if (level <= 15) return 'NORMAL 1';
    if (level <= 34) return 'NORMAL 2';
    if (level <= 54) return 'SIAGA';
    return 'BANJIR';
}

function getConditionClass(level) {
    const condition = getConditionForLevel(level);
    switch (condition) {
        case 'NORMAL 1': return 'bg-blue-100 text-blue-800';
        case 'NORMAL 2': return 'bg-green-100 text-green-800';
        case 'SIAGA': return 'bg-yellow-100 text-yellow-800';
        case 'BANJIR': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function formatActionLogDetails(log) {
  if (log.actionType === 'PUMP_STATUS_CHANGE') {
    return `Pompa ${log.details.pumpId} diubah menjadi ${log.details.status}`;
  }
  if (log.actionType === 'SYSTEM_MODE_CHANGE') {
    return `Mode sistem diubah menjadi ${log.details.newMode}`;
  }
  return JSON.stringify(log.details);
}

async function fetchSystemStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}system/status`);
    if (!response.ok) throw new Error('Gagal mengambil data status sistem. Server mungkin tidak berjalan.');
    const result = await response.json();
    if (result.success) {
      systemStatus.value = result.data;
    } else {
      throw new Error(result.message || 'Gagal memuat status sistem.');
    }
  } catch (error) {
    console.error("Error fetching system status:", error);
    errorMessage.value = error.message;
    if(pollingInterval) clearInterval(pollingInterval);
  } finally {
    isLoading.value = false;
  }
}

async function fetchHistoryTable(page = 1) {
  if (page < 1 || (page > totalPages.value && totalPages.value > 0)) return;
  try {
    const response = await fetch(`${API_BASE_URL}history/table?page=${page}&limit=${pageSize.value}`);
    if (!response.ok) throw new Error('Gagal mengambil data histori');
    const result = await response.json();
    if (result.success) {
      history.value = result.data;
      currentPage.value = result.pagination.currentPage;
      totalPages.value = result.pagination.totalPages;
    }
  } catch (error) {
    console.error("Error fetching history table:", error);
  }
}

async function handlePumpToggle(pumpId) {
  const pumpIndex = pumps.value.findIndex(p => p.pumpId === pumpId);
  if (pumpIndex === -1) return;

  const originalStatus = pumps.value[pumpIndex].status;
  const newStatus = originalStatus === 'ON' ? 'OFF' : 'ON';
  pumps.value[pumpIndex].status = newStatus; // Optimistic UI

  try {
    const response = await fetch(`${API_BASE_URL}pump/${pumpId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) throw new Error('Perintah ke server gagal!');
    const result = await response.json();
    console.log(`Server merespons: ${result.message}`);
    setTimeout(fetchSystemStatus, 500); 
  } catch (error) {
    console.error(`Gagal mengubah status pompa ${pumpId}:`, error);
    pumps.value[pumpIndex].status = originalStatus; // Kembalikan state jika gagal
    alert(`Gagal mengubah status pompa ${pumpId}.`);
  }
}

async function toggleSystemMode() {
  if (isModeLoading.value || !systemStatus.value) return;
  isModeLoading.value = true;

  const originalCondition = systemStatus.value.systemCondition;
  const newMode = currentSystemMode.value === 'AUTO' ? 'MANUAL' : 'AUTO';

  if (newMode === 'MANUAL') {
    systemStatus.value.systemCondition = 'MANUAL_OVERRIDE';
  } else {
    const currentLevel = systemStatus.value.tank.currentLevelCm;
    const newCalculatedCondition = getConditionForLevel(currentLevel);
    systemStatus.value.systemCondition = newCalculatedCondition;
  }

  try {
    const response = await fetch(`${API_BASE_URL}system/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: newMode })
    });
    if (!response.ok) throw new Error('Perintah ganti mode gagal dikirim');
    
    const result = await response.json();
    console.log(`Server merespons: ${result.message}`);
    setTimeout(fetchSystemStatus, 1000);
  } catch (error) {
    console.error(`Gagal mengubah mode ke ${newMode}:`, error);
    systemStatus.value.systemCondition = originalCondition;
    alert(`Gagal mengubah mode sistem.`);
  } finally {
    setTimeout(() => { isModeLoading.value = false; }, 1500);
  }
}

async function fetchActionLogs(page = 1) {
  if (page < 1 || (page > actionLogTotalPages.value && actionLogTotalPages.value > 0)) return;
  try {
    const response = await fetch(`${API_BASE_URL}logs/actions?page=${page}&limit=${actionLogPageSize.value}`);
    if (!response.ok) throw new Error('Gagal mengambil data log aksi');
    
    const result = await response.json();
    if (result.success) {
      actionLogs.value = result.data;
      actionLogCurrentPage.value = result.pagination.currentPage;
      actionLogTotalPages.value = result.pagination.totalPages;
    }
  } catch (error) {
    console.error("Error fetching action logs:", error);
  }
}

function downloadSensorHistoryCSV() {
    window.open(`${API_BASE_URL}history/download/csv`, '_blank');
}
function downloadActionLogCSV() {
    window.open(`${API_BASE_URL}logs/actions/download/csv`, '_blank');
}

onMounted(() => {
  fetchSystemStatus();
  fetchHistoryTable();
  fetchActionLogs();

  pollingInterval = setInterval(() => {
    fetchSystemStatus();
    if (currentPage.value === 1) fetchHistoryTable(1);
    if (actionLogCurrentPage.value === 1) fetchActionLogs(1);
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
