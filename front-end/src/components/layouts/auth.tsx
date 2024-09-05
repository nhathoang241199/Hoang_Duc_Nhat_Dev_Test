import { Box, Container } from "@chakra-ui/react";
import Header from "../header";
import { FC, ReactNode, useEffect } from "react";
import useApi from "@/hooks/useApi";
import useUser from "@/redux/user/selectors";

type TProps = {
  children: ReactNode;
};

const AuthLayout: FC<TProps> = ({ children }) => {
  const { getUserInfo } = useApi();
  const user = useUser();
  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      getUserInfo(userToken);
    }
  }, []);
  return (
    <Box minH="100vh">
      <Header />
      <Container
        pb={{ base: user.email ? 32 : 8, md: 8 }}
        pt={{ base: 24, md: 32, lg: 24 }}
        maxW="container.lg"
      >
        {children}
      </Container>
    </Box>
  );
};

export default AuthLayout;
