import namespace, * as constants from './constants'
import Store                     from './store'
import Directive                 from './directive'
import Validation                from './validation'

const install = (Vue, options) => {
  options.store.registerModule('vuex-form', Store({
    validation: new Validation(options), store: options.store
  }))

  Vue.directive('vuex-form', Directive(options))
}

export { install, namespace, constants }

export default install
