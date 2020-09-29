import React from "react";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../../components/Layout";
import { Formik, Form } from "formik";
import createPost from "../../create-post";
import { InputField } from "../../../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { usePostQuery } from "../../../generated/graphql";

const EditPost = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout variant="regular">
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values) => {
          // const { error } = await createPost({ input: values });
          // if (!error) {
          //   router.push("/");
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title of post"
              label="Title"
            />
            <Box mt={5}>
              <InputField
                textarea
                name="text"
                placeholder="Text of post"
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
