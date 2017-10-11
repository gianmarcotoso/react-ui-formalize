import { func, object } from 'prop-types'
import React from 'react'
import { Component } from 'react'

let ValidationStatusItem = (key, validated) => ({ key, validated })

let Validate = Validatable =>
	class extends Component {
		static propTypes = {
			validationRules: object.isRequired,
			onValidationFail: func
		}

		constructor(props) {
			super(props)

			this.state = {
				validationStatus: {}
			}

			this.validate = this.validate.bind(this)
			this.clearValidationStatus = this.clearValidationStatus.bind(this)
		}

		componentDidMount() {
			this.clearValidationStatus()

			this.getData = (...args) => this.refs.inner.getData(args)
		}

		validate(data) {
			let validationStatusArray = Object.keys(this.props.validationRules).map(key => {
				const validationFunction = this.props.validationRules[key]

				return ValidationStatusItem(key, !!validationFunction(data[key], data))
			})

			let validationStatus = validationStatusArray.reduce((r, i) => {
				r[i.key] = i.validated

				return r
			}, {})

			this.setState({
				validationStatus
			})

			const validationHasPassed = validationStatusArray.filter(r => r.validated === false).length === 0

			if (!validationHasPassed && this.props.onValidationFail) {
				this.props.onValidationFail(validationStatus)
			}

			return validationHasPassed
		}

		clearValidationStatus() {
			if (!this.props.validationRules) {
				console.warn('Validation rules are not set!')
				return
			}

			this.setState({
				validationStatus: Object.keys(this.props.validationRules)
					.map(key => ValidationStatusItem(key, true))
					.reduce((r, i) => {
						r[i.key] = i.validated

						return r
					}, {})
			})
		}

		render() {
			return (
				<Validatable
					ref="inner"
					{...this.props}
					validationStatus={this.state.validationStatus}
					validate={this.validate}
					clearValidationStatus={this.clearValidationStatus}
				/>
			)
		}
	}

export default Validate
