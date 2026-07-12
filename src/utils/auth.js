//utils//auth.js
import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.userId || decoded.id,
      role: decoded.role,
      name: decoded.name,
    };
  } catch {
    return null;
  }
};
