import test from 'tape'
import sinon from 'sinon'
import getFormData from './getFormData'

import '../../../tests/setup'

global.FormData = window.FormData
global.FileList = window.FileList

test('it serializes a simple json object', t => {
	t.plan(3)

	const data = {
		name: 'Jimmy',
		age: 32,
		color: 'blue'
	}

	const formData = getFormData(data)

	t.equals(formData.get('name'), 'Jimmy')
	t.equals(formData.get('age'), '32')
	t.equals(formData.get('color'), 'blue')

	t.end()
})

test('it serializes an object with a file in it', t => {
	// I have no idea how to test this
	t.end()
})

test('it serializes an object with nested arrays/objects (as stringified JSON)', t => {
	t.plan(3)

	const data = {
		name: 'Jimmy',
		skills: [
		'code',
		'guitar'
		],
		preferences: {
			color: 'blue',
			drink: 'beer'
		}
	}

	const formData = getFormData(data)

	t.equals(formData.get('name'), 'Jimmy')
	t.equals(formData.get('skills'), JSON.stringify(data.skills))
	t.equals(formData.get('preferences'), JSON.stringify(data.preferences))

	t.end()
})
