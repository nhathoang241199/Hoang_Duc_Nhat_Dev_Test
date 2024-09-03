import useUser from "@/redux/user/selectors";
import { setEmail } from "@/redux/user/slice";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import ShareModal from "../shareModal";

export default function Header() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = router;
  const user = useUser();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    dispatch(setEmail(""));
    router.push("/signIn");
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      bg="blue.500"
      color="white"
      px={{ base: 4, md: 8 }}
      py={3}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap={2} cursor="pointer" onClick={goToHome} alignItems="center">
          <Heading size="lg" data-testid="share-video">
            Share video
          </Heading>
          <Box display={{ base: "none", md: "block" }}>
            <Image
              src="/images/youtube.png"
              alt="youtube-logo"
              width={100}
              height={40}
            />
          </Box>
        </Flex>
        <Flex>
          {user.email ? (
            <Flex
              display={{ base: "none", md: "flex" }}
              gap={{ base: 2, lg: 4 }}
              alignItems="center"
              direction={{ base: "column", lg: "row" }}
            >
              <Text data-testid="welcome" fontWeight={400}>
                Welcome <b>{user.email}</b>!
              </Text>
              <Flex gap={4}>
                <Button
                  data-testid="share-video-button"
                  colorScheme="green"
                  onClick={onOpen}
                >
                  Share video
                </Button>
                <Button
                  data-testid="logout"
                  colorScheme="red"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Flex>
            </Flex>
          ) : (
            <>
              {pathname !== "/signIn" && (
                <Link href="/signIn" ml={4}>
                  Sign In
                </Link>
              )}
              {pathname !== "/signUp" && (
                <Link href="/signUp" ml={4}>
                  Sign Up
                </Link>
              )}
            </>
          )}
        </Flex>
      </Flex>
      <ShareModal isOpen={isOpen} onClose={onClose} />
      {user.email && pathname === "/" && (
        <Flex
          position="fixed"
          bottom={0}
          left={0}
          w="100vw"
          display={{ base: "flex", md: "none" }}
          gap={2}
          alignItems="center"
          direction="column"
          bg="blue.500"
          pt={2}
          pb={4}
          zIndex={9999}
        >
          <Text fontWeight={400}>
            Welcome <b>{user.email}</b>!
          </Text>
          <Flex gap={4} w="full" justifyContent="space-between" px={4}>
            <Button w="48%" colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
            <Button w="48%" colorScheme="green" onClick={onOpen}>
              Share video
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
