'use strict'

const is = require( '@mojule/is' )

const populate = ( el, type, value, options ) => {
  const { document } = options
  const text = document.createTextNode( value )

  el.dataset.type = type
  el.dataset.value = value
  el.appendChild( text )

  return el
}

const createPrimitive = ( type, value, options ) => {
  const { document } = options
  let { el } = options

  el = el || document.createElement( 'p' )

  populate( el, type, value, options )

  return el
}

const isPrimitive = value =>
  is.string( value ) || is.number( value ) || is.boolean( value ) ||
  is.null( value )

const map = {
  string: ( value, options ) => createPrimitive( 'string', value, options ),
  number: ( value, options ) => createPrimitive( 'number', value, options ),
  boolean: ( value, options ) => createPrimitive( 'boolean', value, options ),
  null: ( value, options ) => createPrimitive( 'null', value, options ),
  array: ( value, options ) => {
    const { document, mapper } = options
    const ol = document.createElement( 'ol' )

    ol.dataset.type = 'array'
    ol.setAttribute( 'start', '0' )

    value.forEach( current => {
      let li = document.createElement( 'li' )

      if( isPrimitive( current ) ){
        const currentOptions = Object.assign( {}, options, { el: li } )

        li = mapper( current, currentOptions )
      } else {
        li.appendChild( mapper( current, options ) )
      }

      ol.appendChild( li )
    })

    return ol
  },
  object: ( value, options ) => {
    const { document, mapper } = options
    const table = document.createElement( 'table' )

    table.dataset.type = 'object'

    Object.keys( value ).forEach( name => {
      const current = value[ name ]
      const tr = document.createElement( 'tr' )
      const th = document.createElement( 'th' )
      const text = document.createTextNode( name )
      let td = document.createElement( 'td' )

      if( isPrimitive( current ) ){
        const currentOptions = Object.assign( {}, options, { el: td } )

        td = mapper( current, currentOptions )
        td.dataset.name = name
      } else {
        const child = mapper( current, options )

        child.dataset.name = name
        td.appendChild( child )
      }

      th.appendChild( text )
      tr.appendChild( th )
      tr.appendChild( td )
      table.appendChild( tr )
    })

    return table
  }
}

module.exports = { map }
