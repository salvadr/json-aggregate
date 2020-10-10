const jsonAggregate = require("../index");

var myJsonData = [
  {
    company: "e",
    employeeCount: 45,
    scoreRange: [
      {
        value: 110,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 3 }
        ]
      },
      {
        value: 50,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 4 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 7 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 8 }
        ]
      }
    ]
  },

  {
    company: "a",
    employeeCount: 45,
    scoreRange: [
      {
        value: 110,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      },
      {
        value: 50,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      }
    ]
  },

  {
    company: "b",
    employeeCount: 45,
    scoreRange: [
      {
        value: 110,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      },
      {
        value: 50,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      }
    ]
  },
  {
    company: "c",
    employeeCount: 45,
    scoreRange: [
      {
        value: 110,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      },
      {
        value: 50,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 1 },
          { ifCounter: 10, shouldCounter: 1 }
        ]
      },
      {
        value: 10,
        exception: [
          { ifCounter: 10, shouldCounter: 3 },
          { ifCounter: 10, shouldCounter: 2 }
        ]
      }
    ]
  }
];

test("#11", () => {
  const collection = jsonAggregate.create(JSON.stringify(myJsonData));
  const unwinded = collection
    .unwind("scoreRange")
    .unwind("scoreRange.exception")
    .exec();
  expect(unwinded.length).toBe(32);
});
