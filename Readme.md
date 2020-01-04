# AMQP Publish Subscribe with Routing

In this tutorial we're going to make it possible to subscribe only to a subset of the messages.
For example, we will be able to direct only critical error messages to the log file (to save disk space), while still being able to print all of the log messages on the console.

In previous examples we were already creating bindings. You may recall code like:
channel.bindQueue(q.queue, exchange, '');

A binding is a relationship between an exchange and a queue. This can be simply read as: the queue is interested in messages from this exchange.


Bindings can take an extra binding key parameter (the empty string in the code above). This is how we could create a binding with a key:
channel.bindQueue(queue_name, exchange_name, 'black');

The meaning of a binding key depends on the exchange type. The fanout exchanges, which we used previously, simply ignored its value.


- Direct exchange
Our logging system from the previous tutorial broadcasts all messages to all consumers.
We want to extend that to allow filtering messages based on their severity.
For example we may want the script which is writing log messages to the disk to only receive critical errors, and not waste disk space on warning or info log messages.

In this setup, we can see the direct exchange X with two queues bound to it.
The first queue is bound with binding key orange, and the second has two bindings, one with binding key black and the other one with green.

		     ------ orange ----> Q1 -----> C1
	P -------> X ------ black ----->
					 Q2 -----> C2
		     ------ green ----->

In such a setup a message published to the exchange X with a routing key orange will be routed to queue Q1.
Messages with a routing key of black or green will go to Q2. All other messages will be discarded.

- Multiple bindings
It is perfectly legal to bind multiple queues with the same binding key.
In our example we could add a binding between X and Q1 with binding key black.
In that case, the direct exchange will behave like fanout and will broadcast the message to all the matching queues.
A message with routing key black will be delivered to both Q1 and Q2.

		        ------ black -----> Q1 -----> C1
	  P -------> X
		        ------ green -----> Q2 -----> C2


#publish(exchange, routingKey, content, [options])
Publish a single message to an exchange. The mandatory parameters are:

- exchange and routingKey: the exchange and routing key, which determine where the message goes.
A special case is sending '' as the exchange, which will send directly to the queue named by the routing key;
sendToQueue below is equivalent to this special case. If the named exchange does not exist, the channel will be closed.

- content: a buffer containing the message content. This will be copied during encoding, so it is safe to mutate it once this method has returned.

Detail tutorial can be found here https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
