<template>
    <div class="bg-gray-50 shadow rounded p-4">
        <div class="flex justify-between items-start">
            <h2 class="text-lg font-semibold mb-2 text-gray-700">{{ projectStore.getSelectedProject!!.name }}</h2>
            <div class="flex gap-2">
                <button :disabled="!authStore.isProjectManager && !authStore.isAdmin" @click="editProject"
                    class="text-sm px-4 py-1 text-green-500 hover:bg-green-200 hover:text-green-800 duration-300 rounded cursor-pointer disabled:bg-gray-200 disabled:text-gray-600/20 disabled:cursor-not-allowed"
                    type="button">Edit</button>
                <button :disabled="!authStore.isAdmin" @click="deleteProject"
                    class="text-sm px-4 py-1 text-red-500 hover:bg-red-200 hover:text-red-800 duration-300 rounded cursor-pointer disabled:bg-gray-200 disabled:text-gray-600/20 disabled:cursor-not-allowed"
                    type="button">Delete</button>
            </div>
        </div>
        <p class="mb-2">{{ projectStore.getSelectedProject!!.description }}</p>

        <div>
            <h4 class="text-gray-700">Users</h4>
            <div class="">
                <div class="flex items-center" v-for="(manager, index) in projectAssignments" :key="manager.userId">
                    <div class="text-sm font-bold bg-gradient-to-tr from-gray-400 to-gray-800 h-6 min-w-6 max-w-6 flex items-center justify-center text-white rounded-full shadow">{{ index + 1 }}</div>
                    <ProjectAssignment class="px-4 py-1 flex-grow" :onUpdate="fetchProjectAssignments"
                        :user-id="manager.userId" :role-id="manager.roleId"
                        :user="manager.firstName + ' ' + manager.lastName" :role="manager.roleName" />
                </div>
            </div>
        </div>

        <div v-if="authStore.isAdmin" class="border-t py-4 mt-4">
            <h4 class="text-gray-700 font-semibold">Assign Users</h4>
            <form class="grid gap-2 md:grid-cols-3"
                @submit.prevent="assignRoleToProject(projectStore.getSelectedProject!!)">
                <select v-model="selectedUserId" class="s-input">
                    <option value="">Select user</option>
                    <option :value="user.id" v-for="user in usrStore.getUsers" :key="user.id">
                        {{ user.firstName }} {{ user.lastName }}
                    </option>
                </select>

                <select v-model="selectedRoleId" class="s-input px-4">
                    <option value="">Select role</option>
                    <option :value="role.id" v-for="role in roleStore.getRoles" :key="role.id">
                        {{ role.name.slice(5) }}
                    </option>
                </select>
                <button type="submit" class="s-btn px-4 py-1.5 disabled:bg-gray-300 disabled:text-gray-700"
                    :disabled="assigningRole || !selectedUserId || !selectedRoleId">
                    {{ assigningRole ? "Assigning..." : "Apply" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import useAPI from '../../../composables/useAPI';
import { APIS } from '../../../lib/apis';
import { axiosGet, axiosPatch } from '../../../lib/axiosLib';
import { Project, ProjectAssignmentDetails } from '../../../lib/definitions';
import { useAlertStore } from '../../../stores/store.alerts';
import { useAuthStore } from '../../../stores/store.auth';
import { useProjectStore } from '../../../stores/store.projects';
import { useRoleStore } from '../../../stores/store.roles';
import { useUserStore } from '../../../stores/store.users';
import ProjectAssignment from './ProjectAssignment.vue';
import { onMounted, ref, watch } from 'vue';

const handleRequest = useAPI()
const usrStore = useUserStore()
const roleStore = useRoleStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const alertStore = useAlertStore()

const projectAssignments = ref<ProjectAssignmentDetails[]>([])
const selectedUserId = ref<string>("")
const selectedRoleId = ref<string>("")
const assigningRole = ref(false)

const emit = defineEmits<{
    (e: "edit", project: Project): void;
    (e: "delete", projectId: string): void;
}>()

const editProject = () => {
    emit("edit", projectStore.getSelectedProject!!)
}

const deleteProject = () => {
    emit("delete", projectStore.getSelectedProject!!.id)
}

const fetchProjectAssignments = (project: Project) => {
    handleRequest({
        func: axiosGet,
        args: [APIS.projects.projectAssignments.replace("<:projectId>", project.id)]
    }).then(response => {
        if (response.status === "ok" && response.result) {
            projectAssignments.value = response.result;
        }
    })
}

const assignRoleToProject = (project: Project) => {
    if (!selectedUserId.value || !selectedRoleId.value) {
        return;
    }

    assigningRole.value = true;
    handleRequest({
        func: axiosPatch,
        args: [
            APIS.projects.assignRoles.replace("<:projectId>", project.id),
            {
                users: [selectedUserId.value],
                role: selectedRoleId.value,
            }
        ]
    }).then(response => {
        if (response.status === "ok") {
            alertStore.pushAlert({
                alert: {
                    status: "success-fill",
                    message: "Role assigned successfully."
                }
            })
            // Reload assignments after successful assignment
            fetchProjectAssignments(project)
        } else {
            alertStore.pushAlert({
                alert: {
                    status: "success-fill",
                    message: response.errors.message || "Sorry! Could not assign role."
                }
            })
        }
    }).finally(() => {
        assigningRole.value = false;
    });
};

watch(() => projectStore.getSelectedProject!!, (newProject) => {
    fetchProjectAssignments(newProject)
})

// Attempt to fetch the project assignments when the component mounts
onMounted(() => {
    fetchProjectAssignments(projectStore.getSelectedProject!!)
});
</script>
