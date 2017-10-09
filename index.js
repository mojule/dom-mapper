'use strict'

const Mapper = require( '@mojule/mapper' )
const defaultOptions = require( './src/default-options' )

const DomMapper = options => {
  options = Object.assign( {}, defaultOptions, options )

  const { from, to } = options

  return {
    from: Mapper( Object.assign( {}, from, options ) ),
    to: Mapper( Object.assign( {}, to, options ) )
  }
}

module.exports = DomMapper
