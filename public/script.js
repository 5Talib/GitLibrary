// script.js


async function getUserData() {
  try {
    showLoader();
    const response = await fetch(`/users/${userName}`);
    const userData = await response.json();
    hideLoader();

    document.querySelector(".profile-photo img").src = userData.avatar_url;
    document.querySelector(".name").innerText = `${
      userData.name || "Not available"
    }`;
    document.querySelector(".bio").innerText = `${
      userData.bio || "Bio Not available"
    }`;
    document.querySelector(".location").innerText = `${
      userData.location || "Location Not available"
    }`;
    document.querySelector(".twitter").innerText = `Twitter: ${
      userData.twitter_username || "Not available"
    }`;
    document.querySelector(".github-link").innerHTML = userData.html_url;
  } catch (error) {
    console.log("Error fetching GitHub user data:", error);
    hideLoader();
  }
}

async function getRepos() {
  try {
    showLoader();
    const response = await fetch(`users/${userName}/repos`);
    const userRepo = await response.json();

    const repoContainer = document.querySelector(".repo-container");
    // console.log(userRepo[0]);
    userRepo.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const repoName = document.createElement("div");
      repoName.className = "repo-name";
      repoName.textContent = `${item.name}`;

      const repoDescription = document.createElement("div");
      repoDescription.className = "repo-description";
      repoDescription.textContent = `${
        item.description || "No description available"
      }`;

      const languageContainer = document.createElement("div");
      languageContainer.className = "languageContainer";

      for (const lang in repoLanguages) {
        const language = document.createElement("div");
        language.className = "language";
        language.textContent = lang;

        // Append the language div to the container
        languageContainer.appendChild(language);
      }

      card.appendChild(repoName);
      card.appendChild(repoDescription);
      card.appendChild(languageContainer);

      repoContainer.appendChild(card);
      hideLoader();
    });
  } catch (error) {
    console.log("Error fetching GitHub user repo:", error);
    hideLoader();
  }
}

function showLoader() {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
}

// Function to hide loader
function hideLoader() {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
}
