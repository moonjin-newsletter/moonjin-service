import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import NestedList from "@editorjs/nested-list";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import Underline from "@editorjs/underline";
import { fileUpload } from "../../lib/file/fileUpload";
import { FileTypeEnum } from "@moonjin/api-types";

export const EDITOR_JS_TOOLS = {
  header: Header,
  underline: Underline,
  // quote: Quote,
  delimiter: Delimiter,
  // linkTool: {
  //   class: LinkTool,
  // config: {
  //   endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
  // },
  // },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: ImageTool,
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file: any) {
          return fileUpload(file, FileTypeEnum.NEWSLETTER).then((res) => {
            return {
              success: 1,
              file: {
                url: res?.file,
                // any other image data you want to store, such as width, height, color, extension, etc
              },
            };
          });
        },
        uploadByUrl(url: any) {
          return new Promise((resolve, reject) => {
            resolve({
              success: 1,
              file: {
                url: url,
                // any other image data you want to store, such as width, height, color, extension, etc
              },
            });
          });
        },
      },
    },
  },
};

export const EDITOR_JS_I18N = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          "Click to tune": "추가",
          "or drag to move": "드래그하기",
        },
      },
      inlineToolbar: {
        converter: {
          "Convert to": "변환하기",
        },
      },
      toolbar: {
        toolbox: {
          Add: "추가",
        },
      },
    },

    /**
     * 기능별 이름
     */
    toolNames: {
      Text: "글",
      Heading: "제목",
      List: "목록",
      Warning: "경고",
      Checklist: "체크리스트",
      Quote: "인용",
      Code: "코드",
      Delimiter: "문단구분",
      "Raw HTML": "HTML-코드",
      Table: "테이블",
      Link: "링크",
      Marker: "마커",
      Bold: "굵은체",
      Italic: "이텔릭",
      InlineCode: "인라인코드",
      Image: "이미지",
    },

    /**
     * 기능의 기능 수정
     */
    tools: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
       * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
       */
      // warning: {
      //   // <-- 'Warning' tool will accept this dictionary section
      //   Title: "Название",
      //   Message: "Сообщение",
      // },

      /**
       * Link is the internal Inline Tool
       */
      list: {
        Unordered: "일반 목록",
        Ordered: "숫자 목록",
      },
      image: {
        "With border": "테두리 추가",
        "Stretch image": "크기 확장",
        "With background": "크기 조절",
      },
      delete: {
        "Click to delete": "제거하기",
      },
      link: {
        "Add a link": "링크 추가",
      },
      /**
       * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
       */
      stub: {
        "The block can not be displayed correctly.":
          "블록이 올바르게 보이지 않습니다",
      },
    },

    /**
     * Section allows to translate Block Tunes
     */
    blockTunes: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
       * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
       *
       * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
       */
      delete: {
        Delete: "지우기",
        "Click to delete": "제거하기",
      },
      moveUp: {
        "Move up": "위로 이동",
      },
      moveDown: {
        "Move down": "아래로 이동",
      },
    },
  },
};
