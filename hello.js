var Hello = {
	connection: null,

	log: function (msg) {
		$("#log").append( msg );
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
				$(document).trigger('connect', 
					{ jid: $("#jid").val(), password: $("#password").val() }
				);
				$(this).dialog(" close");
			}
		}
	});
});

	$(document).bind('connect', function (ev, data) {
		console.log("trying to bind");
		var connection = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");
		connection.connect(data.jid, data.password, function (status) {
			if (status === Strophe.Status.CONNECTED) {
				$(document).trigger('connected');
			} else if (status === Strophe.Status.DISCONNECTED) {
				$(document).trigger('disconnected');
			}
		});
		Hello.connection = connection;
	});
	

	$(document).bind('connected', function () {
		// inform the user
		console.log("Connection established");
		Hello.log("Connection established");
	});

	$(document).bind('disconnected', function () {
		// remove dead connection object
		console.log("Connection terminated");
		Hello.log("Connection terminated");
		Hello.connection = null;
	});




