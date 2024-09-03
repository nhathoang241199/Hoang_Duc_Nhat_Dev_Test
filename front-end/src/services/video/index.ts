import API from "../api";

export type TShareVideoData = {
  url: string;
  title: string;
  description: string;
  banner: string;
};

export type TVoteVideoData = {
  videoId: number;
  isLike: boolean;
};

export const callShareVideo = async (data: TShareVideoData) => {
  const userToken = localStorage.getItem("user_token");
  return await API.post("/videos", data, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

export const callVoteVideo = async (data: TVoteVideoData) => {
  const userToken = localStorage.getItem("user_token");
  return await API.post("/videos/vote", data, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
};

export const callGetVideos = async (callParams: {
  key: string;
  page: number;
  pageSize: number;
}) => {
  const { page, pageSize } = callParams;

  const userToken = localStorage.getItem("user_token");

  const params = {
    page: page,
    pageSize: pageSize,
  };

  return await API.get("/videos", {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    params,
  });
};

export const fetchYoutubeVideoDetails = async (
  videoId: string,
  apiKey: string
) => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
  try {
    const response = await API.get(apiUrl);
    const { data } = response;

    if (data.items && data.items.length > 0) {
      const { title, description, thumbnails } = data.items[0].snippet;
      const banner = thumbnails.high.url;
      return { title, description, banner };
    } else {
      throw new Error("Video not found!");
    }
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
};
