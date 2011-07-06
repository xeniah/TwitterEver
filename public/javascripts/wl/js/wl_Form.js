/*----------------------------------------------------------------------*/
/* wl_Form v 1.0 by revaxarts.com
/* description:	handles the serialization, unserialization and sending
/*				of a form
/* dependency: 	$.confirm, wl_Number*, wl_Slider*, wl_Date*, wl_Value*,
/* 				wl_Password*
/*				* only when fields are within the form
/*----------------------------------------------------------------------*/


$.fn.wl_Form = function (method) {

	var args = arguments;
	return this.each(function () {

		var $this = $(this);


		if ($.fn.wl_Form.methods[method]) {
			return $.fn.wl_Form.methods[method].apply(this, Array.prototype.slice.call(args, 1));
		} else if (typeof method === 'object' || !method) {
			if ($this.data('wl_Form')) {
				var opts = $.extend({}, $this.data('wl_Form'), method);
			} else {
				var opts = $.extend({}, $.fn.wl_Form.defaults, method, $this.data());
			}
		} else {
			$.error('Method "' + method + '" does not exist');
		}

		//all fields within that form
		var $inputs = $this.find('input,textarea,select,div.date,div.slider'),
			//$required = $inputs.filter('[required]'), //Doenst work on IE7/8
			$submitbtn = $this.find(opts.submitButton);

		if (!$this.data('wl_Form')) {

			$this.data('wl_Form', {});

			//get options from the forms nativ attributes
			opts.action = $this.attr('action') || opts.action;
			opts.method = $this.attr('method') || opts.method;

			//prevent the forms defautl behaviour
			$this.bind('submit.wl_Form', function (event) {
				event.preventDefault();
				return false;
			});

			//bind the click action to the submit button
			$submitbtn.bind('click.wl_Form', function (event) {
				$.fn.wl_Form.methods.submit.call($this[0]);
				return false;
			});

			//iterate thru the fields
			$inputs.each(function () {
				var _this = $(this),
					_row = _this.closest('section'),
					//the label should be nice readable
					_label = _row.find('label').eq(0).html() || this.name || this.id || '';


				//This is required because IEs < 9 can't handle this as expected
				if (_this.is('[required]') || typeof _this.prop('required') == 'string') {
					_this.data('required', true);
					_row.find('label').eq(0).append('&nbsp;<span class="required">&nbsp;</span>');
				}
				
				//add the label to the field (and strip out unwanted info)
				_this.data('wl_label', _label.replace(/<span>([^<]+)<\/span>|<([^>]+)\/?>/g, ''));
			});


			//set the form status after the submit button if status is true
			if (opts.status && !$submitbtn.closest('div').is('span.wl_formstatus')) {
				$submitbtn.closest('div').append('<span class="wl_formstatus"></span>');
			}

			//parse the location.search parameters
			if (opts.parseQuery) {
				$this.wl_Form.methods.unserialize.call(this);
			}

		} else {

		}

		if (opts) $.extend($this.data('wl_Form'), opts);
	});

};

$.fn.wl_Form.defaults = {
	submitButton: 'button:last',
	method: 'post',
	action: null,
	serialize: false,
	parseQuery: true,
	dataType: 'text',
	status: true,
	sent: false,
	confirmSend: true,
	text: {
		required: 'This field is required',
		valid: 'This field is invalid',
		password: 'This password is to short',
		passwordmatch: 'This password doesn\'t match',
		incomplete: 'Please fill out the form correctly!',
		send: 'send form...',
		sendagain: 'send again?',
		success: 'form sent!',
		error: 'error while sending!',
		parseerror: 'Can\'t unserialize query string:\n %e'
	},
	tooltip: {
		gravity: 'nw'
	},
	onRequireError: function (element) {},
	onValidError: function (element) {},
	onPasswordError: function (element) {},
	beforeSubmit: function (data) {},
	onComplete: function (textStatus, jqXHR) {},
	onError: function (textStatus, error, jqXHR) {},
	onSuccess: function (data, textStatus, jqXHR) {}
};
$.fn.wl_Form.version = '1.0';


