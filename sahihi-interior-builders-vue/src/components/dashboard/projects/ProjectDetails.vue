<template>
    <div class="bg-gray-50 shadow rounded p-4">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">{{ projectStore.getSelectedProject!!.name }}</h2>
        <p class="mb-4">{{ projectStore.getSelectedProject!!.description }}</p>

        <div>
            <h4 class="text-gray-700">Users</h4>
            <ul class="space-y-3">
                <li v-for="manager in projectAssignments" :key="manager.userId" class="px-4 py-1.5">
                    <ProjectAssignment :onUpdate="fetchProjectAssignments" :user-id="manager.userId" :role-id="manager.roleId"
                        :user="manager.firstName + ' ' + manager.lastName" :role="manager.roleName" />
                </li>
            </ul>
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
                <button type="submit" class="s-btn px-4 py-1.5 disabled:bg-gray-300 disabled:text-gray-700" :disabled="assigningRole || !selectedUserId || !selectedRoleId">
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

const projectAssignments = ref<ProjectAssignmentDetails[]>([])
const selectedUserId = ref<string>("")
const selectedRoleId = ref<string>("")
const assigningRole = ref(false)

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

const assignRoleToProject = async (project: Project) => {
    if (!selectedUserId.value || !selectedRoleId.value) {
        return;
    }

    assigningRole.value = true;
    const response = await handleRequest({
        func: axiosPatch,
        args: [
            APIS.projects.assignRoles.replace("<:projectId>", project.id),
            {
                users: [selectedUserId.value],
                role: selectedRoleId.value,
            }
        ]
    });

    if (response.status === "ok") {
        // Reload assignments after successful assignment
        fetchProjectAssignments(project)
    }

    assigningRole.value = false;
};

watch(() => projectStore.getSelectedProject!!, (newProject) => {
    fetchProjectAssignments(newProject)
})

// Attempt to fetch the project assignments when the component mounts
onMounted(() => {
    fetchProjectAssignments(projectStore.getSelectedProject!!)
});
</script>
