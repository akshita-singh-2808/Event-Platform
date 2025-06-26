// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // your defined file routes

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
