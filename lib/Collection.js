const resolveOperator = require("./operators");
const { getGroupId, getGroup, getGroupKeys } = require("./helpers");

const isDevelopmentEnv = process.env.NODE_ENV !== "production";

class Collection {
  constructor(data) {
    this.data = this.cache = data;
  }

  match(options) {
    if (typeof options === "function") {
      this.data = this.data.filter(options);
    } else if (typeof options === "object") {
      const fields = Object.keys(options);
      this.data = this.data.reduce((matches, doc) => {
        for (const field of fields) {
          if (doc[field] !== options[field]) return matches;
        }
        matches.push(doc);
        return matches;
      }, []);
    } else {
      if (isDevelopmentEnv) {
        throw TypeError("match :: expects an object or a condition function.");
      }
    }
    return this;
  }

  unwind(field) {
    const unwinded = [];
    this.data.forEach(record => {
      const parsedField = field.split(".");
      const arrField = parsedField.reduce((field, path) => {
        return field ? field[path] : record[path];
      }, null);
      if (!arrField || !arrField.length) {
        unwinded.push(record);
        return;
      }
      arrField.forEach(value => {
        const obj = Object.assign({}, record, { [field]: value });
        unwinded.push(obj);
      });
    });
    this.data = unwinded;
    return this;
  }

  group(options) {
    // check and extract group id
    let id;
    if (typeof options === "string" || Array.isArray(options)) {
      id = options;
    } else if (Object.keys(options).indexOf("id") !== -1) {
      id = options.id;
      delete options.id;
    } else {
      if (isDevelopmentEnv) {
        throw Error("group :: an id field is required.");
      }
      return this;
    }

    // there are no group operators defined
    // simply return group ids
    if (
      typeof options === "string" ||
      Array.isArray(options) ||
      Object.keys(options).length === 0
    ) {
      this.data = this.data.reduce((aggregated, record) => {
        const groupId = getGroupId(id, record);
        return getGroupKeys(groupId, aggregated);
      }, []);
      return this;
    }

    if (typeof id === "string" || Array.isArray(id)) {
      this.data = this.data.reduce((aggregated, record, idx) => {
        const fields = Object.keys(options);
        const groupId = getGroupId(id, record);

        // the record does not belong to a group
        if (typeof groupId === "undefined") {
          return aggregated;
        }

        const groupObj = getGroup(groupId, aggregated);
        for (const field of fields) {
          groupObj[field] = resolveOperator({
            operatorObj: options[field],
            currentValue: groupObj[field],
            groupId,
            record,
            recordIdx: idx
          });
        }
        aggregated.push(groupObj);
        return aggregated;
      }, []);

      return this;
    }
  }

  sort(criteria) {
    if (typeof criteria !== "object" || criteria === null) {
      if (isDevelopmentEnv)
        throw TypeError("sort :: criteria must be an object.");
      return this;
    }
    for (const field of Object.keys(criteria)) {
      const sortValue = criteria[field];
      if (!Number.isInteger(sortValue) || Math.abs(sortValue) !== 1) {
        throw SyntaxError("sort :: criteria need to use either 1 or -1.");
      }
    }
    const fields = Object.keys(criteria);
    function compare(a, b, i = 0) {
      const field = fields[i];
      const order = criteria[field];
      if (a[field] < b[field]) {
        return order * -1;
      } else if (a[field] > b[field]) {
        return order * 1;
      } else {
        return compare(a, b, i + 1);
      }
    }
    this.data = this.data.sort(compare);
    return this;
  }

  limit(n) {
    this.data = this.data.slice(0, n);
    return this;
  }

  exec() {
    const { data } = this;
    this.data = this.cache;
    return data;
  }
}

module.exports = Collection;
