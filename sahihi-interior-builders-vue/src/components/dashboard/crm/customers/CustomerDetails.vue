<template>
    <div class="p-4 grid gap-4">

        <div v-if="customer" class="grid gap-2">
            <h2 class="text-lg font-bold border-b">{{ customer.name }}</h2>

            <div class="">
                <strong>Email: </strong>
                <span>{{ customer.email }}</span>
            </div>

            <div class="">
                <strong>Phone: </strong>
                <span>{{ customer.phone }}</span>
            </div>

            <div class="" v-if="customer.company">
                <strong>Company: </strong>
                <span>{{ customer.company }}</span>
            </div>

            <div class="">
                <strong>Account Created: </strong>
                <span>{{ formatDate(customer.createdAt) }}</span>
            </div>

            <div class="">
                <strong>Last Updated: </strong>
                <span>{{ formatDate(customer.updatedAt) }}</span>
            </div>
        </div>

        <DisplayObject v-if="error" :data="error" class="py-2 px-4 rounded shadow text-sm" />

        <Modal @close="showNewLead = false" overlay-class="sm:p-4" content-class="bg-gray-50 max-w-sm p-6"
            v-if="!!customer" :visible="showNewLead">
            <CreateLeadForm @created="fetchLeads" @cancel="showNewLead = false" :customer-id="customer?.id"
                :mode="formMode" :lead="currentLead" />
        </Modal>

        <div>
            <div class="flex justify-between py-2">
                <div class="font-semibold">Leads</div>
                <div>
                    <button @click="addLead" class="s-btn px-4 py-1 duration-300 text-sm">+ Add Lead</button>
                </div>
            </div>
            <table v-if="leads.length" class="w-full text-sm">
                <thead>
                    <tr class="bg-gray-200">
                        <th></th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lead in leads" :key="lead.id" class="border-t">
                        <td class="px-2 py-1">
                            <div class="relative group"><span class="bg-green-400 px-1 rounded">...</span>
                                <div
                                    class="absolute z-50 hidden group-hover:block bg-gray-50 shadow shadow-gray-600 rounded-md overflow-hidden">
                                    <button
                                        class="px-3 py-1 min-w-20 text-start hover:bg-green-100 hover:text-green-800 duration-300"
                                        @click="editLead(lead)">Edit</button>
                                    <button
                                        class="px-3 py-1 min-w-20 text-start hover:bg-green-100 hover:text-green-800 duration-300"
                                        @click="deleteLead(lead.id)">Delete</button>
                                </div>
                            </div>
                        </td>
                        <td class="px-3 py-1.5"><span class="border px-2 rounded bg-gray-200">{{ lead.status }}</span>
                        </td>
                        <td class="px-3 py-1.5">{{ new Date(lead.createdAt).toDateString() + ', ' + new
                            Date(lead.createdAt).toLocaleTimeString() }}</td>
                        <td class="px-3 py-1.5">{{ new Date(lead.updatedAt).toDateString() + ', ' + new
                            Date(lead.updatedAt).toLocaleTimeString() }}</td>
                    </tr>
                </tbody>

            </table>

            <div v-else class="text-gray-500">No leads available for this customer.</div>
        </div>

        <DisplayObject v-if="leadsError" :data="leadsError" class="py-2 px-4 rounded shadow text-sm" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { Customer, Lead } from '../../../../lib/definitions';
import { AlertResponse } from '../../../ui/definitions';
import useAPI from '../../../../composables/useAPI';
import { axiosDelete, axiosGet } from '../../../../lib/axiosLib';
import { APIS } from '../../../../lib/apis';
import DisplayObject from '../../../ui/DisplayObject.vue';
import Modal from '../../../ui/Modal.vue';
import CreateLeadForm from '../leads/CreateLeadForm.vue';
import { useAlertStore } from '../../../../stores/store.alerts';

const props = defineProps<{
    customerId: string
}>();

const alertStore = useAlertStore()

const customer = ref<Customer | null>(null)
const leads = ref<Lead[]>([])
const error = ref<AlertResponse | null>(null)
const leadsError = ref<AlertResponse | null>(null)
const handleRequest = useAPI()
const showNewLead = ref(false)
const formMode = ref<'create' | 'edit'>('create');
const currentLead = ref<Lead | null>(null)

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

const addLead = () => {
    formMode.value = "create"
    currentLead.value = null
    showNewLead.value = true
}

const editLead = (lead: Lead) => {
    formMode.value = "edit"
    currentLead.value = lead
    showNewLead.value = true
}

const deleteLead = async (leadId: string) => {
    handleRequest({
        func: axiosDelete,
        args: [APIS.leads.retrieve.replace("<:leadId>", leadId)]
    }).then(data => {
        if (data.status === "ok") {
            alertStore.pushAlert({
                alert: {
                    status: "success-fill",
                    message: "Lead deleted."
                }
            })
            fetchLeads()
        } else {
            alertStore.pushAlert({
                alert: {
                    status: "error-fill",
                    message: data.errors.message
                }
            })
        }
    })
}

const fetchCustomer = async () => {
    await handleRequest<Customer>({
        func: axiosGet,
        args: [APIS.customers.retrieve.replace("<:customerId>", props.customerId)]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            customer.value = data.result
        } else {
            error.value = {
                status: "error",
                message: data.errors.message
            }
        }
    })
}

const fetchLeads = async () => {
    await handleRequest<Lead[]>({
        func: axiosGet,
        args: [APIS.customers.leads.replace("<:customerId>", props.customerId)]
    }).then(data => {
        if (data.status === "ok" && data.result) {
            leads.value = data.result
        } else {
            leadsError.value = {
                status: "error",
                message: data.errors.message
            }
        }
    })
}

onMounted(async () => {
    Promise.all([
        fetchCustomer(),
        fetchLeads()
    ])
})
</script>

<style scoped lang="css">
strong {
    @apply text-gray-600 text-sm
}

th {
    @apply text-start px-3 py-1
}
</style>
