import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShareModal from "./index";
import useApi from "@/hooks/useApi";
import { fetchYoutubeVideoDetails } from "@/services/video";
import { mutate } from "swr";

// Mock các module cần thiết
jest.mock("@/hooks/useApi");
jest.mock("@/services/video");
jest.mock("swr");

const mockShareVideo = jest.fn();
const mockMutate = jest.fn();
const mockOnClose = jest.fn();

describe("ShareModal", () => {
  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      shareVideo: mockShareVideo,
      loading: false,
    });
    (mutate as jest.Mock).mockImplementation(mockMutate);
  });

  it("renders modal when isOpen is true", () => {
    render(<ShareModal isOpen={true} onClose={mockOnClose} />);

    // Kiểm tra modal có được render không
    expect(screen.getByLabelText(/Share a Youtube movie/i)).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    render(<ShareModal isOpen={false} onClose={mockOnClose} />);

    // Kiểm tra modal không được render khi isOpen là false
    expect(
      screen.queryByText(/Share a Youtube movie/i)
    ).not.toBeInTheDocument();
  });

  it("shows validation error for invalid URL", async () => {
    render(<ShareModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByLabelText(/Youtube URL/i);
    fireEvent.change(input, { target: { value: "invalid-url" } });

    fireEvent.click(screen.getByTestId("share-button"));

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid URL. Please enter a valid YouTube URL./i)
      ).toBeInTheDocument();
    });
  });

  it("shares video successfully with valid URL", async () => {
    (fetchYoutubeVideoDetails as jest.Mock).mockResolvedValue({
      title: "Test Video",
      description: "Test Description",
      banner: "Test Banner",
    });

    mockShareVideo.mockResolvedValue(true);

    render(<ShareModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByLabelText(/Youtube URL/i);
    fireEvent.change(input, {
      target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });

    fireEvent.click(screen.getByTestId("share-button"));

    await waitFor(() => {
      expect(mockShareVideo).toHaveBeenCalledWith({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Test Video",
        description: "Test Description",
        banner: "Test Banner",
      });

      expect(mockMutate).toHaveBeenCalledWith({
        key: "getVideos",
        page: 1,
        pageSize: 10,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when Close button is clicked", () => {
    render(<ShareModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId("close-button"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
