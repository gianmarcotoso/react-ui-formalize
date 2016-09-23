const getFormData = (data) => {
	let formData = new FormData()

	Object.keys(data).forEach( p => {
		let value = data[p]
		if (value === null || typeof value === 'undefined') {
			return
		}

		if (value && value.constructor === FileList) {
			if (value.length === 1) {
				formData.append(p, value.item(0))

				return
			}

			for (let i = 0; i < value.length; i++) {
				formData.append(`${p}_${i}`, value.item(i))
			}

			return
		}

		if (value && (value.constructor === Object || Array.isArray(value))) {
			formData.append(p, JSON.stringify(value))

			return
		}

		formData.append(p, value)
	} )

	return formData
}

export default getFormData
