import { defineStore } from "pinia";
import { Project } from "../lib/definitions";
import useAPI from "../composables/useAPI";
import { axiosGet } from "../lib/axiosLib";
import { APIS } from "../lib/apis";

const handleRequest = useAPI();

export const useProjectStore = defineStore("projects", {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
  }),
  getters: {
    getProjects(state) {
      return state.projects;
    },
    getSelectedProject(state) {
      return state.currentProject;
    },
  },
  actions: {
    async fetchProjects() {
      const response = await handleRequest<Project[]>({
        func: axiosGet,
        args: [APIS.projects.index],
      });
      if (response.status === "ok" && response.result) {
        this.projects = response.result;
      }
    },
    async fetchProjectDetails(projectId: string) {
      // Fetch project details by id
      const response = await handleRequest<Project>({
        func: axiosGet,
        args: [APIS.projects.retrieve.replace("<:projectId>", projectId)],
      });
      if (response.status === "ok" && response.result) {
        this.currentProject = response.result;
      }
    },
  },
});
