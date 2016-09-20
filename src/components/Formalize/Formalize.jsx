import React from 'react'
import { Component } from 'react'

import isEqual from 'lodash.isequal'

let Formalize = Content => class extends Component {
    static defaultProps = {
        wrap: true
    }

	static propTypes = {
		wrap: React.PropTypes.bool
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

    async handleFormValueChange(property, value) {
		const data = {
			...this.state.data,
			[property]: value
		}

		if (this.props.clearValidationStatus) {
			this.props.clearValidationStatus()
		}

        this.setState({data}, Promise.resolve)
    }

    handleFormSubmit(event) {
        event.preventDefault()

        if (this.props.validate && !this.props.validate(this.state.data)) {
            return
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.data)
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
