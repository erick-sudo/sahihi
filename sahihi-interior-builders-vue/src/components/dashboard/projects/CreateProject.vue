<template>
    <!-- Project creation form -->
    <div class="grid gap-4">
        <h2 class="text-lg font-semibold text-gray-700">{{ mode === 'edit' ? 'Edit' : 'New' }} Project</h2>
        <form class="grid gap-2" @submit.prevent="handleSubmit">
            <div>
                <label class="block text-gray-700">Project Name</label>
                <input v-model="form.name" type="text" class="s-input" />
                <span v-if="errors.name" class="text-red-600 text-xs">{{ errors.name }}</span>
            </div>
            <div>
                <label class="block text-gray-700">Description <span class="text-sm font-semibold text-gray-400">[100
                        characters]</span></label>
                <textarea :rows="4" v-model="form.description" class="s-input"></textarea>
                <span v-if="errors.description" class="text-red-600 text-xs">{{ errors.description }}</span>
            </div>
            <button :disabled="!form.name || !form.description || form.description.length > 100" type="submit"
                class="s-btn px-4 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                :class="{ 'bg-gray-300 text-gray-600': submitting }">
                <span v-if="mode === 'create'">{{ submitting ? 'Creating Project...' : 'Create Project' }}</span>
                <span v-else>{{ submitting ? 'Saving changes...' : 'Save Changes' }}</span>
            </button>
        </form>

        <DisplayObject class="px-4 py-2 rounded shadow" v-if="submissionResponse" :data="submissionResponse" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Joi from 'joi';
import useAPI from '../../../composables/useAPI';
import { AlertResponse } from '../../ui/definitions';
import { axiosPatch, axiosPost } from '../../../lib/axiosLib';
import { APIS } from '../../../lib/apis';
import { useProjectStore } from '../../../stores/store.projects';
import { Project } from '../../../lib/definitions';
import DisplayObject from '../../ui/DisplayObject.vue';

const props = defineProps<{
    mode: 'create' | 'edit';
    project: Project | null;
}>();

const emit = defineEmits<{
    (e: 'mutated', message: string): void
}>()

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

// Initialize form with customer data if in edit mode
watch(() => props.project, (newProject) => {
    if (newProject) {
        const { name, description } = newProject
        form.value = { name, description: description || "" };
    } else {
        form.value = { name: '', description: "" };
    }
}, {
    deep: true, immediate: true
});

// Define validation schema
const projectSchema = Joi.object({
    name: Joi.string().required().messages({ 'string.empty': 'Project name is required' }),
    description: Joi.string().optional().max(100)
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
        const req = {
            func: props.mode === "create" ? axiosPost : axiosPatch,
            url: props.mode === "create" ? APIS.projects.create : APIS.projects.retrieve.replace("<:projectId>", projectStore.currentProject!!.id)
        }
        submitting.value = true;
        handleRequest<Project>({
            func: req.func,
            args: [req.url, form.value]
        }).then(data => {
            if (data.status === "ok" && data.result) {
                if (props.mode === "create") {
                    submissionResponse.value = {
                        status: "success",
                        message: "Project created successfully."
                    };
                    form.value = { name: "", description: "" };
                } else {
                    submissionResponse.value = {
                        status: "success",
                        message: "Project updated successfully."
                    };
                }

                emit("mutated", submissionResponse.value.message)

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
