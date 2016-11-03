const namespace = action => { return `vuex-form/${action}` }

// Actions
export const NEW_FORM     = namespace('NEW_FORM')
export const ADD_INPUT    = namespace('ADD_INPUT')
export const CHANGE_INPUT = namespace('CHANGE_INPUT')
export const SUBMIT_FORM  = namespace('SUBMIT_FORM')

// Mutations
export const CREATE_FORM            = namespace('CREATE_FORM')
export const INSERT_INPUT           = namespace('INSERT_INPUT')
export const UPDATE_INPUT           = namespace('UPDATE_INPUT')
export const UPDATE_DATA            = namespace('UPDATE_DATA')
export const UPDATE_ERRORS          = namespace('UPDATE_ERRORS')
export const UPDATE_FORM_VALID      = namespace('UPDATE_FORM_VALID')
export const UPDATE_FORM_SUBMITTING = namespace('UPDATE_FORM_SUBMITTING')

// Getters
export const FORM_DATA       = namespace('FORM_DATA')
export const FORM_ERRORS     = namespace('FORM_ERRORS')
export const INPUT_DATA      = namespace('INPUT_DATA')
export const FORM_VALID      = namespace('FORM_VALID')
export const FORM_CAN_SUBMIT = namespace('FORM_CAN_SUBMIT')

export default namespace
