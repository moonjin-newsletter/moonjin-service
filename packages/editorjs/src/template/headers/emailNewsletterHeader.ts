/**
 * 기본 Newsletter Header
 * @param user_cover
 * @param user_nickname
 * @param user_email
 * @param title
 * @param series_title
 * @param date
 * @constructor
 */
export function EmailNewsletterHeader(user_cover: string, user_nickname: string, user_email: string, title: string, series_title : string | null, date:string, link: string) {
    return `<table
  role="presentation"
  border="0"
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif, system-ui, -apple-system,
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
                <a href="https://dev.moonjin.site">
                  <img
                    src="${user_cover}"
                    alt="Google"
                    width="60"
                    height="60"
                    style="
                      border-radius: 50%;
                      overflow: hidden;
                      border: 1px gray solid;
                      object-fit: cover;
                    "
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <a
                  href=""
                  style="
                    text-decoration: none;
                    font-weight: 700;
                    color: #333333;
                  "
                >
                  ${user_nickname}
                </a>
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
            <tr>
              <td align="center" style="color: #7b0000; font-size: 14px">
                ${series_title}
              </td>
            </tr>

            <tr>
              <td align="center">
                <h1
                  style="
                    font-weight: 700;
                    font-size: 24px;
                    color: #333333;
                    margin: 0;
                    padding: 4px 0 0 0;
                  "
                >
                  ${title}
                </h1>
              </td>
            </tr>
            <tr>
              <td height="24" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            <tr>
              <td
                style="
                  font-size: 12px;
                  color: #333333;
                  margin: 0;
                  padding: 8px 0 0 0;
                "
                align="center"
              >
                by. ${user_nickname}
              </td>
            </tr>
            <tr>
              <td
                style="
                  font-size: 12px;
                  color: #333333;
                  margin: 0;
                  padding: 4px 0 0 0;
                "
                align="center"
              >
                ${date}
              </td>
            </tr>

            <tr>
              <td height="40" style="font-size: 0; line-height: 0">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <hr
                  style="
                    border-width: 1px 0 0 0;
                    border-style: solid;
                    border-color: #d6d6d6;
                  "
                />
              </td>
            </tr>
            <tr>
              <td
                style="
                  width: 100%;
                  padding: 0 0 16px 0;
                  border-radius: 0 0 12px 12px;
                "
                align="right"
                \`
              >
                <a
                  href="${link}"
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
                    src="https://d1ppxineti4knh.cloudfront.net/static/email/logo_icon_primary.svg"
                    alt="Google"
                    width="18"
                    height="18"
                    style="overflow: hidden; object-fit: cover"
                  />
                  <span style="">웹사이트에서 보기</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td height="50"></td>
    </tr>`;
}