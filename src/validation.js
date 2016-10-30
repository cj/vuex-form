const validation = options => {
  const userValidation = options.validation || {}

  return {
    required (value) {
      if (Array.isArray(value)) {
        return !!value.length
      }

      if (value === undefined || value === null) {
        return false
      }

      return !!String(value).trim().length
    },
    ...userValidation
  }
}

export default validation
