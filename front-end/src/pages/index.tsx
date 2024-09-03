import AuthLayout from "@/components/layouts/auth";
import ShareModal from "@/components/shareModal";
import useApi from "@/hooks/useApi";
import useDepositReport from "@/hooks/useDepositReport";
import { truncateString } from "@/utils";
import { Button, Flex, Icon, Text, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

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
  const { data, setPage, mutate, page, totalPage } = useDepositReport();
  const { voteVideo } = useApi();

  const handleVoted = async (videoId: number, isLike: boolean) => {
    const result = await voteVideo({ videoId, isLike });
    if (result) {
      mutate();
    }
  };

  const hanldeOpenVideo = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  return (
    <AuthLayout>
      <Head>
        <title>Share video</title>
        <meta name="description" content="Share video youtube" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            No videos have been shared yet. Be the first to share your video!
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
                <img
                  src={video.banner}
                  alt="video-banner"
                  style={{
                    height: "300px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => hanldeOpenVideo(video.url)}
                />
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
                    const value = e.target.value ? Number(e.target.value) : 0;
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

      <ShareModal isOpen={isOpen} onClose={onClose} />
    </AuthLayout>
  );
}
