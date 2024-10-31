<template>
    <div class="grid">
        <div class="overflow-x-auto pb-2">
            <table class="w-full bg-white border">
                <thead>
                    <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th class="px-4 py-2 text-start">Role Name</th>
                        <th class="px-4 py-2 text-start">Creation Date</th>
                        <th class="px-4 py-2 text-start">Creation Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t" v-for="role in roles" :key="role.id">
                        <td class="px-4 py-2">{{ role.name }}</td>
                        <td class="px-4 py-2">{{ new Date().toDateString() }}</td>
                        <td class="px-4 py-2">{{ new Date().toLocaleTimeString() }}</td>
                        <td class="py-1 px-2"><button @click="deleteRole(role.id)" title="Delete Role"
                                class="bg-red-200 rounded w-6 h-6 text-red-800 hover:bg-red-800 hover:text-white duration-300">x</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Role } from "../../../lib/definitions"
import { useRoleStore } from '../../../stores/store.roles';
import useAPI from '../../../composables/useAPI';
import { axiosDelete } from '../../../lib/axiosLib';
import { APIS } from '../../../lib/apis';

const roleStore = useRoleStore()
const handleRequest = useAPI()


defineProps<{
    roles: Role[];
}>();

function deleteRole(roleId: string) {
    handleRequest({
        func: axiosDelete,
        args: [APIS.authorization.roles.destroy.replace("<:roleId>", roleId)]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            roleStore.fetchRoles()
        }
    })
}
</script>

<style lang="css" scoped>
th,
td {
    @apply truncate
}
</style>
