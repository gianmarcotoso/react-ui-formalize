import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

/* SETUP ENZYME */
configure({ adapter: new Adapter() })

/* SETUP JSDOM */
var jsdom = require('jsdom')
const { JSDOM } = jsdom

const { document } = new JSDOM('').window

var exposedProperties = ['window', 'navigator', 'document']

global.document = document
global.window = document.defaultView
Object.keys(document.defaultView).forEach(property => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property)
		global[property] = document.defaultView[property]
	}
})
global.navigator = {
	userAgent: 'node.js'
}
