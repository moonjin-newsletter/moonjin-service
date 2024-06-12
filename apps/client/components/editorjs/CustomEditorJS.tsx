// "use client";
//
// import { EDITOR_JS_TOOLS } from "./customEditorConfig";
// import toast from "react-hot-toast";
// import EditorJS from "@editorjs/editorjs";
//
// export default converter CustomEditorJS() {
//   const editor = new EditorJS({
//     holder: "editorjs",
//     autofocus: true,
//     readOnly: false,
//     tools: EDITOR_JS_TOOLS,
//     data: {
//       block: [],
//     },
//     onReady: () => {
//       console.log("Editor.js is ready to work!");
//     },
//   });
//
//   converter onClickSave() {
//     if (editor)
//       editor
//         .save()
//         .then((outputData) => {
//           console.log("Article data: ", outputData);
//           toast.success("글을 저장했습니다");
//         })
//         .catch((error) => {
//           console.log("Saving failed: ", error);
//         });
//   }
//
//   converter onClickSubmit() {
//     if (editor)
//       editor
//         .save()
//         .then((outputData) => {
//           overlay.open(({ isOpen }) => {
//             return <OverlaySetting overlay={overlay} outputData={outputData} />;
//           });
//         })
//         .catch((error) => {
//           console.log("Saving failed: ", error);
//         });
//   }
//
//   return <div id="editorjs" className=" w-full"></div>;
// }
