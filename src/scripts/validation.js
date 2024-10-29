let config = null;

function isFormValid() {
  const { form } = config;

  return form.checkValidity();
}

function isInputValid(input) {
  return input.validity.valid;
}

function disabledButton() {
  const { submit, inactiveButtonClass } = config;

  submit.setAttribute("disabled", true);
  submit.classList.add(inactiveButtonClass);
}
function initialStateStyleInput(input) {
  const { inputErrorClass, inputSuccessClass } = config;

  removeClass(input, inputErrorClass);
  removeClass(input, inputSuccessClass);
}

function undisabledButton() {
  const { submit, inactiveButtonClass } = config;

  submit.removeAttribute("disabled");
  submit.classList.remove(inactiveButtonClass);
}

function resetErrorMessage(element) {
  element.textContent = "";
}

function addClass(elem, className) {
  elem.classList.add(className);
}

function removeClass(elem, className) {
  elem.classList.remove(className);
}

function badInput(input) {
  const { inputErrorClass, inputSuccessClass } = config;

  removeClass(input, inputSuccessClass);
  addClass(input, inputErrorClass);
}

function successInput(input) {
  const { inputErrorClass, inputSuccessClass } = config;

  removeClass(input, inputErrorClass);
  addClass(input, inputSuccessClass);
}

function handlerInputValidation(e) {
  const input = e.target;

  isFormValid() ? undisabledButton() : disabledButton();

  if (isInputValid(input)) {
    successInput(input);

    resetErrorMessage(input.nextElementSibling);
  } else {
    badInput(input);

    setErrorMessage(input);
  }
}

function setErrorMessage(input) {
  const errorContainer = input.nextElementSibling;

  const { patternMismatch, valueMissing, tooLong, tooShort, typeMismatch } =
    input.validity;

  let errors = [];

  resetErrorMessage(errorContainer);

  patternMismatch && errors.push(input.dataset.error);

  typeMismatch && errors.push(input.dataset.error);

  valueMissing && errors.push("Обязательно к заполнению");
  tooLong &&
    errors.push(
      `Не более ${input.getAttribute("maxlength")} символов, сейчас: ${
        input.value.length
      }`
    );

  tooShort &&
    errors.push(
      `Не менее ${input.getAttribute("minlength")} символов, сейчас: ${
        input.value.length
      }`
    );

  errors.forEach((err, idx) => {
    errorContainer.textContent += `${idx + 1}. ${err}\r\n`;
  });

  errors = [];
}

function enableValidation(configForm, fn) {
  const { inputs, form } = (config = { ...configForm });

  disabledButton();

  form.reset();

  inputs.forEach((input) => {
    input.addEventListener("input", handlerInputValidation);

    initialStateStyleInput(input);

    resetErrorMessage(input.nextElementSibling);
  });
}

export { enableValidation, handlerInputValidation, initialStateStyleInput };
