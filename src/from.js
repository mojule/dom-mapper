'use strict'

const isDataElement = ( el, type ) => el.nodeType === 1 && el.dataset.type === type

const predicates = {
  stringElement: value => isDataElement( value, 'string' ),
  numberElement: value => isDataElement( value, 'number' ),
  booleanElement: value => isDataElement( value, 'boolean' ),
  nullElement: value => isDataElement( value, 'null' ),
  arrayElement: value => isDataElement( value, 'array' ),
  objectElement: value => isDataElement( value, 'object' ),
  fragmentElement: value => value.nodeType === 11
}

const selfOrDescendant = node =>
  node.matches( '[data-type]' ) ? node : node.querySelector( '[data-type]' )

const dataChildren = node =>
  Array.from( node.children ).map( selfOrDescendant ).filter( n => n )

const map = {
  stringElement: value => value.dataset.value,
  numberElement: value => {
    const num = parseFloat( value.dataset.value )

    return Number.isNaN( num ) ? null : num
  },
  booleanElement: value => value.dataset.value === 'true',
  nullElement: () => null,
  arrayElement: ( value, options ) => {
    const { mapper } = options

    return dataChildren( value ).map( current => mapper( current, options ) )
  },
  objectElement: ( value, options ) => {
    const { mapper } = options

    return dataChildren( value ).reduce( ( obj, current ) => {
      const name = current.dataset.name

      if( name ) obj[ name ] = mapper( current, options )

      return obj
    }, {} )
  },
  fragmentElement: ( value, options ) => {
    const children = map.arrayElement( value, options )

    return children.length === 1 ? children[ 0 ] : children
  }
}

module.exports = { map, predicates }
