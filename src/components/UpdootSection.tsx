import React from "react";
import { Flex, IconButton, Text } from "@chakra-ui/core";
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex justify="center" align="center" direction="column" mr={5}>
      <IconButton
        onClick={() => {
          if (post.voteStatus === 1) {
            return;
          }
          vote({
            postId: post.id,
            value: 1,
          });
        }}
        aria-label="upvote post"
        icon="chevron-up"
        variantColor={post.voteStatus === 1 ? "teal" : undefined}
      ></IconButton>
      <Text padding={2}>{post.points}</Text>
      <IconButton
        onClick={() => {
          if (post.voteStatus === -1) {
            return;
          }
          vote({
            postId: post.id,
            value: -1,
          });
        }}
        aria-label="downvote post"
        icon="chevron-down"
        variantColor={post.voteStatus === -1 ? "red" : undefined}
      ></IconButton>
    </Flex>
  );
};
