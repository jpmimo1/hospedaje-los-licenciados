import configPromise from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";

import "@payloadcms/next/css";

import { importMap } from "./importMap.js";

// 1. Creamos la función de servidor (Server Action) que Payload necesita
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serverFunction = async function (args: any) {
  "use server";
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction} // 2. Se la pasamos como prop aquí
    >
      {children}
    </RootLayout>
  );
}
