import { config } from "@/config/app.config";
import { resend } from "@/mailers/resendClient";
import { CreateEmailResponse as ResendCreateEmailResponse } from "resend";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

interface CreateEmailResponse extends ResendCreateEmailResponse {
  id: string;
}

const mailer_sender =
  config.NODE_ENV === "development"
    ? "no-reply <onboarding@resend.dev>"
    : `no-reply <${config.MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  text,
  html,
}: Params): Promise<{ data?: CreateEmailResponse; error?: any }> => {
  try {
    const data = (await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      text,
      subject,
      html,
    })) as CreateEmailResponse;

    return { data };
  } catch (error: any) {
    return { error };
  }
};
