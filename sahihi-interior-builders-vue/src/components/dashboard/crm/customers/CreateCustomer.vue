<template>
    <div class="">
        <h2 class="text-lg font-semibold mb-4">{{ mode === 'edit' ? 'Edit Customer' : 'Add Customer' }}</h2>

        <DisplayObject v-if="submissionResponse !== null" class="text-sm shadow" :data="submissionResponse"
            klass="py-2 px-4 rounded shadow" />

        <form @submit.prevent="submitForm">
            <div>
                <label class="s-label" for="name">Name:</label>
                <input class="s-input" v-model="form.name" type="text" name="name" />
                <span v-if="errors.name" class="text-red-600 text-xs">{{ errors.name }}</span>
            </div>
            <div>
                <label class="s-label" for="email">Email:</label>
                <input class="s-input" v-model="form.email" type="email" name="email" />
                <span v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</span>
            </div>
            <div>
                <label class="s-label" for="phone">Phone:</label>
                <input class="s-input" v-model="form.phone" type="tel" name="phone" />
                <span v-if="errors.phone" class="text-red-600 text-xs">{{ errors.phone }}</span>
            </div>
            <div>
                <label class="s-label" for="company">Company:</label>
                <input class="s-input" v-model="form.company" type="text" name="company" />
            </div>
            <button type="submit" class="s-btn px-4 py-1.5 mt-3" :class="{ 'bg-gray-300 text-gray-600': submitting }">
                {{ submitting ? 'Submitting...' : (mode === 'edit' ? 'Update' : 'Add') }}
            </button>
            <button type="button" class="s-btn px-4 py-1.5 mt-3 bg-gray-300 text-gray-600"
                @click="cancel">Cancel</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Customer, CustomerForm, customerSchema, validateForm } from '../../../../lib/definitions';
import { AlertResponse } from '../../../ui/definitions';
import useAPI from '../../../../composables/useAPI';
import { axiosPatch, axiosPost } from '../../../../lib/axiosLib';
import { APIS } from '../../../../lib/apis';
import { useCustomerStore } from '../../../../stores/store.customers';
import DisplayObject from '../../../ui/DisplayObject.vue';

const props = defineProps<{
    mode: 'create' | 'edit';
    customer: Customer | null;
}>();
const emit = defineEmits<{
    (e: 'cancel'): void;
}>();
const cancel = () => emit("cancel")

const handleRequest = useAPI();
const customerStore = useCustomerStore();

const form = ref<CustomerForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
});

const submitting = ref(false);
const submissionResponse = ref<AlertResponse | null>(null);
const errors = ref<Record<string, string>>({});

// Initialize form with customer data if in edit mode
watch(() => props.customer, (newCustomer) => {
    if (newCustomer) {
        const { name, email, phone, company } = newCustomer
        form.value = { name, email, phone, company };
    } else {
        form.value = { name: '', email: '', phone: '', company: '' };
    }
}, {
    deep: true, immediate: true
});

const submitForm = async () => {
    const { name, email, phone } = form.value
    if (validateForm({
        value: { name, email, phone },
        schema: customerSchema,
        errors: errors,
    })) {
        submitting.value = true;
        const apiEndpoint = props.mode === 'edit' ? APIS.customers.retrieve.replace("<:customerId>", `${props.customer?.id}`) : APIS.customers.index;

        handleRequest({
            func: props.mode === 'edit' ? axiosPatch : axiosPost,
            args: [apiEndpoint, form.value],
        }).then(data => {
            if (data.status === "ok") {
                customerStore.fetchCustomers();

                if (props.mode === "create") {
                    // Clear form
                    form.value = {
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                    }
                }
                // Success alert
                submissionResponse.value = {
                    status: "success",
                    message: props.mode === "create" ? data.result.message : "Customer details updated successfully.",
                };
            } else {
                submissionResponse.value = {
                    status: "error",
                    message: data.errors.message,
                };
            }
        }).finally(() => {
            submitting.value = false;
        });
    }
};
</script>
