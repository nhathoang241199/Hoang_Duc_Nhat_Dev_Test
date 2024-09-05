import { setEmail } from "@/redux/user/slice";
import {
  callGetUserInfo,
  callLoginApi,
  callRegisterApi,
  TLoginData,
  TRegisterData,
} from "@/services/auth";
import {
  callShareVideo,
  callVoteVideo,
  TShareVideoData,
  TVoteVideoData,
} from "@/services/video";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();

  const login = async (loginData: TLoginData) => {
    setLoading(true);
    try {
      const response = await callLoginApi(loginData);

      const { status } = response;

      if (status === 201) {
        localStorage.setItem("user_token", response.data?.access_token);
        dispatch(setEmail(loginData.email));
        await router.push("/");
        toast.closeAll();
        toast({
          title: "Login successfully!",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast.closeAll();
      toast({
        title: "Login failed!",
        description: error.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
    }
    setLoading(false);
  };

  const register = async (registerData: TRegisterData) => {
    setLoading(true);
    try {
      const response = await callRegisterApi(registerData);

      const { status } = response;

      if (status === 201) {
        toast.closeAll();
        toast({
          title: "Registered successfully!",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        setLoading(false);
        await router.push("/signIn");
      }
    } catch (error: any) {
      toast.closeAll();
      console.log("error: ", error);
      toast({
        title: "Registered failed!",
        description: error?.response?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
    }
    setLoading(false);
  };

  const shareVideo = async (data: TShareVideoData) => {
    setLoading(true);
    try {
      const response = await callShareVideo(data);

      const { status } = response;

      if (status === 201) {
        toast.closeAll();
        toast({
          title: "Share video successfully!",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        setLoading(false);
        return true;
      }
    } catch (error: any) {
      toast.closeAll();
      toast({
        title: "Share video failed!",
        description: error.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
      return false;
    }
    setLoading(false);
  };

  const voteVideo = async (data: TVoteVideoData) => {
    try {
      const response = await callVoteVideo(data);

      const { status } = response;

      if (status === 201) {
        return true;
      }
    } catch (error: any) {
      toast.closeAll();
      toast({
        title: "Share video failed!",
        description: error.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      return false;
    }
  };

  const getUserInfo = async (userToken: string) => {
    try {
      const response = await callGetUserInfo(userToken);

      const { data } = response;

      if (data) {
        dispatch(setEmail(data.email));
      }
    } catch (error: any) {
      localStorage.removeItem("user_token");
      dispatch(setEmail(""));
      return false;
    }
  };

  return {
    loading,
    login,
    register,
    shareVideo,
    voteVideo,
    getUserInfo,
  };
};

export default useApi;
