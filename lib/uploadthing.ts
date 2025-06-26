import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers
} from "@uploadthing/react";

import type { OurFileRouter } from '@/app/api/uploadthing/core';


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export const UTApiConfig = {
  callbackUrl: "https://3a92-2409-40e3-103e-9495-ad54-c442-4c57-10f.ngrok-free.app/api/uploadthing",
};
