const path = require('path')

const DefinePlugin               = require('webpack/lib/DefinePlugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const LoaderOptionsPlugin        = require('webpack/lib/LoaderOptionsPlugin')
const ProgressPlugin             = require('webpack/lib/ProgressPlugin')
const UglifyJsPlugin             = require('webpack/lib/optimize/UglifyJsPlugin')

// VARS
const NODE_ENV        = process.env.NODE_ENV || 'development'
const ENV_DEVELOPMENT = NODE_ENV === 'development'
const ENV_PRODUCTION  = NODE_ENV === 'production'
const ENV_TEST        = NODE_ENV === 'test'
const HOST            = process.env.WEBPACK_HOST || '0.0.0.0'
const PORT            = process.env.WEBPACK_PORT || 3000

// LOADERS
const rules = {
  js: { test: /\.js$/, exclude: /node_modules|dist/, loader: 'babel-loader' },
  vue: { test: /\.vue$/, exclude: /node_modules|dist/, loader: 'vue-loader' }
}

//  CONFIG
const config = module.exports = {}

config.resolve = {
  extensions: ['.js', '.vue'],
  modules: [
    path.resolve('.'),
    'node_modules'
  ],
  alias: {
    vue: 'vue/dist/vue.js'
  }
}

config.plugins = [
  new LoaderOptionsPlugin({
    debug: false,
    minimize: true
  }),
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
]

//  DEVELOPMENT or PRODUCTION
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.entry = {
    'vuex-form': ['./src/index.js']
  }

  config.output = {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/',
    // export itself to a global var
    libraryTarget: 'var',
    // name of the global var: "Foo"
    library: 'VuexForm'
  }
}

// DEVELOPMENT
if (ENV_DEVELOPMENT) {
  config.devtool = 'source-map'

  config.module = {
    rules: [ rules.js, rules.vue ]
  }

  config.plugins.push(
    new HotModuleReplacementPlugin(),
    new ProgressPlugin()
  )

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  }
}

// PRODUCTION
if (ENV_PRODUCTION) {
  config.devtool = 'hidden-source-map'

  config.output.filename = '[name].min.js'

  config.module = {
    rules: [ rules.js, rules.vue ]
  }

  config.plugins.push(
    new UglifyJsPlugin({
      comments: false,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true  // eslint-disable-line camelcase
      }
    })
  )
}

// TEST
if (ENV_TEST) {
  config.devtool = 'inline-source-map'

  config.module = {
    rules: [ rules.js, rules.vue ]
  }

  config.externals = { 'jsdom': 'window' }
}
