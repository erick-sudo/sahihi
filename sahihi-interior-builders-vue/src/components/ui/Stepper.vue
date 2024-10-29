<template>
    <div class="flex justify-between items-center">
        <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center">
            <span class="step-label text-sm w-12 text-center">{{ step }}</span>
            <div class="h-8 w-8 cursor-pointer duration-300 bg-gradient-to-tr flex items-center justify-center rounded-full shadow shadow-black"
                :class="{
                    'from-green-500 to-green-800': index <= currentStep,
                    'scale-110': index === currentStep,
                    'from-gray-800 to-gray-400': index > currentStep,
                }">
                <span class="text-white">{{ index + 1 }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    steps: string[];
    currentStep: number;
}>();
</script>

<style scoped></style>
