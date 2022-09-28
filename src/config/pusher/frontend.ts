import {
	NEXT_PUBLIC_PUSHER_CLUSTER,
	NEXT_PUBLIC_PUSHER_KEY,
} from "$root/config/env";
import { ChannelToDataMap, EVENT_NAME } from "$root/config/pusher/common";
import superjson from "superjson";
import Pusher from "pusher-js";
import { F, flow } from "@mobily/ts-belt";
import { debugLogWithPrefix } from "$root/utils";

const pusherFrontend = new Pusher(NEXT_PUBLIC_PUSHER_KEY, {
	cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
});

/**
 * Provides a more declarative and properly-typed way to
 * subscribe and unsubscribe to a pusher channel
 *
 * @param channelName The name of the channel to subscribe to
 * @param callback The callback to execute when an event is
 * received
 * @returns A callback to unsubscribe from the channel
 */
export const subscribeToChannel = <ChannelName extends keyof ChannelToDataMap>(
	channelName: ChannelName,
	callback: (data: ChannelToDataMap[ChannelName]) => void
) => {
	const channel = pusherFrontend.subscribe(channelName);
	const callbackWithPreProcessing = flow(
		// Pusher handles serialization in strange way, so in order
		// for us to be able to parse the event data with superjson,
		// we have to re-stringify it
		superjson.stringify,
		superjson.parse,
		F.tap(debugLogWithPrefix(`pusher/${channelName}: `)),
		callback
	);
	channel.bind(EVENT_NAME, callbackWithPreProcessing);
	return () => {
		channel.unbind(EVENT_NAME, callbackWithPreProcessing);
		channel.unsubscribe();
	};
};

export default pusherFrontend;