$.fn.wl_Form.methods = {
	disable: function () {
		var $this = $(this),
			_inputs = $this.find($this.data('wl_Form').submitButton + ',input,textarea,select,div.date,div.slider');
		//iterate thru all fields
		_inputs.each(function () {
			var _this = $(this);
			if (_this.is('div')) {
				//disable slider and datefields
				if (_this.is('div.slider') && _this.data('wl_Slider')) {
					_this.wl_Slider('disable');
				} else if (_this.is('div.date') && _this.data('wl_Date')) {
					_this.wl_Date('disable');
				}
			} else {
				//disable normal fields
				_this.prop('disabled', true);
			}
		});
		$this.data('wl_Form').disabled = true;
	},
	enable: function () {
		var $this = $(this),
			_inputs = $this.find($this.data('wl_Form').submitButton + ',input,textarea,select,div.date,div.slider');
		//iterate thru all fields
		_inputs.each(function () {
			var _this = $(this);
			if (_this.is('div')) {
				//enable slider and datefields
				if (_this.is('div.slider') && _this.data('wl_Slider')) {
					_this.wl_Slider('enable');
				} else if (_this.is('div.date') && _this.data('wl_Date')) {
					_this.wl_Date('enable');
				}
			} else {
				//enable normal fields
				_this.prop('disabled', false);
			}
		});
		$this.data('wl_Form').disabled = false;
	},
	submit: function () {

		//collect some required info
		var $this = $(this),
			_data = {},
			_opts = $this.data('wl_Form'),
			_inputs = $this.find('input,textarea,select,div.date,div.slider'),
			_statusel = $this.find('.wl_formstatus'),
			_requiredelements = Array(),
			_validelements = Array(),
			_passwordelements = Array(),
			_submit = true;


		//status reset
		_statusel.text("");

		//iterate thru all fields
		_inputs.each(function (i, e) {
			var _this = $(this),
				_row = _this.closest('section');

			//passwords has a different error handling
			if (_this.attr('type') != 'password' && !_this.data('wl_Password') || _this.data('wl_Password')) {
				_row.removeClass('error');
			}
			
			//if a placeholder is set remove the value temporary
			if (_this.prop('placeholder') && _this.val() == _this.prop('placeholder')) {
				_this.val('');
			}
			//if field is required an a value is set or it is a checkbox and the checkbox isn't checked
			if (_this.data('required') && (!_this.val() || _this.is(':checkbox') && !_this.is(':checked'))) {
				_row.addClass('error');
				_requiredelements.push(_this);
				_submit = false;
			}
			//if it is a valid field but it isn't valid
			if (_this.data('wl_Valid') && !_this.data('wl_Valid').valid) {
				_row.addClass('error');
				_validelements.push(_this);
				_submit = false;
			}
			//if it is a password
			if (_this.data('wl_Password')) {
				var value = _this.val();
				//password confirmation is set and the confirmation isn't equal the password or the password is shorter than the minlength of the password field
				if ((_this.data('wl_Password').confirm && _this.data('wl_Password').connect && value != $('#' + _this.data('wl_Password').connect).val()) || (value && value.length < _this.data('wl_Password').minLength)) {
					_row.addClass('error');
					_passwordelements.push(_this);
					_submit = false;

				}
			};
		});

		//if some of the above errors occures
		if (!_submit) {
			
			//iterate thru all required fields
			$.each(_requiredelements, function (i, e) {
				
				//callback
				_opts.onRequireError.call(e[0],e);
				
				//use tipsy for a tooltip
				e.tipsy($.extend({}, config.tooltip, _opts.tooltip, {
					trigger: 'manual',
					fallback: e.data('errortext') || _opts.text.required
				}));
				e.tipsy('show');
				
				//hide tooltip in fieldfocus
				e.bind('focus.tooltip, click.tooltip', function () {
					$(this).unbind('focus.tooltip, click.tooltip').tipsy('hide');
				});
			});
			
			
			//iterate thru all valid fields
			$.each(_validelements, function (i, e) {
				
				//callback
				_opts.onValidError.call(e[0],e);
				
				//use tipsy for a tooltip
				e.tipsy($.extend({}, config.tooltip, _opts.tooltip, {
					trigger: 'manual',
					fallback: e.data('errortext') || e.data('wl_Valid').errortext || _opts.text.valid
				}));
				e.tipsy('show');
				
				//hide tooltip in fieldfocus
				e.bind('focus.tooltip, click.tooltip', function () {
					$(this).unbind('focus.tooltip, click.tooltip').tipsy('hide');
				});
			});
			
			//iterate thru all valid fields
			$.each(_passwordelements, function (i, e) {
				var text = '',
					value = e.val();
					
				//confirmation is set
				if (e.data('wl_Password').confirm) {
					var connect = $('#' + e.data('wl_Password').connect);
					
					//but password is not equal confimration
					if (value != connect.val()) {
						
						//tipsy on the confirmation field
						connect.tipsy($.extend({}, config.tooltip, _opts.tooltip, {
							trigger: 'manual',
							fallback: connect.data('errortext') || _opts.text.passwordmatch
						}));
						connect.tipsy('show');
						
						//hide tooltip in fieldfocus
						connect.bind('focus.tooltip, click.tooltip', function () {
							$(this).unbind('focus.tooltip, click.tooltip').tipsy('hide');
						});
					}
				}
				
				//length is to short
				if(value.length < e.data('wl_Password').minLength) {
					_opts.onPasswordError.call(e[0],e);
					
					//tipsy
					e.tipsy($.extend({}, config.tooltip, _opts.tooltip, {
						trigger: 'manual',
						fallback: e.data('errortext') || _opts.text.password
					}));
					e.tipsy('show');
					
					//hide tooltip in fieldfocus
					e.bind('focus.tooltip, click.tooltip', function () {
						$(this).unbind('focus.tooltip, click.tooltip').tipsy('hide');
					});
				}

			});

			//Set status message
			_statusel.text(_opts.text.incomplete);
			return false;
		}

		//confirmation is required if the form was allready sent
		if (_opts.confirmSend && _opts.sent === true) {
			$.confirm(_opts.text.sendagain, function () {
				_opts.sent = false;
				$.fn.wl_Form.methods.submit.call($this[0]);
			});
			return false;
		}

		//iterate thru all fields and prepare data
		_inputs.each(function (i, e) {
			var _el = $(e),
				key = _el.attr('name') || e.id,
				value = null;
			
			
			//datepicker
			if (_el.is('.date')) {

				var connect = $this.find('input[data-connect=' + e.id + ']').eq(0),
					dateobj = new Date(_el.datepicker('getDate')),
					//format: YYYY-MM-DD
					date = dateobj.getFullYear() + '-' + $.leadingZero(dateobj.getMonth() + 1) + '-' + $.leadingZero(dateobj.getDate());
				if (dateobj.getTime()) {
					//is connected to a timefield
					if (connect.length) {
						value = date + ' ' + (connect.data('wl_Time').time || '00:00');
					} else {
						value = date;
					}
				}
				_data[key] = value;

			//slider
			} else if (_el.is('.slider')) {
				
				//if it is connected we have a input field too so skip it
				if (!_el.is('[data-connect]')) {
					if (_el.data('wl_Slider').range !== true) {
						value = _el.slider('option', 'value');
						_data[key] = value;
					} else {
						value = _el.slider('option', 'values');
					}
					_data[key] = value;
				}
				
			//wysiwyg editor
			} else if (_el.is('textarea.html')) {

				//copy the content to the textarea
				_el.wysiwyg('save');
				_data[key] = _el.val();

			//timefield
			} else if (_el.is('.time')) {

				//if it is connected we have a datefield too so skip it
				if (!_el.is('[data-connect]')) {
					_data[key] = _el.data('wl_Time').time;
				}

			//timefield
			} else if (_el.is(':checkbox')) {

				_data[key] = _el.is(':checked');

			//password
			} else if (_el.is(':password')) {

				_data[key] = _el.val();

			//radio buttons
			} else if (_el.is(':radio')) {

				if (_el.is(':checked')) {
					_data[key] = e.id;
				}

			//number field
			} else if (_el.data('wl_Number')) {

				value = parseFloat(_el.val());
				if (isNaN(value)) {
					value = null;
				}
				_data[key] = value;

			//other fields
			} else {
				_data[key] = _el.val();
			}
		});
		
		//should we serialize it? (key=value&key2=value2&...)
		if (_opts.serialize) {
			_data = $.param(_data);
		}

		//callback can return false to prevent sending
		if (_opts.beforeSubmit.call($this[0],_data) === false) {
			return false;
		};

		//set status text
		_statusel.text(_opts.text.send);

		//now disable it
		$.fn.wl_Form.methods.disable.call(this);

		//send the form
		$.ajax({
			url: _opts.action,
			type: _opts.method,
			data: _data,
			dataType: _opts.dataType,
			//callback on success
			success: function (data, textStatus, jqXHR) {
				_statusel.textFadeOut(_opts.text.success);
				_opts.onSuccess.call($this[0], data, textStatus, jqXHR);
			},
			//callback on complete
			complete: function (jqXHR, textStatus) {
				$.fn.wl_Form.methods.enable.call($this[0]);
				_opts.sent = true;
				_opts.onComplete.call($this[0], textStatus, jqXHR);
			},
			//callback on error
			error: function (jqXHR, textStatus, error) {
				_statusel.text(_opts.text.error);
				_opts.onError.call($this[0], textStatus, error, jqXHR);
			}
		});

	},
	unserialize: function (string) {
		var $this = $(this),
			_searchquery = string || location.search.substr(1);

		//parse only if we have something to parse
		if (_searchquery) {
			
			//could throw an error because its an userinput
			try {
				
				//prepare string to get a clean array with with key => value
				values = decodeURIComponent(_searchquery).split('&');

				var serialized_values = [];
				
				$.each(values, function () {
					var properties = this.split("="),
						key = properties.shift();

					properties = properties.join('=');

					if ((typeof key !== 'undefined') && (typeof properties !== 'undefined')) {
						serialized_values[key.replace(/\+/g, " ")] = properties.replace(/\+/g, " ");
					}
				});
				values = serialized_values;

				// Iterate thru each element
				$("input,textarea,select,div.date,div.slider").each(function () {
					var _this = $(this),
						_type = _this.attr("type"),
						tag_name = this.name || this.id;



					// Set the values to field
					if (values[tag_name] != null) {
						
						//chechboxes
						if (_type == "checkbox") {
							_this.prop("checked", (values[tag_name] == 'true'));

						//radio buttons
						} else if (_type == "radio") {
							$('input[id="' + values[tag_name] + '"]').attr("checked", true);
							
						//password
						} else if (_type == "password") {
							//don't write passwords for security reasons
							//_this.val(values[tag_name]).trigger('change')
							
						//datepicker
						} else if (_this.is('input.date')) {
							if (/(\d\d:\d\d)$/.test(values[tag_name])) {
								var time = values[tag_name].substr(11),
									date = values[tag_name].substr(0, 10);
								_this.datepicker('setDate', new Date(date));
								$('input[data-connect="' + tag_name + '"]').val(time).data('wl_Time').time = time;
							} else {
								_this.datepicker('setDate', new Date(values[tag_name]));
							}
							
						//inline datepicker
						} else if (_this.is('div.date')) {
							_this.datepicker('setDate', new Date(values[tag_name]));
							
						//colorpicker
						} else if (_this.is('.color')) {
							_this.wl_Color('set', 'value', values[tag_name]);
							
						//Slider
						} else if (_this.is('.slider')) {
							_this.wl_Slider('values', values[tag_name]);
							if (_this.data('wl_Slider')) {
								_this.wl_Slider("change");
								_this.wl_Slider("slide");
							}
						
						//wysiwyg editor
						} else if (_this.is('textarea.html')) {
							_this.val(values[tag_name]);
							if (_this.data('wl_Editor')) {
								_this.wysiwyg("setContent", values[tag_name]);
							}
							
						//other fields
						} else {
							_this.val(values[tag_name]).trigger('change');
						}
					}
				});
			} catch (e) {
				
				//call a message to prevent crashing the application
				$.msg($this.data('wl_Form').text.parseerror.replace('%e', e));
			}
		}
	},
	set: function () {
		var $this = $(this),
			options = {};
		if (typeof arguments[0] === 'object') {
			options = arguments[0];
		} else if (arguments[0] && arguments[1] !== undefined) {
			options[arguments[0]] = arguments[1];
		}
		$.each(options, function (key, value) {
			if ($.fn.wl_Form.defaults[key] !== undefined && $.fn.wl_Form.defaults[key] !== null) {
				$this.data('wl_Form')[key] = value;
			} else {
				$.error('Key "' + key + '" is not defined');
			}
		});

	}
};