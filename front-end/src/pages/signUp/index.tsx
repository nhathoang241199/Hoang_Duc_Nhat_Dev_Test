import AuthLayout from "@/components/layouts/auth";
import useApi from "@/hooks/useApi";
import { TRegisterData } from "@/services/auth";
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

type TRegisterFormData = {
  passwordConfirmation: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const { register: callRegister, loading } = useApi();

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
    passwordConfirmation: yup
      .string()
      .required("Password confirmation is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be at most 50 characters")
      .oneOf([yup.ref("password")], "Confirmation password does not match!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TRegisterData) => {
    await callRegister(data);
  };

  return (
    <AuthLayout>
      <Box maxW="md" mx="auto" mt={10}>
        <Heading mb={6}>Register</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input data-testid="email" type="text" {...register("email")} />
              {errors.email && (
                <FormErrorMessage>
                  {errors.email?.message?.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                data-testid="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <FormErrorMessage>
                  {errors.password?.message?.toString()}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.passwordConfirmation}>
              <FormLabel>Confirmation Password</FormLabel>
              <Input
                data-testid="confirm-password"
                type="password"
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation && (
                <FormErrorMessage>
                  {errors.passwordConfirmation?.message?.toString()}
                </FormErrorMessage>
              )}
            </FormControl>

            <Button
              data-testid="submit-button"
              isLoading={loading}
              type="submit"
              colorScheme="blue"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </AuthLayout>
  );
}
