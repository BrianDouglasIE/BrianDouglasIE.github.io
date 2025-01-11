async function sendPostRequest(path, title) {
  const url =
    "https://analytics.atlantic-design.ie/websites/1/record-page-visit";

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
  sendPostRequest("/example/path", "Example Title")
    .then((response) => console.log("Thank you for visiting"))
    .catch((error) => console.error("Failure:", error));
});
