import lodashUniqueId from 'lodash/uniqueId'

import { testAction } from './helpers'

import Store from '../store'

import {
  // Mutations
  CREATE_FORM,
  INSERT_INPUT,
  UPDATE_INPUT,
  UPDATE_DATA,
  UPDATE_ERRORS,

  // Actions
  NEW_FORM,
  ADD_INPUT,
  CHANGE_INPUT,

  // Getters
  INPUT_DATA
} from '../constants'

describe('store', () => {
  let mutations, actions

  context('mutations', () => {
    beforeEach(() => {
      mutations = new Store({}).mutations
    })

    it('NEW_FORM', () => {
      const state = {}

      mutations[CREATE_FORM](state, 'test')

      expect(state).to.include.keys('forms')
      expect(state.forms).to.include.keys('test')
      expect(state.forms.test).to.deep.equal({
        errors: {},
        inputs: [],
        data: {},
        touched: false,
        submitting: false,
        awaitAsync: false,
        valid: false
      })
    })

    it('INSERT_INPUT', () => {
      const state = { forms: { test: { inputs: [] } } }

      mutations[INSERT_INPUT](state, { formName: 'test', input: {} })

      const testForm = state.forms.test

      expect(testForm.inputs.length).to.equal(1)
      expect(testForm.inputs[0]).to.include.keys('value', 'touched')
      expect(testForm.inputs[0].touched).to.equal(false)
    })

    it('UPDATE_INPUT', () => {
      const inputId = lodashUniqueId('input_')
      const state = { forms: {
        test: { inputs: [{ id: inputId, value: null, touched: false }] }
      }}

      mutations[UPDATE_INPUT](state, {
        formName: 'test',
        input: { id: inputId, value: 'foo' }
      })

      const input = state.forms.test.inputs[0]

      expect(input.touched).to.equal(true)
      expect(input.value).to.equal('foo')
    })
  })

  context('actions', () => {
    let formName, errors, input, state, payload, id

    beforeEach(() => {
      actions = new Store({}).actions
      id = 1
      formName = 'test'
      errors = []
      input = { value: 'foo', valid: true, errors, id }
      state = { forms: { test: { errors } } }
      payload = { formName, input }
    })

    it('NEW_FORM', done => {
      testAction(actions[NEW_FORM], 'test', {}, [
        { type: CREATE_FORM, payload: 'test' }
      ], done)
    })

    it('ADD_INPUT', done => {
      testAction(actions[ADD_INPUT], payload, state, [
        { type: INSERT_INPUT, payload: payload },
        { type: UPDATE_DATA, payload: payload },
        { type: UPDATE_ERRORS, payload: { ...payload, errors } }
      ], done)
    })

    it('CHANGE_INPUT', done => {
      // Stub the store
      actions = new Store({
        store: {
          getters: {
            [INPUT_DATA]: (formName, id) => {
              return input
            }
          }
        }
      }).actions

      testAction(actions[CHANGE_INPUT], { formName, id, value: 'foo' }, state, [
        { type: UPDATE_ERRORS, payload: { ...payload, errors } },
        { type: UPDATE_INPUT, payload: payload },
        { type: UPDATE_DATA, payload: payload }
      ], done)
    })
  })
})
