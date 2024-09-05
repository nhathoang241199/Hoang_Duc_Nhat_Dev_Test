import { callGetVideos } from "@/services/video";
import { useState } from "react";
import useSWR from "swr";
const pageSize = 10;

const useVideo = () => {
  const [page, setPage] = useState(1);

  const { data, error, mutate } = useSWR(
    {
      key: "getVideos",
      page: page,
      pageSize: pageSize,
    },
    callGetVideos
  );
  return {
    data: data?.data?.videos,
    isError: error,
    totalPage: data?.data?.totalPages || 1,
    page,
    setPage,
    mutate,
  };
};

export default useVideo;
