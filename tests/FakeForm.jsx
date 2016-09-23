import React from 'react'

class FakeForm extends React.Component {
	constructor() {
		super()

		this.handleFormValueChange = this.handleFormValueChange.bind(this)
	}

	handleFormValueChange(event) {
		this.props.onFormValueChange(event.target.name, event.target.value)
	}

	render() {
		return (
			<div>
				<input type="text" name="stuff" value={this.props.data.value || ''} onChange={this.handleFormValueChange} />
			</div>
		)
	}
}

export default FakeForm
