import lodashSet      from 'lodash/set'
import lodashMerge    from 'lodash/merge'
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
  FORM_VALUES
} = constants

export default {
  state: {
    signup: {
      data: []
    }
  },
  getters: {
    [FORM_VALUES]: state => formName => {
      // return form.inputs.reduce((inputObj, input) => {
      //   let keys = input.name.replace(']', '').split('[')
      //   return lodashSet(inputObj, keys, input.value)
      // }, {})
      return state[formName].data
    }
  //   errors: state => (formName, name) => {
  //     const errors = state.errors[formName]
  //
  //     return (errors || []).filter(error => error.name === name).map(error => {
  //       return error.errors[0]
  //     })
  //   }
  },
  actions: {
    [NEW_FORM] ({ commit }, name) {
      commit(CREATE_FORM, name)
    },
    [ADD_INPUT] ({ commit }, { formName, input }) {
      commit(INSERT_INPUT, { formName, input })
      commit(UPDATE_DATA, { formName })
    },
    [CHANGE_INPUT] ({ commit, state }, { id, formName, value }) {
      commit(UPDATE_INPUT, { id, formName, value })
      commit(UPDATE_DATA, { formName })
    }
  },
  mutations: {
    [CREATE_FORM] (state, name) {
      state[name] = {
        errors: [],
        inputs: [],
        data: {},
        touched: false,
        submitting: false,
        awaitAsync: false,
        valid: false
      }
    },
    [INSERT_INPUT] (state, { formName, input }) {
      state[formName].inputs.push({ value: null, touched: false, ...input })
    },
    [UPDATE_INPUT] (state, { id, formName, value }) {
      let form       = state[formName]
      let inputs     = form.inputs
      let foundIndex = inputs.findIndex(input => input.id === id)

      inputs[foundIndex] = Object.assign({}, inputs[foundIndex], {
        value: value,
        touched: true
      })
    },
    [UPDATE_DATA] (state, { formName }) {
      let form = state[formName]
      let newData = {}

      form.inputs.forEach(input => {
        let keys = input.name.replace(']', '').split('[')
        lodashSet(newData, keys, input.value)
      })

      form.data = newData
    }
  }
}
