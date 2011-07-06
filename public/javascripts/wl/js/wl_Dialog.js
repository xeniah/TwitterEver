/*----------------------------------------------------------------------*/
/* wl_Dialog v 1.0 by revaxarts.com
/* description: handles alert boxes, prompt boxes and confirm boxes and
/*				message boxes
/*				contains 4 plugins
/* dependency: jquery UI Dialog
/*----------------------------------------------------------------------*/


/*----------------------------------------------------------------------*/
/* Confirm Dialog
/* like the native confirm method
/*----------------------------------------------------------------------*/
$.confirm = function (text, callback, cancelcallback) {

	var options = $.extend(true, {}, $.alert.defaults, $.confirm.defaults);

	//nativ behaviour
	if (options.nativ) {
		if (result = confirm(unescape(text))) {
			if ($.isFunction(callback)) callback.call(this);
		} else {
			if ($.isFunction(cancelcallback)) cancelcallback.call(this);
		}
		return;
	}

	//the callbackfunction
	var cb = function () {
			if ($.isFunction(callback)) callback.call(this);
			$(this).dialog('close');
			$('#wl_dialog').remove();
		},

		//the callbackfunction on cancel
		ccb = function () {
			if ($.isFunction(cancelcallback)) cancelcallback.call(this);
			$(this).dialog('close');
			$('#wl_dialog').remove();
		};

	//set some options
	options = $.extend({}, {
		buttons: [{
			text: options.text.ok,
			click: cb
		}, {
			text: options.text.cancel,
			click: ccb
		}]
	}, options);

	//use the dialog
	$.alert(unescape(text), options);
};

$.confirm.defaults = {
	text: {
		header: 'Please confirm',
		ok: 'Yes',
		cancel: 'No'
	}
};

/*----------------------------------------------------------------------*/
/* Prompt Dialog
/* like the native prompt method
/*----------------------------------------------------------------------*/

$.prompt = function (text, value, callback, cancelcallback) {

	var options = $.extend(true, {}, $.alert.defaults, $.prompt.defaults);

	//nativ behaviour
	if (options.nativ) {
		var val = prompt(unescape($.trim(text)), unescape(value));
		if ($.isFunction(callback) && val !== null) {
			callback.call(this, val);
		} else {
			if ($.isFunction(cancelcallback)) cancelcallback.call(this);
		}
		return;
	}

	//the callbackfunction
	var cb = function (value) {
			if ($.isFunction(callback)) callback.call(this, value);
			$(this).dialog('close');
			$('#wl_dialog').remove();
		},

		//the callbackfunction on cancel
		ccb = function () {
			if ($.isFunction(cancelcallback)) cancelcallback.call(this);
			$(this).dialog('close');
			$('#wl_dialog').remove();
		};

	//set some options
	options = $.extend({}, {
		buttons: [{
			text: options.text.ok,
			click: function () {
				cb.call(this, $('#wl_promptinputfield').val());
			}
		}, {
			text: options.text.cancel,
			click: ccb
		}],
		open: function () {
			$('#wl_promptinputfield').focus().select();
			$('#wl_promptinputfield').uniform();
			$('#wl_promptinputform').bind('submit', function (event) {
				event.preventDefault();
				cb.call(this, $('#wl_promptinputfield').val());
				$(this).parent().dialog('close');
				$('#wl_dialog').remove();
			});

		}
	}, options);

	//use the dialog
	$.alert('<p>' + unescape(text) + '</p><form id="wl_promptinputform"><input id="wl_promptinputfield" name="wl_promptinputfield" value="' + unescape(value) + '"></form>', options);
};

$.prompt.defaults = {
	text: {
		header: 'Please prompt',
		ok: 'OK',
		cancel: 'Cancel'
	}
};


/*----------------------------------------------------------------------*/
/* Alert Dialog
/* like the native alert method
/*----------------------------------------------------------------------*/

