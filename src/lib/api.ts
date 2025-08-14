import { Employee, ApiResponse } from "@/types/employee";

// API client for employees
export const employeeApi = {
  // Get all users/employees
  async getUsers(): Promise<ApiResponse<Employee[]>> {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },

  // Add more API methods as needed
  async getUserById(id: number): Promise<ApiResponse<Employee>> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  },

  async createUser(user: Omit<Employee, "id">): Promise<ApiResponse<Employee>> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.json();
  },

  async updateUser(
    id: number,
    user: Partial<Employee>
  ): Promise<ApiResponse<Employee>> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.json();
  },

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return response.json();
  },
};
