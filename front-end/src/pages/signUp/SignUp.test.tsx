import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "@/pages/signup";
import useApi from "@/hooks/useApi";
import AuthLayout from "@/components/layouts/auth";

// Mock các module cần thiết
jest.mock("@/hooks/useApi");
jest.mock("@/components/layouts/auth", () => ({ children }: any) => (
  <div>{children}</div>
));

describe("SignUp page", () => {
  const mockRegister = jest.fn();
  const mockLoading = false;

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: mockLoading,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the registration form", () => {
    render(<SignUp />);

    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("should show validation error messages for invalid input", async () => {
    render(<SignUp />);

    fireEvent.input(screen.getByTestId("email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.input(screen.getByTestId("password"), {
      target: { value: "123" },
    });
    fireEvent.input(screen.getByTestId("confirm-password"), {
      target: { value: "321" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 6 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Confirmation password does not match!/i)
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register with valid input", async () => {
    render(<SignUp />);

    fireEvent.input(screen.getByTestId("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByTestId("confirm-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      });
    });
  });

  it("should show loading state when form is submitted", async () => {
    (useApi as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: true,
    });

    render(<SignUp />);

    fireEvent.input(screen.getByTestId("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByTestId("confirm-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    const button = screen.getByRole("button", { name: /Submit/i });
    expect(button).toBeDisabled();
  });
});
