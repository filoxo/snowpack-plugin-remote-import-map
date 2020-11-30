# snowpack-plugin-remote-import-map

**This project is still a WIP.** [Import maps can be loaded from an external source](https://github.com/WICG/import-maps#installation). This plugin will load that remote import map and rewrite the local imports to use those URLs that match.

## Usage

### Install

```sh
yarn add -D snowpack-plugin-remote-import-map
# or
npm i -D snowpack-plugin-remote-import-map
```

### Configuration

In your _snowpack.config.js_ file, add the plugin along with [options](#options).

```js
  plugins: [
    [
      "snowpack-plugin-remote-import-map",
      {
        url: "https://your-org.com/import-map.json",
        devUrl: "https://your-org.com/import-map.dev.json"
      },
    ],
    ...
  ],
```

After this, run your project's start command. This plugin will download the importmap on start, and replace the import URLs that match in the import map.

### Options

| name       | type     | default                          | description                                                                                                  |
| ---------- | -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| url        | string   | (required)                       | URL string where the remote import map will be loaded from                                                   |
| devUrl     | string   | `undefined`                      | URL string where the dev version of the remote import map will be loaded from in `devMode` only              |
| extensions | string[] | `[".js", ".jsx", ".tsx", ".ts"]` | [Snowpack file extensions](https://www.snowpack.dev/guides/plugins#tips-%2F-gotchas) to run the transform on |

#### Alternatives

See also [snowpack-plugin-import-map](https://github.com/zhoukekestar/snowpack-plugin-import-map).

## Development

1. Clone repo
1. Run `yarn install`
1. Build project `yarn build`
1. Link project locally `yarn pkg:link`
1. Serve local import map `yarn serve:import-map` if you don't have a remote one to make requests to
1. Install in test project `yarn link snowpack-plugin-remote-import-map`
1. Start test project `yarn start`
1. To clean up, run:
   - `yarn unlink snowpack-plugin-remote-import-map` in test project (or just `yarn install` which clears local links)
   - `yarn pkg:unlink` in this project

### Testing

1. Run `yarn test`
