import uniqueId from 'lodash/uniqueid'

import store from '../store'
import {
  // Mutations
  CREATE_FORM,
  INSERT_INPUT,
  UPDATE_INPUT,

  // Actions
  NEW_FORM,
  ADD_INPUT,
  CHANGE_INPUT
} from '../constants'

const {
  mutations,
  actions
} = store

const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]
    expect(mutation.type).to.equal(type)

    if (payload) {
      expect(mutation.payload).to.deep.equal(payload)
    }

    count++

    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('store', () => {
  context('mutations', () => {
    it('NEW_FORM', () => {
      const state = {}

      mutations[CREATE_FORM](state, 'test')

      expect(state).to.include.keys('forms')
      expect(state.forms).to.include.keys('test')
      expect(state.forms.test).to.deep.equal({
        errors: [],
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
      const inputId = uniqueId('input_')
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

      testAction(actions[ADD_INPUT], payload, {}, [
        { type: INSERT_INPUT, payload: payload }
      ], done)
    })

    it('CHANGE_INPUT', done => {
      let payload = { id: 1, formName: 'test', value: 'foo' }

      testAction(actions[CHANGE_INPUT], payload, {}, [
        { type: UPDATE_INPUT, payload: payload }
      ], done)
    })
  })
})
