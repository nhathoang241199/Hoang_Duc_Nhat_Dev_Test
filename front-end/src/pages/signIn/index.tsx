import AuthLayout from "@/components/layouts/auth";
import useApi from "@/hooks/useApi";
import { TLoginData } from "@/services/auth";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export default function SignIn() {
  const { login, loading } = useApi();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .max(100, "Email must be at most 100 characters")
      .email("Invalid email format"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be at most 50 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TLoginData) => {
    await login(data);
  };

  return (
    <AuthLayout>
      <Box maxW="md" mx="auto" mt={10}>
        <Heading mb={6}>Login</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="text" {...register("email")} />
              {errors.email && (
                <FormErrorMessage>
                  {errors.email?.message?.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <FormErrorMessage>
                  {errors.password?.message?.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <Button
              data-testid="login-button"
              isLoading={loading}
              type="submit"
              colorScheme="blue"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </AuthLayout>
  );
}
