// TODO: Temporary hack to prevent us from having to enter our password
// repeatedly. Remove this from the final codebase
setTimeout(() => {
  try {
    document.getElementById("emailLogin").value = "sseveran@stevens.edu";
    document.getElementById("passwordLogin").value = "password";
    document.getElementById("loginBtn").click();
  } catch (e) {
    // noop
  }
}, 5000);
