import 'babel-polyfill'

var exclude = [
  './index.js'
];

var context = require.context('./src', true, /\.js$/);

context.keys().forEach(function(key) {
  if (exclude.indexOf(key) === -1) context(key);
});
