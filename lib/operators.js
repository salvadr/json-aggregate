const isDevelopmentEnv = process.env.NODE_ENV !== 'production'

const $avg = (function () {
  const cache = Object.create(null)
  return function (target, record, currentValue, groupId, recordIdx) {
    if (recordIdx === 0) {
      Object.keys(cache).forEach(key => delete cache[key])
    }
    const cacheId = JSON.stringify(groupId)
    let value
    if (typeof target === 'string') {
      value = Number(record[target])
    } else if (Array.isArray(target)) {
      value = (target.reduce((total, key) => {
        return total + Number(record[key])
      }, 0) / target.length)
    } else {
      return currentValue
    }
    if (isNaN(value)) {
      return currentValue
    }
    if (!cache[cacheId]) {
      cache[cacheId] = [1, value]
      return value
    }
    const [n, avg] = cache[cacheId]
    const newValue = ((n * avg) + value) / (n + 1)
    cache[cacheId] = [n + 1, newValue]
    return newValue
  }
}())

function $first (target, record, currentValue) {
  if (currentValue) return currentValue
  const value = record[target]
  if (typeof value === 'undefined') {
    return currentValue
  }
  return value
}

const $last = (target, record) => record[target]

const $max = generateMinMax('max')

const $min = generateMinMax('min')

function $sum (target, record, currentValue) {
  currentValue = !isNaN(currentValue) ? Number(currentValue) : 0
  if (target === 1) {
    return currentValue + 1
  } else if (typeof target === 'string') {
    const value = Number(record[target])
    if (isNaN(value)) {
      return currentValue
    } else {
      return currentValue + value
    }
  } else {
    if (isDevelopmentEnv) throw new SyntaxError('Invalid target.')
    return null
  }
}

function $push (arr, record, currentValue) {
  if (!arr.length) {
    if (isDevelopmentEnv) {
      throw new TypeError('$push expects an array of fields (string).')
    }
    return null
  }
  const value = arr.reduce((newRecord, field) => {
    newRecord[field] = record[field]
    return newRecord
  }, {})
  if (currentValue) {
    currentValue.push(value)
    return currentValue
  }
  return [value]
}

function $addToSet (target, record, currentValue) {
  if (typeof target !== 'string') {
    if (isDevelopmentEnv) throw TypeError('$addToSet expects a field (string).')
    return null
  }
  const value = record[target]
  if (currentValue) {
    if (currentValue.indexOf(value) === -1) {
      currentValue.push(value)
    }
    return currentValue
  }
  return [value]
}

/*
 * TODO
 * function $ranges () {} // $bucket
*/

// min-max helper
function generateMinMax (op) {
  return function (target, record, currentValue) {
    if (typeof target !== 'string') {
      return currentValue
    }
    const value = Number(record[target])
    if (isNaN(value)) {
      return currentValue
    }
    const condition = op === 'min' ? currentValue < value : currentValue > value
    return condition ? currentValue : value
  }
}

const operators = {
  $avg,
  $first,
  $last,
  $max,
  $min,
  $sum,
  $push,
  $addToSet
}

function resolveOperator (options) {
  const { operatorObj, record, currentValue, groupId, recordIdx } = options
  if (typeof operatorObj !== 'object') {
    if (isDevelopmentEnv) throw TypeError('Expected a value/key pair.')
    return null
  }
  const operatorObjKeys = Object.keys(operatorObj)
  if (operatorObjKeys.length > 1) {
    if (isDevelopmentEnv) throw SyntaxError('Only 1 operator per field is supported.')
    return null
  }
  const operator = operatorObjKeys[0]
  const target = operatorObj[operator]
  if (Object.keys(operators).indexOf(operator) === -1) {
    if (isDevelopmentEnv) throw SyntaxError('Invalid operator.')
    return null
  }

  return operators[operator](target, record, currentValue, groupId, recordIdx)
}

module.exports = resolveOperator
