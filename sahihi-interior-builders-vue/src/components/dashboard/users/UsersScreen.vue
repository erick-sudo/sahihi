<template>
    <div class="p-2">
        <UserList :users="userStore.getAllUsers" />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../../../stores/store.users';
import UserList from './UserList.vue';

const userStore = useUserStore()

onMounted(() => {
    userStore.fetchAllUsers()
})
</script>