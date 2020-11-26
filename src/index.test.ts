import remoteImportMapPlugin from './index'

const contents = `
import React from 'react';
import rxjs from 'rxjs';
`
test('snowpack-plugin-remote-import-map', async () => {

  const { transform } = remoteImportMapPlugin({}, {
    url: {
      prod: "https://storage.googleapis.com/react.microfrontends.app/importmap.json"
    }
  })

  expect(transform).toBeTruthy();

  const testFile = {
    id: "testFile",
    contents, 
    fileExt: ".js", 
    isDev: false,
    isHmrEnabled: false
  }

  const result = transform && await transform(testFile)

  expect(result).not.toContain("'react'")
  expect(result).not.toContain("'rxjs'")
})