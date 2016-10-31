const validation = options => {
  const userValidation = options.validation || {}

  return {
    required (value, args) {
      let msg = args.msg || 'Required'

      if (Array.isArray(value)) {
        return [!!value.length, msg]
      }

      if (value === undefined || value === null) {
        return [false, msg]
      }

      return [!!String(value).trim().length, msg]
    },
    ...userValidation
  }
}

export default validation
