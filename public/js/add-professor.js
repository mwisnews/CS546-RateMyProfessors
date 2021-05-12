const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const method = "post";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const professorFirstNameBox = document.getElementById(
    "professorFirstNameBox"
  );
  const professorLastNameBox = document.getElementById("professorLastNameBox");

  const body = JSON.stringify({
    professorFirstName: professorFirstNameBox.value,
    professorLastName: professorLastNameBox.value,
  });

  const response = await fetch(window.location.href, {
    method,
    headers,
    body,
  });

  const { error, redirect } = await response.json();

  if (error) {
    document.querySelector(".error").textContent = error;
  } else {
    window.location.href = redirect;
  }
});
