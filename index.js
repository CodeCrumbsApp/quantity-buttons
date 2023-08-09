/** @format */

;(function (global) {
	global.QuantityButtons = function ({
		quantityGroupClass = 'q-group',
		quantityIncrementButtonClass = 'q-inc',
		quantityDecrementButtonClass = 'q-dec',
		quantityNumberFieldClass = 'q-num',
		disableDecrementAtOne = true,
	}) {
		// Function to disable or enable the decrement button
		function manageDecButtonState(input, decButton) {
			if (disableDecrementAtOne) {
				if (parseInt(input.value, 10) <= 1) {
					decButton.setAttribute('disabled', '')
					decButton.classList.add('disabled')
				} else {
					decButton.removeAttribute('disabled')
					decButton.classList.remove('disabled')
				}
			}
		}

		// Check input values and set disabled state of decrement buttons on page load
		window.addEventListener('DOMContentLoaded', (event) => {
			let quantityGroups = document.querySelectorAll(`.${quantityGroupClass}`)
			quantityGroups.forEach((group) => {
				let input = group.querySelector(`.${quantityNumberFieldClass}`)
				let decButton = group.querySelector(`.${quantityDecrementButtonClass}`)
				manageDecButtonState(input, decButton)
			})
		})

		document.addEventListener('click', function (e) {
			let target = e.target

			// Bubble up until we find an element with a relevant class or reach the document
			while (
				target != null &&
				target.nodeType == Node.ELEMENT_NODE && // Only continue while target is an HTMLElement
				!target.classList.contains(quantityIncrementButtonClass) &&
				!target.classList.contains(quantityDecrementButtonClass)
			) {
				target = target.parentNode
			}

			// If the target or one of its parents has a relevant class, adjust the input value
			if (target != null && target.nodeType == Node.ELEMENT_NODE) {
				let input = target
					.closest(`.${quantityGroupClass}`)
					.querySelector(`.${quantityNumberFieldClass}`)
				let val = parseInt(input.value, 10)

				// Find the decrement button to manage its 'disabled' state
				let decButton = target
					.closest(`.${quantityGroupClass}`)
					.querySelector(`.${quantityDecrementButtonClass}`)
				if (target.classList.contains(quantityIncrementButtonClass)) {
					input.value = val + 1
				} else if (target.classList.contains(quantityDecrementButtonClass)) {
					input.value = Math.max(val - 1, 1)
				}

				// Update the disabled state of the decrement button
				manageDecButtonState(input, decButton)

				input.dispatchEvent(new Event('change'))
			}
		})
	}
})((globalThis.CodeCrumbs = globalThis.CodeCrumbs || {}))
