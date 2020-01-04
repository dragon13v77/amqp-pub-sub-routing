var amqp = require('amqplib/callback_api');

const LOCAL_URL = 'amqp://localhost';
const EXCHANGE_NAME = 'direct_logs';


var args = process.argv.slice(2);
var msg = args.slice(1).join(' ') || 'Hello World!';
var routingKey = (args.length > 0) ? args[0] : 'info';
//  routingKey = 'severity' can be one of 'info', 'warning', 'error'.

amqp.connect(LOCAL_URL, function(error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function(error1, channel) {
		if (error1) {
			throw error1;
		}

		channel.assertExchange(EXCHANGE_NAME, 'direct', {
			durable: false
		});
		channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(msg));
		console.log(" [x] Sent %s: '%s'", routingKey, msg);
	});

	setTimeout(function() {
		connection.close();
		process.exit(0);
	}, 500);
});