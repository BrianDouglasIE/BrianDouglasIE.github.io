async function sendPostRequest(path, title) {
  const url =
    "http://analytics.atlantic-design.ie/websites/1/record-page-visit";

  const payload = {
    path,
    title,
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://briandouglas.ie",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw error;
  }
}

window.addEventListener("load", () => {
  const path = window.location.pathname;
  const title = document.title;
  sendPostRequest(path || "/", title)
    .then((response) => console.log("Thank you for visiting"))
    .catch((error) => console.error("Failure:", error));
});
