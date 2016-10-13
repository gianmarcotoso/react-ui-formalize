import React from 'react'

class FakeForm extends React.Component {
	constructor() {
		super()

		this.handleFormValueChange = this.handleFormValueChange.bind(this)
		this.handleFormValueChangeAndThenSome = this.handleFormValueChangeAndThenSome.bind(this)
	}

	handleFormValueChange(event) {
		this.props.onFormValueChange(event.target.name, event.target.value)
	}

	handleFormValueChangeAndThenSome(event) {
		this.props.onMultipleFormValuesChange({
			stuff: this.props.data.stuff,
			more: event.target.value
		})
	}

	render() {
		return (
			<div>
				<input type="text" name="stuff" value={this.props.data.value || ''} onChange={this.handleFormValueChange} />
				<input type="text" name="more" value={this.props.data.more || ''} onChange={this.handleFormValueChangeAndThenSome} />
			</div>
		)
	}
}

export default FakeForm
