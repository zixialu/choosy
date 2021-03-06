# Choosy

Create quick, informal polls for your friends to vote on! Votes are counted using the Borda count and updated live.

[Visit us on Heroku](https://chooosy.herokuapp.com/)

## Screenshots

![Screenshot of landing page](https://raw.githubusercontent.com/zixialu/choosy/master/docs/choosy-new-poll.png)

![Screenshot of voting form](https://raw.githubusercontent.com/zixialu/choosy/master/docs/choosy-vote.png)

![Screenshot of results page](https://raw.githubusercontent.com/zixialu/choosy/master/docs/choosy-results.png)

## Setting Up the Repo

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`

2. Update the `.env` file with your correct local information, including a new `AES_SECRET_KEY` to generate encrypted ids and `MAILGUN_API_KEY` to send email updates through mailgun.

3. Install dependencies: `npm i`

4. Fix binaries for sass: `npm rebuild node-sass`

5. Run migrations: `npm run knex migrate:latest`

6. Run the server: `npm run local`

7. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- PostgreSQL 9.5.x or above

## About the Team

Choosy was created by [Edward Yang](https://github.com/edwardcode), [Umair Abdul](https://github.com/uabdul), and [Zixia Lu](https://github.com/zixialu) for Lighthouse Labs' Decision Maker midterm project.
