<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useAPI from '../../composables/useAPI';
import { axiosGet } from '../../lib/axiosLib';
import { APIS } from '../../lib/apis';
import { useAuthStore } from '../../stores/store.auth';
import ProjectScreen from './projects/ProjectScreen.vue';
import { useUserStore } from '../../stores/store.users';
import { useRoleStore } from '../../stores/store.roles';
import UsersScreen from './users/UsersScreen.vue';
import RolesScreen from './roles/RolesScreen.vue';
import CRMScreen from './crm/CRMScreen.vue';
import AlertsHost from '../ui/AlertsHost.vue';

const usrStore = useUserStore()
const roleStore = useRoleStore()
const authStore = useAuthStore()

const signingOut = ref(false)

const handleRequest = useAPI()

const activeTab = ref(3)

const tabs = [
    { name: "Projects", checkAccess: () => true },
    { name: "Users", checkAccess: () => authStore.currentAuth?.authorities.some(a => a.name === "ROLE_ADMIN") },
    { name: "Roles", checkAccess: () => authStore.currentAuth?.authorities.some(a => a.name === "ROLE_ADMIN") },
    { name: "Leads", checkAccess: () => true },
]

function signout() {
    signingOut.value = true
    handleRequest({
        func: axiosGet,
        args: [APIS.account.signout]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            authStore.clearAuth()
        }
    }).finally(() => {
        signingOut.value = false
    })
}

function changeTab(n: number) {
    activeTab.value = n
}

onMounted(async () => {
    await usrStore.fetchUsers()
    await roleStore.fetchRoles()
})

</script>

<template>
    <div class="fixed inset-0 flex flex-col">
        <nav class="flex items-center p-2">
            <div class="flex-grow">
                <h3 class="font-bold uppercase"><span class="text-green-600">Sahihi</span>-Interior-Builders</h3>
                <div class="text-xs font-bold text-green-700">{{ authStore.currentAuth?.principal.email }}</div>
            </div>

            <div>
                <button type="button" @click="signout" class="px-4 py-1 s-btn"
                    :class="{ 'bg-gray-300 text-gray-600': signingOut }">
                    {{ signingOut ? 'Signing out...' : 'Sign out' }}
                </button>
            </div>
        </nav>

        <div class="flex flex-grow border-t">
            <div class="p-2 min-w-32">
                <div class="grid bg-gray-50 rounded overflow-hidden shadow">
                    <button @click="changeTab(index)" v-for="(tab, index) in tabs.filter(t => t.checkAccess())"
                        :key="index" :class="[
                            'px-3 py-1.5 border-l-4 block text-start',
                            {
                                'border-green-500': activeTab === index,
                                'border-transparent': activeTab !== index
                            }
                        ]">
                        {{ tab.name }}
                    </button>
                </div>
            </div>

            <div class="flex-grow border-l overflow-y-auto">
                <div v-if="activeTab === 0">
                    <ProjectScreen />
                </div>

                <div v-if="activeTab === 1 && tabs[1].checkAccess()">
                    <UsersScreen />
                </div>

                <div v-if="activeTab === 2 && tabs[2].checkAccess()">
                    <RolesScreen />
                </div>

                <div v-if="activeTab === 3 && tabs[3].checkAccess()">
                    <CRMScreen />
                </div>
            </div>
        </div>
    </div>

    <AlertsHost />
</template>

<style scoped></style>