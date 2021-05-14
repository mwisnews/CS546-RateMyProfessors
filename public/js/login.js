const logoutLink = document.querySelector('[href="/logout"]');

if (
  window.location.href.endsWith("login") ||
  window.location.href.endsWith("logout")
) {
  // noop
} else {
  logoutLink.style.display = "block";
}
