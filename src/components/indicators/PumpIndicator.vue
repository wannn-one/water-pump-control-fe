<template>
    <section class="bg-card w-fit h-fit border rounded-xl p-4 drop-shadow-xl absolute z-50 scale-75" :id="id" :class="{
        'bg-ongreen text-white': pumpStatus === 'on',
        'bg-neutral text-black': pumpStatus === 'off'
    }">
        <h1 class="text-xl font-medium">{{ content.title }}</h1>
        <p class="text-sm">Control Mode: {{ pumpControlMode }}</p>
        <section class="flex w-full justify-between">
            <img class="bg-cover" :class="{ 'animate-pump': pumpStatus === 'on' }" src="/src/assets/img/Pump.png"
                alt="Pompa">
        </section>
    </section>
</template>

<script>
export default {
    name: 'PumpIndicator',
    props: {
        id: Number, // Incremental ID starting from 1
        content: {
            type: Object,
            required: true,
            properties: {
                title: String
            }
        }
    },
    data() {
        return {
            pumpStatus: 'off', // Default status
            pumpControlMode: 'AUTOMATIC', // Default control mode
            apiUrl: `${import.meta.env.VITE_API_BASE_URL}pumpcontrol` // API URL for pump control
        };
    },
    mounted() {
        this.fetchPumpStatus();
        // Refresh pump status every 15 seconds
        setInterval(this.fetchPumpStatus, 15000);
    },
    methods: {
        async fetchPumpStatus() {
            try {
                const response = await fetch(this.apiUrl);
                const data = await response.json();

                const pumpData = data.find(pump => pump.pumpId === `PUMP-ESP32-${this.id.toString().padStart(2, '0')}`);
                if (pumpData) {
                    this.pumpStatus = pumpData.status.toLowerCase(); // Update pump status
                    this.pumpControlMode = pumpData.controlMode; // Update control mode
                    console.log(`Pump ${this.id}: Status updated to ${this.pumpStatus}`);
                }
            } catch (error) {
                console.error("Error fetching pump status:", error);
            }
        },
        setPumpStatus(activate) {
            if (this.pumpStatus === (activate ? 'on' : 'off')) {
                return; // No changes needed
            }

            this.pumpStatus = activate ? 'on' : 'off';
            this.pumpControlMode = activate ? 'MANUAL' : 'AUTOMATIC';

            // Update server with new status
            this.updatePumpStatus();
        },
        async updatePumpStatus() {
            const pumpId = `PUMP-ESP32-${this.id.toString().padStart(2, '0')}`;
            const baseUrl = `${this.apiUrl}/${pumpId}/toggle`;
            const action = this.pumpStatus === 'on' ? 'ON' : 'OFF';

            try {
                const response = await fetch(baseUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action })
                });

                if (!response.ok) {
                    throw new Error(`Failed to update pump status: ${response.status}`);
                }

                const result = await response.json();
                console.log(`Pump ${this.id} status updated: ${result.message}`);
            } catch (error) {
                console.error(`Error updating pump ${this.id} status:`, error);
            }
        }
    }
};
</script>