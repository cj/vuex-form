const namespace = action => { return `vuex-form/${action}` }

// Actions
export const NEW_FORM     = namespace('NEW_FORM')
export const ADD_INPUT    = namespace('ADD_INPUT')
export const CHANGE_INPUT = namespace('CHANGE_INPUT')

// Mutations
export const CREATE_FORM  = namespace('CREATE_FORM')
export const INSERT_INPUT = namespace('INSERT_INPUT')
export const UPDATE_INPUT = namespace('UPDATE_INPUT')
export const UPDATE_DATA  = namespace('UPDATE_DATA')

// Getters
export const FORM_VALUES = namespace('FORM_VALUES')

export default namespace
