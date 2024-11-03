function resetErrorMessage(element) {
  element.textContent = "";
}

function badInput(input, successClass, errorClass) {
  input.classList.remove(successClass);

  input.classList.add(errorClass);
}

function successInput(input, successClass, errorClass) {
  input.classList.remove(errorClass);

  input.classList.add(successClass);
}

function hideInputError(input, errorClass, successClass) {
  successInput(input, successClass, errorClass);

  resetErrorMessage(input.nextElementSibling);
}

function showInputError(input, errorClass, successClass) {
  badInput(input, successClass, errorClass);

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

function disableSubmitButton(btn, className) {
  btn.classList.add(className);
  btn.disabled = true;
}

function enableSubmitButton(btn, className) {
  btn.classList.remove(className);
  btn.disabled = false;
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function toggleButtonState(inputs, submitBtn, inactiveButtonClass) {
  hasInvalidInput(inputs)
    ? disableSubmitButton(submitBtn, inactiveButtonClass)
    : enableSubmitButton(submitBtn, inactiveButtonClass);
}

function checkInputValidity(input, inputErrorClass, inputSuccessClass) {
  input.validity.valid
    ? hideInputError(input, inputErrorClass, inputSuccessClass)
    : showInputError(input, inputErrorClass, inputSuccessClass);
}

function setEventListeners(
  inputs,
  submitBtn,
  inactiveButtonClass,
  inputErrorClass,
  inputSuccessClass
) {
  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      toggleButtonState(inputs, submitBtn, inactiveButtonClass);

      checkInputValidity(input, inputErrorClass, inputSuccessClass);
    });
  });
}

function enableValidation(validationConfig) {
  validationConfig.forEach(
    ({
      form,
      submitBtn,
      inactiveButtonClass,
      inputs,
      inputErrorClass,
      inputSuccessClass,
    }) => {
      form.addEventListener("submit", (e) => e.preventDefault());

      disableSubmitButton(submitBtn, inactiveButtonClass);

      setEventListeners(
        inputs,
        submitBtn,
        inactiveButtonClass,
        inputErrorClass,
        inputSuccessClass
      );
    }
  );
}

function clearValidation({ inputs, removeClassNames }) {
  inputs.forEach((input) => {
    resetErrorMessage(input.nextElementSibling);

    removeClassNames.forEach((cl) => input.classList.remove(cl));
  });
}

export { enableValidation, clearValidation };
