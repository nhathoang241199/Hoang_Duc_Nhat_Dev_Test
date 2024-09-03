import API from "../api";

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  password: string;
};

export const callLoginApi = async (data: TLoginData) => {
  return await API.post("/auth/login", {
    ...data,
    email: data.email.replace(/\s+/g, ""),
  });
};

export const callRegisterApi = async (data: TRegisterData) => {
  return await API.post("/users/register", {
    ...data,
    email: data.email.replace(/\s+/g, ""),
  });
};

export const callGetUserInfo = async (token: string) => {
  return await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
