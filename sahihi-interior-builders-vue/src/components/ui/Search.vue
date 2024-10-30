<template>
    <input class="w-full" name="key" placeholder="Search..." v-model="inputValue" @keydown.enter="handleEnter"
        @input="emit('change', inputValue)" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps<{
    queryKey: string
}>()

const emit = defineEmits<{
    (e: 'go', value: string): void;
    (e: 'change', value: string): void;
}>();

// Initialize inputValue with the query parameter value if available
const inputValue = ref<string>('');

// Emit the go event when the Enter key is pressed
const handleEnter = () => {
    emit('go', inputValue.value);
};

// Watch for inputValue changes and update the query parameter
watch(inputValue, (newValue) => {
    router.replace({ query: { ...route.query, [props.queryKey]: newValue } });
});

// Initialize the query parameter on mount
onMounted(() => {
    if (!route.query[props.queryKey] && inputValue.value) {
        router.replace({ query: { ...route.query, [props.queryKey]: inputValue.value } });
    }
});
</script>

<style scoped lang="css"></style>
