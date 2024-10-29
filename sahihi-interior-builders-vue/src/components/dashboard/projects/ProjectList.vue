<template>
    <div class="shadow rounded bg-gray-50">
        <div class="flex items-center p-2">
            <div class="flex-grow px-2 text-gray-700">Projects</div>
            <div v-if="authStore.isAdmin" class="relative group">
                <button class="px-4 text-green-600">New Project</button>
                <div class="relative">
                    <div class="absolute right-0 hidden group-hover:block">
                        <CreateProject />
                    </div>
                </div>
            </div>
        </div>
        <ul class="">
            <li class="border-t" v-for="project in projectStore.getProjects" :key="project.id">
                <button
                    class="w-full text-sm flex justify-between text-left px-4 py-2 hover:bg-green-100 transition duration-200"
                    @click="select(project.id)">
                    <span>{{ project.name }}</span>
                    <span>{{ new Date(project.createdAt).toLocaleString() }}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { useProjectStore } from '../../../stores/store.projects';
import CreateProject from './CreateProject.vue';
import { useAuthStore } from '../../../stores/store.auth';

const authStore = useAuthStore()

const projectStore = useProjectStore();
const emit = defineEmits(['select']);

const select = (projectId: string) => {
    emit('select', projectId);
};
</script>
