import { render, screen } from "@testing-library/react";
import AuthLayout from "./auth";
import Header from "../header";
import useApi from "@/hooks/useApi";

// Mock các module
jest.mock("../header", () => jest.fn(() => <div data-testid="header" />));
jest.mock("@/hooks/useApi", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getUserInfo: jest.fn(),
  })),
}));

describe("AuthLayout", () => {
  it("renders the Header component", () => {
    render(
      <AuthLayout>
        <div>Test Children</div>
      </AuthLayout>
    );

    // Kiểm tra xem Header có được render hay không
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
  });

  it("renders the children components", () => {
    render(
      <AuthLayout>
        <div data-testid="child">Test Children</div>
      </AuthLayout>
    );

    // Kiểm tra xem children có được render hay không
    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Test Children");
  });

  it("calls getUserInfo if user_token is present in localStorage", () => {
    const mockGetUserInfo = jest.fn();
    (useApi as jest.Mock).mockReturnValue({ getUserInfo: mockGetUserInfo });

    // Giả lập giá trị của localStorage
    localStorage.setItem("user_token", "fake_token");

    render(
      <AuthLayout>
        <div>Test Children</div>
      </AuthLayout>
    );

    // Kiểm tra xem getUserInfo có được gọi hay không
    expect(mockGetUserInfo).toHaveBeenCalledWith("fake_token");
  });

  it("does not call getUserInfo if user_token is not present in localStorage", () => {
    const mockGetUserInfo = jest.fn();
    (useApi as jest.Mock).mockReturnValue({ getUserInfo: mockGetUserInfo });

    // Đảm bảo localStorage không có user_token
    localStorage.removeItem("user_token");

    render(
      <AuthLayout>
        <div>Test Children</div>
      </AuthLayout>
    );

    // Kiểm tra xem getUserInfo không được gọi
    expect(mockGetUserInfo).not.toHaveBeenCalled();
  });
});
