import { EmailTemplate } from "@moonjin/editorjs";

export async function GET(request: Request) {
  const html = EmailTemplate.Header.EmailCertifyHeader(
    "www.moonjin.io",
    EmailTemplate.Footer.EmailFooter(),
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
