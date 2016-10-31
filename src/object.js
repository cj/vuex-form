import lodashAssign from 'lodash/assign'
import lodashHas    from 'lodash/has'
import lodashGet    from 'lodash/get'

class VuexFormObject {
  constructor (obj) {
    lodashAssign(this, obj)
  }

  has (keyString) { return lodashHas(this, keyString) }

  get (keyString, defaultValue = null) {
    return lodashGet(this, keyString, defaultValue)
  }
}

export default VuexFormObject
