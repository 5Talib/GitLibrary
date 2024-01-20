import axios, { HttpStatusCode } from "axios";
import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import "dotenv/config";
// import { fetchGitHubUserData, fetchGitHubUserRepo } from "./index.js";

const __dirname = dirname("");
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

var globalUser;

app.get("/", (req, res) => {
  res.sendFile("/public/landingPage.html", { root: __dirname });
});

app.get("/user/:username", async (req, res) => {
  try {
    const userName = req.params.username;

    const userResponse = await axios.get(
      `https://api.github.com/users/${userName}`,
      {
        headers: {
          "Content-Type": "application/vnd.github+json",
          Authorization: `Bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
        },
      }
    );
    const userData = userResponse.data;
    // res.redirect("user.html");
    res.status(HttpStatusCode.Ok).send({
      avatar_url: userData.avatar_url,
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
      twitter_username: userData.twitter_username,
      html_url: userData.html_url,
    });
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    res.sendStatus(HttpStatusCode.InternalServerError);
  }
});

app.get("/username/:username", (req, res) => {
  globalUser = req.params.username;
  res.sendFile("/public/user.html", { root: __dirname });
});

app.post("/global", (req, res) => {
  res.json(globalUser);
});

app.post("/user/:username/repos", async (req, res) => {
  try {
    const { page, pageSize = 10 } = req.body;
    const userName = req.params.username;
    const repoResponse = await axios.get(
      `https://api.github.com/users/${userName}/repos`,
      {
        headers: {
          "Content-Type": "application/vnd.github+json",
          Authorization: `Bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
        },
      }
    );
    const totalRepos = repoResponse.data.length;
    const totalPages = Math.ceil(totalRepos / pageSize);
    const repos = [];
    const skip = (page - 1) * pageSize;
    const limit = skip + pageSize;

    for (let i = skip; i < totalRepos && i < limit; i++) {
      const name = repoResponse.data[i].name;
      const langResponse = await axios.get(
        `https://api.github.com/repos/${userName}/${name}/languages`,
        {
          headers: {
            "Content-Type": "application/vnd.github+json",
            Authorization: `Bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
          },
        }
      );
      repos.push({
        name,
        description: repoResponse.data[i].description,
        url: repoResponse.data[i].url,
        languages: Object.keys(langResponse.data),
      });
    }

    res.status(HttpStatusCode.Ok).send({
      data: [...repos],
      page,
      pageSize,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(HttpStatusCode.InternalServerError);
  }
});

app.listen(PORT, () => {
  console.log("Server Running on port:", PORT);
});
