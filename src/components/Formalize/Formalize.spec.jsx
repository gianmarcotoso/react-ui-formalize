import test from 'tape'
import sinon from 'sinon'
import { mount } from 'enzyme'
import React from 'react'
import Formalize from './Formalize'

/* SETUP JSDOM */
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
global.navigator = {
  userAgent: 'node.js'
};

/* THE ACTUAL TESTS */
test('it does its thing with a simple form', t => {
	t.plan(1)

	const FakeForm = class extends React.Component {
		constructor() {
			super()

			this.handleFormValueChange = this.handleFormValueChange.bind(this)
		}

		handleFormValueChange(event) {
			this.props.onFormValueChange(event.target.name, event.target.value)
		}

		render() {
			return (
				<div>
					<input type="text" name="stuff" value={this.props.data.value || ''} onChange={this.handleFormValueChange} />
				</div>
			)
		}
	}

	const FormalizedFakeForm = Formalize(FakeForm)

	const handleFormSubmit = data => {
		t.equals(data.stuff, 'hello')
		t.end()
	}

	const wrapper = mount(
		<FormalizedFakeForm 
			data={{value: ''}}
			onSubmit={handleFormSubmit}
		/>
	)

	wrapper.find('input').simulate('change', {target: {name: 'stuff', value: 'hello'}})

	wrapper.find('form').simulate('submit')
})

