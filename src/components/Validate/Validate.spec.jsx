import test from 'tape'
import sinon from 'sinon'
import { mount } from 'enzyme'
import React from 'react'
import Formalize from '../Formalize'
import Transform from '../Transform'
import Validate from './Validate'

import '../../../tests/setup'
import FakeForm from '../../../tests/FakeForm.jsx'

const FormalizedTransformedValidatedFakeForm = Validate(Transform(Formalize(FakeForm)))

test('it validates data as specified', t => {
	t.plan(2)

	const handleFormSubmit = data => {
		// send to server or whatever
	}

	const handleValidationFail = failures => {
		// do stuff to handle failure
	}

	const submitSpy = sinon.spy(handleFormSubmit)
	const validationFailSpy = sinon.spy(handleValidationFail)

	const transformRules = {
		stuff: v => parseInt(v)
	}

	const validationRules = {
		stuff: v=> v > 40
	}

	const wrapper = mount(
		<FormalizedTransformedValidatedFakeForm 
			data={{stuff: ''}}
			onSubmit={submitSpy}
			onValidationFail={validationFailSpy}

			transformRules={transformRules}
			validationRules={validationRules}
		/>
	)

	
	wrapper.find('input').first().simulate('change', {target: {name: 'stuff', value: 40}})
	wrapper.find('form').simulate('submit')

	t.assert(validationFailSpy.calledOnce)
	
	wrapper.find('input').first().simulate('change', {target: {name: 'stuff', value: '42ingoredstuff'}})
	wrapper.find('form').simulate('submit')

	t.assert(submitSpy.calledOnce)
})
