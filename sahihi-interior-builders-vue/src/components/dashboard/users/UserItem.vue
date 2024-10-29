<template>
    <tr class="border-t">
        <td class="px-4 py-1.5 truncate">{{ user.firstName }}</td>
        <td class="px-4 py-1.5 truncate">{{ user.lastName }}</td>
        <td class="px-4 py-1.5 truncate">{{ user.email }}</td>
        <td class="px-4 py-1.5 truncate">{{ user.phoneNumber }}</td>
        <td class="px-4 py-1.5 truncate">{{ user.address }}</td>
        <td class="px-4 py-1.5 truncate">{{ user.kraPin }}</td>
        <td class="px-4 py-2 truncate">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
        <td class="px-4 py-2 truncate">{{ new Date(user.createdAt).toLocaleTimeString() }}</td>
        <td class="px-4 py-1.5 truncate">
            <a :href="user.kraAttachment" class="text-green-500 hover:underline" target="_blank">
                View Attachment
            </a>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { User } from '../../../lib/definitions';

defineProps<{
    user: User;
}>();
</script>