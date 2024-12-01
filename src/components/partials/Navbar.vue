<template>
    <nav class="flex gap-4 items-center w-full h-full px-12 justify-between">

        <h1 class="text-xl font-medium truncate">
            Dashboard Sistem Monitoring Level Air dan Pengendalian Otomatisasi Pompa
            Air - Wardah Sari
        </h1>
        <button type="button"
            class="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-main text-white hover:bg-purple-600 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
            aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-scale-animation-modal"
            data-hs-overlay="#hs-scale-animation-modal">
            User Manual
        </button>
    </nav>

    <!-- Modal User Manual -->
    <div id="hs-scale-animation-modal"
        class="hs-overlay hidden size-full fixed top-0 start-0 overflow-x-hidden pointer-events-none" role="dialog"
        tabindex="-1" aria-labelledby="hs-scale-animation-modal-label">
        <div
            class="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
            <div class="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
                <div class="flex justify-between items-center py-3 px-4 border-b">
                    <h3 id="hs-scale-animation-modal-label" class="font-semibold text-black">
                        Panduan Penggunaan
                    </h3>
                    <button type="button"
                        class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-black hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Close" data-hs-overlay="#hs-scale-animation-modal">
                        <span class="sr-only">Close</span>
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-4 overflow-y-auto">
                    <p class="mt-1 text-black">
                        Segera Hadir
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Navbar",
};
</script>
