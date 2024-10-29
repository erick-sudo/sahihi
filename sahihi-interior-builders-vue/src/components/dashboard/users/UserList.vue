<template>
    <div>
        <div class="overflow-x-auto p-2 bg-gray-50 shadow">
            <div class="">
                <table class="w-full rounded shadow">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="px-4 py-1.5 truncate">First Name</th>
                            <th class="px-4 py-1.5 truncate">Last Name</th>
                            <th class="px-4 py-1.5 truncate">Email</th>
                            <th class="px-4 py-1.5 truncate">Phone Number</th>
                            <th class="px-4 py-1.5 truncate">Address</th>
                            <th class="px-4 py-1.5 truncate">KRA PIN</th>
                            <th class="px-4 py-1.5 truncate">KRA Attachment</th>
                            <th class="px-4 py-1.5 truncate">Created At</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <UserItem v-for="user in users" :key="user.id" :user="user" />
                    </tbody>
                </table>
            </div>
        </div>

        <div class="p-4">
            <CreateUserForm />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { User } from '../../../lib/definitions';
import UserItem from './UserItem.vue';
import CreateUserForm from './CreateUserForm.vue';

defineProps<{
    users: User[];
}>();
</script>
