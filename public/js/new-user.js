const passwordBox1 = document.getElementById("passwordBox1");
const passwordBox2 = document.getElementById("passwordBox2");
const errorMessage = document.querySelector(".error");
const form = document.getElementById("newUserForm");

const displayError = () => {
  errorMessage.textContent = "Passwords must match";
};

const clearError = () => {
  errorMessage.textContent = "";
};

const passwordsMatch = () => {
  if (!passwordBox1.value && !passwordBox2.value) return true;

  return (
    (passwordBox1.value || passwordBox2.value) &&
    passwordBox1.value === passwordBox2.value
  );
};

const confirmPasswordsMatch = () => {
  if (!passwordsMatch()) {
    displayError();
  }
};

passwordBox1.addEventListener("focus", clearError);
passwordBox2.addEventListener("focus", clearError);

passwordBox1.addEventListener("blur", confirmPasswordsMatch);
passwordBox2.addEventListener("blur", confirmPasswordsMatch);

form.addEventListener("submit", (e) => {
  if (!passwordsMatch()) {
    e.preventDefault();
    displayError();
  }
});
