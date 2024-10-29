<template>
    <div class="p-2 grid gap-2">
        <div class="">
            <ProjectList @select="selectProject" />
        </div>
        <div v-if="projectStore.getSelectedProject" class="">
            <ProjectDetails />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectStore } from '../../../stores/store.projects';
import ProjectList from './ProjectList.vue';
import ProjectDetails from './ProjectDetails.vue';

const projectStore = useProjectStore();

onMounted(async () => {
    await projectStore.fetchProjects();
});

const selectProject = async (projectId: string) => {
    await projectStore.fetchProjectDetails(projectId);
};
</script>
