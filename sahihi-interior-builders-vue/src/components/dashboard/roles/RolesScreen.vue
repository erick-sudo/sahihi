<template>
    <div class="p-2 grid gap-4">
        <RoleList :roles="roleStore.getRoles" />

        <CreateRoleForm />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoleStore } from '../../../stores/store.roles';
import RoleList from './RoleList.vue';
import CreateRoleForm from './CreateRoleForm.vue';

const roleStore = useRoleStore()

onMounted(() => {
    roleStore.fetchRoles()
})
</script>