import lodashUniqueId from 'lodash/uniqueid'

import { testAction } from './helpers'

import { mutations, actions } from '../store'
import {
  // Mutations
  CREATE_FORM,
  INSERT_INPUT,
  UPDATE_INPUT,
  UPDATE_DATA,
  REMOVE_ERROR,

  // Actions
  NEW_FORM,
  ADD_INPUT,
  CHANGE_INPUT
} from '../constants'

describe('store', () => {
  context('mutations', () => {
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
        formName: 'test', id: inputId, value: 'foo'
      })

      const input = state.forms.test.inputs[0]

      expect(input.touched).to.equal(true)
      expect(input.value).to.equal('foo')
    })
  })

  context('actions', () => {
    it('NEW_FORM', done => {
      testAction(actions[NEW_FORM], 'test', {}, [
        { type: CREATE_FORM, payload: 'test' }
      ], done)
    })

    it('ADD_INPUT', done => {
      let payload = { formName: 'test', input: {} }
      let state   = {}

      testAction(actions[ADD_INPUT], payload, state, [
        { type: INSERT_INPUT, payload: payload }
      ], done)
    })

    it('CHANGE_INPUT', done => {
      let payload = { id: 1, formName: 'test', value: 'foo', valid: true }
      let state   = {}

      testAction(actions[CHANGE_INPUT], payload, state, [
        { type: REMOVE_ERROR, payload: payload },
        { type: UPDATE_INPUT, payload: payload }
      ], done)
    })
  })
})
