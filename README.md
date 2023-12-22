# Sortofacrm

### A CRM with a focus on reporting and user experience

Currently not tested in production since I need to create a general module

This is in order to be able to create custom modules straight from the interface

The testing for the general modules is happening in tasks module, which will then be converted to a general module
allowing for any new modules creation straight from the interface

I started the development of this project to learn more about Nuxt and its capabilities as well as create some project
of my own, scale of which seems nearly impossible. However, I have been starting to learn Rust and am planning to integrate
it within this project as well (possibly some sort of ML project since I want to expand my knowledge on that as well)

There is A LOT to do and to improve, but I hope to get the first working prototype by end of January 2024

In case you have any ideas and want to help me work on this - feel free to reach out at [eriks@lapinseriks.com](mailto:eriks@lapinseriks.com?subject=Sortofacrm)

## Setup

Make sure to install the dependencies:

```bash
# yarn - also generates the prisma client
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```

## Environment variables for running
DATABASE_URL: a link for prisma - check [Prisma documentation](https://www.prisma.io/docs) should be good with postgresql or mysql (made initially with mysql) - but there are no relations defined specifically
NUXTAUTH_SECRET: a random secret string - considerably long - for password encription (there is a plan to add some OAuth authentication later)

## Production

Build the application for production (haven't tested as of December 2023):

```bash
# yarn
yarn build
```