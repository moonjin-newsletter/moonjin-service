/**
 * 이메일 뉴스레터 푸터 템플릿
 * @param link
 * @param user_nickname
 * @param user_description
 * @param user_moonjinId
 * @constructor
 */
export function EmailNewsletterFooter(
  link: string,
  user_nickname: string,
  user_description: string,
  user_moonjinId: string,
) {
  return `<tr>
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
        >
          <tbody>
            <tr>
              <td
                style="
                  width: 100%;
                  padding: 24px 16px 0px 16px;
                  background-color: #f7f7f7;
                  border-radius: 12px 12px 0 0;
                "
                align="center"
              >
                방금 읽으신 글이 마음에 드셨나요?<br />
                문진에 방문하여 더 많은 글을 읽어보세요!
              </td>
            </tr>

            <tr>
              <td height="16" style="background-color: #f7f7f7"></td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  width: 100%;
                  padding: 0 0 16px 0;
                  border-radius: 0 0 12px 12px;
                "
                align="center"
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
                    src="https://d1ppxineti4knh.cloudfront.net/static/email/logo_Image_primary.png"
                    alt="Moonjin"
                    width="18"
                    height="18"
                    style="overflow: hidden; object-fit: cover"
                  />
                  <span style="margin-left: 6px">웹사이트에서 보기</span>
                </a>
              </td>
            </tr>
            <tr>
              <td height="40"></td>
            </tr>
            <tr>
              <td>
                <hr
                  style="
                    border-width: 1px 0 0 0;
                    border-style: solid;
                    border-color: #d6d6d6;
                    margin: 0;
                  "
                />
              </td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 24px 8px 0 8px;
                  font-size: 14px;
                "
              >
                © ${user_nickname}
              </td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 8px 8px 0 8px;
                  font-size: 14px;
                  color: #7a7a7a;
                "
              >
                ${user_description}
              </td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 8px 8px 0 8px;
                  font-size: 14px;
                  color: #7a7a7a;
                "
              >
                <a
                  href="https://dev.moonjin.site/@${user_moonjinId}"
                  style="
                    color: #7a7a7a;
                    text-decoration: none;
                    text-decoration: underline;
                  "
                  >${user_nickname}</a
                >
                |
                <a
                  href="${link}"
                  style="
                    color: #7a7a7a;
                    text-decoration: none;
                    text-decoration: underline;
                  "
                  >구독 취소</a
                >
              </td>
            </tr>
            <tr>
              <td height="40" style="background-color: #f7f7f7"></td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 0 8px 8px 8px;
                  font-size: 14px;
                  color: #7a7a7a;
                "
              >
                <img
                  src="https://d1ppxineti4knh.cloudfront.net/static/email/moonjin.png"
                  alt="Moonjin"
                  height="24"
                  style="overflow: hidden; object-fit: cover"
                />
              </td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 0 8px 8px 8px;
                  font-size: 14px;
                  color: #7a7a7a;
                "
              >
                문진에서 뉴스레터 시작하기
                <a style="text-decoration: underline" href="https://dev.moonjin.site">바로가기</a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`;
}
