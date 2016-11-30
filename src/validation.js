import lodashIsEmpty  from 'lodash/isEmpty'
import lodashIsString from 'lodash/isString'
import lodashTemplate from 'lodash/template'

export const Validation = ({ validation: customValidation = {}, validationMessages: vMsgs = {} }) => {
  const getMsg = (msg, args = {}) => {
    let currentMsg = vMsgs.required || (args.msg || msg)
    return lodashTemplate(currentMsg, { interpolate: /{{([\s\S]+?)}}/g })(args)
  }

  return {
    alphabetic (value, args = {}) {
      let msg = getMsg('Must be a alphabetic value')

      return [!Array.isArray(value) && /^[a-zA-Z]*$/.test(value), msg]
    },

    alpha (value, args = {}) {
      let msg = getMsg('Must only contain letters and numbers', args)
      let valid = !Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value)

      return [valid, msg]
    },

    alphaDash (value, args = {}) {
      let msg = getMsg('Must only contain letters, numbers, underscores or dashes', args)
      let valid = !Array.isArray(value) && /^[a-zA-Z0-9_-]*$/.test(value)

      return [valid, msg]
    },

    alphaSpace (value, args = {}) {
      let msg = getMsg('Must only contain letters, numbers or spaces', args)
      let valid = !Array.isArray(value) && /^[a-zA-Z0-9\s]*$/.test(value)

      return [valid, msg]
    },

    between (value, args = {}) {
      let msg = getMsg('Must be between {{ min }} and {{ max }}', args)
      let valid = Number(args.min) <= value && Number(args.max) >= value

      return [valid, msg]
    },

    decimal (value, args = {}) {
      let points = args.points || (args.points = '*')
      let msg    = getMsg('Must be a decimal<% if (points && points !== "*") { %> with {{ points }} points<% } %>', args)

      if (Array.isArray(value)) {
        return [false, msg]
      }

      if (value === null || value === undefined || value === '') {
        return [true, msg]
      }

      const regexPart = points === '*' ? '*' : `{0,${points}}`
      const regex = new RegExp(`^[0-9]*.?[0-9]${regexPart}$`)

      if (!regex.test(value)) {
        return [false, msg]
      }

      return [!Number.isNaN(parseFloat(value)), msg]
    },

    email (value) {
      let msg   = getMsg('Not a valid email')
      let valid = /^(([^<>()[\]\\.,;:#\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/.test(value)

      return [valid, msg]
    },

    includes (value, args = {}) {
      args.value = value
      let values = args.values || (args.values = [])
      let msg  = getMsg('{{ value }} is not one of the following: {{ values.join(", ") }}', args)

      return [!!values.filter(option => option === value).length, msg]
    },

    numeric (value, args = {}) {
      let msg = getMsg('Must be a numeric value')

      return [!Array.isArray(value) && /^[0-9]*$/.test(value), msg]
    },

    required (value, args = {}) {
      let msg = getMsg('Required', args)

      if (lodashIsString(value)) {
        value = value.trim()
      }

      return [!lodashIsEmpty(value), msg]
    },

    ...customValidation
  }
}

export default Validation
