import lodashSet      from 'lodash/set'
import lodashIsEmpty  from 'lodash/isempty'
import lodashLast     from 'lodash/last'
import lodashUnSet    from 'lodash/unset'
import lodashMerge    from 'lodash/merge'
import lodashForEach  from 'lodash/foreach'
import lodashIsEqual  from 'lodash/isequal'

import * as constants      from './constants'
import VuexFormObject      from './object'
import VuexFormErrorObject from './error_object'

const {
  // Actions
  NEW_FORM,
  ADD_INPUT,
  CHANGE_INPUT,
  SUBMIT_FORM,

  // Mutations
  CREATE_FORM,
  INSERT_INPUT,
  UPDATE_INPUT,
  UPDATE_DATA,
  UPDATE_ERRORS,
  UPDATE_FORM_VALID,
  UPDATE_FORM_SUBMITTING,

  // Getters
  FORM_DATA,
  FORM_ERRORS,
  INPUT_DATA,
  FORM_VALID,
  FORM_CAN_SUBMIT
} = constants

const Store = ({ validation, store }) => {
  const runValidation = (value, inputValidation = {}) => {
    let validations = []
    let errors      = []

    lodashForEach(inputValidation, (args, key) => {
      let currentValidation = validation[key]

      let [ valid, error ] = currentValidation(value, args)

      validations.push(valid)

      if (!valid) errors.push(error)
    })

    return [validations.every(valid => valid === true), errors]
  }

  return {
    runValidation,
    state: {
      forms: {}
    },
    getters: {
      [FORM_DATA]: state => formName => {
        let form = state.forms[formName]

        return new VuexFormObject(form ? form.data : {})
      },
      [FORM_ERRORS]: state => formName => {
        let form = state.forms[formName]

        return new VuexFormErrorObject(form ? form.errors : {})
      },
      [INPUT_DATA]: state => (formName, id) => {
        let form = state.forms[formName]

        return form.inputs.find(input => input.id === id)
      },
      [FORM_VALID]: state => formName => {
        let form = state.forms[formName]

        if (form) {
          if (form.touched) {
            return form.valid
          } else {
            return true
          }
        } else {
          return false
        }
      },
      [FORM_CAN_SUBMIT]: state => formName => {
        let form = state.forms[formName]

        if (form && (!form.touched || (form.valid && !form.submitting && !form.awaitAsync))) {
          return true
        } else {
          return false
        }
      }
    },
    actions: {
      [NEW_FORM] ({ commit }, name) {
        commit(CREATE_FORM, name)
      },
      [ADD_INPUT] ({ commit }, { formName, input }) {
        const { validation: inputValidation } = input

        let [valid, errors] = runValidation(input.value, inputValidation)

        input = { ...input, valid, errors }

        commit(INSERT_INPUT, { formName, input })
        commit(UPDATE_DATA, { formName, input })
        commit(UPDATE_ERRORS, { formName, input, errors })
      },
      [CHANGE_INPUT] ({ commit, state }, { formName, id, value }) {
        let form    = state.forms[formName]
        let input   = store.getters[INPUT_DATA](formName, id)
        input.value = value

        const { validation: inputValidation } = input

        let [valid, errors] = runValidation(input.value, inputValidation)

        input = { ...input, valid, errors }

        commit(UPDATE_ERRORS, { formName, input, errors })
        commit(UPDATE_INPUT, { formName, input })
        commit(UPDATE_DATA, { formName, input })

        if (!lodashIsEmpty(form.errors) && form.valid) {
          commit(UPDATE_FORM_VALID, { formName, valid: false })
        } else if (lodashIsEmpty(form.errors) && !form.valid) {
          commit(UPDATE_FORM_VALID, { formName, valid: true })
        }
      },
      [SUBMIT_FORM] ({ commit, state }, formName) {
        let form     = state.forms[formName]
        const inputs = form.inputs

        if (!form.touched) form.touched = true

        form.submitting = true

        inputs.forEach(input => {
          commit(UPDATE_ERRORS, { formName, input, errors: false })
        })
      }
    },
    mutations: {
      [CREATE_FORM] (state, name) {
        state.forms = { ...state.forms,
          [name]: {
            errors: {},
            inputs: [],
            data: {},
            touched: false,
            submitting: false,
            awaitAsync: false,
            valid: false
          }
        }
      },
      [INSERT_INPUT] (state, { formName, input }) {
        state.forms[formName].inputs.push({
          value: null, touched: false, valid: true, errors: [], ...input
        })
      },
      [UPDATE_INPUT] (state, { formName, input }) {
        let { id, valid, value, errors } = input

        let form       = state.forms[formName]
        let inputs     = form.inputs
        let foundIndex = inputs.findIndex(input => input.id === id)

        inputs[foundIndex] = {
          ...inputs[foundIndex], value, valid, errors, touched: true
        }

        if (!form.touched) form.touched = true
      },
      [UPDATE_DATA] (state, { formName, input }) {
        let form = state.forms[formName]
        let inputData = {}

        let keys = input.name.replace(']', '').split('[')
        lodashSet(inputData, keys, input.value)

        form.data = lodashMerge({...form.data}, inputData)
      },
      [UPDATE_ERRORS] (state, { formName, input, errors = [] }) {
        let form      = state.forms[formName]
        let keys      = input.name.replace(']', '').split('[')
        let newErrors = { ...form.errors }
        let touched = form.touched || input.touched

        if (errors.length) {
          lodashSet(newErrors, keys, { errors, touched })
        } else if (!errors && input.errors && input.errors.length) {
          lodashSet(newErrors, keys, { errors: input.errors, touched })
        } else {
          lodashUnSet(newErrors, keys)
          keys.pop()

          let lastKey   = lodashLast(keys)
          let lastError = newErrors[lastKey]

          if (lodashIsEmpty(lastError)) {
            delete newErrors[lastKey]
          }
        }

        // This is to prevent unnecessary vue rendering when the errors object
        // is the same.
        if (!lodashIsEqual(form.errors, newErrors)) {
          form.errors = newErrors
        }
      },
      [UPDATE_FORM_VALID] (state, { formName, valid }) {
        state.forms[formName].valid = valid
      },
      [UPDATE_FORM_SUBMITTING] (state, { formName, value }) {
        state.forms[formName].submitting = value
      }
    }
  }
}

let storeInstance = new Store({})

export const mutations = storeInstance.mutations
export const actions   = storeInstance.actions

export default Store
