import api from "./api";

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },
};
