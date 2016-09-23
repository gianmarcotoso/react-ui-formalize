import React from 'react'
import { Component } from 'react'

import isEqual from 'lodash.isequal'

let Formalize = Content => class extends Component {
	static defaultProps = {
		wrap: true
	}

	static propTypes = {
		data: React.PropTypes.object.isRequired,
		wrap: React.PropTypes.bool,

		onSubmit: React.PropTypes.func,
		onChange: React.PropTypes.func,
		onReset: React.PropTypes.func,
		
		validate: React.PropTypes.func,
		transform: React.PropTypes.func
	}

	constructor(props) {
		super(props)

		this.state = {
			data: {}
		}

		this.handleFormValueChange = this.handleFormValueChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleFormReset = this.handleFormReset.bind(this)
	}

	componentDidMount() {
		this.setState({data: this.props.data || {}})
	}

	componentWillReceiveProps(props) {
		if (!isEqual(props.data, this.props.data)) {
			this.setState({data: props.data || {}})

			if (this.props.clearValidationStatus) {
				this.props.clearValidationStatus()
			}
		}
	}

	handleFormValueChange(property, value) {
		return new Promise(resolve => {
			const data = {
				...this.state.data,
				[property]: value
			}

			if (this.props.clearValidationStatus) {
				this.props.clearValidationStatus()
			}

			this.setState({data}, () => {
				if (this.props.onChange) {
					this.props.onChange(property, value)
				}

				resolve(data)
			})
		})
	}

	handleFormSubmit(event) {
		event.preventDefault()

		const data = this.props.transform ? this.props.transform(this.state.data) : this.state.data

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
				<form onSubmit={this.handleFormSubmit} onReset={this.handleFormReset} className={this.props.formClassName} ref="form">
					<Content {...this.props} onFormValueChange={this.handleFormValueChange} data={this.state.data} />
				</form>
			)
		}

		return (
			<div className={this.props.formClassName}>
				<Content {...this.props} onFormValueChange={this.handleFormValueChange} data={this.state.data} />
			</div>
		)
	}
}

export default Formalize
