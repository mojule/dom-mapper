'use strict'

const KitchenSink = require( './kitchen-sink' )

const values = KitchenSink()

const expects = {
  string: '<p data-type="string" data-value="foo">foo</p>',
  emptyString: '<p data-type="string" data-value=""></p>',
  number: '<p data-type="number" data-value="-1.5">-1.5</p>',
  true: '<p data-type="boolean" data-value="true">true</p>',
  false: '<p data-type="boolean" data-value="false">false</p>',
  null: '<p data-type="null" data-value="null">null</p>',
  array: '<ol data-type="array"><li data-type="number" data-value="1">1</li><li data-type="number" data-value="2">2</li><li data-type="number" data-value="3">3</li></ol>',
  emptyArray: '<ol data-type="array"></ol>',
  object: '<dl data-type="object"><dt>foo</dt><dd data-type="string" data-value="bar" data-name="foo">bar</dd><dt>baz</dt><dd data-type="string" data-value="qux" data-name="baz">qux</dd></dl>',
  emptyObject: '<dl data-type="object"></dl>',
  objectArray: '<ol data-type="array"><li><dl data-type="object"><dt>foo</dt><dd data-type="number" data-value="1" data-name="foo">1</dd><dt>bar</dt><dd data-type="number" data-value="2" data-name="bar">2</dd><dt>baz</dt><dd data-type="number" data-value="3" data-name="baz">3</dd><dt>qux</dt><dd data-type="number" data-value="4" data-name="qux">4</dd></dl></li><li><dl data-type="object"><dt>foo</dt><dd data-type="number" data-value="5" data-name="foo">5</dd><dt>bar</dt><dd data-type="number" data-value="6" data-name="bar">6</dd><dt>baz</dt><dd data-type="number" data-value="7" data-name="baz">7</dd></dl></li><li><dl data-type="object"><dt>foo</dt><dd data-type="number" data-value="5" data-name="foo">5</dd><dt>bar</dt><dd data-type="string" data-value="foo" data-name="bar">foo</dd></dl></li></ol>',
  mixedArray: '<ol data-type="array"><li><dl data-type="object"></dl></li><li><dl data-type="object"><dt>foo</dt><dd data-type="number" data-value="1" data-name="foo">1</dd><dt>bar</dt><dd><ol data-type="array" data-name="bar"></ol></dd></dl></li></ol>',
  nestedArray: '<ol data-type="array"><li><ol data-type="array"><li><ol data-type="array"><li data-type="number" data-value="1">1</li><li data-type="number" data-value="2">2</li></ol></li><li><ol data-type="array"><li data-type="number" data-value="3">3</li><li data-type="number" data-value="4">4</li></ol></li></ol></li><li><ol data-type="array"><li><ol data-type="array"><li data-type="number" data-value="5">5</li><li data-type="number" data-value="6">6</li></ol></li><li><ol data-type="array"><li data-type="number" data-value="7">7</li><li data-type="number" data-value="8">8</li></ol></li></ol></li></ol>'
}

module.exports = { values, expects }
