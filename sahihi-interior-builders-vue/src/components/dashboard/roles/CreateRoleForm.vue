<template>
    <div class="max-w-sm p-6 bg-white shadow-md rounded">
        <h2 class="font-semibold mb-4 text-gray-700">Create New Role</h2>
        <form @submit.prevent="submitRole">
            <div class="mb-4">
                <label for="roleName" class="block text-gray-600 font-medium mb-2">Role Name</label>
                <input v-model="roleName" type="text" id="roleName" placeholder="Enter role name" class="s-input"
                    required />
            </div>

            <button :disabled="!roleName" type="submit"
                class="s-btn px-4 py-1.5 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed">
                Create
            </button>
        </form>
    </div>

    <div class="max-w-sm" v-if="submissionResponse !== null">
        <DisplayObject class="text-sm shadow" :data="submissionResponse" klass="py-2 px-4 rounded shadow" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AlertResponse } from '../../ui/definitions';
import useAPI from '../../../composables/useAPI';
import { axiosPost } from '../../../lib/axiosLib';
import { APIS } from '../../../lib/apis';
import { useRoleStore } from '../../../stores/store.roles';
import DisplayObject from '../../ui/DisplayObject.vue';

const roleStore = useRoleStore()
const handleRequest = useAPI()

const roleName = ref('');
const submitting = ref(false)
const submissionResponse = ref<AlertResponse | null>(null)

// Emit the new role data when the form is submitted
const submitRole = () => {
    submitting.value = true
    handleRequest({
        func: axiosPost,
        args: [APIS.authorization.roles.create, {
            name: roleName.value
        }]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            submissionResponse.value = {
                status: "success",
                message: "Role created successfully."
            }
            roleStore.fetchRoles()
            resetForm();
        } else {
            submissionResponse.value = {
                status: "error",
                message: data.errors.message
            }
        }
    }).finally(() => {
        submitting.value = false
    })

};



// Function to reset the form fields
const resetForm = () => {
    roleName.value = '';
};
</script>
