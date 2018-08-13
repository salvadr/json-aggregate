const jsonAggregate = require('../index')

describe('Examples from the docs', () => {

  test('match with object', () => {
    const data = JSON.stringify([
      { 'author': 'dave', 'score': 80, 'views': 100 },
      { 'author': 'dave', 'score': 85, 'views': 521 },
      { 'author': 'ahn', 'score': 60, 'views': 1000 },
      { 'author': 'li', 'score': 55, 'views': 5000 },
      { 'author': 'annT', 'score': 60, 'views': 50 },
      { 'author': 'li', 'score': 94, 'views': 999 },
      { 'author': 'ty', 'score': 95, 'views': 1000 }
    ])
    const collection = jsonAggregate.create(data)
    expect(collection.match({ author : "dave" }).exec())
    .toEqual([{ "author" : "dave", "score" : 80, "views" : 100 },
    { "author" : "dave", "score" : 85, "views" : 521 }])
  })

  test('match with object', () => {
    const data = JSON.stringify([
      { 'author': 'dave', 'score': 80, 'views': 100 },
      { 'author': 'dave', 'score': 85, 'views': 521 },
      { 'author': 'ahn', 'score': 60, 'views': 1000 },
      { 'author': 'li', 'score': 55, 'views': 5000 },
      { 'author': 'annT', 'score': 60, 'views': 50 },
      { 'author': 'li', 'score': 94, 'views': 999 },
      { 'author': 'ty', 'score': 95, 'views': 1000 }
    ])
    const collection = jsonAggregate.create(data)
    expect(collection.match(item => item.author === "dave").exec())
    .toEqual([{ "author" : "dave", "score" : 80, "views" : 100 },
    { "author" : "dave", "score" : 85, "views" : 521 }])
  })

  test('unwind', () => {
    const data = JSON.stringify([
      { "item" : "ABC1", sizes: [ "S", "M", "L"] }
    ])
    const collection = jsonAggregate.create(data)
    expect(collection.unwind("sizes").exec()).toEqual([
      { "item" : "ABC1", "sizes" : "S" },
      { "item" : "ABC1", "sizes" : "M" },
      { "item" : "ABC1", "sizes" : "L" },
    ])
  })

  test('limit', () => {
    const data = JSON.stringify([
      { company: "a", employeeCount: 45, category: 1, product: "Product A", price: 120 },
      { company: "a", employeeCount: 45, category: 1, product: "Product B", price: 80 },
      { company: "a", employeeCount: 45, category: 2, product: "Product C", price: 105 },
      { company: "a", employeeCount: 45, category: 2, product: "Product D", price: 95 },
      { company: "b", employeeCount: 30, category: 1, product: "Product A", price: 40 },
      { company: "b", employeeCount: 30, category: 1, product: "Product B", price: 100 },
      { company: "b", employeeCount: 30, category: 2, product: "Product C", price: 60 },
      { company: "b", employeeCount: 30, category: 2, product: "Product D", price: 130 }
    ])
    const collection = jsonAggregate.create(data)
    expect(collection.sort({ price: -1}).limit(2).exec()).toEqual([
      { company: "b", employeeCount: 30, category: 2, product: "Product D", price: 130 },
      { company: "a", employeeCount: 45, category: 1, product: "Product A", price: 120 }
    ])
  })

  test('$avg', () => {
    const data = JSON.stringify([
      { company: "a", employeeCount: 45, category: 1, product: "Product A", price: 120 },
      { company: "a", employeeCount: 45, category: 1, product: "Product B", price: 80 },
      { company: "a", employeeCount: 45, category: 2, product: "Product C", price: 105 },
      { company: "a", employeeCount: 45, category: 2, product: "Product D", price: 95 },
      { company: "b", employeeCount: 30, category: 1, product: "Product A", price: 40 },
      { company: "b", employeeCount: 30, category: 1, product: "Product B", price: 100 },
      { company: "b", employeeCount: 30, category: 2, product: "Product C", price: 60 },
      { company: "b", employeeCount: 30, category: 2, product: "Product D", price: 130 }
    ])
    const collection = jsonAggregate.create(data)
    expect(collection.group({ id: 'product', count: { $avg: 'price' } }).exec())
    .toEqual([
      { id: 'Product A', count: 80 },
      { id: 'Product B', count: 90 },
      { id: 'Product C', count: 82.5 },
      { id: 'Product D', count: 112.5 }
    ])
  })

  test('advanced example', () => {
    const data = JSON.stringify([
      { shop: "XYZ", "item" : "A", sizes: [ "S", "M", "L"], price: '99' },
      { shop: "XYZ", "item" : "B", sizes: [ "M", "L"], price: '69' },
      { shop: "XYZ", "item" : "C", sizes: [ "S", "L", "XL"], price: '120' },
      { shop: "MNO", "item" : "A", sizes: [ "S" ], price: '110' },
      { shop: "MNO", "item" : "B", sizes: [ "S", "M", "L"], price: '80' },
      { shop: "MNO", "item" : "C", sizes: [ "S", "M", "XL"], price: '100' },
      { shop: "JKL", "item" : "A", sizes: [ "S", "M", "XL" ], price: '105' },
      { shop: "JKL", "item" : "B", sizes: [ "M", "L"], price: '50' },
      { shop: "JKL", "item" : "C", sizes: [ "M", "XL"], price: '110' }
    ])
    const collection = jsonAggregate.create(data)
    expect(
      collection
        .match(item => item.price > 60)
        .unwind('sizes')
        .group({
          id: ['item', 'sizes'],
          whereToBuy: { $push: ['shop', 'price'] }
        })
        .exec()
    ).toEqual([{"id": {"item": "A", "sizes": "L"}, "whereToBuy": [{"price": "99", "shop": "XYZ"}]}, {"id": {"item": "C", "sizes": "L"}, "whereToBuy": [{"price": "120", "shop": "XYZ"}]}, {"id": {"item": "B", "sizes": "S"}, "whereToBuy": [{"price": "80", "shop": "MNO"}]}, {"id": {"item": "B", "sizes": "M"}, "whereToBuy": [{"price": "69", "shop": "XYZ"}, {"price": "80", "shop": "MNO"}]}, {"id": {"item": "B", "sizes": "L"}, "whereToBuy": [{"price": "69", "shop": "XYZ"}, {"price": "80", "shop": "MNO"}]}, {"id": {"item": "C", "sizes": "S"}, "whereToBuy": [{"price": "120", "shop": "XYZ"}, {"price": "100", "shop": "MNO"}]}, {"id": {"item": "A", "sizes": "S"}, "whereToBuy": [{"price": "99", "shop": "XYZ"}, {"price": "110", "shop": "MNO"}, {"price": "105", "shop": "JKL"}]}, {"id": {"item": "A", "sizes": "M"}, "whereToBuy": [{"price": "99", "shop": "XYZ"},{"price": "105", "shop": "JKL"}]}, {"id": {"item": "A", "sizes": "XL"}, "whereToBuy": [{"price": "105", "shop": "JKL"}]}, {"id": {"item": "C", "sizes": "M"}, "whereToBuy": [{"price": "100", "shop": "MNO"}, {"price": "110", "shop": "JKL"}]}, {"id": {"item": "C", "sizes": "XL"}, "whereToBuy": [{"price": "120", "shop": "XYZ"}, {"price": "100", "shop": "MNO"}, {"price": "110", "shop": "JKL"}]}])
  })

})
