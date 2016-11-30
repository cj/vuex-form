import lodashUniqueId from 'lodash/uniqueId'
import lodashDebounce from 'lodash/debounce'

import * as constant from './constants'
import lodashForEach       from 'lodash/forEach'

export const getValue = el => { return (el.files || el.value) || null }

export const bindForm = (el, callback, store) => {
  let formName = el.name
  let inputs   = el.getElementsByTagName('input')

  el.dataset.vuexForm = formName

  store.dispatch(constant.NEW_FORM, formName)

  lodashForEach(inputs, input => {
    input.dataset.formName = formName
    input.dispatchEvent(new Event('vuexFormInit'))
  })

  el.addEventListener('submit', (event) => {
    event.preventDefault()

    store.dispatch(constant.SUBMIT_FORM, formName)

    const done = () => {
      store.commit(constant.UPDATE_FORM_SUBMITTING, { formName, value: false })
    }

    if (store.getters[constant.FORM_VALID](formName)) {
      callback(done)
    } else {
      done()
    }
  })
}

export const bindInput = (el, value, store) => {
  let eventTypes = ['keyup', 'keydown', 'change', 'focusout']

  let id         = lodashUniqueId()
  let validation = value || {}
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
        value: getValue(el),
        id
      })
    }, 250))
  })
}

export default ({ store }) => ({
  bind (el, binding, { tag }) {
    let value = binding.value

    switch (tag) {
      case 'form':
        bindForm(el, value, store)
        break
      case 'input':
        bindInput(el, value, store)
        break
    }
  }
})
