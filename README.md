![](/public/GitHub_Banner.png?raw=true)

# Bag of Holding

Bag of Holding is a web app that lets all the players in a tabletop RPG session track their inventory in one central location. Inventory sheets are created without requiring any account creation or authentication and update in real time, allowing for easy and convenient collaboration between players, as well as offering advanced filters and searching that makes it suitable for tracking both the group inventory and the inventory of individual players.

[Live Site](https://www.bagofholding.cloud/)

![](/public/ogImages/ogSheet.png?raw=true)

**Stack:** Bag of Holding is built primarily using the following technologies:

- Typescript
- [React](https://github.com/facebook/react), bootstrapped with [Next.js](https://github.com/vercel/next.js/) via `create-next-app` and [Chakra UI](https://github.com/chakra-ui/chakra-ui/) for styling
- PostgreSQL Database hosted on [Supabase](https://app.supabase.com/)
- Hosted on [Vercel](https://vercel.com/)
- [tRPC](https://trpc.io/) backend

## Installation

**NOTE:** You need docker installed

How to install and locally host your own installation of Bag of Holding:

1. Fork + Clone this repository
2. Run the `yarn` command (yarn must be installed) and wait for installation of packages to finish
3. Run `yarn dev` to run the application

## Development

We will gladly accept any help you want to offer us. If you want to contribute to Bag of Holding, please read this section and follow any instructions.

### Extensions

It is recommended that you install the following extensions before starting work on Bag of Holding:

- **Prettier (esbenp.prettier-vscode):** An extension for formatting your code.
- **ESLint (dbaeumer.vscode-eslint):** An extension for linting your code.

### Workflow

When making commits to this repository run `yarn commit` in your terminal and follow the prompts to generate a high quality message that will be accepted.

## Credits

- I borrowed some of [this](https://github.com/mvasin/react-div-100vh) library and copy/pasted
  it directly into the project because I only needed some of it and wanted to cut down on dependencies.
  It is licensed under the MIT license.

## License

MIT
