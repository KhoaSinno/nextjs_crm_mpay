// Employee related types
export interface Employee {
  id: number;
  name: string;
  email?: string;
  phone: string;
  department: string;
  designation: string;
  type: string;
  status: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
