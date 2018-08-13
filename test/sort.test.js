const jsonAggregate = require('../index')

describe('sort', () => {
  const shortJSON = [{
    company: 'a',
    price: 90
  }, {
    company: 'b',
    price: 120
  }, {
    company: 'b',
    price: 50
  }]
  test('sort', () => {
    const collection = jsonAggregate.create(JSON.stringify(shortJSON))
    expect(
      collection.sort({ company: -1, price: 1 }).exec()
    ).toEqual([{
      company: 'b',
      price: 50
    },{
      company: 'b',
      price: 120
    },{
      company: 'a',
      price: 90
    }])
  })
  test('sort - bad criteria', () => {
    function testCollection () {
      const collection = jsonAggregate.create(JSON.stringify(shortJSON))
      collection.sort({ company: 'hello' }).exec()
    }
    expect(testCollection).toThrow(SyntaxError)
  })
})
