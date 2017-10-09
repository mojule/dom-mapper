# dom-mapper

Map from a value to the DOM, or from the DOM to a value

`npm install @mojule/dom-mapper`

```js
const Mapper = require( '@mojule/dom-mapper' )

/*
  requires a document instance - can be window.document in the browser, or you
  can use one created by JSDOM et al.
*/
const options = { document }

const { from, to } = Mapper( options )

let value = { foo: 1, bar: 'baz' }

/*
<table data-type="object">
  <tr>
    <th>foo</th>
    <td data-type="number" data-value="1" data-name="foo">1</td>
  </tr>
  <tr>
    <th>bar</th>
    <td data-type="string" data-value="baz" data-name="bar">"baz"</td>
  </tr>
<table>
*/
const dom = to( value )

/*
  {
    "foo": 1,
    "bar": "baz"
  }
*/
value = from( dom )
```

## Mapping to the DOM

Will convert any JSON-compatible value to a DOM representation

The DOM representation is intended to be both semantic and human readable,
eg an object maps to a two column name/value table, an array maps to a
zero-indexed ordered list etc.

```js
const el = mapper.to( value )
```

## Mapping from the DOM

Compatible with, but much looser than the mapper that maps to the DOM. Your DOM
elements can encode JSON-compatible values in a fairly free form way, you just
add the required `data-` attributes to the nodes you want to take part in the
mapping.

```js
const value = mapper.from( el )
```

### Primitives

Elements with a `data-type` attribute of `string`, `number`, `boolean`, `null`,
`array` or `object` will be converted to their matching value.

The primitives `string`, `number` and `boolean` should have a `data-value`
attribute. If the `data-value` attribute is missing, they will return `null`.

For `string`, the resultant string will be the value of the attribute.

For `number`, the result of passing the attribute value string to `parseFloat`
will be used, with `null` returned if the result is `NaN`.

For `boolean`, `true` will be returned if and only if the attribute value
exactly matches `"true"`, otherwise `false` will be returned.

### Arrays

Elements with `data-type="array"` will return an array containing the mapped
results of any descendant elements with a `data-type` attribute; excluding any
descendants of those descendants, to allow for nesting of arrays and objects.

This allows you to have child elements with varying amounts of nesting for
display or semantic purposes and still get the expected result:

```html
<div data-type="array">
  <p>
    <img src="1.png" alt="" />
    <span data-type="number" data-value="1">One</span>
  </p>
  <p data-type="string" data-value="foo">Foo</p>
</div>
```

```json
[ 1, "foo" ]
```

### Objects

Elements with `data-type="object"` are mapped in the same way as `array`, except
descendant nodes are expected to also have a `data-name` attribute. Any nodes
without this attribute are skipped:

```html
<div data-type="object">
  <div>
    <p data-type="string" data-name="foo" data-value="Foo">Foo</p>
    <p data-type="string" data-name="bar" data-value="Bar">Bar</p>
  </div>
  <div>
    <p data-type="string" data-value="baz">Baz</p>
  </div>
</div>
```

```json
{ "foo": "Foo", "bar": "Bar" }
```

## Finding data elements

If the root node you pass in doesn't match any of the above patterns, it will
be searched for descendants that do in the same manner as mapping an `array`,
except with the caveat that if only a single value is found, that value is
returned rather than an array with a length of one.

### Single matching value

```html
<div>
  <p>Hello World</p>
  <p><span data-type="number" data-value="1">One</span></p>
</div>
```

```json
1
```

### Multiple values

```html
<div>
  <p>Hello World</p>
  <p><span data-type="number" data-value="1">One</span></p>
  <p><span data-type="number" data-value="2">Two</span></p>
</div>
```

```json
[ 1, 2 ]
```

## Complex example, JSON to DOM

### Input

```json
{
  "string": "foo",
  "emptyString": "",
  "number": -1.5,
  "true": true,
  "false": false,
  "null": null,
  "array": [ 1, 2, 3 ],
  "emptyArray": [],
  "object": { "foo": "bar", "baz": "qux" },
  "emptyObject": {},
  "objectArray": [
    { "foo": 1, "bar": 2, "baz": 3, "qux": 4 },
    { "foo": 5, "bar": 6, "baz": 7 },
    { "foo": 5, "bar": "foo" }
  ],
  "mixedArray": [ {}, { "foo": 1, "bar": [] } ],
  "nestedArray": [ [ [ 1, 2 ], [ 3, 4 ] ], [ [ 5, 6 ], [ 7, 8 ] ] ]
}
```

