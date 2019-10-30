module.exports = (webpackConfig, env) => {

  const newRule = {
    test: /\.(png|svg|jpg|gif)$/,
    loaders: ['file-loader']
  }
  webpackConfig.module.rules.push(newRule)

  return webpackConfig
}