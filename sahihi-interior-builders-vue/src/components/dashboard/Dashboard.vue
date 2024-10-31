<template>
    <div class="">
        <div class="flex items-center px-2 h-12 sticky top-0 bg-gray-100 border-b">
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
        </div>

        <div class="flex">
            <div class="p-2 min-w-32 relative">
                <div class="sticky top-14 grid bg-gray-50 rounded overflow-hidden shadow">
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

            <div class="flex-grow border-l">
                <div v-if="activeTab === 0">
                    <ProjectScreen />
                </div>

                <div v-if="activeTab === 1">
                    <UsersScreen v-if="tabs[1].checkAccess()" />
                    <ForbiddenAccess v-else />
                </div>

                <div v-if="activeTab === 2">
                    <RolesScreen v-if="tabs[2].checkAccess()" />
                    <ForbiddenAccess v-else />
                </div>


                <div v-if="activeTab === 3">
                    <CRMScreen v-if="tabs[3].checkAccess()" />
                    <ForbiddenAccess v-else />
                </div>
            </div>
        </div>
    </div>

    <AlertsHost />
</template>

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
import ForbiddenAccess from '../ui/ForbiddenAccess.vue';

const usrStore = useUserStore()
const roleStore = useRoleStore()
const authStore = useAuthStore()

const signingOut = ref(false)

const handleRequest = useAPI()

const activeTab = ref(0)

const tabs = [
    { name: "Projects", checkAccess: () => true },
    { name: "Users", checkAccess: () => authStore.isAdmin },
    { name: "Roles", checkAccess: () => authStore.isAdmin },
    { name: "Leads", checkAccess: () => authStore.isAdmin },
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

<style scoped></style>