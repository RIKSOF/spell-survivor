//PUBNUB = PUBNUB.init({
//	publish_key: 'demo',
//	subscribe_key: 'demo'
//});


function RS_pnSubscribe(channel) {

	PUBNUB.subscribe({
		channel: channel,
		callback: displayCallback,
		error: displayCallback
	});
}


function RS_pnUnSubscribe(channel) {

	PUBNUB.unsubscribe({
		channel: channel,
		callback: displayCallback,
		error: displayCallback
	});

}

function RS_pnPublish(channel, message) {
	if (channel) {
		PUBNUB.publish({
			channel: channel,
			message:message,
			callback: displayCallback,
			error: displayCallback
		});
	} else {
		console.log('invalid channel');
	}
}

function displayCallback(m, e, c) {
	// Use first and last args
	if (c && m) {
		console.log(JSON.stringify(c + ": " + m));
		// Only one argument
	} else if (m) {
		console.log(JSON.stringify(m));
	}
}