'use strict'

const KitchenSink = () => {
  const kitchenSink = {
    string: 'foo',
    emptyString: '',
    number: -1.5,
    true: true,
    false: false,
    null: null,
    array: [ 1, 2, 3 ],
    emptyArray: [],
    object: { foo: 'bar', baz: 'qux' },
    emptyObject: {},
    objectArray: [
      { foo: 1, bar: 2, baz: 3, qux: 4 },
      { foo: 5, bar: 6, baz: 7 },
      { foo: 5, bar: 'foo' }
    ],
    mixedArray: [ {}, { foo: 1, bar: [] } ],
    nestedArray: [ [ [ 1, 2 ], [ 3, 4 ] ], [ [ 5, 6 ], [ 7, 8 ] ] ]
  }

  return kitchenSink
}

module.exports = KitchenSink
