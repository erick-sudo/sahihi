<template>
    <h4 class="text-gray-700 font-semibold mb-3">{{ mode === "create" ? "Create new lead" : "Update lead status." }}
    </h4>
    <form class="grid gap-2" @submit.prevent="submitForm">
        <select v-model="status" class="s-input px-4">
            <option value="">Select lead status</option>
            <option :value="status" v-for="(status, index) in Object.values(LeadStatus)" :key="index">
                {{ status }}
            </option>
        </select>
        <div v-if="lead" class="px-3 py-1.5"><strong>Created</strong><br />{{ new Date(lead.createdAt).toDateString() +
            ', ' + new
                Date(lead.createdAt).toLocaleTimeString() }}</div>
        <div v-if="lead" class="px-3 py-1.5"><strong>Last Updated</strong><br />{{ new
            Date(lead.updatedAt).toDateString() + ', ' + new
                Date(lead.updatedAt).toLocaleTimeString() }}</div>
        <button type="submit" class="s-btn px-4 py-1.5 mt-2" :class="{ 'bg-gray-300 text-gray-600': submitting }">
            {{ submitting ? 'Submitting...' : (mode === 'edit' ? 'Update' : 'Add') }}
        </button>
        <button type="button" class="s-btn px-4 py-1.5 mt-2 bg-gray-300 text-gray-600" @click="cancel">Cancel</button>
    </form>
</template>
selectedUserId
<script setup lang="ts">
import { ref, watch } from 'vue';
import { Lead, LeadStatus } from '../../../../lib/definitions';
import { AlertResponse } from '../../../ui/definitions';
import useAPI from '../../../../composables/useAPI';
import { axiosPatch, axiosPost } from '../../../../lib/axiosLib';
import { APIS } from '../../../../lib/apis';
import { useCustomerStore } from '../../../../stores/store.customers';
import { useAlertStore } from '../../../../stores/store.alerts';

const props = defineProps<{
    mode: 'create' | 'edit';
    lead: Lead | null;
    customerId: string;
}>();
const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'created'): void;
}>();
const cancel = () => emit("cancel")
const alertStore = useAlertStore()

const handleRequest = useAPI();
const customerStore = useCustomerStore();

const status = ref<LeadStatus>(LeadStatus.New)

const submitting = ref(false);
const submissionResponse = ref<AlertResponse | null>(null);

watch(() => props.lead, (newValue) => {
    if (props.mode === "edit") {
        if (newValue?.status) {
            status.value = newValue.status
        }
    }
}, {
    deep: true,
    immediate: true
})

const submitForm = async () => {
    submitting.value = true;
    const apiEndpoint = props.mode === 'edit' ? APIS.leads.retrieve.replace("<:leadId>", `${props.lead?.id}`) : APIS.leads.index;

    handleRequest({
        func: props.mode === 'edit' ? axiosPatch : axiosPost,
        args: [apiEndpoint, {
            customerId: props.customerId,
            status: status.value
        }],
    }).then(data => {
        if (data.status === "ok") {
            customerStore.fetchCustomers();

            if (props.mode === "create") {
                status.value = LeadStatus.New
            }
            // Success alert
            alertStore.pushAlert({
                alert: {
                    status: "success",
                    message: props.mode === "create" ? data.result.message : "Lead updated successfully.",
                }
            })
            emit("created")
        } else {
            submissionResponse.value = {
                status: "error",
                message: data.errors?.message || "An error occured.",
            };
        }
    }).finally(() => {
        submitting.value = false;
    });
};
</script>