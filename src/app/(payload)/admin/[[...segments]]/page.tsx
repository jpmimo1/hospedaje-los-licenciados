import configPromise from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

// 1. En Payload v3, generatePageMetadata ya no necesita importMap, solo la promesa de configuración

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateMetadata = async ({ params, searchParams }: any) =>
  generatePageMetadata({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params, searchParams }: any) {
  // En el RootPage sí es necesario pasar el importMap
  return RootPage({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
    importMap,
  });
}
