import { callNumber } from "./pha.js";

const form = document.getElementById("pha-form");
const surnameInput = document.getElementById("sobrenome");
const givenInput = document.getElementById("nome");
const resultEl = document.getElementById("numero");
const copyBtn = document.getElementById("copiar");
const statusEl = document.getElementById("status");

const EMPTY_COPY = "Informe sobrenome e nome.";
const MISSING_SURNAME = "Falta o sobrenome.";
const MISSING_GIVEN = "Falta o nome.";
const NOT_FOUND = "Não encontramos um número para este nome. Confira a grafia.";

function currentNames() {
  return {
    surname: surnameInput.value.trim(),
    given: givenInput.value.trim(),
  };
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", isError);
}

function render() {
  const { surname, given } = currentNames();
  copyBtn.disabled = true;
  resultEl.tabIndex = -1;

  if (!surname && !given) {
    resultEl.textContent = EMPTY_COPY;
    resultEl.classList.add("is-empty");
    return;
  }
  if (!surname) {
    resultEl.textContent = MISSING_SURNAME;
    resultEl.classList.add("is-empty");
    return;
  }
  if (!given) {
    resultEl.textContent = MISSING_GIVEN;
    resultEl.classList.add("is-empty");
    return;
  }

  const n = callNumber(surname, given);
  if (n < 0) {
    resultEl.textContent = NOT_FOUND;
    resultEl.classList.add("is-empty");
    return;
  }

  resultEl.textContent = String(n);
  resultEl.classList.remove("is-empty");
  resultEl.tabIndex = 0;
  copyBtn.disabled = false;
}

async function copyNumber(event) {
  event.preventDefault();
  const { surname, given } = currentNames();
  if (!surname || !given) {
    render();
    return;
  }
  const n = callNumber(surname, given);
  if (n < 0) {
    render();
    return;
  }
  const text = String(n);
  const copied = await writeClipboard(text);
  if (copied) {
    setStatus(`Número ${text} copiado.`);
    return;
  }
  resultEl.focus();
  setStatus("Não foi possível copiar. Selecione o número e copie manualmente.", true);
}

function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => copyViaExecCommand(text)
    );
  }
  return Promise.resolve(copyViaExecCommand(text));
}

function copyViaExecCommand(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.setAttribute("aria-hidden", "true");
  input.style.position = "fixed";
  input.style.insetInlineStart = "-9999px";
  document.body.append(input);
  input.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  input.remove();
  return ok;
}

form.addEventListener("input", () => {
  setStatus("");
  render();
});

form.addEventListener("submit", copyNumber);

form.addEventListener("reset", () => {
  queueMicrotask(() => {
    setStatus("");
    render();
    surnameInput.focus();
  });
});

render();
