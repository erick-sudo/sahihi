<template>
    <div class="py-4 flex flex-col gap-4">
        <div class="max-w-sm mx-auto w-full" v-if="submissionResponse !== null">
            <DisplayObject :data="submissionResponse" klass="py-2 px-4 rounded shadow" />
        </div>

        <div class="bg-white max-w-sm mx-auto p-6 grid gap-4 w-full shadow rounded">
            <h2 class="text-lg font-semibold text-gray-700">Signin</h2>
            <form class="grid gap-2" @submit.prevent="handleSubmit">
                <div class="">
                    <label class="block text-gray-700">Email</label>
                    <input v-model="form.email" type="email" class="s-input" />
                    <span v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</span>
                </div>
                <div class="">
                    <label class="block text-gray-700">Password</label>
                    <input v-model="form.password" type="password" class="s-input" />
                    <span v-if="errors.password" class="text-red-600 text-xs">{{ errors.password }}</span>
                </div>
                <button type="submit" class="s-btn mt-2 px-4 py-1.5"
                    :class="{ 'bg-gray-300 text-gray-600': submitting }">
                    {{ submitting ? 'Signing in...' : 'Signin' }}
                </button>

            </form>

            <div class="border-b"></div>

            <div class="text-center">
                <span>Don't have an account?</span>&nbsp;<RouterLink class="text-green-600 hover:text-green-800"
                    to="/signup">
                    Create
                </RouterLink>.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Joi from 'joi';
import useAPI from '../../composables/useAPI';
import DisplayObject from '../ui/DisplayObject.vue';
import { AlertResponse } from '../ui/definitions';
import { axiosGet, axiosPost } from '../../lib/axiosLib';
import { APIS } from '../../lib/apis'
import { useAuthStore } from '../../stores/store.auth';
import { AuthenticationContext } from '../../lib/definitions';

const authStore = useAuthStore()

const handleRequest = useAPI()

interface LoginForm {
    email: string;
    password: string;
}

function fetchCurrentUser() {
    handleRequest<AuthenticationContext>({
        func: axiosGet,
        args: [APIS.account.currentUser]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            authStore.updateAuth(data.result)
        } else {
            authStore.clearAuth()
        }
    })
}

const loginSchema = Joi.object({
    email: Joi.string().email({
        tlds: { allow: false }
    }).required().messages({ 'string.email': 'Invalid email address' }),
    password: Joi.string().min(8).required().messages({ 'string.min': 'Weak password' })
});

const form = ref<LoginForm>({
    email: "",
    password: ''
});

const submitting = ref(false)
const submissionResponse = ref<AlertResponse | null>(null)
const errors = ref<Record<string, string>>({});

const validateForm = () => {

    const { error } = loginSchema.validate(form.value, { abortEarly: false });

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
            args: [APIS.account.signin, form.value]
        }).then(data => {
            if (data.status === "ok" && data.result) {
                submissionResponse.value = {
                    status: "success",
                    message: "Signed in successfully."
                }
                fetchCurrentUser()
            } else {
                submissionResponse.value = {
                    status: "error",
                    message: data.errors.message || "Could not sign in."
                }
            }
        }).finally(() => {
            submitting.value = false
        })
    }
};

// Attempt to fetch the current user
onMounted(fetchCurrentUser)
</script>

<style scoped></style>