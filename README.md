# snowpack-plugin-remote-import-map

**This project is still a WIP.** [Import maps can be loaded from an external source](https://github.com/WICG/import-maps#installation). This plugin will load that remote import map and rewrite the local imports to use those URLs that match.

## Alternatives

See also [snowpack-plugin-import-map](https://github.com/zhoukekestar/snowpack-plugin-import-map).

## Development

1. clone repo
1. run `yarn install`
1. Link project locally `yarn build && cd pkg && yalc publish --push && cd ..`
   - TODO: Find a better way to publish only contents of pkg folder
1. Serve local import map `yarn serve:import-map`
1. Install in test project `yalc add snowpack-plugin-remote-import-map`
1. Start test project `yarn start`

### Testing

Run `yarn test`
