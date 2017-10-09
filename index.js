'use strict'

const Mapper = require( '@mojule/mapper' )
const defaultOptions = require( './src/default-options' )

const DomMapper = options => {
  options = Object.assign( {}, defaultOptions, options )

  const { from, to, document } = options

  if( !document )
    throw Error( 'A document instance is required' )

  return {
    from: Mapper( Object.assign( {}, from, options ) ),
    to: Mapper( Object.assign( {}, to, options ) )
  }
}

module.exports = DomMapper
