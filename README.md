# mobx + react-hot-loader basic boilerplate

---

## get started
- clone repo 
- `git checkout boilerplate`
  - this branch is the same as `react-hot-loader/examples/mobx` but upgraded for babel7


## documentation
- react-hot-loader https://github.com/gaearon/react-hot-loader
- @hot-loader/react-dom: https://github.com/hot-loader/react-dom (sometimes called `react-🔥-dom`)
- getting started guide http://gaearon.github.io/react-hot-loader/getstarted/#step-2-of-3-using-hmr-to-replace-the-root-component


#### babel
- upgrading programmatically: 
  - https://github.com/babel/babel-upgrade
  - `npx babel-upgrade --write`
- read this to avoid confusion! https://babeljs.io/docs/en/v7-migration
- **caution: upgrading decorator plugin** (order is important); https://babeljs.io/docs/en/babel-plugin-proposal-decorators
- https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
- https://babeljs.io/docs/en/babel-preset-env
- https://babeljs.io/docs/en/babel-preset-react
- https://babeljs.io/docs/en/next/babel-preset-env.html
- https://babeljs.io/docs/en/next/babel-preset-react.html


## clone boilerplate from react-hot-loader examples
```
svn checkout https://github.com/gaearon/react-hot-loader/trunk/examples/mobx boilerplate-mobx-react-hot-loader
cd boilerplate-mobx-react-hot-loader
```
*note:** as of 2019-07-25 the mobx react-hot-loader example had outdated packages (`mobx`, `react`, `react-dom`, `react-hot-loader`). Upgrade them the work with `react@^16.8.6`. Then alias `react-dom` to `./node_modules/@hot-loader/react-dom' in `webpack.conf`.