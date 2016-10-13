import test from 'tape'
import sinon from 'sinon'
import { mount } from 'enzyme'
import React from 'react'
import Formalize from '../Formalize'
import Transform from './Transform.jsx'

import '../../../tests/setup'
import FakeForm from '../../../tests/FakeForm.jsx'

const FormalizedTransformedFakeForm = Transform(Formalize(FakeForm))

test('it transforms data as specified', t => {
	t.plan(1)

	const handleFormSubmit = data => {
		t.equals(data.stuff, 42)
		t.end()
	}

	const transformRules = {
		stuff: v => parseInt(v)
	}

	const wrapper = mount(
		<FormalizedTransformedFakeForm 
			data={{stuff: ''}}
			onSubmit={handleFormSubmit}

			transformRules={transformRules}
		/>
	)

	wrapper.find('input').first().simulate('change', {target: {name: 'stuff', value: '42ingoredstuff'}})

	wrapper.find('form').simulate('submit')
})
