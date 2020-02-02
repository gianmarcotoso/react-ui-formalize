import isEqual from 'lodash.isequal'
import { bool, func, object } from 'prop-types'
import React from 'react'
import { Component } from 'react'

let Formalize = Content =>
	class extends Component {
		static defaultProps = {
			wrap: true,
		}

		static propTypes = {
			data: object.isRequired,
			wrap: bool,

			onSubmit: func,
			onChange: func,
			onReset: func,

			validate: func,
			transform: func,
		}

		constructor(props) {
			super(props)

			this.state = {
				data: {},
			}

			this.handleFormValueChange = this.handleFormValueChange.bind(this)
			this.handleMultipleFormValuesChange = this.handleMultipleFormValuesChange.bind(
				this,
			)
			this.handleFormSubmit = this.handleFormSubmit.bind(this)
			this.handleFormReset = this.handleFormReset.bind(this)
		}

		componentDidMount() {
			this.setState({ data: this.props.data || {} })
		}

		componentDidUpdate(props) {
			if (!isEqual(props.data, this.props.data)) {
				this.setState({ data: props.data || {} })

				if (this.props.clearValidationStatus) {
					this.props.clearValidationStatus()
				}
			}
		}

		handleMultipleFormValuesChange(values) {
			return new Promise(resolve => {
				const data = {
					...this.state.data,
					...values,
				}

				if (this.props.clearValidationStatus) {
					this.props.clearValidationStatus()
				}

				this.setState({ data }, () => {
					if (this.props.onChange) {
						this.props.onChange(
							Object.keys(values),
							Object.keys(values).map(k => values[k]),
							this.state.data,
						)
					}

					resolve(data)
				})
			})
		}

		handleFormValueChange(property, value) {
			return new Promise(resolve => {
				const data = {
					...this.state.data,
					[property]: value,
				}

				if (this.props.clearValidationStatus) {
					this.props.clearValidationStatus()
				}

				this.setState({ data }, () => {
					if (this.props.onChange) {
						this.props.onChange(property, value, this.state.data)
					}

					resolve(data)
				})
			})
		}

		handleFormSubmit(event) {
			event.preventDefault()
			event.stopPropagation()

			const data = this.props.transform
				? this.props.transform(this.state.data)
				: this.state.data

			if (this.props.validate && !this.props.validate(data)) {
				return
			}

			if (this.props.onSubmit) {
				this.props.onSubmit(data)
			}
		}

		handleFormReset(event) {
			if (this.props.onReset) {
				this.props.onReset(event)
			}
		}

		render() {
			if (this.props.wrap) {
				return (
					<form
						onSubmit={this.handleFormSubmit}
						onReset={this.handleFormReset}
						className={this.props.formClassName}
						ref="form"
					>
						<Content
							{...this.props}
							onMultipleFormValuesChange={
								this.handleMultipleFormValuesChange
							}
							onFormValueChange={this.handleFormValueChange}
							data={this.state.data}
						/>
					</form>
				)
			}

			return (
				<div className={this.props.formClassName}>
					<Content
						{...this.props}
						onFormSubmit={this.handleFormSubmit}
						onFormReset={this.handleFormReset}
						onMultipleFormValuesChange={
							this.handleMultipleFormValuesChange
						}
						onFormValueChange={this.handleFormValueChange}
						data={this.state.data}
					/>
				</div>
			)
		}
	}

export default Formalize
