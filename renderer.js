const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("token-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const token = document.getElementById("token").value;
    ipcRenderer.send("generate-link", token);
  });

  document.querySelector("#help a").addEventListener("click", (event) => {
    event.preventDefault();
    ipcRenderer.send("open-external-link", event.target.href);
  });
});

ipcRenderer.on("link-generated", (event, result) => {
  const resultDiv = document.getElementById("result");
  if (result.success) {
    resultDiv.innerHTML = `<p>Your friend request link: <span class="link">${result.link}</span></p>`;

    const linkSpan = resultDiv.querySelector(".link");
    linkSpan.addEventListener("click", (e) => {
      e.preventDefault();
      ipcRenderer.send("generate-link", document.getElementById("token").value);
    });
  } else {
    resultDiv.innerHTML = `<p class="error">Error: ${result.error}</p>`;
  }
});
