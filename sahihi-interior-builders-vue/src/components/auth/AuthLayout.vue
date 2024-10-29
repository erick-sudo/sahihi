<template>
    <component :is="currentComponent" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import Dashboard from "../dashboard/Dashboard.vue";
import Signin from "./Signin.vue";
import { useAuthStore } from "../../stores/store.auth";

const authStore = useAuthStore();

const currentComponent = computed(() => {
    return authStore.currentAuth ? Dashboard : Signin;
});

</script>

<style scoped></style>