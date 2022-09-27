import sheetRouter from "$root/server/routers/sheetRouter";
import trpc from "$trpc";

const appRouter = trpc.router({
	sheet: sheetRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
