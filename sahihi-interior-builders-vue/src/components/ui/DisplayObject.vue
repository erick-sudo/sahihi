<template>
    <div :class="[klass, {
        's-success': data.status === 'success',
        's-error': data.status === 'error',
        's-warning': data.status === 'warning',
        's-info': data.status === 'info',
    }]">
        <!-- If type of steps is flat -->
        <div v-if="flatTypes.includes(typeof data.message)">
            <div>{{ data.message }}</div>
        </div>

        <!-- If type of steps is array -->
        <div v-if="Array.isArray(data.message)">
            <div v-for="(el, index) in data.message" :key="index">
                <div>{{ el }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { AlertResponse } from './definitions';

const flatTypes = ["string", "number", "undefined", "symbol", "boolean", "bigint"];

defineProps<{
    data: AlertResponse;
    klass?: string; // This lets you pass class directly
}>();
</script>

<style scoped></style>
