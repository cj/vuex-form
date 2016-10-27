import namespace, * as constants from './constants'
import store                     from './store'
import directive                 from './directive'

const install = (Vue, options) => {
  options.store.registerModule('vuex-form', store)
  Vue.directive('vuex-form', directive(options))
}

export { install, namespace, constants }

export default install
