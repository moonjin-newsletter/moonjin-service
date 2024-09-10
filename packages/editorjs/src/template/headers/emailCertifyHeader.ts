export function EmailCertifyHeader(redirectUrl: string) {
  return `
  <table
  role="presentation"
  border="0"
  cellpadding="0"
  cellspacing="0"
  width="100%"
  style="
    margin: 0 auto;
    background-color: #f7f7f7;
    font-family: 'Pretendard', sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue';
  "
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
          style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            padding: 32px 40px;
          "
        >
          <tbody>
            <tr>
              <td>
                <img
                  src="https://d1ppxineti4knh.cloudfront.net/static/graphic/graphic_2.png"
                  alt="Moonjin"
                  width="100"
                  height="100"
                  style="
                    width: 100px;
                    height: 100px;
                    margin: 0 auto;
                    display: block;
                  "
                />
              </td>
            </tr>
            <tr>
              <td height="8"></td>
            </tr>
            <tr>
              <td align="center">
                <h1
                  style="
                    font-weight: 600;
                    font-size: 36px;
                    font-family: Times, Georgia, 'Times New Roman', Times, serif;
                    color: #333333;
                    line-height: 1.3em;
                  "
                >
                  Moonjin<br />Newsletter
                </h1>
              </td>
            </tr>
            <tr>
              <td align="center">
                <span
                  style="
                    box-sizing: border-box;
                    color: #999999;
                    font-weight: 400;
                    line-height: 1.6em;
                    
                  "
                  >안녕하세요, 문진을 이용해 주셔서 감사합니다.<br />인증을
                  위해 아래의 버튼을 클릭해주세요.</span
                >
              </td>
            </tr>
            <tr>
              <td height="40"></td>
            </tr>
            <tr>
              <td align="center">
                <a
                  target="_blank"
                  href="${redirectUrl}"
                  style="
                    display: block;
                    width: fit-content;
                    background-color: #7b0000;
                    color: #ffffff;
                    padding: 12px 32px;
                    border-radius: 24px;
                    text-decoration: none;
                  "
                  >인증하기</a
                >
              </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td>
                <hr style="border: 1px solid #e9e9e9; border-bottom: #e9e9e9" />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td height="50"></td>
    </tr>
  </tbody>
</table>

  
  `;
}
