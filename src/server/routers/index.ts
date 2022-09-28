import itemRouter from "$root/server/routers/itemRouter";
import sheetRouter from "$root/server/routers/sheetRouter";
import trpc from "$trpc";

const appRouter = trpc.router({
	sheet: sheetRouter,
	item: itemRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
