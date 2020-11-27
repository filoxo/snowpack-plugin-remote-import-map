import remoteImportMapPlugin from "./index";

const testImportMap = {
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

jest.mock("./request", () => {
  return {
    __esModule: true,
    requestJSON: jest.fn((url) => {
      switch(true) {
        case url === 'prod': return Promise.resolve(testImportMap)
        case url === 'dev': return Promise.resolve(testDevImportMap)
        default: return Promise.reject(
          "Something went wrong with the provided url to mocked requestJSON",
        )
      }
    }
    ),
  };
});

test("successfully replaces matching file with remote import map urls", async () => {
  const { transform } = remoteImportMapPlugin({}, {
    url: {
      prod: "prod",
    },
  });

  expect(transform).toBeTruthy();

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

  const result = transform && await transform(testFile);

  expect(result).not.toContain("'react'");
  expect(result).toContain(testImportMap.imports.react);
  expect(result).not.toContain("'rxjs'");
  expect(result).toContain(testImportMap.imports.rxjs);
});

test("preserves file with unmatched extension as-is", async () => {
  const { transform } = remoteImportMapPlugin({}, {
    url: {
      prod:
        "prod",
    },
  });

  if (transform) {
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

    expect(false);
    const result = await transform(testFile);

    expect(result).toEqual(testFile.contents);
  } else {
    fail("transform is falsy!");
  }
});
