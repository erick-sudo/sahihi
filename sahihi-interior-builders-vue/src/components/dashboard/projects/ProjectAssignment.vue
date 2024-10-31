<template>
    <div class="grid grid-cols-3 items-center">
        <span class="text-sm text-gray-500">
            <strong class="text-gray-800">User:</strong> {{ user }}
        </span>
        <span class="text-sm text-gray-500">
            <strong class="text-gray-800">Role:</strong> {{ role.slice(5) }}
        </span>
        <span class="text-sm text-gray-500 flex justify-center">
            <button :disabled="!authStore.isAdmin" @click="unassignRole(projectStore.getSelectedProject!!)"
                class="text-red-800 disabled:bg-gray-200 disabled:text-gray-600/20 disabled:cursor-not-allowed hover:bg-red-200 px-4 rounded py-1.5 duration-300">Unassign</button>
        </span>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Project } from '../../../lib/definitions';
import { APIS } from '../../../lib/apis';
import { axiosPatch } from '../../../lib/axiosLib';
import useAPI from '../../../composables/useAPI';
import { useProjectStore } from '../../../stores/store.projects';
import { useAuthStore } from '../../../stores/store.auth';

const projectStore = useProjectStore()
const authStore = useAuthStore()
const handleRequest = useAPI()

const props = defineProps<{
    user: string;
    role: string;
    roleId: string;
    userId: string;
    onUpdate: (project: Project) => void
}>();

const unassignRole = async (project: Project) => {
    const response = await handleRequest({
        func: axiosPatch,
        args: [
            APIS.projects.unassignRoles.replace("<:projectId>", project.id),
            {
                users: [props.userId],
                role: props.roleId,
            }
        ]
    });

    if (response.status === "ok") {
        // Notify successful unassignment
        props.onUpdate(project);
    }
};
</script>
