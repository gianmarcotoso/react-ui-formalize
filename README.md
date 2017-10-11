# React UI Formalize

A set of Higher Order Components to painlessly handle forms with ReactJS. 

## Tell me more

This repository contains a set of 3 HoCs that will save you a lot of time and pain when handling forms with ReactJS. It does _not_ use anything other than ReactJS, so you don't need to interface it with your store(s) or whatever you do to handle your application state. Just put in your form, get your data out, be happy! 

## The components

Let's find out what's in the box...

### Formalize

The main component of this package is `Formalize`. This HoC wraps *any* component and converts it into a form, keeping track of the input values into its internal state. It can handle pretty much anything you throw at it, provided you follow one simple rule: when something in the form is supposed to change, you need to call the `onFormValueChange` method passed to your component as a prop by the HoC. Let's see an example of how this thing is supposed to work:

```javascript
// My Component
import React from 'react'
import { Formalize } from 'react-ui-formalize'

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
- `onChange`: Receives a function which is called with the name and the new value of the changed data, as well as the complete form data as its third parameter. Use this if you need to do something on the parent when a value changes; this function is also called after `onMultipleFormValuesChange` and receives an array of properties and an array of values as its first two parameters, while the third remains unchanged;
- `onReset`: Receives a function which is called with no parameters whenever the form resets;
- `transform`: Receives a function which is called right before `onSubmit` and has data as its only parameter. If defined, it **must** return an object, and can be used to transform the form data before handing it to onSubmit. 
- `validate`: Receives a function which is called right before `onSubmit`, but **after** `transform`. It gets the (transformed) data as its only parameter and, if defined, must return either `true` or `false` to tell `Formalize` if the data has passed validation. If it returns `false`, `onSubmit` is not called.

Any wrapped component will receive the following props:

- `onFormValueChange`: a callback that you **must** call whenever a value in your form changes in order to let `Formalize` know about it. Call it from within your event handlers, passing it the `name` of the property that has changed and its new `value`;
- `onMultipleFormValuesChange`: a callback that behaves as the previous one, but where you can simply pass an object containing the mutations;
-`data`: the object containing the data saved within `Formalize` internal state. Use it to populate your form's input `value`s. 

### Transform

The transform HoC can be used to provide Formalized with a default implementation of the `transform` property. If you wrap the Formalized component with transform, you can pass a `transformRules` property to it, where you define how each key should be trasformed (you can omit those you want to leave untouched):

```javascript
// My Component
import React from 'react'
import { Formalize, Transform } from 'react-ui-formalize'

class MyComponent extends React.Component {
	/* ... */
}

export default Transform(Formalize(MyComponent))

// ... and in the parent:
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

					transformRules={{
						age: v => parseInt(v)
					}}
				/>
			</div>
		)
	}
}
```

Using `Transform` will ensure that all the values will be passed to `onSubmit` after being transformed, so you can use it if you need to typecase values of do other pre-submit (and pre-validation!) operations on them

### Validate

You can see this HoC as an addon to both `Formalize` and `Transform`. It handles form validation, and already provides an implementation for the `validate` property so you don't have to write one. Just as `Transform`, it allows you to pass another property called `validationRules` where you can define how to validate your `data` object. You can leave out the keys you don't want validated.

```javascript
// My Component
import React from 'react'
import { Formalize, Transform, Validate } from 'react-ui-formalize'

class MyComponent extends React.Component {
	/* ... */
	render() {
		return (
			<div>
				<div>
					<label>Name: </label>
					<input type="text" name="name" onChange={this.handleFormValueChange.bind(this)} value={this.props.data.name} />
					{this.props.validationStatus.name === false ? (
						<small class="error">Your name must be at least 3 characters long</small>
					) : null}
				</div>
				/* ... */
			</div>
	   )
	}
}

export default Validate(Transform(Formalize(MyComponent)))

// ... and in the parent:
class Parent extends React.Component {
	/* ... */
	handleSomeoneFormSubmit(data) {
		console.log('Yay, the data has been updated!', data)
	}

	handleValidationFail(validationStatus) {
		console.log('Something went awry...', validationStatus)
	}

	render() {
		return (
			<div>
				/* ... */
				<MyComponent 
					data={this.props.someone}
					onSubmit={this.handleSomeoneFormSubmit.bind(this)}

					transformRules={{
						age: v => parseInt(v)
					}}

					onValidationFail={this.handleValidationFail.bind(this)}
					validationRules={{
						name: v => v && v.length > 3,
						age: v => v < 150 && v >= 0
					}}
				/>
			</div>
		)
	}
}
```

If the validation process fails, the `onValidationFail` callback property is called (if present). This function will receive a `validationStatus` object as its only parameter, and will contain information about the validation status of each validated element in the form. The Formalized component will also have a `validationStatus` prop always available, to facilitate the handling of validation styling within the component itself. 

Remember: data is validated **after** being transformed, not before!

## Contributing

Feel free to open issues or make pull requests if something is wrong or you feel you can make an improvement!

## License

MIT