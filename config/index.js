/*
 * @Author: your name
 * @Date: 2019-12-09 01:11:11
 * @LastEditTime: 2020-03-14 13:54:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\config\index.js
 */
// https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
var path = require('path')
var resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  build: {
    env: '"production"',
    index: path.resolve(__dirname, '../dist/index.html'),
    title: 'Chirp',
    icon: path.resolve(__dirname, '../src/assets/favicon.png'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    websocketUrl: '"ws:54.144.207.148:8888"',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    extractCSS: true,
    useEslint: false,
    alias: {
      '@': resolve('src'),
      '@actions': resolve('src/actions'),
      '@api': resolve('src/api'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components'),
      '@constants': resolve('src/constants'),
      '@containers': resolve('src/containers'),
      '@decorators': resolve('src/decorators'),
      '@pages': resolve('src/pages'),
      '@reducers': resolve('src/reducers'),
      '@routes': resolve('src/routes'),
      '@store': resolve('src/store'),
      '@utils': resolve('src/utils')
    }
  },
  dev: {
    env: '"development"',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    websocketUrl: '"ws:54.144.207.148:8888"',
    // Various Dev Server settings
    port: 3000, // can be overwritten by process.env.PORT
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    proxyTable: {
      '/test' : {
        target : 'http://localhost:7777',
        secure: false,
        pathRewrite: {"^/test" : ""}
      },
      '/api': {
        target: 'http://54.144.207.148:8888',
        secure: false,
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://54.144.207.148:8080',
        secure: false,
        changeOrigin: true,
      }
    },

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
