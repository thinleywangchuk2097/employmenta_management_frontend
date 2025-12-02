import apiClient from "../axios";

class EmploymentManagementService {
  async list(params = {}) {
    const res = await apiClient.get(`/api/v1/employee-management/get-all-employees`, { params });
    return res.data;
  }

  async getById(id) {
    const res = await apiClient.get(`/api/v1/employee-management/get-employee/${id}`);
    return res.data;
  }

  async create(data) {
    const res = await apiClient.post(`/api/v1/employee-management/create`, data);
    return res.data;
  }

  async update(id, data) {
    const res = await apiClient.put(`/api/v1/employee-management/update-employee/${id}`, data);
    return res.data;
  }

  async remove(id) {
    const res = await apiClient.delete(`/api/v1/employee-management/delete-employee/${id}`);
    return res.data;
  }
}

export default new EmploymentManagementService();
