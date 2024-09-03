import { getYoutubeVideoId, truncateString } from "@/utils";

describe("getYoutubeVideoId", () => {
  it("should return the correct YouTube video ID for a standard YouTube URL", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const videoId = getYoutubeVideoId(url);
    expect(videoId).toBe("dQw4w9WgXcQ");
  });

  it("should return the correct YouTube video ID for a shortened YouTube URL", () => {
    const url = "https://youtu.be/dQw4w9WgXcQ";
    const videoId = getYoutubeVideoId(url);
    expect(videoId).toBe("dQw4w9WgXcQ");
  });

  it("should return the correct YouTube video ID for an embedded YouTube URL", () => {
    const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const videoId = getYoutubeVideoId(url);
    expect(videoId).toBe("dQw4w9WgXcQ");
  });

  it("should return null for an invalid YouTube URL", () => {
    const url = "https://www.example.com/watch?v=dQw4w9WgXcQ";
    const videoId = getYoutubeVideoId(url);
    expect(videoId).toBeNull();
  });
});

describe("truncateString", () => {
  it("should truncate a string that exceeds the maximum length and append ellipsis", () => {
    const str = "This is a very long string that needs to be truncated.";
    const truncatedStr = truncateString(str, 10);
    expect(truncatedStr).toBe("This is a ...");
  });

  it("should return the original string if it does not exceed the maximum length", () => {
    const str = "Short string";
    const truncatedStr = truncateString(str, 20);
    expect(truncatedStr).toBe("Short string");
  });

  it("should truncate a string to the default length of 300 characters", () => {
    const str = "a".repeat(301);
    const truncatedStr = truncateString(str);
    expect(truncatedStr).toBe("a".repeat(300) + "...");
  });

  it("should return the original string if the length is exactly the maximum length", () => {
    const str = "a".repeat(300);
    const truncatedStr = truncateString(str);
    expect(truncatedStr).toBe(str);
  });
});
