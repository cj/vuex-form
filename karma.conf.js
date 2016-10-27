module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],

    files: [
      'karma.entry.js'
    ],

    preprocessors: {
      'karma.entry.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.config.babel.js'),

    webpackServer: {
      noInfo: true,
      stats: { chunks: false }
    },

    reporters: [
      config.singleRun ? 'mocha' : 'dots',
      'coverage'
    ],

    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        {type: 'lcov'},
        {type: 'text-summary'}
      ]
    },

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false,

    browsers: ['Chrome']
  })
}
