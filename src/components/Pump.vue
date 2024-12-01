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
        }
    },
    methods: {
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
                const response = await fetch(`${baseUrl}pumpcontrol/${pumpId}/toggle`, {
                    method: 'PUT', // Use PUT method as per the API
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action }) // Send the action (ON or OFF) in the body
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const result = await response.json();
                console.log(result.message); // Display response message from the server
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