### Output

```html
<table data-type="object">
  <tr>
    <th>string</th>
    <td data-type="string" data-value="foo" data-name="string">"foo"</td>
  </tr>
  <tr>
    <th>emptyString</th>
    <td data-type="string" data-value="" data-name="emptyString">""</td>
  </tr>
  <tr>
    <th>number</th>
    <td data-type="number" data-value="-1.5" data-name="number">-1.5</td>
  </tr>
  <tr>
    <th>true</th>
    <td data-type="boolean" data-value="true" data-name="true">true</td>
  </tr>
  <tr>
    <th>false</th>
    <td data-type="boolean" data-value="false" data-name="false">false</td>
  </tr>
  <tr>
    <th>null</th>
    <td data-type="null" data-value="null" data-name="null">null</td>
  </tr>
  <tr>
    <th>array</th>
    <td>
      <ol data-type="array" start="0" data-name="array">
        <li data-type="number" data-value="1">1</li>
        <li data-type="number" data-value="2">2</li>
        <li data-type="number" data-value="3">3</li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>emptyArray</th>
    <td>
      <ol data-type="array" start="0" data-name="emptyArray"></ol>
    </td>
  </tr>
  <tr>
    <th>object</th>
    <td>
      <table data-type="object" data-name="object">
        <tr>
          <th>foo</th>
          <td data-type="string" data-value="bar" data-name="foo">"bar"</td>
        </tr>
        <tr>
          <th>baz</th>
          <td data-type="string" data-value="qux" data-name="baz">"qux"</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <th>emptyObject</th>
    <td>
      <table data-type="object" data-name="emptyObject"></table>
    </td>
  </tr>
  <tr>
    <th>objectArray</th>
    <td>
      <ol data-type="array" start="0" data-name="objectArray">
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="1" data-name="foo">1</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="number" data-value="2" data-name="bar">2</td>
            </tr>
            <tr>
              <th>baz</th>
              <td data-type="number" data-value="3" data-name="baz">3</td>
            </tr>
            <tr>
              <th>qux</th>
              <td data-type="number" data-value="4" data-name="qux">4</td>
            </tr>
          </table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="5" data-name="foo">5</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="number" data-value="6" data-name="bar">6</td>
            </tr>
            <tr>
              <th>baz</th>
              <td data-type="number" data-value="7" data-name="baz">7</td>
            </tr>
          </table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="5" data-name="foo">5</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="string" data-value="foo" data-name="bar">"foo"</td>
            </tr>
          </table>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>mixedArray</th>
    <td>
      <ol data-type="array" start="0" data-name="mixedArray">
        <li>
          <table data-type="object"></table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="1" data-name="foo">1</td>
            </tr>
            <tr>
              <th>bar</th>
              <td>
                <ol data-type="array" start="0" data-name="bar"></ol>
              </td>
            </tr>
          </table>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>nestedArray</th>
    <td>
      <ol data-type="array" start="0" data-name="nestedArray">
        <li>
          <ol data-type="array" start="0">
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="1">1</li>
                <li data-type="number" data-value="2">2</li>
              </ol>
            </li>
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="3">3</li>
                <li data-type="number" data-value="4">4</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>
          <ol data-type="array" start="0">
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="5">5</li>
                <li data-type="number" data-value="6">6</li>
              </ol>
            </li>
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="7">7</li>
                <li data-type="number" data-value="8">8</li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </td>
  </tr>
</table>
```

