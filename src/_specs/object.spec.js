import VuexFormObject from '../object'

describe('VuexFormObject', () => {
  let vuexFormObject

  beforeEach(() => {
    vuexFormObject = new VuexFormObject({
      foo: 'bar',
      nested: {
        foo: 'bar'
      }
    })
  })

  it('should return an object', () => {
    expect(vuexFormObject).to.be.an('object')
  })

  it('should contain the correct values', () => {
    expect(vuexFormObject.foo).to.equal('bar')
    expect(vuexFormObject.nested.foo).to.equal('bar')
  })

  it('#has', () => {
    expect(vuexFormObject.has('foo')).to.equal(true)
    expect(vuexFormObject.has('nested.foo')).to.equal(true)
  })

  it('#get', () => {
    expect(vuexFormObject.get('foo')).to.equal('bar')
    expect(vuexFormObject.get('nested.foo')).to.equal('bar')
    expect(vuexFormObject.get('this.is.not.defined', 'default value')).to.equal('default value')
  })
})