$.alert = function (content, options) {


	//if no options it is a normal dialog
	if (!options) {
		var options = $.extend(true, {}, {
			buttons: [{
				text: $.alert.defaults.text.ok,
				click: function () {
					$(this).dialog('close');
					$('#wl_dialog').remove();
				}
			}]
		}, $.alert.defaults);
	}

	//nativ behaviour
	if (options.nativ) {
		alert(content);
		return;
	}

	//create a container
	var container = $('<div/>', {
		id: 'wl_dialog'
	}).appendTo('body');

	//set a header
	if (options.text.header) {
		container.attr('title', options.text.header);
	}

	//fill the container
	container.html(content.replace(/\n/g, '<br>'));
	//display the dialog
	container.dialog(options);


};


$.alert.defaults = {
	nativ: false,
	resizable: false,
	modal: true,
	text: {
		header: 'Notification',
		ok: 'OK'
	}
};


/*----------------------------------------------------------------------*/
/* Message Function
/*----------------------------------------------------------------------*/


$.msg = function (content, options) {


	//get the options
	var options = $.extend({}, $.msg.defaults, options);

	var container = $('#wl_msg');

	//the container doen't exists => create it
	if (!container.length) {
		container = $('<div/>', {
			id: 'wl_msg'
		}).appendTo('body').data('msgcount', 0);
		var topoffset = parseInt(container.css('top'), 10);

		//bind some events to it
		container.bind('mouseover', function () {
			container.data('pause', true);
		}).bind('mouseout', function () {
			container.data('pause', false);
		});
		container.delegate('.msg-close', 'click', function () {
			container.data('pause', false);
			close($(this).parent());
		});
		container.delegate('.msg-box-close', 'click', function () {
			container.fadeOutSlide(options.fadeTime);
		});

		//bind the scroll event
		$(window).unbind('scroll.wl_msg').bind('scroll.wl_msg', function () {
			var pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			if (pos > topoffset) {
				(window.navigator.standalone === undefined) ? container.css({
					position: 'fixed',
					top: 10
				}) : container.css({
					top: pos + 10
				});
			} else {
				(window.navigator.standalone === undefined) ? container.removeAttr('style') : container.css({
					top: topoffset
				});
			}
		}).trigger('scroll.wl_msg');
	}

	//count of displayed messages
	var count = container.data('msgcount');

	function getHTML(content, headline) {
		return '<div class="msg-box"><h3>' + (headline || '') + '</h3><a class="msg-close">close</a><div class="msg-content">' + content.replace('\n', '<br>') + '</div></div>';
	}

	function create() {
		var msg = $(getHTML(content, options.header)),
			closeall = $('.msg-box-close');

		//we have some messages allready
		if (count) {

			//No close all button
			if (!closeall.length) {
				msg.appendTo(container);
				$('<div class="msg-box-close">close all</div>').appendTo(container).fadeInSlide(options.fadeTime);

				//Close all button
			} else {
				msg.insertBefore(closeall);
			}

			//first message
		} else {
			msg.appendTo(container);
		}

		//fade it in nicly
		msg.fadeInSlide(options.fadeTime);

		//add the count of the messages to the container
		container.data('msgcount', ++count);

		//outclose it only if it's not sticky
		if (!options.sticky) {
			close(msg, options.live);
		}
	}

	function close(item, delay) {
		if (!delay) delay = 0;
		setTimeout(function () {

			//if the mouse isn't over the container
			if (!container.data('pause')) {
				item.fadeOutSlide(options.fadeTime, function () {
					var count = $('.msg-box').length;
					if (count < 2 && $('.msg-box-close').length) {
						$('.msg-box-close').fadeOutSlide(options.fadeTime);
					}
					container.data('msgcount', count);
				})
				//try again...
			} else {
				close(item, delay);
			}

		}, delay);
	}

	//create the messsage
	create();

};

$.msg.defaults = {
	header: null,
	live: 5000,
	topoffset: 90,
	fadeTime: 500,
	sticky: false
};