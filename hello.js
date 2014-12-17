
$(function () {

	$("#login_dialog").dialog({
		resizable: false,
        modal: true,
        title: "Connect to XMPP",
        height: 250,
        width: 400,
        buttons: {
			Connect: function () {
				$(document).trigger('connect', 
					{ jid: $("#jid").val(), password: $("#password").val() }
				);
				$(this).dialog(" close");
			}
		}
	});

	$(document).bind('connect', function (ev, data) {
		var connection = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");
		connection.connect(data.jid, data.password, function (status) {
			if (status === Strophe.Status.CONNECTED) {
				$(document).trigger('connected');
			} else if (status === Strophe.Status.DISCONNECTED) {
				$(document).trigger('disconnected');
			}
		});
	});
	

	$(document).bind('connected', function () {
		// nothing here yet
	});

	$(document).bind('disconnected', function () {
		// nothing here yet
	});

});


