import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./index";
import useApi from "@/hooks/useApi";

// Mock các module cần thiết
jest.mock("@/hooks/useApi");
jest.mock("@/components/layouts/auth", () => ({ children }: any) => (
  <div>{children}</div>
));

describe("SignIn page", () => {
  const mockLogin = jest.fn();
  const mockLoading = false;

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: mockLoading,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the login form", () => {
    render(<SignIn />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("should show validation error messages for invalid input", async () => {
    render(<SignIn />);

    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should call login with valid input", async () => {
    render(<SignIn />);

    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should show loading state when form is submitted", async () => {
    (useApi as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
    });

    render(<SignIn />);

    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login-button"));

    const button = screen.getByTestId("login-button");
    expect(button).toBeDisabled();
  });
});
