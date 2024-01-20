# Git Library

Discover GitHub Profiles and Repositories

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.x

    $ npm --version
    10.2.x

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

---

## Install

    $ git clone https://github.com/5Talib/GitLibrary.git
    $ cd GitLibrary
    $ npm install

## Configure app

Open `.env` then you will need to add:

- GITHUB_ACCESS_TOKEN=<your_access_token>

## Running the project locally

    $ npm run dev

## Simple build for production

    $ npm build
