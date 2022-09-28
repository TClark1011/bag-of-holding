import {
	NEXT_PUBLIC_PUSHER_CLUSTER,
	NEXT_PUBLIC_PUSHER_KEY,
	PUSHER_APP_ID,
	PUSHER_SECRET,
} from "$root/config/env";
import { ChannelToDataMap, EVENT_NAME } from "$root/config/pusher/common";
import Pusher from "pusher";
import { stringify } from "superjson";

const pusherBackend = new Pusher({
	appId: PUSHER_APP_ID,
	key: NEXT_PUBLIC_PUSHER_KEY,
	cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
	secret: PUSHER_SECRET,
	useTLS: true,
});

/**
 * Fire a channel event with correct typings
 *
 * @param channelName The name of the channel to fire the event on
 * @param data The event object
 */
export const fireChannelEvent = <ChannelName extends keyof ChannelToDataMap>(
	channelName: ChannelName,
	data: ChannelToDataMap[ChannelName]
) => {
	const serializedData = stringify(data);
	return pusherBackend.trigger(channelName, EVENT_NAME, serializedData);
};

export default pusherBackend;
