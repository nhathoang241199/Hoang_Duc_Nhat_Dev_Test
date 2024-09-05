import { renderHook, act } from "@testing-library/react-hooks";
import useApi from "@/hooks/useApi";
import {
  callLoginApi,
  callRegisterApi,
  callGetUserInfo,
} from "@/services/auth";
import { callShareVideo, callVoteVideo } from "@/services/video";
import { setEmail } from "@/redux/user/slice";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

// Mock all the necessary modules
jest.mock("@/services/video", () => ({
  callShareVideo: jest.fn(),
  callVoteVideo: jest.fn(),
}));

jest.mock("@/services/auth", () => ({
  callLoginApi: jest.fn(),
  callRegisterApi: jest.fn(),
  callGetUserInfo: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  useToast: jest.fn(() => {
    const toast = jest.fn(); // Mock hàm chính để hiển thị toast
    toast.closeAll = jest.fn(); // Mock phương thức closeAll
    return toast;
  }),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("useApi custom hook", () => {
  let mockDispatch: jest.Mock;
  let mockRouterPush: jest.Mock;
  let mockToast = jest.fn();

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockRouterPush = jest.fn();
    mockToast = jest.fn();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useToast as jest.Mock).mockReturnValue(mockToast);
    mockToast.closeAll = jest.fn();
    // Mock localStorage
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should call login API, dispatch email, and redirect on success", async () => {
      (callLoginApi as jest.Mock).mockResolvedValue({
        status: 201,
        data: { access_token: "mockToken" },
      });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(callLoginApi).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user_token",
        "mockToken"
      );
      expect(mockDispatch).toHaveBeenCalledWith(setEmail("test@example.com"));
      expect(mockRouterPush).toHaveBeenCalledWith("/");
      expect(mockToast).toHaveBeenCalledWith({
        title: "Login successfully!",
        status: "success",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    });

    it("should handle login failure", async () => {
      (callLoginApi as jest.Mock).mockRejectedValue({
        response: {
          data: { message: "Invalid credentials" },
        },
      });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Login failed!",
        description: "Invalid credentials",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    });
  });

  describe("register", () => {
    it("should call register API and redirect on success", async () => {
      (callRegisterApi as jest.Mock).mockResolvedValue({
        status: 201,
      });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.register({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(callRegisterApi).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/signIn");
      expect(mockToast).toHaveBeenCalledWith({
        title: "Registered successfully!",
        status: "success",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    });

    it("should handle register failure", async () => {
      (callRegisterApi as jest.Mock).mockRejectedValue({
        response: {
          data: { message: "Email already exists" },
        },
      });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.register({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Registered failed!",
        description: "Email already exists",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    });
  });

  describe("shareVideo", () => {
    it("should call share video API and show success toast", async () => {
      (callShareVideo as jest.Mock).mockResolvedValue({ status: 201 });

      const { result } = renderHook(() => useApi());

      let response;
      await act(async () => {
        response = await result.current.shareVideo({
          url: "http://example.com",
          title: "Video Title",
          description: "Video Description",
          banner: "http://example.com/banner.jpg",
        });
      });

      expect(callShareVideo).toHaveBeenCalledWith({
        url: "http://example.com",
        title: "Video Title",
        description: "Video Description",
        banner: "http://example.com/banner.jpg",
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: "Share video successfully!",
        status: "success",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      expect(response).toBe(true);
    });
  });

  describe("voteVideo", () => {
    it("should call vote video API and return true on success", async () => {
      (callVoteVideo as jest.Mock).mockResolvedValue({ status: 201 });

      const { result } = renderHook(() => useApi());

      let response;
      await act(async () => {
        response = await result.current.voteVideo({ videoId: 1, isLike: true });
      });

      expect(callVoteVideo).toHaveBeenCalledWith({ videoId: 1, isLike: true });
      expect(response).toBe(true);
    });

    it("should handle vote video failure", async () => {
      (callVoteVideo as jest.Mock).mockRejectedValue({
        response: {
          data: { message: "Failed to vote" },
        },
      });

      const { result } = renderHook(() => useApi());

      let response;
      await act(async () => {
        response = await result.current.voteVideo({ videoId: 1, isLike: true });
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Share video failed!",
        description: "Failed to vote",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      expect(response).toBe(false);
    });
  });

  describe("getUserInfo", () => {
    it("should call get user info API and dispatch email on success", async () => {
      const mockUserInfo = { email: "test@example.com" };
      (callGetUserInfo as jest.Mock).mockResolvedValue({ data: mockUserInfo });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.getUserInfo("mockToken");
      });

      expect(callGetUserInfo).toHaveBeenCalledWith("mockToken");
      expect(mockDispatch).toHaveBeenCalledWith(setEmail("test@example.com"));
    });

    it("should handle get user info failure", async () => {
      (callGetUserInfo as jest.Mock).mockRejectedValue({
        response: {
          data: { message: "Failed to get user info" },
        },
      });

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.getUserInfo("mockToken");
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Get user info failed!",
        description: "Failed to get user info",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
    });
  });
});
