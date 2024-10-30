<template>
    <div class="p-2 grid gap-2">
        <div class="flex items-center gap-2">
            <div class="flex-grow flex items-center gap-2">
                <Search @change="(v: string) => {
                    search = v
                }" @go="onSearch" query-key="q" class="px-4 py-1 rounded-lg border i-input text-sm" />
                <div><button @click="onSearch(search)" class="s-btn text-sm px-2 py-1 shadow">Go</button></div>
            </div>
            <div><button class="s-btn px-3 py-1 text-sm shadow" @click="openCustomerForm">Add Customer</button></div>
        </div>
        <div class="pb-4 grid">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-gray-200">
                        <th></th>
                        <th class="text-sm text-start px-2 py-1">Name</th>
                        <th class="text-sm text-start px-2 py-1">Email</th>
                        <th class="text-sm text-start px-2 py-1">Phone</th>
                        <th class="text-sm text-start px-2 py-1">Company</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-t border-gray-300" v-for="customer in customerStore.getCustomers"
                        :key="customer.id">
                        <td class="px-2 py-1">
                            <div class="relative group"><span class="bg-green-400 px-1 rounded">...</span>
                                <div
                                    class="absolute z-50 hidden group-hover:block bg-gray-50 shadow shadow-gray-600 rounded-md overflow-hidden">
                                    <button
                                        class="px-3 py-1 min-w-20 text-start hover:bg-green-100 hover:text-green-800 duration-300"
                                        @click="viewLeads(customer.id)">View</button>
                                    <button
                                        class="px-3 py-1 min-w-20 text-start hover:bg-green-100 hover:text-green-800 duration-300"
                                        @click="editCustomer(customer)">Edit</button>
                                    <button
                                        class="px-3 py-1 min-w-20 text-start hover:bg-green-100 hover:text-green-800 duration-300"
                                        @click="deleteCustomer(customer.id)">Delete</button>
                                </div>
                            </div>
                        </td>
                        <td class="px-2 py-1.5 truncate">{{ customer.name }}</td>
                        <td class="px-2 py-1.5 truncate">{{ customer.email }}</td>
                        <td class="px-2 py-1.5 truncate">{{ customer.phone }}</td>
                        <td class="px-2 py-1.5 truncate">{{ customer.company }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal content-class="bg-gray-50 max-w-sm p-6 my-4" :visible="showCustomerForm"
            @close="showCustomerForm = false">
            <CreateCustomer :customer="currentCustomer" :mode="formMode" @cancel="showCustomerForm = false" />
        </Modal>

        <Modal overlay-class="md:p-4" content-class="bg-gray-50 max-w-2xl p-4" v-if="showCustomerDetails !== null"
            :visible="!!showCustomerDetails" @close="showCustomerDetails = null">
            <CustomerDetails :customer-id="showCustomerDetails" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCustomerStore } from '../../../../stores/store.customers';
import CreateCustomer from './CreateCustomer.vue';
import CustomerDetails from './CustomerDetails.vue';
import { Customer } from '../../../../lib/definitions';
import Modal from '../../../ui/Modal.vue';
import useAPI from '../../../../composables/useAPI';
import { axiosDelete } from '../../../../lib/axiosLib';
import { APIS } from '../../../../lib/apis';
import { useAlertStore } from '../../../../stores/store.alerts';
import Search from '../../../ui/Search.vue';

const handleRequest = useAPI()
const customerStore = useCustomerStore()
const showCustomerForm = ref(false);
const showCustomerDetails = ref<string | null>(null);
const formMode = ref<'create' | 'edit'>('create');
const currentCustomer = ref<Customer | null>(null);
const alertStore = useAlertStore()
const search = ref('')

const onSearch = (v: string) => {
    if (v) {
        customerStore.search(v)
    }
}

const openCustomerForm = () => {
    formMode.value = 'create';
    currentCustomer.value = null;
    showCustomerForm.value = true;
};

const editCustomer = (customer: Customer) => {
    formMode.value = 'edit';
    currentCustomer.value = customer;
    showCustomerForm.value = true;
};

const viewLeads = (customerId: string) => {
    showCustomerDetails.value = customerId
}

const deleteCustomer = (customerId: string) => {
    handleRequest({
        func: axiosDelete,
        args: [APIS.customers.retrieve.replace("<:customerId>", customerId)]
    }).then(data => {
        if (data.status === "ok") {
            alertStore.pushAlert({
                alert: {
                    status: "success-fill",
                    message: "Customer deleted succesfully."
                }
            })
            customerStore.fetchCustomers()
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

onMounted(async () => {
    await customerStore.fetchCustomers()
})
</script>
