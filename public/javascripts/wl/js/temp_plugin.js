$(document).ready(function () {




/*----------------------------------------------------------------------*/
/* wl_XXXXX description
/*----------------------------------------------------------------------*/


$.fn.wl_XXXXX = function (method) {

	var args = arguments;
	return this.each(function () {

		var $this = $(this);


		if ($.fn.wl_XXXXX.methods[method]) {
			return $.fn.wl_XXXXX.methods[method].apply(this, Array.prototype.slice.call(args, 1));
		} else if (typeof method === 'object' || !method) {
			if ($this.data('wl_XXXXX')) {
				var opts = $.extend({}, $this.data('wl_XXXXX'), method);
			} else {
				var opts = $.extend({}, $.fn.wl_XXXXX.defaults, method, $this.data());
			}
		} else {
			$.error('Method "' + method + '" does not exist');
		}


		if (!$this.data('wl_XXXXX')) {

			$this.data('wl_XXXXX', {});


		} else {

		}

		if (opts) $.extend($this.data('wl_XXXXX'), opts);
	});

};

$.fn.wl_XXXXX.defaults = {
	speed: 500,
	onBeforeClose: function () {},
	onClose: function () {}
};
$.fn.wl_XXXXX.version = '1.0';


$.fn.wl_XXXXX.methods = {
	set: function () {
		var $this = $(this),
			options = {};
		if (typeof arguments[0] === 'object') {
			options = arguments[0];
		} else if (arguments[0] && arguments[1] !== undefined) {
			options[arguments[0]] = arguments[1];
		}
		$.each(options, function (key, value) {
			if ($.fn.wl_XXXXX.defaults[key] !== undefined || $.fn.wl_XXXXX.defaults[key] == null) {
				$this.data('wl_XXXXX')[key] = value;
			} else {
				$.error('Key "' + key + '" is not defined');
			}
		});

	}
};



});