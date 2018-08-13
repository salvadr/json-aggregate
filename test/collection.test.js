const jsonAggregate = require('../index')
const Collection = require('../lib/Collection')

describe('initialization', () => {
  const json = JSON.stringify({ 'a': 1 })
  test('new', () => {
    expect(jsonAggregate.create(json)).toBeInstanceOf(Collection)
  })
  test('init with json', () => {
    expect(jsonAggregate.create(json).data).toEqual([{a: 1}])
  })
  test('init with non-json', () => {
    function testCollection () {
      const collection = jsonAggregate.create('_')
    }
    expect(testCollection).toThrowError(TypeError)
  })
  test('test op with no operator', () => {
    function testCollection () {
      const collection = jsonAggregate.create(JSON.stringify([
        { product: 'Product A', price: 120 },
        { product: 'Product B', price: 80 },
        { product: 'Product C', price: 105 },
        { product: 'Product D', price: 95 }
      ]))
      collection
        .group({
          id: 'product',
          count: 1
        })
        .exec()
    }
    expect(testCollection).toThrowError(TypeError)
  })
})
