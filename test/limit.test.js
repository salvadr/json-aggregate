const jsonAggregate = require('../index')
const { products } = require('./data')

describe('limit', () => {
  test('limit', () => {
    const collection = jsonAggregate.create(JSON.stringify(products))
    expect(
      collection.limit(2).exec()
    ).toHaveLength(2)
  })
})