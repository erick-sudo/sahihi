<template>
    <div class="py-4 flex flex-col gap-4">
        <div class="max-w-sm mx-auto w-full" v-if="submissionResponse !== null">
            <DisplayObject :data="submissionResponse" klass="py-2 px-4 rounded shadow" />
        </div>

        <div class="bg-white w-full max-w-sm mx-auto p-6 grid gap-4 shadow rounded">
            <h2 class="text-lg font-semibold text-gray-700">Signup</h2>

            <div class="">
                <Stepper :steps="['Basic Info', 'Contact Info', 'Account Setup']" :currentStep="currentStep" />
            </div>
            <form class="grid gap-2" @submit.prevent="handleSubmit">

                <!-- Step 1: Personal Details -->
                <div v-if="currentStep === 0">
                    <div>
                        <label class="block text-gray-700">First Name</label>
                        <input v-model="form.firstName" type="text" class="s-input" />
                        <span v-if="errors.firstName" class="text-red-600 text-xs">{{ errors.firstName }}</span>
                    </div>
                    <div>
                        <label class="block text-gray-700">Last Name</label>
                        <input v-model="form.lastName" type="text" class="s-input" />
                        <span v-if="errors.lastName" class="text-red-600 text-xs">{{ errors.lastName }}</span>
                    </div>
                </div>

                <!-- Step 2: Contact Details -->
                <div v-if="currentStep === 1">
                    <div>
                        <label class="block text-gray-700">Phone Number</label>
                        <input v-model="form.phoneNumber" type="tel" class="s-input" />
                        <span v-if="errors.phoneNumber" class="text-red-600 text-xs">{{ errors.phoneNumber }}</span>
                    </div>
                    <div>
                        <label class="block text-gray-700">Address</label>
                        <input v-model="form.address" type="text" class="s-input" />
                        <span v-if="errors.address" class="text-red-600 text-xs">{{ errors.address }}</span>
                    </div>
                    <div>
                        <label class="block text-gray-700">Email</label>
                        <input v-model="form.email" type="email" class="s-input" />
                        <span v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</span>
                    </div>
                </div>

                <!-- Step 3: Security Information -->
                <div v-if="currentStep === 2">
                    <div>
                        <label class="block text-gray-700">KRA Pin</label>
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

                <div class="flex justify-between gap-4">
                    <button type="button" class="px-4 py-1.5 s-btn" v-if="currentStep > 0" @click="prevStep">Previous</button>
                    <button type="button" class="px-4 py-1.5 s-btn" v-if="currentStep < 2" @click="nextStep">Next</button>
                    <button type="submit" class="s-btn px-4 py-1.5" :class="{ 'bg-gray-300 text-gray-600': submitting }"
                        v-if="currentStep === 2">
                        {{ submitting ? 'Submitting...' : 'Submit' }}
                    </button>
                </div>
            </form>

            <div class="border-b"></div>

            <div class="text-center">
                <span>Have an account?</span>&nbsp;<RouterLink class="text-green-600 hover:text-green-800" to="/">
                    Sign in
                </RouterLink>.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Stepper from '../ui/Stepper.vue';
import useAPI from '../../composables/useAPI';
import { axiosPost } from '../../lib/axiosLib';
import { APIS } from '../../lib/apis';
import DisplayObject from '../ui/DisplayObject.vue';
import { AlertResponse } from '../ui/definitions';
import { baseSignupSchema, SignupForm } from '../../lib/definitions';

const handleRequest = useAPI()

const baseSchema = baseSignupSchema

const currentStep = ref(0);
const form = ref<SignupForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    kraPin: '',
    kraAttachment: null,
    password: '',
    confirmPassword: ''
});

const submitting = ref(false)
const submissionResponse = ref<AlertResponse | null>(null)
const errors = ref<Record<string, string>>({});

const validateForm = (step: number) => {

    const stepProperties = [
        ['firstName', 'lastName'],
        ['phoneNumber', 'address', 'email'],
        ['kraPin', 'kraAttachment', 'password', 'confirmPassword']
    ]

    const { error } = baseSchema.validate(form.value, { abortEarly: false });

    if (error) {
        errors.value = error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {} as Record<string, string>);

        if (Object.entries(errors.value).some(([k, _v]) => stepProperties[step].some(p => p === k))) {
            return false
        }
    }

    errors.value = {};
    return true;
};

const nextStep = () => {
    if (validateForm(currentStep.value)) {
        currentStep.value++;
    }
};

const prevStep = () => {
    currentStep.value--;
};

const handleSubmit = async () => {
    if (validateForm(currentStep.value)) {
        submitting.value = true
        handleRequest({
            func: axiosPost,
            args: [APIS.user.create, form.value]
        }).then(data => {
            if (data.status === "ok" && data.result) {
                submissionResponse.value = {
                    status: "success",
                    message: "Signed up successfully."
                }
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

<style scoped></style>
