import lodashIsEmpty from 'lodash/isEmpty'
import lodashFirst   from 'lodash/first'
import lodashLast    from 'lodash/last'

import VuexFormObject from './object'

class VuexFormErrorObject extends VuexFormObject {
  has (keyString) {
    let val = this.get(keyString) || {}

    if (lodashIsEmpty(val.errors) || !val.touched) {
      return false
    } else {
      return true
    }
  }

  all (...args) {
    return (this.get(...args) || {}).errors
  }

  first (...args) {
    return lodashFirst(this.all(...args))
  }

  last (...args) {
    return lodashLast(this.all(...args))
  }
}

export default VuexFormErrorObject
