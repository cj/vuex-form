import lodashSet      from 'lodash/set'
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

  // Getters
  FORM_DATA
} = constants

const store = ({ validation }) => {
  const runValidation = (value, inputValidation = {}) => {
    let validations = []

    lodashForEach(inputValidation, (args, key) => {
      let currentValidation = validation[key]

      validations.push(currentValidation(value, args))
    })

    return validations.every(valid => valid === true)
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
      }
    },
    actions: {
      [NEW_FORM] ({ commit }, name) {
        commit(CREATE_FORM, name)
      },
      [ADD_INPUT] ({ commit }, { formName, input }) {
        commit(INSERT_INPUT, { formName, input })
        commit(UPDATE_DATA, formName)
      },
      [CHANGE_INPUT] ({ commit, state }, input) {
        const { formName, validation: inputValidation } = input

        input.valid = runValidation(input.value, inputValidation)

        commit(UPDATE_INPUT, input)
        commit(UPDATE_DATA, formName)
      }
    },
    mutations: {
      [CREATE_FORM] (state, name) {
        state.forms = { ...state.forms,
          [name]: {
            errors: [],
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
        state.forms[formName].inputs.push({ value: null, touched: false, valid: true, ...input })
      },
      [UPDATE_INPUT] (state, { id, formName, valid, value }) {
        let form       = state.forms[formName]
        let inputs     = form.inputs
        let foundIndex = inputs.findIndex(input => input.id === id)

        inputs[foundIndex] = { ...inputs[foundIndex], value, valid, touched: true }
      },
      [UPDATE_DATA] (state, formName) {
        let form = state.forms[formName]
        let newData = {}

        form.inputs.forEach(input => {
          let keys = input.name.replace(']', '').split('[')
          lodashSet(newData, keys, input.value)
        })

        form.data = newData
      }
    }
  }
}

let storeInstance = store({})

export const mutations = storeInstance.mutations
export const actions   = storeInstance.actions

export default store
