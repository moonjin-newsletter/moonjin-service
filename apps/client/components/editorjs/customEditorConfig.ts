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
