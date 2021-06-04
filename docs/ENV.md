# ENV

All environment variables used in the codebase are exported from either the `env.ts` or `publicEnv.ts` file within the `/config` directory. This allows for variables to be imported with a nice syntax and for them to be parsed before being exported. `env.ts` is used for exporting secret variables that will only be accessed from the backend, `publicEnv.ts` exports variables that will also be available to the frontend. Public environment variable names must be prefixed with `NEXT_PUBLIC_` as per Next.js specifications.

## Environment Variables

| Name                           | Description                                                 |
| ------------------------------ | ----------------------------------------------------------- |
| `MONGO_URL`                    | The MongoDB connection string                               |
| `UNDERGOING_MIGRATION`         | Whether or not the application is undergoing data migration |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | If the application is in maintenance mode                   |
