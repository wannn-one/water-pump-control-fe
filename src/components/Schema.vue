<template>
    <!-- Indicator In -->
    <TankIndicator id="TK-001" :content="{ title: 'TK-001' }" class="left-0 top-0" />
    <TankIndicator id="TK-002" :content="{ title: 'TK-002' }" class="right-0 top-16" />
    <PumpIndicator :id="1" :content="{ title: 'P-001' }" class="-top-4 inset-x-60" />
    <PumpIndicator :id="2" :content="{ title: 'P-002' }" class="top-28 inset-x-60" />
    <PumpIndicator :id="3" :content="{ title: 'P-003' }" class="bottom-3 inset-x-60" />
    <PumpIndicator :id="4" :content="{ title: 'P-004' }" class="bottom-14 left-8 inset-x-60" />
    <!-- Indicator Out -->

    <!-- Flow Water In -->
    <div class="w-[3%] h-[80%] bg-water absolute bottom-8 left-24 rounded-l-xl flex items-center py-4">
        <span class="h-full running-animationY inversey transform">
            <svg class="transform -rotate-90" width="18" height="8" viewBox="0 0 25 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <div class="w-[3%] h-[65%] bg-water absolute right-20 top-28 rounded-r-xl flex items-center py-4">
        <span class="h-full running-animationY">
            <svg class="transform rotate-90" width="18" height="8" viewBox="0 0 25 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <!-- Pipa Kiri 1 -->
    <div class="w-[3%] h-[70%] bg-water absolute inset-7 left-56 z-50 rounded-l-xl flex items-center py-4">
    </div>
    <div class="w-[3%] h-[70%] bg-water absolute inset-7 left-96 rounded-r-xl flex items-center py-4 ">

    </div>
    <div class="w-[29%] h-[5%] bg-water absolute inset-12 rounded-l-xl flex items-center px-4">
        <span class="w-full running-animationX inversex">
            <svg class="" width="18" height="8" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <div class="w-[28%] h-[5%] bg-water absolute right-12 top-28 rounded-r-xl flex items-center px-4">
        <span class="w-full running-animationX inversex">
            <svg class="" width="18" height="8" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <!-- Pipa Bawah -->
    <div class="w-[71%] h-[5%] bg-water absolute bottom-8 left-24 rounded-b-xl flex items-center px-4">
        <span class="w-full running-animationX">
            <svg class="transform rotate-180" width="18" height="8" viewBox="0 0 25 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <div class="w-[29%] h-[5%] bg-water absolute left-56 top-6 rounded-t-xl flex items-center px-4">
        <span class="w-full running-animationX inversex">
            <svg class="" width="18" height="8" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <div class="w-[29%] h-[5%] bg-water absolute left-56 rounded-tl-xl bottom-60 flex items-center px-4">
        <span class="w-full running-animationX inversex">
            <svg class="" width="18" height="8" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <div class="w-[29%] h-[5%] bg-water absolute left-56 rounded-b-xl bottom-24 flex items-center px-4">
        <span class="w-full running-animationX inversex">
            <svg class="" width="18" height="8" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 7C0.447715 7 4.82823e-08 7.44772 0 8C-4.82823e-08 8.55228 0.447715 9 1 9L1 7ZM24.7071 8.70711C25.0976 8.31658 25.0976 7.68342 24.7071 7.2929L18.3431 0.928934C17.9526 0.538409 17.3195 0.538409 16.9289 0.928934C16.5384 1.31946 16.5384 1.95262 16.9289 2.34315L22.5858 8L16.9289 13.6569C16.5384 14.0474 16.5384 14.6805 16.9289 15.0711C17.3195 15.4616 17.9526 15.4616 18.3431 15.0711L24.7071 8.70711ZM1 9L24 9L24 7L1 7L1 9Z"
                    fill="white" />
            </svg>
        </span>
    </div>
    <!-- Flow Water In -->

</template>
<script>
import TankIndicator from './indicators/TankIndicator.vue';
import PumpIndicator from './indicators/PumpIndicator.vue';

export default {
    name: 'Schema',
    components: {
        TankIndicator,
        PumpIndicator
    }


}
</script>
<style scoped>
.running-animationX {
    animation: runningx 4s infinite linear;
}

.running-animationY {
    animation: runningy 4s infinite linear;
}

.running-animationY.inversey {
    animation: runningyinversey 4s infinite linear;
}

.running-animationX.inversex {
    animation: runningxinversex 4s infinite linear;
}

@keyframes runningx {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0%);
    }
}

@keyframes runningxinversex {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(100%);
    }
}

@keyframes runningy {
    from {
        transform: translateY(0%);
    }

    to {
        transform: translateY(100%);
    }

}

@keyframes runningyinversey {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0%);
    }

}
</style>