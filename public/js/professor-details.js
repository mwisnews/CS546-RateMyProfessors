const inputsToDisable = document.querySelectorAll('[should-disable="true"]');

for (const input of inputsToDisable) {
  input.disabled = true;
}
