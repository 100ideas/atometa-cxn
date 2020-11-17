
**first**:
figure out how to use a single atlaskit package from src independently of the monorepo. But how?

Dev setup going forward:

**Option 0**:
1. hack AK `public/examples.html.ejs` so dev/build pipeline is faster less bloated
2. dev AK packages directly in AK repo
3. yarn link <AK-package>/dist -> notebook
4. cycle between 3<->4

**Option 1**:
1. create new monorepo w/ workspaces
  - `notebook`
  - `fileserver`
  - `atlaskit/*/*` (see AK package.json bolt workspace config)
    - script to clone in desired atlaskit packages
2. try to adapt 'atlaskit/build/webpack-config' to watch/compile AK packages


**Option 2**:
- use yarn workspaces + lerna
- perhaps w/ typescripts `path mapping`?
  - definitely check out https://codeburst.io/an-opinionated-web-application-solution-part-6-19eaa06f33e5
  - https://github.com/Quramy/lerna-yarn-workspaces-example#resolve-dependencies-as-typescript-modules

---

1. copy desired modules from `atlaskit2-origin/packages/` into `<project>/@atlaskit/`

2. setup `package.json` to use [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)

```js
{
  "name": "atlaskit-starter",
  "version": "0.0.1",
  "description": "understand atlaskit-media-api",
  "private": true,
  "workspaces": ["@atlaskit/*"],
  "scripts": {
    "start": "react-scripts start",
  ...
```

3. copy typing definitions from atlaskit2-origin:

```bash
# from within hack project - copy tsconfigs
cp atlaskit2-origin/.tsconfig.media.json .


# copy typings listed in tsconfig
cd atlaskit2-origin
mkdir typings_out
jq '.files[]' tsconfig.media.json | xargs -I _ cp _ typings_out/
mv typings_out <dest>
```



---

Here are two options:

[json-merge][1]

`json-merge package.json --parse="dependencies" package2.json --parse="devDependencies"`


[npm-deps][2] scans subdirectories for nested package.json files, and merges all the dependencies together in a single package.json file that is outputted to stdout.

A base template passed through standard input is used to produce the root package.json file. This allows package.json to be ignored by version control systems, which conflict with auto-generated files. Base package attributes, like name and version, can be stored in a separate file such as package-base.json, and kept in version control.

```
$ cd my_cool_project
$ npm-deps < package-base.json > package.json
```

  [1]: https://www.npmjs.com/package/json-merge
  [2]: https://www.npmjs.com/package/npm-deps

---

fuck create-react-app and atlaskit typescript grrrr

- AK2 ts-compiler needs webpack4?
- need to upgrade due to peer dependencies
- look in `./node_modules/react-scripts:`

```bash
warning " > babel-loader@7.1.2" has incorrect peer dependency "webpack@2 || 3".
warning " > file-loader@1.1.5" has incorrect peer dependency "webpack@^2.0.0 || ^3.0.0".
warning " > extract-text-webpack-plugin@3.0.2" has incorrect peer dependency "webpack@^3.1.0".
warning " > html-webpack-plugin@2.29.0" has incorrect peer dependency "webpack@1 || ^2 || ^2.1.0-beta || ^2.2.0-rc || ^3".
warning " > sw-precache-webpack-plugin@0.11.4" has incorrect peer dependency "webpack@^1 || ^2 || ^2.1.0-beta || ^2.2.0-beta || ^3".
warning " > webpack-manifest-plugin@1.3.2" has incorrect peer dependency "webpack@1 || 2 || 3".
[5/5] 📃  Rebuilding all packages...

# dont think this worked...
$ yarn upgrade babel-loader file-loader extract-text-webpack-plugin html-webpack-plugin sw-precache-webpack-plugin webpack-manifest-plugin`
```

"webpack": "^4.16.1",
"webpack-bundle-analyzer": "^2.13.0",
"webpack-dev-server": "^3.1.4",
"webpack-manifest-plugin": "1.3.2",
