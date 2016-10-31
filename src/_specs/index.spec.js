import Vue from 'vue'
import Vuex from 'vuex'

import VuexForm, { constants } from '../index'
import VuexFormTest from './index.spec.vue'

const { FORM_DATA, CHANGE_INPUT } = constants

describe('VuexForm', () => {
  let vm
  let store
  let formStore

  beforeEach(() => {
    Vue.use(Vuex)

    store = new Vuex.Store({
      state: {}
    })

    store.testAction = {}

    let storeDispatch = store.dispatch

    // stub dispatch so that once all dispatch actions are done, including async
    // ones, we then call back any callbacks set for that action
    sinon.stub(store, 'dispatch', async (action, payload) => {
      let cb = store.testAction[action]

      await storeDispatch(action, payload)

      if (cb) {
        cb(action, payload)
        delete store.testAction[action]
      }
    })

    vm = new Vue({
      store,
      plugins: [VuexForm(Vue, {store})],
      template: '<div><VuexFormTest /></div>',
      components: { VuexFormTest }
    })

    vm.$mount()

    formStore = store.state['vuex-form'].forms
  })

  it('state should contain vuex-form', () => {
    expect(formStore).to.be.an('object')
  })

  context('signup', () => {
    it('should have the correct amount of inputs in the state', () => {
      expect(formStore.signup.inputs.length).to.equal(3)
    })

    it.only('initial values should be null', () => {
      expect(store.getters[FORM_DATA]('signup')).to.deep.equal({
        user_id: null,
        user: {
          first_name: null,
          last_name: null
        }
      })
    })

    it('should validate input on change', done => {
      let firstNameInput = vm.$el.querySelector('[name="user[first_name]"]')
      firstNameInput.dispatchEvent(new Event('change'))

      store.testAction[CHANGE_INPUT] = (action, payload) => {
        let input = formStore.signup.inputs.filter(input => { return input.name === 'user[first_name]' })[0]
        expect(input.valid).to.be.false
        done()
      }
    })

    it('should update store and ui on input value change', done => {
      let firstNameInput = vm.$el.querySelector('[name="user[first_name]"]')
      let innerHTML      = vm.$el.getElementsByClassName('first_name')[0].innerHTML

      expect(innerHTML).to.equal('')

      firstNameInput.value = 'Foo'
      firstNameInput.dispatchEvent(new Event('change'))

      store.testAction[CHANGE_INPUT] = (action, payload) => {
        innerHTML = vm.$el.getElementsByClassName('first_name')[0].innerHTML
        expect(innerHTML).to.equal('Foo')
        done()
      }
    })
  })
})
