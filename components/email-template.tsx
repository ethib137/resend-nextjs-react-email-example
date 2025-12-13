import * as React from "react";

import {
  Body,
  Container,
  Head,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface BillingFailureEmailProps {
  updateBillingURL?: string;
  username: string;
}

export const BillingFailureEmail = ({
  updateBillingURL = 'https://www.resend.com',
  username,
}: BillingFailureEmailProps) => (
  <Html>
    <Head>
      <title>Your payment did not go through</title>
    </Head>
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Body className="bg-white text-[#24292e] font-github">
        <Preview>
          Your payment did not go through.
        </Preview>
        <Container className="max-w-[480px] mx-auto my-0 pt-5 pb-12 px-0">
          <Text className="text-[24px] leading-[1.25]">
            Your payment did not go through.
          </Text>
          <Section className="p-6 border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="mb-[10px] mt-0 text-left">
              Hi {username},
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              We were not able to process your recent payment for our product.
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              This can happen if a card expires, the bank declines the charge, or the billing details need a quick update.
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              To keep everything running smoothly, please update your payment method here: <a href={updateBillingURL}>Update Billing Details</a>
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              If you’ve already taken care of this, you can ignore this email.
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              If something doesn’t look right, just reply and we’ll help.
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              Thanks,
            </Text>
            <Text className="mb-[10px] mt-0 text-left">
              Resend Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default BillingFailureEmail;