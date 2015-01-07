var Hello = {
	connection: null,
	start_time: null,

	log: function (msg) {
		$("#log").append( msg );
	},

	send_ping: function (to) {
		console.log("send_ping")
		var message = $iq({
			to: to,
			type: "get",
			id: "ping1"
		}).c("ping", {xmlns: "urn:xmpp:ping"});
		Hello.log("sending ping to : " + to + ".");
		Hello.start_time = (new Date()).getTime();
		Hello.connection.send(message);
	},

	handle_pong: function (iq) {
		console.log("handle_pong")
		var elapsed = (new Date()).getTime() - Hello.start_time;
		Hello.log("the time to handle a ping is: " + elapsed + "" )
		var pong = $iq({to: $(iq).attr("from"), type: "result", id: $(iq).attr("id")});
		conn.send(pong);
		return true;
	}
};


$(function () {

	$("#login_dialog").dialog({
		autoOpen: true,
		draggable: false,
		modal: true,
		title: "Connect to XMPP",
		buttons: {
			Connect: function () {
				$(document).trigger("connect", 
					{ jid: $("#jid").val(), password: $("#password").val() }
				);
				$(this).dialog("close");
			}
		}
	});
});

	$(document).bind("connect", function (ev, data) {
		console.log("trying to bind this jid:");
		var connection = new Strophe.Connection("http://localhost:5280/http-bind");
		connection.connect(data.jid, data.password, function (status) {
			if (status === Strophe.Status.CONNECTED) {
				$(document).trigger('connected');
			} else if (status === Strophe.Status.DISCONNECTED) {
				$(document).trigger('disconnected');
			}
		});
		Hello.connection = connection;
	});
	

	$(document).bind("connected", function () {
		// inform the user
		Hello.log("Connection established");
		var domain = Strophe.getDomainFromJID(Hello.connection.jid)
		Hello.connection.addHandler(Hello.handle_pong, null, "iq", null, "ping1");
		console.log("Connection established");
		Hello.send_ping(domain);
	});

	$(document).bind("disconnected", function () {
		// remove dead connection object
		console.log("Connection terminated");
		Hello.log("Connection terminated");
		Hello.connection = null;
	});

	//  daniel@martinagehwolf-macbook.local






