import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import login from "../login";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <div>
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              newPassword: values.newPassword,
              token,
            });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="New password"
                label="Enter your new password here..."
                type="password"
              />
              {tokenError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>{tokenError}</AlertTitle>
                  <CloseButton position="absolute" right="8px" top="8px" />
                </Alert>
              ) : null}

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Set new password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
