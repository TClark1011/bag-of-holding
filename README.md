![](/assets/images/GitHub_Banner.png?raw=true)

# Bag of Holding

Bag of Holding is a web app that lets all the players in a  tabletop RPG session track their inventory in one central location. Inventory sheets are created without requiring any account creation or authentication and update in real time, allowing for easy and convenient collaboration between players, as well as offering advanced filters and searching that makes it suitable for tracking both the group inventory and the inventory of individual players. 

[Live Site](https://www.bagofholding.cloud/)

![](/public/ogImages/ogSheet.png?raw=true)

**Stack:** Bag of Holding is built primarily using the following technologies:

- Typescript
- [React](https://github.com/facebook/react), bootstrapped with [Next.js](https://github.com/vercel/next.js/) via `create-next-app` and [Chakra UI](https://github.com/chakra-ui/chakra-ui/) for styling
- [MongoDB Cloud](https://www.mongodb.com/cloud) with [Mongoose](https://github.com/Automattic/mongoose)
- Hosted on [Vercel](https://vercel.com/)

**Status:** Bag of Holding is currently on version 1.0.1

## Installation

How to install and locally host your own installation of Bag of Holding:

1. Fork + Clone this repository
2. Run the `yarn` command (yarn must be installed) and wait for installation of packages to finish
3. Create a MongoDB Atlas collection and get the connection string (for help, follow [this guide](https://dev.to/dalalrohit/how-to-connect-to-mongodb-atlas-using-node-js-k9i) up to the point that you get the connection string in step 4)
4. Create a file named `.env` in the root directory of your forked repository. In that file, write `MONGO_URL=*your connection string*`
5. Run `yarn start:dev` to run the development server, or just `yarn start` for the production server.

### Configuration

- **Fetch Intervals:** By default, inventory sheets will request new data from the server once every 30000 milliseconds. The regularity of this can be customized. To do this, add `NEXT_PUBLIC_REFETCH_INTERVAL=*desired refetch intervals in milliseconds*`

## License

MIT