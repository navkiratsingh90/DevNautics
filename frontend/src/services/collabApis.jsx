import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/collab",
  withCredentials: true,
});

/* ===============================
   PROJECT COLLAB APIS
================================ */

export const createProjectCollab = (data) =>
  API.post("create", data);

export const updateProject = (projectId, data) =>
  API.put(`${projectId}`, data);

export const getAllProjects = ({
    filters = {},
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = {}) =>
    API.post(`/get?page=${page}&limit=${limit}`, {
      filters,
      sort,
      order,
    });
  
export const getProjectById = (projectId) =>
  API.get(`${projectId}`);

export const deleteProject = (projectId) =>
  API.delete(`${projectId}`);

/* ===============================
   COLLAB REQUEST APIS
================================ */

export const requestCollaboration = (projectId, data) =>
  API.post(`${projectId}/request`, data);

export const acceptApplication = (applicationId) =>
  API.post(`accept/${applicationId}`);
