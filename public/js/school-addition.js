const schoolState = document.querySelector('[name="schoolStateHidden"]').value;

const option = document.querySelector(`option[value="${schoolState}"]`);

if (option) option.selected = true;

const educationLevel = document.querySelector('[name="educationLevelHidden"]')
  .value;

const radio = document.querySelector(`input[value="${educationLevel}"]`);

if (radio) radio.checked = true;
