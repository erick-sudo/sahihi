export const baseUrl = `${import.meta.env.VITE_SAHIHI_API}`;

export const APIS = {
  account: {
    signin: `${baseUrl}/auth/signin`,
    signup: `${baseUrl}/auth/signup`,
    currentUser: `${baseUrl}/auth/current/user`,
    signout: `${baseUrl}/auth/signout`,
  },
  user: {
    create: `${baseUrl}/users`,
    index: `${baseUrl}/users`,
    indexBrief: `${baseUrl}/users/index/brief`,
    retrieve: `${baseUrl}/users/<:userId>`,
  },
  projects: {
    create: `${baseUrl}/projects`,
    index: `${baseUrl}/projects`,
    retrieve: `${baseUrl}/projects/<:projectId>`,
    assignRoles: `${baseUrl}/projects/<:projectId>/roles/assign`,
    unassignRoles: `${baseUrl}/projects/<:projectId>/roles/unassign`,
    projectAssignments: `${baseUrl}/projects/<:projectId>/project_assignments`,
  },
  authorization: {
    roles: {
      index: `${baseUrl}/roles`,
      show: `${baseUrl}/roles/<:roleId>`,
      create: `${baseUrl}/roles`,
      destroy: `${baseUrl}/roles/<:roleId>`,
    },
  },
};