<table data-type="object">
  <tr>
    <th>string</th>
    <td data-type="string" data-value="foo" data-name="string">"foo"</td>
  </tr>
  <tr>
    <th>emptyString</th>
    <td data-type="string" data-value="" data-name="emptyString">""</td>
  </tr>
  <tr>
    <th>number</th>
    <td data-type="number" data-value="-1.5" data-name="number">-1.5</td>
  </tr>
  <tr>
    <th>true</th>
    <td data-type="boolean" data-value="true" data-name="true">true</td>
  </tr>
  <tr>
    <th>false</th>
    <td data-type="boolean" data-value="false" data-name="false">false</td>
  </tr>
  <tr>
    <th>null</th>
    <td data-type="null" data-value="null" data-name="null">null</td>
  </tr>
  <tr>
    <th>array</th>
    <td>
      <ol data-type="array" start="0" data-name="array">
        <li data-type="number" data-value="1">1</li>
        <li data-type="number" data-value="2">2</li>
        <li data-type="number" data-value="3">3</li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>emptyArray</th>
    <td>
      <ol data-type="array" start="0" data-name="emptyArray"></ol>
    </td>
  </tr>
  <tr>
    <th>object</th>
    <td>
      <table data-type="object" data-name="object">
        <tr>
          <th>foo</th>
          <td data-type="string" data-value="bar" data-name="foo">"bar"</td>
        </tr>
        <tr>
          <th>baz</th>
          <td data-type="string" data-value="qux" data-name="baz">"qux"</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <th>emptyObject</th>
    <td>
      <table data-type="object" data-name="emptyObject"></table>
    </td>
  </tr>
  <tr>
    <th>objectArray</th>
    <td>
      <ol data-type="array" start="0" data-name="objectArray">
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="1" data-name="foo">1</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="number" data-value="2" data-name="bar">2</td>
            </tr>
            <tr>
              <th>baz</th>
              <td data-type="number" data-value="3" data-name="baz">3</td>
            </tr>
            <tr>
              <th>qux</th>
              <td data-type="number" data-value="4" data-name="qux">4</td>
            </tr>
          </table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="5" data-name="foo">5</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="number" data-value="6" data-name="bar">6</td>
            </tr>
            <tr>
              <th>baz</th>
              <td data-type="number" data-value="7" data-name="baz">7</td>
            </tr>
          </table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="5" data-name="foo">5</td>
            </tr>
            <tr>
              <th>bar</th>
              <td data-type="string" data-value="foo" data-name="bar">"foo"</td>
            </tr>
          </table>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>mixedArray</th>
    <td>
      <ol data-type="array" start="0" data-name="mixedArray">
        <li>
          <table data-type="object"></table>
        </li>
        <li>
          <table data-type="object">
            <tr>
              <th>foo</th>
              <td data-type="number" data-value="1" data-name="foo">1</td>
            </tr>
            <tr>
              <th>bar</th>
              <td>
                <ol data-type="array" start="0" data-name="bar"></ol>
              </td>
            </tr>
          </table>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <th>nestedArray</th>
    <td>
      <ol data-type="array" start="0" data-name="nestedArray">
        <li>
          <ol data-type="array" start="0">
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="1">1</li>
                <li data-type="number" data-value="2">2</li>
              </ol>
            </li>
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="3">3</li>
                <li data-type="number" data-value="4">4</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>
          <ol data-type="array" start="0">
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="5">5</li>
                <li data-type="number" data-value="6">6</li>
              </ol>
            </li>
            <li>
              <ol data-type="array" start="0">
                <li data-type="number" data-value="7">7</li>
                <li data-type="number" data-value="8">8</li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </td>
  </tr>
</table>

### Suggested CSS

```css
table[data-type="object"] {
  border: 1px solid #ccc;
  border-bottom: 0;
  border-collapse: collapse;
}

table[data-type="object"] th {
  text-align: left;
  vertical-align: top;
  border-right: 1px solid #ccc;
}

table[data-type="object"] td,
table[data-type="object"] th {
  border-bottom: 1px solid #ccc;
  padding: 0.5rem;
}

ol[data-type="array"] > li {
  border: 1px dotted #ccc;
  border-bottom: 0;
  padding: 0.5rem;
  list-style-type: decimal;
}

ol[data-type="array"] > li:last-child {
  border: 1px dotted #ccc;
}

ol[data-type="array"]:empty {
  margin: 0;
  padding: 0;
}

ol[data-type="array"]:empty:before {
  content: 'empty array';
  font-style: italic;
}

table[data-type="object"]:empty {
  border: 0;
}

table[data-type="object"]:empty:before {
  content: 'empty object';
  font-style: italic;
}
```