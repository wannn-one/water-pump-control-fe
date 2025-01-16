<template>
    <section class="bg-card w-full h-fit border border-t-main rounded-xl p-6 drop-shadow-xl" :id="id">
        <h1 class="text-xl font-medium">{{ content.title }}</h1>
        <section class="flex w-full justify-between">
            <img class="bg-cover" :class="{ 'animate-pump': statusPump }" src="/src/assets/img/Pump.png" alt="Pompa">
            <section class="flex flex-col justify-end items-center">
                <button @click="tooglePump(id)"
                    class=" text-white p-1 rounded-lg w-full flex gap-2 transition-all duration-300 ease-in-out"
                    :class="{ 'bg-ongreen flex-row-reverse': statusPump, 'bg-secondary': !statusPump }">
                    <div class="bg-white size-6 rounded-md p-1"></div>
                    <p>{{ statusPump ? 'ON' : 'OFF' }}</p>
                </button>
            </section>
        </section>
    </section>
</template>

<script>
export default {
    name: "Pump",
    props: {
        id: Number,
        content: {
            type: Object,
            required: true,
            properties: {
                title: String,
            }
        }
    },
    data() {
        return {
            statusPump: false, // Initial state is OFF
            autoModeTimeout: null, // Timeout for reverting to AUTOMATIC mode
            remainingTime: null, // Remaining time for AUTOMATIC mode
            intervalId: null, // Interval for updating remaining time
        };
    },
    mounted() {
        // Fetch pump status from the server on mount
        this.fetchPumpStatus();
        this.restoreCountdown();
    },
    methods: {
        async fetchPumpStatus() {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL; // Base URL from .env
                const response = await fetch(`${baseUrl}pumpcontrol`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch pump data: ${response.status}`);
                }

                const data = await response.json();
                const pumpId = `PUMP-ESP32-${this.id.toString().padStart(2, '0')}`;
                const pumpData = data.find(pump => pump.pumpId === pumpId);

                if (pumpData) {
                    this.statusPump = pumpData.status.toLowerCase() === "on";
                    console.log(`Pump ${pumpId} initial status: ${this.statusPump ? "ON" : "OFF"}`);
                } else {
                    console.warn(`Pump data not found for ID: ${pumpId}`);
                }
            } catch (error) {
                console.error("Error fetching pump status:", error);
            }
        },
        restoreCountdown() {
            const targetTime = localStorage.getItem(`pump-${this.id}-targetTime`);
            if (targetTime) {
                const now = Date.now();
                const remaining = parseInt(targetTime, 10) - now;

                if (remaining > 0) {
                    this.startCountdown(remaining);
                } else {
                    this.setAutomaticMode();
                }
            }
        },
        startCountdown(duration) {
            this.remainingTime = duration;

            this.intervalId = setInterval(() => {
                this.remainingTime -= 1000;
                console.log(`Remaining time to revert to AUTOMATIC: ${Math.max(0, this.remainingTime / 1000)} seconds`);

                if (this.remainingTime <= 0) {
                    clearInterval(this.intervalId);
                    this.setAutomaticMode();
                }
            }, 1000);
        },
        async setAutomaticMode() {
            if (this.id === 4) {
                console.log("Pump 4 mode remains unchanged (MANUAL).");
                return;
            }

            const pumpId = `PUMP-ESP32-${this.id.toString().padStart(2, '0')}`;
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            try {
                const revertResponse = await fetch(`${baseUrl}pumpcontrol/${pumpId}/mode`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mode: "AUTOMATIC" })
                });

                if (!revertResponse.ok) {
                    throw new Error(`Server responded with status ${revertResponse.status}`);
                }

                const revertResult = await revertResponse.json();
                console.log(revertResult.message); // Display response message from the server

                localStorage.removeItem(`pump-${this.id}-targetTime`);
            } catch (error) {
                console.error('Error reverting pump mode to AUTOMATIC:', error);
            }
        },
        async tooglePump(id) {

            // Toggle local status
            this.statusPump = !this.statusPump;

            // Format the pumpId to match the API format: PUMP-ESP32-0{id}
            const pumpId = `PUMP-ESP32-${id.toString().padStart(2, '0')}`; // Ensure the id has two digits
            console.log(pumpId);

            // Determine action based on the local state
            const action = this.statusPump ? "ON" : "OFF";
            console.log(action);

            // Send status to the server using PUT method
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL; // Base URL from .env

                // Toggle pump status
                const statusResponse = await fetch(`${baseUrl}pumpcontrol/${pumpId}/toggle`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action })
                });

                if (!statusResponse.ok) {
                    throw new Error(`Server responded with status ${statusResponse.status}`);
                }

                const statusResult = await statusResponse.json();
                console.log(statusResult.message); // Display response message from the server

                if (id === 4) {
                    console.log("Pump 4 is excluded from automatic/manual mode changes.");
                    return;
                }

                // Set mode to MANUAL and start timer to revert to AUTOMATIC
                const modeResponse = await fetch(`${baseUrl}pumpcontrol/${pumpId}/mode`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mode: "MANUAL" })
                });

                if (!modeResponse.ok) {
                    throw new Error(`Server responded with status ${modeResponse.status}`);
                }

                const modeResult = await modeResponse.json();
                console.log(modeResult.message); // Display response message from the server

                const targetTime = Date.now() + 300000; // 5 minutes from now
                localStorage.setItem(`pump-${this.id}-targetTime`, targetTime);
                this.startCountdown(300000);

            } catch (error) {
                console.error('Error updating pump status:', error);
            }

            // Emit event to parent component (if needed)
            this.$emit('toogle-pump', id, this.statusPump);
            console.log(`Pump ${id} is ${this.statusPump ? 'ON' : 'OFF'}`); // Show pump status in the console
        }
    }
};
</script>

<style>
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
