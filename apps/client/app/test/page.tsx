export default function Page() {
  // pages/index.js

  // Editor.js JSON 데이터 예시
  const editorData = {
    time: 1635603431943,
    blocks: [
      {
        type: "paragraph",
        data: {
          text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
        },
      },
      {
        type: "header",
        data: {
          text: "This is a header",
          level: 2,
        },
      },
      // 추가 블록들...
    ],
    version: "2.22.2",
  };

  function renderEditorData(data: any) {
    return data.blocks.map((block: any, index: any) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p
              key={index}
              className="custom-paragraph"
              dangerouslySetInnerHTML={{ __html: block.data.text }}
            />
          );
        case "header":
          const Tag = `h${block.data.level}`;
          return <hr />;
        // 다른 블록 타입 처리 추가
        default:
          return null;
      }
    });
  }

  const content = renderEditorData(editorData);

  return (
    <div className="mt-40">
      <div id="editor-output">{content}</div>
    </div>
  );
}
