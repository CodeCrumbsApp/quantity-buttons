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
			const isDisabled = disableDecrementAtOne && parseInt(input.value, 10) <= 1
			decButton.toggleAttribute('disabled', isDisabled)
			decButton.classList.toggle('disabled', isDisabled)
		}

		// Function to check input values and set disabled state of decrement buttons
		function checkInputValues() {
			const quantityGroups = document.querySelectorAll(`.${quantityGroupClass}`)
			quantityGroups.forEach((group) => {
				const input = group.querySelector(`.${quantityNumberFieldClass}`)
				const decButton = group.querySelector(
					`.${quantityDecrementButtonClass}`,
				)
				if (input && decButton) {
					manageDecButtonState(input, decButton)
				}
			})
		}

		// Check input values and set disabled state of decrement buttons on page load
		if (document.readyState !== 'loading') {
			checkInputValues()
		} else {
			document.addEventListener('DOMContentLoaded', checkInputValues)
		}

		document.addEventListener('click', function (e) {
			let target = e.target

			// Bubble up until we find an element with a relevant class or reach the document
			while (
				target &&
				target.nodeType == Node.ELEMENT_NODE &&
				(target.classList
					? !target.classList.contains(quantityIncrementButtonClass) &&
					  !target.classList.contains(quantityDecrementButtonClass)
					: true)
			) {
				target = target.parentNode
			}

			// If the target or one of its parents has a relevant class, adjust the input value
			if (target && target instanceof Element) {
				const input = target
					.closest(`.${quantityGroupClass}`)
					.querySelector(`.${quantityNumberFieldClass}`)
				const val = parseInt(input.value, 10)

				// Find the decrement button to manage its 'disabled' state
				const decButton = target
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

		// ====================== Code for Mutation Observer ======================
		// Create a mutation observer to watch for changes in the input elements
		const observer = new MutationObserver((mutationsList, observer) => {
			for (let mutation of mutationsList) {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'value'
				) {
					checkInputValues()
				}
			}
		})

		// Start observing the document with the configured parameters
		observer.observe(document, {
			attributes: true,
			subtree: true,
			attributeFilter: ['value'],
		})
	}
})((globalThis.CodeCrumbs = globalThis.CodeCrumbs || {}))
