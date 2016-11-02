import lodashUniqueId from 'lodash/uniqueid'
import lodashDebounce from 'lodash/debounce'

import * as constant from './constants'
import lodashForEach       from 'lodash/foreach'

export const getValue = el => { return (el.files || el.value) || null }

export const bindForm = ({el, value, store}) => {
  let formName = el.name
  let inputs   = el.getElementsByTagName('input')

  el.dataset.vuexForm = formName

  store.dispatch(constant.NEW_FORM, formName)

  lodashForEach(inputs, input => {
    input.dataset.formName = formName
    input.dispatchEvent(new Event('vuexFormInit'))
  })

  el.addEventListener('submit', (event) => {
    el.dispatchEvent(new Event('vuexFormSubmit'))
  })
}

export const bindInput = ({el, bindingValue, store}) => {
  let eventTypes = ['keyup', 'keydown', 'change']

  let id         = lodashUniqueId()
  let validation = bindingValue || {}
  let name       = el.name
  let type       = el.type
  // value is not a variable as `el.value` could/will be updated.

  el.addEventListener('vuexFormInit', () => {
    store.dispatch(constant.ADD_INPUT, {
      formName: el.dataset.formName,
      input: { id, name, type, validation, value: getValue(el) }
    })
  })

  eventTypes.forEach(eventType => {
    el.addEventListener(eventType, lodashDebounce(() => {
      store.dispatch(constant.CHANGE_INPUT, {
        formName: el.dataset.formName,
        input: { id, name, type, validation, value: getValue(el) }
      })
    }, 250))
  })
}

export default ({ store }) => ({
  bind (el, binding, { tag }) {
    let bindingValue = binding.value

    switch (tag) {
      case 'form':
        bindForm({el, bindingValue, store})
        break
      case 'input':
        bindInput({el, bindingValue, store})
        break
    }
  }
})
