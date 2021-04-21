export const REFETCH_INTERVAL = parseInt(
	process.env.NEXT_PUBLIC_REFETCH_INTERVAL || "3000"
);
//? How frequently sheets should refetch data

export const inProduction = process.env.NODE_ENV === "production";
export const inDevelopment = process.env.NODE_ENV === "development";
export const inTesting = process.env.NODE_ENV === "test";

export const onProdBranch =
	process.env.NEXT_PUBLIC_ON_PROD_BRANCH &&
	JSON.parse(process.env.NEXT_PUBLIC_ON_PROD_BRANCH) === true;
//? If the application is running on the production branch

export const isBuildingForProd = onProdBranch && inProduction;
//? If the application is being built to be deployed to production

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const DEBUG_ANALYTICS: boolean =
	process.env.NEXT_PUBLIC_DEBUG_ANALYTICS &&
	JSON.parse(process.env.NEXT_PUBLIC_DEBUG_ANALYTICS);
