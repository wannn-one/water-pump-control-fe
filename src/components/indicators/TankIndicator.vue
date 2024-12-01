<template>
    <section class="bg-card size-fit border rounded-xl p-4 drop-shadow-xl absolute z-50 scale-75" :id="id">
        <h1 class="text-xl font-medium">{{ content.title }}</h1>
        <section class="flex w-full justify-between">
            <img class="bg-cover" src="/src/assets/img/waterTank.png" alt="waterTank">
        </section>
    </section>
</template>
<script>
export default {
    name: 'TankIndicator',
    props: {
        id: String,
        content: {
            type: Object,
            required: true,
            properties: {
                title: String,
            }
        }
    },



}
</script>
