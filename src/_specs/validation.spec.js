import Validation from '../validation'

describe('validation', () => {
  let v

  beforeEach(() => {
    v = new Validation({})
  })

  it('required', () => {
    expect(v.required('')).to.deep.equal([false, 'Required'])
    expect(v.required('foo')[0]).to.equal(true)
    expect(v.required('', { msg: 'Field Required' })).to.deep.equal(
      [false, 'Field Required']
    )
    expect(v.required(' ')[0]).to.equal(false)
    expect(v.required([])[0]).to.equal(false)
    expect(v.required({})[0]).to.equal(false)
    expect(v.required(undefined)[0]).to.equal(false)
    expect(v.required(null)[0]).to.equal(false)
  })

  it('alpha', () => {
    expect(v.alpha('#')).to.deep.equal([false, 'Must only contain letters and numbers'])
    expect(v.alpha('abc123')[0]).to.equal(true)
  })

  it('alphaDash', () => {
    expect(v.alphaDash('1 1')).to.deep.equal([false, 'Must only contain letters, numbers, underscores or dashes'])
    expect(v.alphaDash('abc-efg_123')[0]).to.equal(true)
  })

  it('alphaSpace', () => {
    expect(v.alphaSpace('1-1')).to.deep.equal([false, 'Must only contain letters, numbers or spaces'])
    expect(v.alphaSpace('abc 123')[0]).to.equal(true)
  })

  it('between', () => {
    let args = { min: 1, max: 10 }

    expect(v.between(11, args)).to.deep.equal([false, 'Must be between 1 and 10'])
    expect(v.between(5, args)[0]).to.equal(true)
  })

  it('decimal', () => {
    expect(v.decimal('a')).to.deep.equal([false, 'Must be a decimal'])
    expect(v.decimal(1)[0]).to.equal(true)
    expect(v.decimal('1.1')[0]).to.equal(true)
    expect(v.decimal('1.1111', { points: 3 })).to.deep.equal([false, 'Must be a decimal with 3 points'])
  })

  it('email', () => {
    expect(v.email('foo@bar')).to.deep.equal([false, 'Not a valid email'])
    expect(v.email('foo@bar.com')[0]).to.deep.equal(true)
    expect(v.email('foo@bar.io')[0]).to.deep.equal(true)
    expect(v.email('foo@bar.a')[0]).to.deep.equal(false)
    expect(v.email('foo+bar@bar.io')[0]).to.deep.equal(true)
  })

  it('includes', () => {
    let args = { values: ['foo', 'bar'] }

    expect(v.includes('fooBar', args)).to.deep.equal([false, 'fooBar is not one of the following: foo, bar'])
    expect(v.includes('foo', args)[0]).to.equal(true)
    expect(v.includes('bar', args)[0]).to.equal(true)
  })

  it('numeric', () => {
    expect(v.numeric('a')).to.deep.equal([false, 'Must be a numeric value'])
    expect(v.numeric('1')[0]).to.equal(true)
    expect(v.numeric(1)[0]).to.equal(true)
  })

  it('alphabetic', () => {
    expect(v.alphabetic('1')).to.deep.equal([false, 'Must be a alphabetic value'])
    expect(v.alphabetic('a')[0]).to.equal(true)
  })
})
