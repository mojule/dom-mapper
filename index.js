'use strict'

const Mapper = require( '@mojule/mapper' )
const defaultOptions = require( './src/default-options' )
const from = require( './src/from' )
const to = require( './src/to' )

const DomMapper = options => {
  options = Object.assign( {}, defaultOptions, options )

  return {
    from: Mapper( Object.assign( {}, from, options ) ),
    to: Mapper( Object.assign( {}, to, options ) )
  }
}

module.exports = DomMapper
