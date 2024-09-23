import useUserStore from "../store/useUserStore";
import authInstance from "../axiosInstance/authInstance";

export const register = async (userData) => {
  const response = await authInstance.post("/register", userData);
  return response.data;
};
export const login = async (userData) => {
  const { setUser, setAccessToken } = useUserStore.getState();

  const response = await authInstance.post("/login", userData);

  setUser(response.data.user);
  setAccessToken(response.data.accessToken);

  return response.data;
};

export const getUserProfile = async () => {
  const { accessToken } = useUserStore.getState();
  const response = await authInstance.get("/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
};

export const updateProfile = async (formData) => {
  const { accessToken } = useUserStore.getState();

  const response = await authInstance.patch("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};
