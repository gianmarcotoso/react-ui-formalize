import { object } from 'prop-types'
import React from 'react'
import { Component } from 'react'

let Transform = WrappedComponent =>
	class extends Component {
		static propTypes = {
			transformRules: object
		}

		constructor(props) {
			super(props)

			this.handleTransform = this.handleTransform.bind(this)
		}

		handleTransform(data) {
			if (!data || data.constructor !== Object) {
				return data
			}

			if (!this.props.transformRules || this.props.transformRules.constructor !== Object) {
				return data
			}

			const transformedData = Object.keys(data).reduce((result, property) => {
				if (data.hasOwnProperty(property) && this.props.transformRules.hasOwnProperty(property)) {
					const transformFunction = this.props.transformRules[property]

					result[property] = transformFunction(data[property])
				} else {
					result[property] = data[property]
				}

				return result
			}, {})

			return transformedData
		}

		render() {
			return <WrappedComponent ref="inner" {...this.props} transform={this.handleTransform} />
		}
	}

export default Transform
