This is a tutorial for sending a billing failure email using [React Email](https://react.email/) and [Resend](https://resend.com/) in a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Initialize a Next.js Project
Run `npx create-next-app@latest {projectName}`

- Select: "Yes, use recommended defaults"

Run `npm install`

Run `npm run dev` to run the development server.

### 2. Define a Route
Create the file `/app/api/billing/route.tsx` with the following contents:
```
export async function POST() {
  return Response.json({success: 'Hello World'});
}
```

Run `curl -X POST http://localhost:3000/api/billing` to test the new api.
### 4. Add the Resend API Key as an Environment Variable

[Create an API key](https://resend.com/api-keys)

Create the file `.env` in the root directory with the following contents replacing the api key with your own:
```
RESEND_API_KEY=my-api-key
```

This can now be accessed using `process.env.RESEND_API_KEY`.

### 5. Send an Email with Resend

When a request is made to your billing API if a failure is encountered it's simple to send an email to your customers using Resend.

Run `npm install resend` to install the resend Node.js SDK.

Update the contents of `route.tsx` with the following:
```
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Billing Failure',
      html: '<h1>Your payment did not go through.</h1>',
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
```

This will now send a basic email that can be seen in your [emails](https://resend.com/emails) dashboard.

To test this run `curl -X POST http://localhost:3000/api/billing`.

### 6. Add an Attachment
To send an attachment we will update our call to `resend.emails.send()` including the `attachments` parameter.

Update the contents of `route.tsx` with the following:
```
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Billing Failure',
      html: '<h1>Your payment did not go through.</h1>',
      attachments: [
        {
          path: 'https://resend.com/static/sample/invoice.pdf',
          filename: 'invoice.pdf',
        },
      ],
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
```

To test this run `curl -X POST http://localhost:3000/api/billing`.

You will now see an attachment added to your email.

For more details see our documentation on [attachments](https://resend.com/docs/dashboard/emails/attachments).

Now that we have sent a simple email and included attachments we need to improve our email template to make it more aesthetic and easier for our users to understand the information we are trying to communicate.

To improve our email template we will use [React Email](https://react.email/) which greatly simplifies the process of styling emails consistently for all clients.

### 7. Create an Email Template using React Email
First let's install `@react-email/components`

Run `npm install @react-email/components`

Create the file `/components/email-template.tsx` with the following contents:
```
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
```

Now we need to update our call to `resend.emails.send()` replacing the `html` parameter with a `react` parameter. The `react` parameter allows us to use a React component to render the content of our email. We can then leverage React component props to pass variables to our email template to personalize the experience for individual users.

Update the contents of `route.tsx` with the following:
```
import { BillingFailureEmail } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Billing Failure',
      react: BillingFailureEmail({username: "John"}),
      attachments: [
        {
          path: 'https://resend.com/static/sample/invoice.pdf',
          filename: 'invoice.pdf',
        },
      ],
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
```

Test your email again by running `curl -X POST http://localhost:3000/api/billing`.

Congratulations! You now have a customizable email that can be sent conditionally when there is an issue with billing being processed successfully.

### 8. Possible Issues

#### Issues with Multiple Versions of `react` and `react-dom`
If your email was working correctly when sent using the `html` property but then fails when being sent with a React Email template the issue may be caused by mismatched versions of `react` and `react-dom`.

This can be fixed a number of ways but one recommended way is to add the `overrides`
 block to your `package.json` file declaring `react` and `react-dom`. React expects only one version of itself to be used in an application and this declaration guarantees that will be the case.
```
  "overrides": {
    "react": "19.2.1",
    "react-dom": "19.2.1"
  }
```

After adding the `overrides` block to package.json remove the `package-lock.json` file and the `node_modules` directory.

Run `npm install`

Restart the dev server.

Test your email again by running `curl -X POST http://localhost:3000/api/billing`.

Your email will now be sending correctly using Resend and React Email.