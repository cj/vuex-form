import uniqueId from 'lodash/uniqueid'
// import debounce from 'lodash/debounce'

import * as constant from './constants'
import forEach       from 'lodash/foreach'

export const bindForm = ({el, value, store}) => {
  let formName = el.name
  let inputs   = el.getElementsByTagName('input')

  el.dataset.vuexForm = formName

  store.dispatch(constant.NEW_FORM, formName)

  forEach(inputs, input => {
    input.dataset.vuexForm = formName
    input.dispatchEvent(new Event('vuexFormInit'))
  })
}

export const bindInput = ({el, value, store}) => {
  let id = uniqueId()

  el.addEventListener('vuexFormInit', () => {
    store.dispatch(constant.ADD_INPUT, {
      formName: el.dataset.vuexForm,
      input: {
        id: id,
        name: el.name,
        type: el.type,
        validation: value
      }
    })
  })

  // TODO: use debounce here
  el.addEventListener('change', () => {
    let value = el.value

    store.dispatch(constant.CHANGE_INPUT, {
      id,
      formName: el.dataset.vuexForm,
      value: el.files || value
    })
  })
}

export default ({ store }) => ({
  bind (el, binding, { tag }) {
    let value = binding.value

    switch (tag) {
      case 'form':
        bindForm({el, value, store})
        break
      case 'input':
        bindInput({el, value, store})
        break
    }
  }
})
