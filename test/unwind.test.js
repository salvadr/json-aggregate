const jsonAggregate = require('../index')

describe('unwind', () => {
  const data = [{
    "item" : "T-Shirt 1", sizes: [ "S", "M", "L"]
  }]
  const collection = jsonAggregate.create(JSON.stringify(data))
  test('unwind', () => {
    expect(
      collection.unwind('sizes').exec()
    ).toEqual([
      { "item" : "T-Shirt 1", sizes: "S" },
      { "item" : "T-Shirt 1", sizes: "M" },
      { "item" : "T-Shirt 1", sizes: "L" }
    ])
  })
  // test an item without array value
})
