import { FC } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useApi from "@/hooks/useApi";
import { fetchYoutubeVideoDetails } from "@/services/video";
import { getYoutubeVideoId } from "@/utils";
import { mutate } from "swr";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ShareModal: FC<TProps> = ({ onClose, isOpen }) => {
  const { shareVideo, loading } = useApi();
  const toast = useToast();

  const schema = yup.object().shape({
    url: yup
      .string()
      .required("URL is required")
      .max(100, "URL must be at most 100 characters")
      .matches(
        /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
        "Invalid URL. Please enter a valid YouTube URL."
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ url: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { url: string }) => {
    const videoId = getYoutubeVideoId(data.url);

    if (videoId) {
      const apiKey = "AIzaSyBw9jDigSIheZAojJ3sxY8OaYkBx0DvKKM";
      try {
        const videoDetails = await fetchYoutubeVideoDetails(videoId, apiKey);
        if (videoDetails) {
          const { title, description, banner } = videoDetails;
          const dataSubmit = {
            url: data.url,
            title,
            description,
            banner,
          };
          const reuslt = await shareVideo(dataSubmit);
          if (reuslt) {
            reset();
            onClose();
            mutate({ key: "getVideos", page: 1, pageSize: 10 });
          }
        }
      } catch (error: any) {
        toast.closeAll();
        toast({
          title: "Share video failed!",
          description: error?.message,
          status: "error",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal
      data-testid="share-video-modal"
      size={{ base: "sm", md: "lg" }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share a Youtube movie</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.url}>
                <FormLabel>Youtube URL</FormLabel>
                <Input type="text" {...register("url")} />
                {errors.url && (
                  <FormErrorMessage>
                    {errors.url?.message?.toString()}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            data-testid="close-button"
            variant="ghost"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}
            colorScheme="blue"
            data-testid="share-button"
          >
            Share
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
