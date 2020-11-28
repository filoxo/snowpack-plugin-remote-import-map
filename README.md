# snowpack-plugin-remote-import-map

**This project is still a WIP.** [Import maps can be loaded from an external source](https://github.com/WICG/import-maps#installation). This plugin will load that remote import map and rewrite the local imports to use those URLs that match.

## Usage

### Install

```sh
yarn add -D snowpack-plugin-remote-import-map
# or
npm i -S snowpack-plugin-remote-import-map
```

### Configuration

In your _snowpack.config.js_ file, add the plugin along with the prod url.

```js
  plugins: [
    [
      "snowpack-plugin-remote-import-map",
      {
        url: "https://your-org.com/import-map.json",
        devUrl: "https://your-org.com/import-map.dev.json",
        extensions: [".ts", ".js"]
      },
    ],
    ...
  ],
```

After this, run your project's start command. This plugin will download the importmap on start, and replace the import URLs that match in the import map.

#### Alternatives

See also [snowpack-plugin-import-map](https://github.com/zhoukekestar/snowpack-plugin-import-map).

## Development

1. Clone repo
1. Run `yarn install`
1. Build project `yarn build`
1. Link project locally `yarn link-pkg`
1. Serve local import map `yarn serve:import-map`
1. Install in test project `yarn link snowpack-plugin-remote-import-map`
1. Start test project `yarn start`

### Testing

Run `yarn test`
