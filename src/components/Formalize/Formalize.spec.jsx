import test from 'tape'
import sinon from 'sinon'
import { mount } from 'enzyme'
import React from 'react'
import Formalize from './Formalize'

import '../../tests/setup'
import FakeForm from '../../tests/FakeForm.jsx'

const FormalizedFakeForm = Formalize(FakeForm)

test('it does its thing with a simple form', t => {
	t.plan(1)

	const handleFormSubmit = data => {
		t.equals(data.stuff, 'hello')
		t.end()
	}

	const wrapper = mount(
		<FormalizedFakeForm 
			data={{stuff: ''}}
			onSubmit={handleFormSubmit}
		/>
	)

	wrapper.find('input').simulate('change', {target: {name: 'stuff', value: 'hello'}})

	wrapper.find('form').simulate('submit')
})

test('it does its thing with a simple form calling the validator', t => {
	t.plan(2)

	const handleFormSubmit = data => {
		t.equals(data.stuff, 'hello')
		t.assert(spy.calledOnce)
	}

	const validator = (data) => true
	
	const spy = sinon.spy(validator)

	const wrapper = mount(
		<FormalizedFakeForm 
			data={{stuff: ''}}
			onSubmit={handleFormSubmit}
			validate={spy}
		/>
	)

	wrapper.find('input').simulate('change', {target: {name: 'stuff', value: 'hello'}})
	wrapper.find('form').simulate('submit')
})

test('it does its thing with a simple form calling the transformer', t => {
	t.plan(2)

	const handleFormSubmit = data => {
		t.equals(data.stuff, 'hello')
		t.assert(spy.calledOnce)
	}

	const transformer = (data) => data
	
	const spy = sinon.spy(transformer)

	const wrapper = mount(
		<FormalizedFakeForm 
			data={{stuff: ''}}
			onSubmit={handleFormSubmit}
			transform={spy}
		/>
	)

	wrapper.find('input').simulate('change', {target: {name: 'stuff', value: 'hello'}})
	wrapper.find('form').simulate('submit')
})
