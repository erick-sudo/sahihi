<template>
    <!-- Project creation form -->
    <div class="bg-gray-50 w-[20rem] mx-auto p-6 grid gap-4 shadow rounded">
        <h2 class="text-lg font-semibold text-gray-700">Create Project</h2>
        <form class="grid gap-2" @submit.prevent="handleSubmit">
            <div>
                <label class="block text-gray-700">Project Name</label>
                <input v-model="form.name" type="text" class="s-input" />
                <span v-if="errors.name" class="text-red-600 text-xs">{{ errors.name }}</span>
            </div>
            <div>
                <label class="block text-gray-700">Description</label>
                <textarea :rows="4" v-model="form.description" class="s-input"></textarea>
                <span v-if="errors.description" class="text-red-600 text-xs">{{ errors.description }}</span>
            </div>
            <button :disabled="!form.name || !form.description" type="submit" class="s-btn px-4 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600" :class="{ 'bg-gray-300 text-gray-600': submitting }">
                {{ submitting ? 'Creating Project...' : 'Create Project' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Joi from 'joi';
import useAPI from '../../../composables/useAPI';
import { AlertResponse } from '../../ui/definitions';
import { axiosPost } from '../../../lib/axiosLib';
import { APIS } from '../../../lib/apis';
import { useProjectStore } from '../../../stores/store.projects';
import { Project } from '../../../lib/definitions';

const projectStore = useProjectStore();

const handleRequest = useAPI();

interface ProjectForm {
    name: string;
    description: string;
}

const form = ref<ProjectForm>({
    name: "",
    description: ""
});

const submitting = ref(false);
const submissionResponse = ref<AlertResponse | null>(null);
const errors = ref<Record<string, string>>({});

// Define validation schema
const projectSchema = Joi.object({
    name: Joi.string().required().messages({ 'string.empty': 'Project name is required' }),
    description: Joi.string().optional()
});

// Validate the form
const validateForm = () => {
    const { error } = projectSchema.validate(form.value, { abortEarly: false });

    if (error) {
        errors.value = error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
        }, {} as Record<string, string>);

        return false;
    }

    errors.value = {};
    return true;
};

// Handle form submission
const handleSubmit = async () => {
    if (validateForm()) {
        submitting.value = true;
        handleRequest<Project>({
            func: axiosPost,
            args: [APIS.projects.create, form.value]
        }).then(data => {
            if (data.status === "ok" && data.result) {
                submissionResponse.value = {
                    status: "success",
                    message: "Project created successfully."
                };
                form.value = { name: "", description: "" }; // Reset the form
                projectStore.fetchProjects()
                projectStore.fetchProjectDetails(data.result.id)
            } else {
                submissionResponse.value = {
                    status: "error",
                    message: data.errors.message
                };
            }
        }).finally(() => {
            submitting.value = false;
        });
    }
};
</script>
