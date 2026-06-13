import configPromise from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

// In Payload v3, generatePageMetadata no longer requires importMap, only the config promise
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateMetadata = async ({ params, searchParams }: any) =>
  generatePageMetadata({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params, searchParams }: any) {
  // RootPage still requires the importMap to be passed
  return RootPage({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
    importMap,
  });
}
