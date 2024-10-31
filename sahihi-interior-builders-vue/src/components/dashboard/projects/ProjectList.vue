<template>

    <Modal overlay-class="p-4" content-class="bg-gray-50 p-6 z-50 max-w-xs" :visible="showNewProjectModal"
        @close="showNewProjectModal = false">
        <CreateProject :project="currentProject" :mode="formMode" @mutated="onMutated" />
    </Modal>

    <div class="shadow rounded bg-gray-50">
        <div class="flex items-center p-2">
            <div class="flex-grow px-2 text-gray-700">Projects</div>
            <div v-if="authStore.isAdmin" class="group">
                <button @click="newProject" class="px-4 text-green-600">New Project</button>
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

    <div v-if="projectStore.getProjects.length < 1" class="mt-4 s-info p-4 shadow rounded">
        {{ authStore.isAdmin ? "No projects found." : "You are not assigned to any projects yet." }}
    </div>

    <div v-if="projectStore.getSelectedProject" class="">
        <ProjectDetails @edit="editProject" @delete="deleteProject" />
    </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import { useProjectStore } from '../../../stores/store.projects';
import CreateProject from './CreateProject.vue';
import { useAuthStore } from '../../../stores/store.auth';
import Modal from '../../ui/Modal.vue';
import { useAlertStore } from '../../../stores/store.alerts';
import { Project } from '../../../lib/definitions';
import { axiosDelete } from '../../../lib/axiosLib';
import useAPI from '../../../composables/useAPI';
import { APIS } from '../../../lib/apis';
import ProjectDetails from './ProjectDetails.vue';

const authStore = useAuthStore()
const alertStore = useAlertStore()
const showNewProjectModal = ref(false)
const projectStore = useProjectStore();
const emit = defineEmits(['select']);
const formMode = ref<'create' | 'edit'>('create');
const currentProject = ref<Project | null>(null);
const handleRequest = useAPI()

const newProject = () => {
    formMode.value = 'create';
    currentProject.value = null;
    showNewProjectModal.value = true;
};

const editProject = (project: Project) => {
    formMode.value = 'edit';
    currentProject.value = project;
    showNewProjectModal.value = true;
};

const deleteProject = (projectId: string) => {
    handleRequest({
        func: axiosDelete,
        args: [APIS.projects.retrieve.replace("<:projectId>", projectId)]
    }).then(async data => {
        if (data.status === "ok") {
            alertStore.pushAlert({
                alert: {
                    status: "success-fill",
                    message: "Project deleted succesfully."
                }
            })
            projectStore.clearCurrentProject()
            await projectStore.fetchProjects()
        } else {
            alertStore.pushAlert({
                alert: {
                    status: "error-fill",
                    message: data.errors.message
                }
            })
        }
    })
}

const onMutated = (message: string) => {
    alertStore.pushAlert({
        alert: {
            status: "success-fill",
            message: message
        }
    })
}

const select = (projectId: string) => {
    emit('select', projectId);
};
</script>
