'use strict'

const html = `
<div data-type="object">
  <div>
    <p data-type="string" data-name="foo" data-value="bar">Bar</p>
    <p data-type="string" data-name="baz" data-value="qux">Qux</p>
    <div>
      <p data-type="string" data-name="foobar" data-value="bazqux">BazQux</p>
    </div>
    <p data-type="string" data-value="no name">No Name</p>
  </div>
  <p data-type="string" data-name="hello" data-value="world">World</p>
  <div>
    <div>
      <div data-type="object" data-name="nested">
        <p data-type="number" data-name="a" data-value="1">One</p>
        <p data-type="number" data-name="b" data-value="2">Two</p>
      </div>
    </div>
  </div>
  <div data-type="string" data-name="missingStringValue"></div>
  <div data-type="number" data-name="missingNumberValue"></div>
  <div data-type="boolean" data-name="missingBooleanValue"></div>
</div>
`

const expect = {
  foo: 'bar',
  baz: 'qux',
  foobar: 'bazqux',
  hello: 'world',
  nested: {
    a: 1,
    b: 2
  },
  missingStringValue: null,
  missingNumberValue: null,
  missingBooleanValue: null
}

module.exports = { html, expect }
