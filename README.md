# React UI Form

A set of Higher Order Components to painlessly handle forms with ReactJS. 

## Tell me more

This repository contains a set of 3 HoCs that will save you a lot of time and pain when handling forms with ReactJS. It does _not_ use anything other than ReactJS, so you don't need to interface it with your store(s) or whatever you do to handle your application state. Just put in your form, get your data out, be happy! Now, for what's in the box...

## Formalize

The main component of this package is `Formalize`. This HoC wraps *any* component and converts it into a form, keeping track of the input values into its internal state. It can handle pretty much anything you throw at it, provided you follow one simple rule: when something in the form is supposed to change, you need to call the `onFormValueChange` method passed to your component as a prop by the HoC. Let's see an example of how this thing is supposed to work:

```javascript
// My Component
import React from 'react'
import { Formalize } from 'react-ui-form'

class MyComponent extends React.Component {
	handleFormValueChange(event) {
		this.props.onFormValueChange(event.target.name, event.target.value)
	}

	render() {
		return (
			<div>
				<div>
					<label>Name: </label>
					<input type="text" name="name" onChange={this.handleFormValueChange.bind(this)} value={this.props.data.name} />
				</div>
				<div>
					<label>Age: </label>
					<input type="number" name="age" onChange={this.handleFormValueChange.bind(this)} value={this.props.data.age} />
				</div>
				<div>
					<label>Color: </label>
					<input type="text" name="color" onChange={this.handleFormValueChange.bind(this)} value={this.props.data.color} />
				</div>
				<button type="submit">Go!</button>
			</div>
	   )
	}
}

export default Formalize(MyComponent)

// ... meanwhile, on the parent component

class Parent extends React.Component {
	/* ... */
	handleSomeoneFormSubmit(data) {
		console.log('Yay, the data has been updated!', data)
	}

	render() {
		return (
			<div>
				/* ... */
				<MyComponent 
					data={this.props.someone}
					onSubmit={this.handleSomeoneFormSubmit.bind(this)}
				/>
			</div>
		)
	}
}
```

You might have noticed a couple of things:

- Data is passed from the parent to the child as a prop, and used by the single inputs as a value for their `value` property. `Formalize` takes care of providing its wrapped component a copy (which it stores in its own state) and updates it everytime `onFormValueChange` is called. The original `data` passed from the parent is *never* touched, and if the value for that property changes, `Formalize` takes care of updating the form.
- Since `Formalize` wraps the component in a form, you can attach a callback to the `onSubmit` property of your component. It will be called whenever the `submit` event is fired from the form. If you don't want to wrap, simply pass `wrap={false}`.

Here is a list of all the props you can pass to a component wrapped with `Formalize`:

- `data` (**required**): The initial data passed to the form. This can change during the lifetime of your parent component and, if it does, it will propagate to the Formalized component. Don't pass an empty object defined inline, it will make you cry;
- `wrap`: Defaults to `true`. Tells Formalize whether to wrap your component in a `form` element or not;
- `onSubmit`: Receives a function which is called with the current `data` as its only paramter when the form is submitted. Use this to dispatch actions or do your thing with the user's input;
- `onChange`: Receives a function which is called with the name and the new value of the changed data. Use this if you need to do something on the parent when a value changes;
- `onReset`: Receives a function which is called with no parameters whenever the form resets;
- `transform`: Receives a function which is called right before `onSubmit` and has data as its only parameter. If defined, it **must** return an object, and can be used to transform the form data before handing it to onSubmit. 
- `validate`: Receives a function which is called right before `onSubmit`, but **after** `transform`. It gets the (transformed) data as its only parameter and, if defined, must return either `true` or `false` to tell `Formalize` if the data has passed validation. If it returns `false`, `onSubmit` is not called.
