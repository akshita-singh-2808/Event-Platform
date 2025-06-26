export const runtime = "nodejs"; // or "edge" if you're using edge runtime
export const dynamic = "force-dynamic";

import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
// import { UTApiConfig } from "@/lib/uploadthing";
// Export routes for Next App Router
 // enables dynamic handling
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
//   config: UTApiConfig,
 
});
