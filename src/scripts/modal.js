const keydown = ["Escape"];
let closeConfig = null;

function removeListener(
  listeners,
  handler,
  isDocumentSetListener = false,
  documentTypeEvent = "click"
) {
  listeners.forEach((listener) =>
    listener.removeEventListener("click", handler)
  );

  isDocumentSetListener &&
    document.removeEventListener(documentTypeEvent, handler);
}

function openModal(node, classAdd, configForClose = null) {
  node.classList.add(...classAdd);

  if (configForClose) closeConfig = configForClose;
}

function closeModal(evt, classNames = [], modalNode = null) {
  evt.stopPropagation();

  const isEquel = evt.target === evt.currentTarget;
  const isParamsExist = classNames.length && modalNode;

  const {
    modal,
    classRemove,
    listeners,
    isDocumentSetListener,
    documentTypeEvent,
  } = closeConfig;

  if (isEquel || keydown.includes(evt.key)) {
    // Функция вызвана со всеми параметрами
    isParamsExist &&
      classNames.forEach((item) => modalNode.classList.remove(item));

    // Функция передана как ссылка и в openModal должен быть передан configForClose
    !isParamsExist && closeModal(evt, classRemove, modal);

    closeConfig &&
      removeListener(
        listeners,
        closeModal,
        isDocumentSetListener,
        documentTypeEvent
      );

    closeConfig = null;
  }
}

export { openModal, closeModal, removeListener };
