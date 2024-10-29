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

const usrStore = useUserStore()
const roleStore = useRoleStore()
const authStore = useAuthStore()

const signingOut = ref(false)

const handleRequest = useAPI()

const activeTab = ref(0)

const tabs = [
    { name: "Projects", checkAccess: () => true },
    { name: "Users", checkAccess: () => authStore.currentAuth?.authorities.some(a => a.name === "ROLE_ADMIN") },
    { name: "Roles", checkAccess: () => authStore.currentAuth?.authorities.some(a => a.name === "ROLE_ADMIN") },
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
    <div class="">
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
        <div class="border-t flex">
            <button @click="changeTab(index)" v-for="(tab, index) in tabs.filter(t => t.checkAccess())" :key="index"
                :class="[
                    'px-4 py-1 border-r',
                    {
                        '': activeTab === index,
                        'border-b': activeTab !== index
                    }
                ]">
                {{ tab.name }}
            </button>
            <div class="border-b flex-grow"></div>
        </div>

        <div v-if="activeTab === 0">
            <ProjectScreen />
        </div>

        <div v-if="activeTab === 1 && tabs[1].checkAccess()">
            <UsersScreen />
        </div>

        <div v-if="activeTab === 2 && tabs[2].checkAccess()">
            <RolesScreen />
        </div>
    </div>
</template>

<style scoped></style>