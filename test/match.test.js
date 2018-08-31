const jsonAggregate = require('../index')
const { products } = require('./data')

describe('match', () => {
  const collection = jsonAggregate.create(JSON.stringify(products))

  test('text value', () => {
    expect(
      collection
        .match({ product: 'Product A' })
        .exec()
    ).toEqual([
      {
        company: 'a',
        employeeCount: 45,
        category: 1,
        product: 'Product A',
        price: 120
      },
      {
        company: 'b',
        employeeCount: 30,
        category: 1,
        product: 'Product A',
        price: 49.9
      }
    ])
  })

  test('with condition', () => {
    expect(
      collection
        .match((doc) => doc.price > 100)
        .exec()
    ).toEqual([{
      company: 'a',
      employeeCount: 45,
      category: 1,
      product: 'Product A',
      price: 120
    },{
      company: 'a',
      employeeCount: 45,
      category: 2,
      product: 'Product C',
      price: 105
    },{
      company: 'b',
      employeeCount: 30,
      category: 2,
      product: 'Product D',
      price: 130
    }])
  })

  test('text value', () => {
    function wrongMatch() {
      collection
      .match(123)
      .exec()
    }
    expect(wrongMatch).toThrowError(TypeError)
  })

})