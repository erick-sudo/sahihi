<template>
    <div :class="overlayClass" class="fixed inset-0 bg-black/50 overflow-y-auto" v-if="visible">
        <div :class="contentClass" class="mx-auto p-2 rounded-lg">
            <div class="flex justify-end">
                <button class="hover:bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full"
                    @click="closeModal">×</button>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    visible: boolean;
    contentClass?: string;
    overlayClass?: string;
}>();
const emit = defineEmits<{
    (e: 'close'): void;
}>();
const closeModal = () => {
    emit('close');
};
</script>