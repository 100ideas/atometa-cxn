const path = require('path');

// const newRules = [
//   {
//     test: /\.(png|svg|jpg|gif)$/,
//     loaders: ['file-loader']
//   },{
//     test: /\.scss$/,
//     loaders: [
//       'style-loader',
//       'css-loader?sourceMap',
//       'sass-loader?sourceMap'
//     ]
//   }
// ]

const newRules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    loaders: ['file-loader']
  },{
    // firefox throws error w/ css sourcemaps, see fix
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: false,
        },
      }
    ]
  }
]

module.exports = (webpackConfig, env) => {

  console.log("\n\nwebpack.override.js extended default cosmos wepack from...\n", webpackConfig)
  
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

  // webpackConfig.module.rules.push(newRule)
  newRules.map(rule => webpackConfig.module.rules.push(rule) )

  // webpackConfig.resolve.modules = updatedResolveModules
  webpackConfig.resolve = updatedResolve

  console.log("\nto...\n", webpackConfig, "\n\n")

  return webpackConfig
}