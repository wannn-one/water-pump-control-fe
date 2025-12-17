<template>
    <article class="h-fit w-full flex flex-col">
        <div class="w-full h-fit flex items-center">
            <p class="h-fit transform rotate-180 text-xs text-center w-6" style="writing-mode: vertical-rl;">
                Jumlah Aktif
            </p>

            <div class="flex-1" id="pump-activity-chart"></div>
        </div>

        <p class="text-center text-xs text-black">Waktu (Detik Berjalan)</p>
    </article>
</template>

<script>
// TIDAK PERLU IMPORT APEXCHARTS LAGI
// import ApexCharts from 'apexcharts'; <-- HAPUS INI

export default {
    name: "ActivePumpChart",
    data() {
        return {
            chart: null,
            currentSecond: 0,
            intervalSeconds: 15,  // Update setiap 2 detik
            maxVisiblePoints: 6, // Menampilkan 30 detik (15 titik * 2 detik)
            validPumpIds: ['P-001', 'P-002', 'P-003'] // Filter hanya pompa ini
        }
    },
    methods: {
        initializeChart() {
            // Generate label waktu awal (0, 2, 4, ... 28)
            const initialCategories = Array.from({ length: this.maxVisiblePoints }, (_, i) => {
                return i * this.intervalSeconds;
            });
            // Set waktu berjalan ke angka terakhir
            this.currentSecond = initialCategories[initialCategories.length - 1];

            const chartElement = document.querySelector("#pump-activity-chart");

            // Langsung panggil new ApexCharts (karena sudah global)
            this.chart = new ApexCharts(chartElement, {
                chart: {
                    height: 300, // Tinggi disamakan dengan Chart.vue
                    type: 'line',
                    toolbar: { show: false },
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: { speed: 1000 }
                    },
                    zoom: { enabled: false },
                },
                series: [{
                    name: 'Pompa Aktif',
                    // Data awal 0 semua
                    data: Array.from({ length: this.maxVisiblePoints }, () => 0),
                }],
                colors: ['#22c55e'], // Warna Hijau
                stroke: {
                    curve: 'stepline', // Grafik Patah-patah (Step Line)
                    width: 4 // Ketebalan disamakan
                },
                xaxis: {
                    type: 'category',
                    tickPlacement: 'on',
                    categories: initialCategories,
                    axisBorder: { show: false },
                    axisTicks: {
                        show: true,
                        borderType: 'solid',
                        color: '#9ca3af',
                    },
                    labels: {
                        style: {
                            colors: '#9ca3af',
                            fontSize: '13px',
                            fontFamily: 'Fredoka, ui-sans-serif',
                            fontWeight: 400
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    max: 3, // Skala 0 sampai 3
                    tickAmount: 3, // Supaya muncul angka bulat: 0, 1, 2, 3
                    labels: {
                        align: 'left',
                        style: {
                            colors: '#9ca3af',
                            fontSize: '13px',
                            fontFamily: 'Fredoka, ui-sans-serif',
                            fontWeight: 400
                        },
                        formatter: (value) => value.toFixed(0)
                    },
                },
                grid: {
                    strokeDashArray: 2
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " Unit ON"
                        }
                    }
                }
            });

            this.chart.render();
        },
        async fetchNewDataPoint() {
            try {
                // Ambil data dari API
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}system/status`);
                if (!response.ok) throw new Error(`API Error`);

                const result = await response.json();

                if (result.success && result.data && result.data.pumps) {
                    // Filter pompa yang ID-nya valid DAN statusnya ON
                    const activeCount = result.data.pumps.filter(p =>
                        this.validPumpIds.includes(p.pumpId) && p.status === 'ON'
                    ).length;
                    return activeCount;
                }
                return 0;

            } catch (error) {
                // Silent error agar grafik tetap jalan (nilai 0)
                return 0;
            }
        },
        updateChartData() {
            setInterval(async () => {
                const newDataPoint = await this.fetchNewDataPoint();
                this.currentSecond += this.intervalSeconds;

                const seriesData = this.chart.w.config.series[0].data;
                const categories = this.chart.w.config.xaxis.categories;

                // Push data baru
                seriesData.push(newDataPoint);
                categories.push(this.currentSecond);

                // Buang data lama jika melebihi batas
                if (seriesData.length > this.maxVisiblePoints) {
                    seriesData.shift();
                    categories.shift();
                }

                // Update Grafik
                this.chart.updateOptions({
                    xaxis: { categories: categories }
                });

                this.chart.updateSeries([{ data: seriesData }]);

            }, this.intervalSeconds * 1000);
        }
    },
    mounted() {
        this.initializeChart();
        this.updateChartData();
    }
};
</script>