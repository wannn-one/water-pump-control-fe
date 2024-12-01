<template>
    <article class="h-fit w-full flex flex-col">
        <div class="w-full h-fit flex items-center">
            <p class="h-fit transform rotate-180 text-xs" style="writing-mode: vertical-rl;">Level
                (Centimeter)</p>
            <div class="flex-1" id="water-level-chart"></div>
        </div>
        <p class="text-center text-xs text-black">Waktu (Second)</p>
        <div class="text-center mt-2">
            <p class="text-sm font-medium sensor-condition">Kondisi Sensor: UNKNOWN</p>
        </div>
    </article>
</template>

<script>
window.addEventListener('load', () => {
    const chartElement = document.querySelector("#water-level-chart");
    let currentSecond = 15; // Mulai dari detik 15
    const intervalSeconds = 15; // Update setiap 15 detik
    const maxVisiblePoints = 6; // Selalu tampilkan 6 series pada x-axis
    let chart;

    function initializeChart() {
        chart = new ApexCharts(chartElement, {
            chart: {
                height: 300,
                type: 'area',
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000 // 1 second animation for real-time effect
                    }
                },
                zoom: {
                    enabled: false
                },
            },
            series: [
                {
                    name: 'Level',
                    data: Array.from({ length: maxVisiblePoints }, () => 0), // Initialize with 6 zeros
                }
            ],
            xaxis: {
                type: 'category',
                tickPlacement: 'on',
                categories: Array.from({ length: maxVisiblePoints }, (_, i) => i < 5 ? '' : (i - 4) * intervalSeconds), // Labels 15, 30, 45, ...
                axisBorder: {
                    show: false
                },
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
                max: 70,
                labels: {
                    align: 'left',
                    style: {
                        colors: '#9ca3af',
                        fontSize: '13px',
                        fontFamily: 'Fredoka, ui-sans-serif',
                        fontWeight: 400
                    },
                    formatter: (value) => value
                },
            },
            stroke: {
                curve: 'smooth',
                width: 4,
                colors: ['#9487E8']
            },
            grid: {
                strokeDashArray: 2
            },
            fill: {
                type: 'gradient',
                colors: ['#9487E8'],
            },
            tooltip: {
                x: {
                    format: 'ss',
                }
            }
        });

        chart.render();
    }

    async function fetchNewDataPoint() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}waterlevel`);
            const data = await response.json();
            console.log(data);
        
            // Asumsikan hanya satu sensor pada API respons, gunakan lastReading dan sensorCondition
            if (data.length > 0) {
                const { lastReading, sensorCondition } = data[0]; // Ambil lastReading dan sensorCondition dari sensor pertama
                updateSensorCondition(sensorCondition); // Perbarui tampilan kondisi sensor
                return lastReading !== null ? lastReading : 0; // Jika lastReading null, kembalikan 0
            }
        
            updateSensorCondition("UNKNOWN"); // Tampilkan UNKNOWN jika tidak ada data
            return 0; // Jika tidak ada data, kembalikan 0
        } catch (error) {
            console.error('Error fetching new data point:', error);
            updateSensorCondition("ERROR"); // Tampilkan ERROR jika fetch gagal
            return 0; // Mengembalikan 0 jika terjadi error
        }  
    }

    function updateSensorCondition(condition) {
        const conditionElement = document.querySelector(".sensor-condition");
        if (conditionElement) {
            conditionElement.textContent = `Kondisi Sensor: ${condition}`;
            // Tambahkan gaya dinamis untuk warna berdasarkan kondisi
            conditionElement.style.color = getConditionColor(condition);
        }
    }

    function getConditionColor(condition) {
        switch (condition) {
            case "NORMAL":
                return "green";
            case "SIAGA":
                return "orange";
            case "BAHAYA":
                return "red";
            default:
                return "gray";
        }
    }

    function updateChartData() {
        setInterval(async () => {
            const newDataPoint = await fetchNewDataPoint();

            const seriesData = chart.w.config.series[0].data;
            let categories = chart.w.config.xaxis.categories;

            // Tambahkan titik data baru ke dalam series
            seriesData.push(newDataPoint);

            // Jika jumlah data melebihi jumlah maksimum tampilan, hapus data pertama
            if (seriesData.length > maxVisiblePoints) {
                seriesData.shift();
            }

            // Atur kategori waktu pada sumbu x seperti yang sudah ada
            categories = Array.from({ length: maxVisiblePoints }, (_, i) => {
                if (i < 5 && currentSecond === 15) {
                    return '';
                } else {
                    if (currentSecond === 30 && i >= 0 && i <= 3) {
                        return '';
                    }
                    if (currentSecond === 45 && i >= 0 && i <= 2) {
                        return '';
                    }
                    if (currentSecond === 60 && i >= 0 && i <= 1) {
                        return '';
                    }
                    if (currentSecond === 75 && i === 0) {
                        return '';
                    }
                    return currentSecond + (i - 5) * intervalSeconds;
                }
            });

            // Mengatur ulang sumbu y berdasarkan data terbaru
            let minY = Math.min(...seriesData); // Nilai minimum dari data saat ini
            let maxY = Math.max(...seriesData); // Nilai maksimum dari data saat ini

            // Jika minY sama dengan maxY atau minY > maxY, tambahkan rentang default
            if (minY === maxY) {
                minY -= 5;
                maxY += 5;
            } else if (minY > maxY) {
                const temp = minY;
                minY = maxY - 5; // Set minY lebih kecil dari maxY
                maxY = temp + 5; // Set maxY lebih besar dari minY
            }

            chart.updateOptions({
                xaxis: {
                    categories: categories.map(cat => (cat === '' ? '' : `${cat}`))
                },
                yaxis: {
                    min: minY, // Menggunakan nilai minY yang disesuaikan
                    max: maxY  // Menggunakan nilai maxY yang disesuaikan
                }
            });

            // Memperbarui grafik dengan data terbaru
            chart.updateSeries([{
                data: seriesData
            }]);

            currentSecond += intervalSeconds;

        }, intervalSeconds * 1000);
    }

    initializeChart();
    updateChartData();
});

export default {
    name: "Chart",
};
</script>
