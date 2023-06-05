# ENV

Environment variables are stored in `.env` files in the project root. Where possible, we try to provide defaults for development in the base `.env` file which is tracked by git, making it so you don't have to manually set up env variables when working on this code base.

All environment variables used in the codebase are exported from either the `env.ts` or `publicEnv.ts` file within the `/config` directory. This allows for variables to be imported with a nice syntax and for them to be parsed before being exported. `env.ts` is used for exporting secret variables that will only be accessed from the backend, `publicEnv.ts` exports variables that will also be available to the frontend. Public environment variable names must be prefixed with `NEXT_PUBLIC_` as per Next.js specifications.

## Environment Variables

| Name                               | Description                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POSTGRES_*`                       | Env variables that start with `POSTGRES_` are used by the development database                     |
| `DATABASE_URL`                     | The URL used to connect to the database                                                            |
| `UNDERGOING_MIGRATION`             | Whether or not the application is undergoing data migration                                        |
| `NEXT_PUBLIC_MAINTENANCE_MODE`     | If the application is in maintenance mode, must set both this and `UNDERGOING_MIGRATION` to `true` |
| `MONTHS_INACTIVE_OLD_SHEET_DELETE` | How many months a sheet must be inactive for before it will be deleted                             |

**Redis:** If you want to run the full `gen:pwa` script then you will need to add the var `REDIS_CONNECTION_STRING` to an untracked `.env.local` file, passing it a connection string to a REDIS database. However this should only be required during production builds. To generate the PWA assets during development you can run `yarn gen:pwa --no-redis` which will skip the redis step.

### Notes

- When performing data migrations against the production database, you must remove all of the URL parameters from the connection string
