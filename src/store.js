import lodashSet      from 'lodash/set'
import lodashIsEmpty  from 'lodash/isempty'
import lodashLast     from 'lodash/last'
import lodashUnSet    from 'lodash/unset'
import lodashMerge    from 'lodash/merge'
import lodashForEach  from 'lodash/foreach'

import * as constants from './constants'

const {
  // Actions
  NEW_FORM,
  ADD_INPUT,
  CHANGE_INPUT,

  // Mutations
  CREATE_FORM,
  INSERT_INPUT,
  UPDATE_INPUT,
  UPDATE_DATA,
  UPDATE_ERRORS,

  // Getters
  FORM_DATA,
  FORM_ERRORS
} = constants

const store = ({ validation }) => {
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

        return form ? form.data : {}
      },
      [FORM_ERRORS]: state => formName => {
        let form = state.forms[formName]

        return form ? form.errors : {}
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
      [CHANGE_INPUT] ({ commit, state }, input) {
        const { formName, validation: inputValidation } = input

        let [valid, errors] = runValidation(input.value, inputValidation)

        input = { ...input, valid, errors }

        commit(UPDATE_INPUT, input)
        commit(UPDATE_DATA, { formName, input })
        commit(UPDATE_ERRORS, { formName, input, errors })
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
      [UPDATE_INPUT] (state, { id, formName, valid, value }) {
        let form       = state.forms[formName]
        let inputs     = form.inputs
        let foundIndex = inputs.findIndex(input => input.id === id)

        inputs[foundIndex] = { ...inputs[foundIndex], value, valid, touched: true }
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

        if (errors.length) {
          lodashSet(newErrors, keys, errors)
        } else {
          lodashUnSet(newErrors, keys)
          keys.pop()

          let lastKey = lodashLast(keys)
          let lastError = newErrors[lastKey]

          if (lodashIsEmpty(lastError)) {
            delete newErrors[lastKey]
          }
        }

        form.errors = newErrors
      }
    }
  }
}

let storeInstance = store({})

export const mutations = storeInstance.mutations
export const actions   = storeInstance.actions

export default store
