'use strict'

const is = require( '@mojule/is' )

const isDataElement = ( el, type ) =>
  el.nodeType === 1 && el.dataset.type === type

const predicates = {
  stringElement: value => isDataElement( value, 'string' ),
  numberElement: value => isDataElement( value, 'number' ),
  booleanElement: value => isDataElement( value, 'boolean' ),
  nullElement: value => isDataElement( value, 'null' ),
  arrayElement: value => isDataElement( value, 'array' ),
  objectElement: value => isDataElement( value, 'object' ),
  parentElement: value => [ 1, 9, 11 ].includes( value.nodeType )
}

const dataDescendants = node =>
  Array.from( node.children ).reduce( ( arr, child ) => {
    if( child.matches( '[data-type]') ){
      arr.push( child )
    } else {
      arr.push( ...dataDescendants( child ) )
    }

    return arr
  }, [] )

const map = {
  stringElement: value =>
    is.undefined( value.dataset.value ) ? null : value.dataset.value,
  numberElement: value => {
    const num = parseFloat( value.dataset.value )

    return Number.isFinite( num ) ? num : null
  },
  booleanElement: value => {
    if( is.undefined( value.dataset.value ) ) return null

    return value.dataset.value === 'true'
  },
  nullElement: () => null,
  arrayElement: ( value, options ) => {
    const { mapper } = options

    return dataDescendants( value ).map( current => mapper( current, options ) )
  },
  objectElement: ( value, options ) => {
    const { mapper } = options

    return dataDescendants( value ).reduce( ( obj, current ) => {
      const name = current.dataset.name

      if( name ) obj[ name ] = mapper( current, options )

      return obj
    }, {} )
  },
  parentElement: ( value, options ) => {
    const children = map.arrayElement( value, options )

    return children.length === 1 ? children[ 0 ] : children
  }
}

module.exports = { map, predicates }
