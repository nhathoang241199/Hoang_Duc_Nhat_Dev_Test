import AuthLayout from "@/components/layouts/auth";
import ShareModal from "@/components/shareModal";
import useApi from "@/hooks/useApi";
import useVideo from "@/hooks/useVideo";
import { getYoutubeVideoId, truncateString } from "@/utils";
import {
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { io } from "socket.io-client";
import { mutate as globalMutate } from "swr";

enum EVoteStatus {
  liked = "liked",
  unliked = "unliked",
  notVoted = "notVoted",
}

type TVideo = {
  id: number;
  url: string;
  title: string;
  description: string;
  banner: string;
  likes: number;
  unlikes: number;
  userVoteStatus: EVoteStatus | undefined;
  user: {
    email: string;
    id: number;
    password: string;
  };
};

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, setPage, mutate, page, totalPage } = useVideo();
  const { voteVideo } = useApi();
  const toast = useToast();
  const iframeWidth = useBreakpointValue(
    {
      base: "100%",
      md: "400px",
    },
    {
      fallback: "100%",
    }
  );

  const handleVoted = async (videoId: number, isLike: boolean) => {
    const result = await voteVideo({ videoId, isLike });
    if (result) {
      mutate();
    }
  };

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/backend", "") ||
        "http://share--Publi-e28O0AIcCghh-1447109741.ap-southeast-1.elb.amazonaws.com",
      {
        path: "/backend/socket.io",
        transports: ["websocket"],
      }
    );

    socket.on("videoShared", (data) => {
      globalMutate({ key: "getVideos", page: 1, pageSize: 10 });
      toast.closeAll();
      toast({
        title: `${data.user} just shared a video`,
        description: data.title,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AuthLayout>
      <Head>
        <title>Share video</title>
        <meta name="description" content="Share video youtube" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data ? (
        <>
          {data && data.length === 0 ? (
            <Flex
              width="100%"
              height="full"
              alignItems="center"
              justifyContent="center"
              direction="column"
              gap={4}
            >
              <Image
                src="/images/no-data.png"
                alt="no-data"
                width={400}
                height={400}
              />
              <Text>
                No videos have been shared yet. Be the first to share your
                video!
              </Text>
              <Button onClick={onOpen} colorScheme="green">
                Share video
              </Button>
            </Flex>
          ) : (
            <Flex direction="column">
              <Flex gap={4} direction="column">
                {data.map((video: TVideo) => (
                  <Flex
                    gap={{ base: 0, md: 2 }}
                    key={video.id}
                    boxShadow="md"
                    rounded="2xl"
                    overflow="hidden"
                    _hover={{
                      boxShadow: "dark-lg",
                    }}
                    transition="all ease 0.2s"
                    direction={{ base: "column", md: "row" }}
                  >
                    {/* <img
                  src={video.banner}
                  alt="video-banner"
                  style={{
                    height: "300px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => hanldeOpenVideo(video.url)}
                /> */}
                    <iframe
                      height="300px"
                      width={iframeWidth}
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                        video.url
                      )}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>

                    <Flex
                      direction="column"
                      flex={1}
                      py={4}
                      px={{ base: 4, md: 4 }}
                      gap={2}
                    >
                      <Text
                        maxW="550px"
                        fontWeight={600}
                        fontSize="lg"
                        color="blue.500"
                      >
                        {video.title}
                      </Text>
                      <Text fontWeight={600}>
                        Share by: {video?.user?.email || "Anonymous"}
                      </Text>
                      <Flex w="full" justifyContent="space-between" pr={10}>
                        <Flex gap={4}>
                          <Flex gap={1} alignItems="center">
                            {video?.likes || 0}{" "}
                            <Icon color="green.500" as={AiFillLike} />
                          </Flex>
                          <Flex gap={1} alignItems="center">
                            {video?.unlikes || 0}{" "}
                            <Icon color="red.500" as={AiFillDislike} />
                          </Flex>
                        </Flex>
                        {video?.userVoteStatus && (
                          <Flex gap={2} alignItems="center">
                            {video?.userVoteStatus === EVoteStatus.notVoted && (
                              <>
                                <Icon
                                  _hover={{
                                    color: "blue.500",
                                  }}
                                  w={8}
                                  cursor="pointer"
                                  h={8}
                                  as={AiFillLike}
                                  onClick={() => handleVoted(video.id, true)}
                                />
                                <Icon
                                  _hover={{
                                    color: "blue.500",
                                  }}
                                  cursor="pointer"
                                  w={8}
                                  h={8}
                                  as={AiFillDislike}
                                  onClick={() => handleVoted(video.id, false)}
                                />
                              </>
                            )}

                            {video?.userVoteStatus === EVoteStatus.liked && (
                              <>
                                <Icon
                                  color="green.500"
                                  w={8}
                                  h={8}
                                  as={AiFillLike}
                                />
                              </>
                            )}

                            {video?.userVoteStatus === EVoteStatus.unliked && (
                              <>
                                <Icon
                                  color="red.500"
                                  w={8}
                                  h={8}
                                  as={AiFillDislike}
                                />
                              </>
                            )}
                            <Text>
                              (
                              {video?.userVoteStatus === EVoteStatus.notVoted
                                ? "Un-voted"
                                : video?.userVoteStatus === EVoteStatus.liked
                                ? "Voted up"
                                : "Voted down"}
                              )
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                      <Text fontWeight={600}>Description: </Text>
                      <Text fontSize={12} color="gray.800" maxW="550px">
                        {truncateString(video.description)}{" "}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
              <Flex
                direction={{ base: "column", md: "row" }}
                mt={{ base: 12, md: 16 }}
                mb={4}
                fontSize="smaller"
                gap={{ base: 8, md: 0 }}
              >
                <Flex
                  w={{ base: "full", md: "fit-content" }}
                  justifyContent="space-between"
                  alignItems="center"
                  mr={2}
                >
                  <Button
                    variant="link"
                    onClick={() => setPage(1)}
                    isDisabled={page < 2}
                  >
                    {"<<"}
                  </Button>{" "}
                  <Button
                    variant="link"
                    onClick={() => setPage(page - 1)}
                    isDisabled={page < 2}
                  >
                    {"<"}
                  </Button>{" "}
                  <Text>
                    Page{" "}
                    <strong>
                      {page} of {totalPage ? totalPage : 0}
                    </strong>{" "}
                  </Text>
                  <Button
                    variant="link"
                    onClick={() => setPage(page + 1)}
                    isDisabled={page === totalPage}
                  >
                    {">"}
                  </Button>{" "}
                  <Button
                    variant="link"
                    onClick={() => setPage(totalPage)}
                    isDisabled={page === totalPage}
                  >
                    {">>"}
                  </Button>{" "}
                </Flex>
                <Flex alignItems="center" gap={4}>
                  <Text display={{ base: "none", md: "block" }}>|</Text>
                  <Text>
                    Go to page:{"  "}
                    <input
                      style={{
                        width: "80px",
                        height: "32px",
                        background: "#ece9e9",
                        paddingLeft: "10px",
                      }}
                      type="number"
                      defaultValue={page}
                      onBlur={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : 0;
                        if (value > totalPage || value < 0 || !value) {
                          return;
                        }
                        setPage(value);
                      }}
                    />
                  </Text>{" "}
                </Flex>
              </Flex>
            </Flex>
          )}
        </>
      ) : (
        <Flex
          w="full"
          h="full"
          minH="calc(100vh - 66px)"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner color="blue.500" size="xl" />
        </Flex>
      )}

      <ShareModal isOpen={isOpen} onClose={onClose} />
    </AuthLayout>
  );
}
