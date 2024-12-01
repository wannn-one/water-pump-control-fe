<template>
    <section class="bg-card w-fit h-fit border rounded-xl p-4 drop-shadow-xl absolute z-50 scale-75" :id="id" :class="{
        'bg-ongreen text-white': pumpStatus === 'on',
        'bg-neutral text-black': pumpStatus === 'off'
    }">
        <h1 class="text-xl font-medium">{{ content.title }}</h1>
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
                title: String,
            }
        }
    },
    data() {
        return {
            pumpStatus: 'off', // Default status
            apiUrl: `${import.meta.env.VITE_API_BASE_URL}pumpcontrol`, // Replace with your API URL
        }
    },
    mounted() {
        // Fetch API when the component is mounted
        this.fetchPumpStatus();
        // Refresh data every 15 seconds
        setInterval(this.fetchPumpStatus, 15000);
    },
    methods: {
        // Fetch pump status from the API
        async fetchPumpStatus() {
            try {
                const response = await fetch(this.apiUrl);
                const data = await response.json();

                // Sort pumps to ensure consistent ordering
                const sortedPumps = data.sort((a, b) => {
                    const aNumber = parseInt(a.pumpId.match(/\d+$/)[0]);
                    const bNumber = parseInt(b.pumpId.match(/\d+$/)[0]);
                    return aNumber - bNumber;
                });

                // Map pumps to incremental IDs
                const pumpData = sortedPumps[this.id - 1]; // Array index starts at 0, while id starts at 1

                if (pumpData) {
                    // Update the pump status based on the backend response
                    this.pumpStatus = pumpData.status.toLowerCase(); // Expecting 'on' or 'off'
                } else {
                    console.warn(`Pump with incremental ID ${this.id} not found`);
                    this.pumpStatus = 'off'; // Default to 'off' if pump not found
                }
            } catch (error) {
                console.error("Error fetching pump status:", error);
            }
        }
    }
}
</script>
