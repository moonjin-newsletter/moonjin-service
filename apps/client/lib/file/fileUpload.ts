import csr from "../fetcher/csr";

import type {
  FileTypeEnum,
  PreSignedUrlDto,
  ResponseForm,
} from "@moonjin/api-types";

export async function fileUpload(file: File, fileType: FileTypeEnum) {
  try {
    const fileUrl = await csr
      .post("file", {
        json: { fileType: fileType, fileName: file.name },
      })
      .then((res) => res.json<ResponseForm<PreSignedUrlDto>>());
    const s3Fetch = await fetch(fileUrl?.data?.preSignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/png",
      },
      body: file,
    });
    console.log("업로드 성공");

    return fileUrl?.data?.file;
  } catch (err) {
    console.log(err);
  }
}
