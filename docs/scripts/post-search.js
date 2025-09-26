document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("post-search");
  const posts = document.querySelectorAll("#posts li");
  const matchCount = document.getElementById("match-count");

  function updateMatches() {
    const query = searchInput.value.toLowerCase();
    let count = 0;

    posts.forEach((li) => {
      const title = li.querySelector("h3").textContent.toLowerCase();
      const excerpt = li.querySelector("div")?.textContent.toLowerCase() || "";

      if (title.includes(query) || excerpt.includes(query)) {
        li.style.display = "";
        count++;
      } else {
        li.style.display = "none";
      }
    });

    if(query.length) {
      matchCount.textContent = `${count} match${count !== 1 ? "es" : ""}`;
    } else {
      matchCount.textContent = ``;
    }
  }

  searchInput.addEventListener("input", updateMatches);

  // initialize count
  updateMatches();
});
