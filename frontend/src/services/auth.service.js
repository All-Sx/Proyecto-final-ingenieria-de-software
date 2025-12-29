import api from "../config/axios";

export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const register = (userData) => {
  return api.post("/auth/register", userData);
};