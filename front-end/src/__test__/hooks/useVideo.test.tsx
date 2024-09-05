import { renderHook, act } from "@testing-library/react-hooks";
import useVideo from "@/hooks/useVideo";
import useSWR from "swr";
import { callGetVideos } from "@/services/video";

// Mock các module cần thiết
jest.mock("swr");
jest.mock("@/services/video");

describe("useVideo hook", () => {
  const mockData = {
    data: {
      videos: ["video1", "video2"],
      totalPages: 5,
    },
  };

  beforeEach(() => {
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      mutate: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return videos and total pages correctly", () => {
    const { result } = renderHook(() => useVideo());

    expect(result.current.data).toEqual(mockData.data.videos);
    expect(result.current.totalPage).toBe(mockData.data.totalPages);
    expect(result.current.isError).toBeNull();
  });

  it("should handle page change correctly", () => {
    const { result } = renderHook(() => useVideo());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
    expect(useSWR).toHaveBeenCalledWith(
      { key: "getVideos", page: 2, pageSize: 10 },
      callGetVideos
    );
  });

  it("should return error if there is an error", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: "Error occurred",
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useVideo());

    expect(result.current.isError).toBe("Error occurred");
    expect(result.current.data).toEqual(undefined);
    expect(result.current.totalPage).toBe(1);
  });

  it("should handle mutate correctly", () => {
    const mockMutate = jest.fn();
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useVideo());

    result.current.mutate();

    expect(mockMutate).toHaveBeenCalled();
  });
});
