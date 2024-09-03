import {
  callLoginApi,
  callRegisterApi,
  callGetUserInfo,
  TLoginData,
  TRegisterData,
} from "@/services/auth";

import {
  callShareVideo,
  callVoteVideo,
  callGetVideos,
  fetchYoutubeVideoDetails,
  TShareVideoData,
  TVoteVideoData,
} from "@/services/video";

import API from "@/services/api";

jest.mock("@/services/api");

describe("Auth API Calls", () => {
  const mockPost = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    (API.post as jest.Mock) = mockPost;
    (API.get as jest.Mock) = mockGet;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("callLoginApi", () => {
    it("should call API.post with the correct URL and data", async () => {
      const data: TLoginData = {
        email: " test@example.com ",
        password: "password123",
      };
      const trimmedData = {
        email: "test@example.com",
        password: "password123",
      };

      await callLoginApi(data);

      expect(mockPost).toHaveBeenCalledWith("/auth/login", trimmedData);
    });
  });

  describe("callRegisterApi", () => {
    it("should call API.post with the correct URL and data", async () => {
      const data: TRegisterData = {
        email: " test@example.com ",
        password: "password123",
      };
      const trimmedData = {
        email: "test@example.com",
        password: "password123",
      };

      await callRegisterApi(data);

      expect(mockPost).toHaveBeenCalledWith("/users/register", trimmedData);
    });
  });

  describe("callGetUserInfo", () => {
    it("should call API.get with the correct URL and headers", async () => {
      const token = "mock-token";
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await callGetUserInfo(token);

      expect(mockGet).toHaveBeenCalledWith("/auth/me", { headers });
    });
  });
});

describe("Video API Calls", () => {
  const mockPost = jest.fn();
  const mockGet = jest.fn();
  const mockToken = "mock-token";

  beforeEach(() => {
    localStorage.setItem("user_token", mockToken);
    (API.post as jest.Mock) = mockPost;
    (API.get as jest.Mock) = mockGet;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("callShareVideo", () => {
    it("should call API.post with the correct URL, data, and headers", async () => {
      const data: TShareVideoData = {
        url: "http://example.com",
        title: "Test Video",
        description: "Test Description",
        banner: "http://example.com/banner.jpg",
      };

      await callShareVideo(data);

      expect(mockPost).toHaveBeenCalledWith("/videos", data, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe("callVoteVideo", () => {
    it("should call API.post with the correct URL, data, and headers", async () => {
      const data: TVoteVideoData = {
        videoId: 123,
        isLike: true,
      };

      await callVoteVideo(data);

      expect(mockPost).toHaveBeenCalledWith("/videos/vote", data, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe("callGetVideos", () => {
    it("should call API.get with the correct URL, headers, and params", async () => {
      const callParams = {
        key: "getVideos",
        page: 1,
        pageSize: 10,
      };

      await callGetVideos(callParams);

      expect(mockGet).toHaveBeenCalledWith("/videos", {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        params: {
          page: 1,
          pageSize: 10,
        },
      });
    });
  });

  describe("fetchYoutubeVideoDetails", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return video details when API call is successful", async () => {
      const videoId = "dQw4w9WgXcQ";
      const apiKey = "test-api-key";
      const responseData = {
        items: [
          {
            snippet: {
              title: "Test Video",
              description: "Test Description",
              thumbnails: {
                high: { url: "http://example.com/banner.jpg" },
              },
            },
          },
        ],
      };

      mockGet.mockResolvedValue({ data: responseData });

      const result = await fetchYoutubeVideoDetails(videoId, apiKey);

      expect(mockGet).toHaveBeenCalledWith(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
      );
      expect(result).toEqual({
        title: "Test Video",
        description: "Test Description",
        banner: "http://example.com/banner.jpg",
      });
    });

    it("should return null and log error when API call fails", async () => {
      const videoId = "invalid-video-id";
      const apiKey = "test-api-key";

      mockGet.mockRejectedValue(new Error("API call failed"));

      const result = await fetchYoutubeVideoDetails(videoId, apiKey);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching video details:",
        expect.any(Error)
      );
    });
  });
});
