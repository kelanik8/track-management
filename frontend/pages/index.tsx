import type { NextPage } from "next";
import React, { Fragment, useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Center,
  Stack,
  Text,
  Container,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Heading,
  Badge,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FilePond } from "react-filepond";
import { submitTrackData } from "../app/features/tracks/tracksSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import "filepond/dist/filepond.min.css";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const tracksPending = useAppSelector((state) => state.tracks.pending);
  const tracksData = useAppSelector((state) => state.tracks.tracks);
  const tracksError = useAppSelector((state) => state.tracks.error);
  const [files, setFiles] = useState([]);
  const filePondRef = useRef(null);
  const toast = useToast()

  useEffect(() => {
    if (tracksError) {
      toast({
        title: "An Error Occured",
        description: tracksError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [tracksError]);

  const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let filesRef: any = filePondRef.current
    if (!filesRef.getFiles().length) {
      toast({
        title: "An Error Occurred",
        description: "Upload a CSV file",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
    const csvFile = filesRef.getFiles()[0]
    dispatch(submitTrackData(csvFile));
  };

  return (
    <Container maxW="container.md" marginTop="40">
      <Center p={8}>
        <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
          <Heading mb={10}>Conference Track Management</Heading>

          <Box w="100%" p={1}>
            <FilePond
              files={files}
              allowMultiple={false}
              name="files"
              ref={filePondRef}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
          </Box>
          <Button w={"full"} variant={"outline"} onClick={onSubmit}>
            <Center>
              <Text>Upload CSV</Text>
            </Center>
          </Button>
          <Box w="100%" p={1} marginTop="30">
            {tracksPending && (
              <Center w="100%">
                <Spinner color="red.500" />
              </Center>
            )}
            {tracksData.length > 0 && (
              <Fragment>
                {tracksData.map((track, idx) => (
                  <Fragment key={idx}>
                    <Badge mt="10" mb="5">
                      Track {idx + 1}
                    </Badge>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Time</Th>
                          <Th>Talk</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {track.map((session, idx) => (
                          <Tr key={idx}>
                            <Td>{session.time}</Td>
                            <Td>{session.talk}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Fragment>
                ))}
              </Fragment>
            )}
          </Box>
        </Stack>
      </Center>
    </Container>
  );
};

export default Home;
