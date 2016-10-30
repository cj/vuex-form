import namespace, * as constants from './constants'
import store                     from './store'
import directive                 from './directive'
import validation                from './validation'

const install = (Vue, options) => {
  options.store.registerModule('vuex-form', store({
    validation: validation(options)
  }))

  Vue.directive('vuex-form', directive(options))
}

export { install, namespace, constants }

export default install
