import { ChannelToDataMap } from "$root/config/pusher/common";
import { subscribeToChannel } from "$root/config/pusher/frontend";
import { useEffect } from "react";

/**
 * A hook for subscribing to a pusher channel
 *
 * @param channelName The name of the channel to subscribe to
 * @param callback The callback to run when an event is received
 */
const usePusherSubscription = <ChannelName extends keyof ChannelToDataMap>(
	channelName: ChannelName,
	callback: (data: ChannelToDataMap[ChannelName]) => void
) => {
	useEffect(() => {
		const unsubscribe = subscribeToChannel(channelName, callback);

		return unsubscribe;
	});
};

export default usePusherSubscription;
