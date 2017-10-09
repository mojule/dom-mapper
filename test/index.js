'use strict'

const assert = require( 'assert' )
const domUtils = require( '@mojule/dom-utils' )
const Mapper = require( '..' )
const KitchenSink = require( './fixtures/kitchen-sink' )
const document = require( './fixtures/document' )

const { stringify, parse } = domUtils

const mapper = Mapper( { document } )
const { from, to } = mapper

describe( 'dom-mapper', () => {
  it( 'round trips object', () => {
    const kitchenSink = KitchenSink()
    const dom = to( kitchenSink )
    const value = from( dom )

    assert.deepEqual( kitchenSink, value )
  })

  describe( 'round trips each type', () => {
    const kitchenSink = KitchenSink()

    Object.keys( kitchenSink ).forEach( name => {
      const value = kitchenSink[ name ]

      it( `${ name } fixture round trips to original value`, () => {
        const dom = to( value )
        const rounded = from( dom )

        assert.deepEqual( value, rounded )
      })
    })
  })

  it( 'converts bad number to null', () => {
    const dom = parse( document, '<p data-type="number"></p>' )
    const result = from( dom )

    assert.strictEqual( result, null )
  })

  it( 'multiple from fragment', () => {
    const fragment = parse( document, '<p data-type="number" data-value="1"></p><p data-type="number" data-value="2"></p>' )
    const result = from( fragment )

    assert.deepEqual( result, [ 1, 2 ] )
  })

  it( 'single from fragment', () => {
    const fragment = parse( document, ' <p data-type="number" data-value="1"></p> ' )
    const result = from( fragment )

    assert.strictEqual( result, 1 )
  })

  it( 'any nesting/skips object descendants without names/missing values', () => {
    const nesting = require( './fixtures/nesting' )

    const { html, expect } = nesting
    const dom = parse( document, html )
    const result = from( dom )

    assert.deepEqual( result, expect )
  })

  it( 'requires a document instance', () => {
    assert.throws( () => Mapper() )
  })
})
