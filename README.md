# expressjs-api

This repository is a dummy Node.js REST-API built with [TypeScript](https://www.typescriptlang.org/) and [Express](https://expressjs.com/). You might want to use it as codebase for your own Node project.

You can find a detailed explanation about the application's architecture on my [blog](https://larswaechter.dev/blog/nodejs-rest-api-structure/).

## :file_folder: Packages

A shortened list of the Node modules used in this app:

- [acl](https://www.npmjs.com/package/acl)
- [express](https://www.npmjs.com/package/express)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [passport](https://www.npmjs.com/package/passport)
- [redis](https://www.npmjs.com/package/redis)
- [typeorm](https://www.npmjs.com/package/typeorm)

## :crystal_ball: Features

- ACL (access control list)
- Component-based architecture
- Caching (Redis)
- DB seeding
- Mailing
- MySQL
- Testing

## Folder structure

Read more [here](https://larswaechter.dev/blog/nodejs-rest-api-structure/).

- `src/api` everything needed for the REST API
  - `src/api/components` component routers, controllers, models, tests and more
  - `src/api/middleware` API middleware
- `src/config` global configuration files
- `src/services` services for sending mails, caching, authentication and more
- `src/test` test factory

## :computer: Setup

### Native

Requirements:

- [MySQL](https://www.mysql.com/de/)
- [Node.js](https://nodejs.org/en/)
- [Redis](https://redis.io/)

Installation:

1. Run `npm install`
2. Rename `.env.example` to `.env` and enter environment variables
3. Run `npm run build` to compile the TS code
4. Run `npm start` to start the application

You can reach the server at [http://localhost:3000/api/v1/](http://localhost:3000/api/v1).

### Docker

Requirements:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Installation:

1. Rename `.env.docker.example` to `.env.docker` and enter environment variables
2. Run `docker-compose up` to start the Docker containers

You can reach the server at [http://localhost:3000/api/v1/](http://localhost:3000/api/v1).

### Building

During the build process the following tasks are executed:

- Compiling TS into JS
- Copying mail HTML templates to `dist` directory
- Merging component `policy.json` files into a single one in `dist/output/policies.combined.json`

The last two tasks are executed using Gulp as you can see in `gulpfile.js`.

### Database seeding

In `db/seed.sql` you'll find a SQL script that can be used for seeding the database with dummy data. Make sure that the database and its tables were created before executing the script. The tables are created on application start.

You can load the script via a npm command: `npm run seed`.

If you want to seed the database from a Docker container you must connect to it before: `docker exec -it expressjs-api bash`.

## :hammer: Tools

### ACL

This application uses [acl](https://www.npmjs.com/package/acl) for permission management. Each component in `src/api/components` has its own `policy.json` which includes permissions for each role.

During the build process all these `policy.json` files get merged into a single one using a Gulp task as described more above.

### MailHog

[MailHog](https://github.com/mailhog/MailHog) is an email testing tool for developers. You can use it as SMTP server to simulate the process of sending mails. MailHog is included as Docker image within the `docker-compose.yml` file.

Start the containers as described above and you can open the MailHog web interface at [http://localhost:8025](http://localhost:8025/) where you'll find an overview of all sent emails.

## :octocat: Community

- [Website](https://larswaechter.dev/)
- [Buy me a coffee](https://www.buymeacoffee.com/larswaechter)
