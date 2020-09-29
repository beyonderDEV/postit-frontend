import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  usePostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useMeQuery,
} from "../generated/graphql";
import { Layout } from "../components/Layout";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/core";
import NextLink from "next/link";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });

  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>Query failed ._.</div>;
  }

  return (
    <Layout variant="regular">
      <Flex>
        <NextLink href="/create-post">
          <Link padding={3} bg="#09b863" borderRadius="lg" textDecoration={0}>
            Create post
          </Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={post} />
                <Box>
                  <Flex>
                    <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize="xl">{post.title}</Heading>
                      </Link>
                    </NextLink>
                  </Flex>
                  <Text>{post.creator.username}</Text>
                  <Text maxW="90%" mt={4}>
                    {post.text}
                  </Text>
                </Box>
                {meData?.me?.id !== post.creator.id ? null : (
                  <Box ml="auto">
                    <NextLink
                      href="/post/edit/[id]"
                      as={`/post/edit/${post.id}`}
                    >
                      <IconButton
                        as={Link}
                        mr={2}
                        variantColor="teal"
                        ml="auto"
                        aria-label="edit"
                        icon="edit"
                      />
                    </NextLink>
                    <IconButton
                      variantColor="red"
                      ml="auto"
                      aria-label="delete"
                      icon="delete"
                      onClick={() => {
                        deletePost({ id: post.id });
                      }}
                    />
                  </Box>
                )}
              </Flex>
            )
          )}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
