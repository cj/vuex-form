import lodashAssign from 'lodash/assign'
import lodashHas    from 'lodash/has'
import lodashGet    from 'lodash/get'
import lodashFirst  from 'lodash/first'
import lodashLast   from 'lodash/last'

class VuexFormObject {
  constructor (obj) {
    lodashAssign(this, obj)
  }

  has (keyString) { return lodashHas(this, keyString) }

  get (keyString, defaultValue = null) {
    return lodashGet(this, keyString, defaultValue)
  }

  first (...args) {
    return lodashFirst(this.get(...args))
  }

  last (...args) {
    return lodashLast(this.get(...args))
  }
}

export default VuexFormObject
