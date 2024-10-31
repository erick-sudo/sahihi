<template>
    <form class="grid gap-2" @submit.prevent="handleSubmit">
        <!-- Step 1: Personal Details -->
        <div class="grid gap-y-2 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
                <label class="">First Name</label>
                <input v-model="form.firstName" type="text" class="s-input" />
                <span v-if="errors.firstName" class="text-red-600 text-xs">{{ errors.firstName }}</span>
            </div>
            <div>
                <label class="">Last Name</label>
                <input v-model="form.lastName" type="text" class="s-input" />
                <span v-if="errors.lastName" class="text-red-600 text-xs">{{ errors.lastName }}</span>
            </div>


            <!-- Step 2: Contact Details -->
            <div>
                <label class="">Phone Number</label>
                <input placeholder="e.g. +254700000000" v-model="form.phoneNumber" type="tel" class="s-input" />
                <span v-if="errors.phoneNumber" class="text-red-600 text-xs">{{ errors.phoneNumber }}</span>
            </div>
            <div>
                <label class="">Address</label>
                <input v-model="form.address" type="text" class="s-input" />
                <span v-if="errors.address" class="text-red-600 text-xs">{{ errors.address }}</span>
            </div>
            <div>
                <label class="">Email</label>
                <input v-model="form.email" type="email" class="s-input" />
                <span v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</span>
            </div>

            <!-- Step 3: Security Information -->
            <div>
                <label class="">KRA Pin</label>
                <input v-model="form.kraPin" type="text" class="s-input" />
                <span v-if="errors.kraPin" class="text-red-600 text-xs">{{ errors.kraPin }}</span>
            </div>
            <div>
                <label class="block text-gray-700">KRA Attachment</label>
                <input v-model="form.kraAttachment" type="text" class="s-input" />
            </div>
            <div>
                <label class="block text-gray-700">Password</label>
                <input v-model="form.password" type="password" class="s-input" />
                <span v-if="errors.password" class="text-red-600 text-xs">{{ errors.password }}</span>
            </div>
            <div>
                <label class="block text-gray-700">Confirm Password</label>
                <input v-model="form.confirmPassword" type="password" class="s-input" />
                <span v-if="errors.confirmPassword" class="text-red-600 text-xs">{{ errors.confirmPassword
                    }}</span>
            </div>
        </div>

        <div class="flex justify-end">
            <div class="w-64">
                <button type="submit" class="s-btn px-4 py-1.5" :class="{ 'bg-gray-300 text-gray-600': submitting }">
                    {{ submitting ? 'Submitting...' : 'Submit' }}
                </button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useAPI from '../../../composables/useAPI';
import { baseSignupSchema, SignupForm } from '../../../lib/definitions';
import { AlertResponse } from '../../ui/definitions';
import { axiosPost } from '../../../lib/axiosLib';
import { APIS } from '../../../lib/apis';
import { useUserStore } from '../../../stores/store.users';

const handleRequest = useAPI()
const userStore = useUserStore()

const form = ref<SignupForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    kraPin: '',
    kraAttachment: '',
    password: '',
    confirmPassword: ''
});

const submitting = ref(false)
const submissionResponse = ref<AlertResponse | null>(null)
const errors = ref<Record<string, string>>({});

const validateForm = () => {

    const { error } = baseSignupSchema.validate(form.value, { abortEarly: false });

    if (error) {
        errors.value = error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {} as Record<string, string>);

        return false
    }

    errors.value = {};
    return true;
};

const handleSubmit = async () => {
    if (validateForm()) {
        submitting.value = true
        handleRequest({
            func: axiosPost,
            args: [APIS.user.create, form.value]
        }).then(data => {
            if (data.status === "ok" && data.result) {
                submissionResponse.value = {
                    status: "success",
                    message: "User created successfully."
                }
                userStore.fetchAllUsers()
            } else {
                submissionResponse.value = {
                    status: "error",
                    message: data.errors.message
                }
            }
        }).finally(() => {
            submitting.value = false
        })
    }
};
</script>

<style scoped>
label {
    @apply text-sm text-gray-700 mb-0
}
</style>