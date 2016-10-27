import Vue from 'vue'
import Vuex from 'vuex'

import VuexForm, { constants } from '../index'
import VuexFormTest from './index.spec.vue'

const {
  // Getters
  FORM_VALUES
} = constants

describe('VuexForm', () => {
  let vm
  let store
  let formStore

  beforeEach(() => {
    Vue.use(Vuex)

    store = new Vuex.Store({
      state: {}
    })

    vm = new Vue({
      store,
      plugins: [VuexForm(Vue, {store})],
      template: '<div><VuexFormTest /></div>',
      components: { VuexFormTest }
    }).$mount()

    formStore = store.state['vuex-form']
  })

  it('state should contain vuex-form', () => {
    expect(formStore).to.be.an('object')
  })

  context('signup', () => {
    it('should have the correct amount of inputs in the state', () => {
      expect(formStore.signup.inputs.length).to.equal(3)
    })

    it('initial values should be null', () => {
      expect(store.getters[FORM_VALUES]('signup')).to.deep.equal({
        user_id: null,
        user: {
          first_name: null,
          last_name: null
        }
      })
    })

    it('should update store on input value change', done => {
      let firstNameInput = vm.$el.querySelector('[name="user[first_name]"]')

      let innerHTML = vm.$el.getElementsByClassName('first_name')[0].innerHTML
      expect(innerHTML).to.equal('')

      firstNameInput.value = 'Foo'
      firstNameInput.dispatchEvent(new Event('change'))

      Vue.nextTick(() => {
        let innerHTML = vm.$el.getElementsByClassName('first_name')[0].innerHTML
        expect(innerHTML).to.equal('Foo')
        done()
      })
    })
  })
})
