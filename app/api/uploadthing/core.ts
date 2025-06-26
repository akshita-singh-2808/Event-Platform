import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server"; // ✅ Use Clerk auth

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { userId } = await auth(); // ✅ Grab authenticated user ID
      if (!userId) throw new Error("Unauthorized");

      return { userId }; // This will now be a real user ID
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for userId:", metadata.userId);
      console.log("📎 File URL (deprecated):", file.url);
      console.log("📎 File ufsUrl (use this):", file.ufsUrl);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
