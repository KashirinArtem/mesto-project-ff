import { closeModal } from "./modal";

function handlerForm(form, inputsNames) {
  const formData = new FormData(form);

  const obj = {};

  inputsNames.forEach((name) => {
    obj[name] = formData.get(name);
  });

  form.reset();

  closeModal();

  return obj;
}

export { handlerForm };
