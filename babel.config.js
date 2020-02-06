module.exports = api => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    "presets": [
      "@babel/preset-modules",
      "@babel/preset-react"
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      [
        "@babel/plugin-proposal-class-properties",
        {
          "loose": true
        }
      ],
      // Applies the react-refresh Babel plugin on development modes only
      // https://github.com/pmmmwh/react-refresh-webpack-plugin
      api.env('development') && 'react-refresh/babel',
    ].filter(Boolean)
  }
}


    // trying out @babel/preset-modules for better performance & readability
    // https://github.com/babel/preset-modules
    //
    // [
    //   "@babel/preset-env",
    //   {
    //     "loose": true,
    //     "modules": false,
    //     "targets": {
    //       "browsers": "last 2 chrome versions"
    //     }
    //   }
    // ],