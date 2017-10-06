'use strict'

const assert = require( 'assert' )
const domUtils = require( '@mojule/dom-utils' )
const Mapper = require( '..' )
const valueToDomFixtures = require( './fixtures/value-to-dom' )
const KitchenSink = require( './fixtures/kitchen-sink' )
const document = require( './fixtures/document' )

const { stringify } = domUtils

const mapper = Mapper( { document } )
const { from, to } = mapper

describe( 'dom-mapper', () => {
  it( 'round trips', () => {
    const kitchenSink = KitchenSink()
    const dom = to( kitchenSink )
    const value = from( dom )

    assert.deepEqual( kitchenSink, value )
  })

  describe( 'value to dom', () => {
    const { values, expects } = valueToDomFixtures

    Object.keys( values ).forEach( name => {
      const value = values[ name ]

      it( `${ name } fixture round trips to original value`, () => {
        const dom = to( value )
        const rounded = from( dom )

        assert.deepEqual( value, rounded )
      })
    })
  })
})
