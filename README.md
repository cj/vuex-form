# Vuex Form

## Install

`npm i -D vuex-form`

## Usage

```javascript
import VuexForm from 'vuex-form'

Vue.use(VuexForm, {store}) // make sure to pass your vuex store
```

## About

A simple Vue plugin that allows you to manage your forms using vuex.

## Todo

- [] Take over form submit by using `v-vuex-form`.  You'll need to make sure to have
`name` attribute so you can reference your form later.  The callback for the
submit should be passed as the parameter i.e. `v-vuex-form="handleSubmit"`.

- [] Specifiy inputs using `v-vuex-form-input`, you can pass an object for
validation.  i.e. `v-vuex-form-input="{ required: true }"`.

- [] Update value and validate inputs on change.

- [] Allow custom validation methods.
