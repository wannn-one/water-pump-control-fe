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
export default {
    name: "Chart",
    data() {
        return {
            chart: null,
            currentSecond: 15,
            intervalSeconds: 15,
            maxVisiblePoints: 6
        }
    },
    methods: {
        initializeChart() {
            const chartElement = document.querySelector("#water-level-chart");
            this.chart = new ApexCharts(chartElement, {
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
                            speed: 1000
                        }
                    },
                    zoom: {
                        enabled: false
                    },
                },
                series: [
                    {
                        name: 'Level',
                        data: Array.from({ length: this.maxVisiblePoints }, () => 0),
                    }
                ],
                xaxis: {
                    type: 'category',
                    tickPlacement: 'on',
                    categories: Array.from({ length: this.maxVisiblePoints }, (_, i) => i < 5 ? '' : (i - 4) * this.intervalSeconds),
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

            this.chart.render();
        },
        async fetchNewDataPoint() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}system/status`);
                if (!response.ok) {
                    throw new Error(`API response error: ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data && result.data.tank) {
                    const level = result.data.tank.currentLevelCm;
                    const systemCondition = result.data.systemCondition;
                    this.updateSensorCondition(systemCondition);
                    return level !== null ? level : 0;
                }

                this.updateSensorCondition("UNKNOWN");
                return 0;

            } catch (error) {
                console.error('Error fetching new data point:', error);
                this.updateSensorCondition("ERROR");
                return 0;
            }
        },
        updateSensorCondition(condition) {
            const conditionElement = document.querySelector(".sensor-condition");
            if (conditionElement) {
                conditionElement.textContent = `Kondisi Sensor: ${condition}`;
                conditionElement.style.color = this.getConditionColor(condition);
            }
        },
        getConditionColor(condition) {
            switch (condition) {
                case "NORMAL 1":
                    return "green";
                case "NORMAL 2":
                    return "green";
                case "SIAGA":
                    return "orange";
                case "BANJIR":
                    return "red";
                default:
                    return "gray";
            }
        },
        updateChartData() {
            setInterval(async () => {
                const newDataPoint = await this.fetchNewDataPoint();

                const seriesData = this.chart.w.config.series[0].data;
                let categories = this.chart.w.config.xaxis.categories;

                seriesData.push(newDataPoint);

                if (seriesData.length > this.maxVisiblePoints) {
                    seriesData.shift();
                }

                categories = Array.from({ length: this.maxVisiblePoints }, (_, i) => {
                    if (i < 5 && this.currentSecond === 15) {
                        return '';
                    } else {
                        if (this.currentSecond === 30 && i >= 0 && i <= 3) {
                            return '';
                        }
                        if (this.currentSecond === 45 && i >= 0 && i <= 2) {
                            return '';
                        }
                        if (this.currentSecond === 60 && i >= 0 && i <= 1) {
                            return '';
                        }
                        if (this.currentSecond === 75 && i === 0) {
                            return '';
                        }
                        return this.currentSecond + (i - 5) * this.intervalSeconds;
                    }
                });

                let minY = Math.min(...seriesData);
                let maxY = Math.max(...seriesData);

                if (minY === maxY) {
                    minY -= 5;
                    maxY += 5;
                } else if (minY > maxY) {
                    const temp = minY;
                    minY = maxY - 5;
                    maxY = temp + 5;
                }

                this.chart.updateOptions({
                    xaxis: {
                        categories: categories.map(cat => (cat === '' ? '' : `${cat}`))
                    },
                    yaxis: {
                        min: minY,
                        max: maxY
                    }
                });

                this.chart.updateSeries([{
                    data: seriesData
                }]);

                this.currentSecond += this.intervalSeconds;

            }, this.intervalSeconds * 1000);
        }
    },
    mounted() {
        this.initializeChart();
        this.updateChartData();
    }
};
</script>
