/**
 * 기본 Newsletter Header
 * @param user_cover
 * @param user_nickname
 * @param user_email
 * @param title
 * @param subtitle
 * @param series_title
 * @param date
 * @param link
 * @constructor
 */
export function EmailNewsletterHeader(
  user_cover: string,
  user_nickname: string,
  user_email: string,
  title: string,
  subtitle: string,
  series_title: string | null,
  date: string,
  link: string,
) {
  return `<table
  role="presentation"
  border="0"
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue';"
>
  <tbody>
    <tr>
      <td height="50"></td>
    </tr>
    <tr>
      <td>
        <table
          role="presentation"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style=""
        >
          <tbody>
            <tr>
              <td align="center" style="width: 100%; padding: 32px 0 8px 0">
                <div >
                  <img
                    src="${user_cover}"
                    alt="user"
                    width="60"
                    height="60"
                    style="
                      border-radius: 50%;
                      overflow: hidden;
                      border: 1px lightgray solid;
                      object-fit: cover;
                    "
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td align="center">
                <div
                  style="
                    text-decoration: none;
                    font-weight: 700;
                    color: #333333;
                  "
                >
                  ${user_nickname}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 20px 0 20px" align="center">
                <span
                  style="color: #333333; font-size: 14px; margin: 0; padding: 0"
                >
                  ${user_email}
                </span>
              </td>
            </tr>
            <tr>
              <td height="40" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            ${
              series_title
                ? `<tr>
                <td align="center" style="color: #7b0000; font-size: 16px; line-height: 1.5;  ">
                    ${series_title}
                </td>
            </tr>
            <tr>
              <td height="12" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>`
                : ""
            }
            <tr>
              <td align="center">
                <h1
                  style="
                    font-family: serif;
                    font-weight: bold;
                    font-size: 28px;
                    max-width: 500px;
                    word-break: keep-all;
                    line-height: 1.5;
                    color: #333333;
                    margin: 0;
                    letter-spacing: -0.025em;
                  "
                >
                  ${title}
                </h1>
              </td>
            </tr>
            <tr>
              <td height="8" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            <tr>
                <td align="center">
                    <h2 style="
                    font-family: serif;
                    font-size: 16px;
                    font-weight: 500;
                    color: #999999;
                    max-width: 500px;
                    word-break: keep-all;
                    line-height: 1.5;
                    margin: 0;
                    ">
                    ${subtitle}
                    </h2>
                </td>
            </tr>
            <tr>
              <td height="40" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            <tr>
              <td
                style="
                  width: 100%;
                  border-radius: 0 0 12px 12px;
                "
                align="center"
              >
                <a
                  href="${link}"
                  target="_blank"
                  style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    color: #7b0000;
                    margin: 0;
                    padding: 8px 16px;
                    border: #7b0000 1px solid;
                    border-radius: 24px;
                    font-size: 12px;
                  "
                >
                  <img
                    src="https://d1ppxineti4knh.cloudfront.net/static/email/logo_Image_primary.png"
                    alt="Google"
                    width="18"
                    height="18"
                    style="overflow: hidden; object-fit: cover"
                  />
                  <span style="margin-left: 6px">웹사이트에서 보기</span>
                </a>
              </td>
            </tr>
            <tr>
              <td height="24" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <hr
                  style="
                    height: 1px;
                    width: 100%;
                    border-width: 1px 0 0 0;
                    border-style: solid;
                    border-color: #d6d6d6;
                  "
                />
              </td>
            </tr>
            <tr>
              <td height="40" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    `;
}
