import remoteImportMapPlugin from "./index";

test("successfully replaces matching file with remote import map urls", async () => {
  const { transform } = remoteImportMapPlugin({}, {
    url: {
      prod:
        "https://storage.googleapis.com/react.microfrontends.app/importmap.json",
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
  expect(result).not.toContain("'rxjs'");
});


test("preserves file with unmatched extension as-is", async () => {
  const { transform } = remoteImportMapPlugin({}, {
    url: {
      prod:
        "https://storage.googleapis.com/react.microfrontends.app/importmap.json",
    },
  });

  if(transform) {
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
  
    expect(false, )
    const result = await transform(testFile);
  
    expect(result).toEqual(testFile.contents)
  } else {
    fail('transform is falsy!')
  }
});