const path = require('path');

module.exports = (webpackConfig, env) => {

  console.log("\n\nwebpack.override.js extended default cosmos wepack from...\n", webpackConfig)
  
  const newRule = {
    test: /\.(png|svg|jpg|gif)$/,
    loaders: ['file-loader']
  }

  const currentResolveModules = webpackConfig.resolve.modules && typeof webpackConfig.resolve.modules === 'array'
    ? webpackConfig.resolve.modules
    : []
  
  const updatedResolve = {
    ...webpackConfig.resolve,
    ...{ 
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve('node_modules'),
      ]
    }
  }

  const updatedResolveModules = [
    // path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'src'),
    path.resolve('node_modules'),
    ...currentResolveModules
  ]

  webpackConfig.module.rules.push(newRule)
  // webpackConfig.resolve.modules = updatedResolveModules
  webpackConfig.resolve = updatedResolve

  console.log("\nto...\n", webpackConfig, "\n\n")

  return webpackConfig
}