import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import { fileUpload } from "../../lib/file/fileUpload";
import { FileTypeEnum } from "@moonjin/api-types";

export const customEditorJS = (data?: any[]) =>
  new EditorJS({
    holder: "editorjs",
    autofocus: true,
    readOnly: false,
    tools: {
      header: Header,
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
    },
    data: {
      blocks: data ?? [],
    },
    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    onReady: () => {
      console.log("Editor.js is ready to work!");
    },
  });
