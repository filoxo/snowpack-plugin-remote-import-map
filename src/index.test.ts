import remoteImportMapPlugin from "./index";

const testProdImportMap = {
  imports: {
    react: "https://some.cdn.com/react.js",
    rxjs: "https://some.cdn.com/rx.js",
  },
};

const testDevImportMap = {
  imports: {
    react: "https://some.cdn.com/react.dev.js",
    rxjs: "https://some.cdn.com/rx.dev.js",
  },
};

const getTransformResult = async (env: string | [string, string], testFile: any) => {
  let prod, dev; 
  if(Array.isArray(env)) {
    [ prod, dev ] = env;
  } else {
    prod = env;
  }
  const transform = remoteImportMapPlugin(null, {
    url: prod,
    devUrl: dev
  }).transform!;

  expect(transform).toBeTruthy();
  return await transform(testFile);
};

jest.mock("./request", () => {
  return {
    __esModule: true,
    requestJSON: jest.fn((url) => {
      switch (true) {
        case url === "prod":
          return Promise.resolve(testProdImportMap);
        case url === "dev":
          return Promise.resolve(testDevImportMap);
        default:
          return Promise.reject(
            "Something went wrong with the provided url to mocked requestJSON",
          );
      }
    }),
  };
});

test("successfully replaces matching file with remote import map urls", async () => {
  const testFile = {
    id: "testFile",
    contents: `
import React from 'react';
import rxjs from 'rxjs';
`,
    fileExt: ".js",
    isDev: false,
    isHmrEnabled: false,
  };
  const result = await getTransformResult("prod", testFile);
  expect(result).not.toContain("'react'");
  expect(result).toContain(testProdImportMap.imports.react);
  expect(result).not.toContain("'rxjs'");
  expect(result).toContain(testProdImportMap.imports.rxjs);
});

test("successfully replaces matching file with remote dev import map urls", async () => {
  const testFile = {
    id: "testFile",
    contents: `
import React from 'react';
import rxjs from 'rxjs';
`,
    fileExt: ".js",
    isDev: true,
    isHmrEnabled: false,
  };
  const result = await getTransformResult(["prod", "dev"], testFile);
  expect(result).not.toContain("'react'");
  expect(result).not.toContain(testProdImportMap.imports.react);
  expect(result).toContain(testDevImportMap.imports.react);
  expect(result).not.toContain("'rxjs'");
  expect(result).not.toContain(testProdImportMap.imports.rxjs);
  expect(result).toContain(testDevImportMap.imports.rxjs);
});

test("preserves file with unmatched extension as-is", async () => {
  const testFile = {
    id: "testFile",
    contents: `
import React from 'react';
import rxjs from 'rxjs';
`,
    fileExt: ".mjs",
    isDev: false,
    isHmrEnabled: false,
  };
  const result = await getTransformResult("prod", testFile);
  expect(result).toEqual(testFile.contents);
});

test("replaces only imports that are in the import map", async () => {
  const testFile = {
    id: "testFile",
    contents: `
import React from 'react';
import _ from 'lodash';
`,
    fileExt: ".js",
    isDev: false,
    isHmrEnabled: false,
  };
  const result = await getTransformResult("prod", testFile);
  expect(result).toContain(testProdImportMap.imports.react);
  expect(result).toContain(`'lodash'`);
});

test("throws if requestJSON rejects", async () => {
  try {
    const testFile = {
      id: "testFile",
      contents: `
import React from 'react';
import rxjs from 'rxjs';
  `,
      fileExt: ".js",
      isDev: false,
      isHmrEnabled: false,
    };

    await getTransformResult("reject", testFile);
  } catch (e) {
    expect(e.message).toContain("snowpack-plugin-remote-import-map failed");
  }
});
