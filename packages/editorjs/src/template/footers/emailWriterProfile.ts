/**
 * 기본 Newsletter Header
 * @param user_cover
 * @param user_nickname
 * @param user_description
 * @param user_link
 * @constructor
 */

export function EmailWriterProfile(
  user_cover: string,
  user_nickname: string,
  user_description: string,
  user_link: string,
) {
  return ` <tr>
      <td>
        <table
          role="presentation"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="padding: 48px 80px"
        >
          <tbody>
            <tr>
              <td align="center" style="width: 100%">
                  <img
                    src="${user_cover}"
                    alt="Google"
                    width="60"
                    height="60"
                    style="
                      border-radius: 50%;
                      overflow: hidden;
                      border: 1px lightgray solid;
                      object-fit: cover;
                    "
                  />
              </td>
            </tr>
            <tr>
              <td height="6"></td>
            </tr>
            <tr>
              <td align="center">
                <span
                  style="
                    font-size: 18px;
                    font-weight: 700;
                    color: #333333;
                  "
                >
                    ${user_nickname}
                </span>
              </td>
            </tr>
            <tr>
              <td height="4"></td>
            </tr>
            <tr align="center">
              <td>
                <span style="font-size: 14px; color: #999999; font-weight: 300"
                  >© ${user_nickname}</span
                >
              </td>
            </tr>
            <tr>
              <td height="12"></td>
            </tr>
            <tr align="center">
              <td>
                <p style="font-size: 14px; color: #999999">
                    ${user_description}
                </p>
              </td>
            </tr>
            <tr>
              <td height="24"></td>
            </tr>
            <tr align="center">
              <td>
                <a
                  target="_blank"
                  href="${user_link}"
                  style="
                    display: block;
                    padding: 6px 14px;
                    background: #7b0000;
                    width: fit-content;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #ffffff;
                    text-decoration: none;
                  "
                >
                  방문하기
                </a>
              </td>
            </tr>
            <tr>
              <td height="24"></td>
            </tr>
            <tr align="center">
              <td>
                <a target="_blank" href="${user_link}" style="font-size: 14px; color: #333333">
                  구독 취소하기
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>`;
}
