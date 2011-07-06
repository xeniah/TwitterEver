/*----------------------------------------------------------------------*/
/* Set some Standards
/*----------------------------------------------------------------------*/

var config = {
	tooltip :{
		gravity: 'nw',
		fade: false,
		opacity: 1,
		offset: 0
	}
};



if($.fn.wl_Alert) $.fn.wl_Alert.defaults = {
	speed: 500,
	sticky: false,
	onBeforeClose: function (element) {},
	onClose: function (element) {}
};

if($.fn.wl_Autocomplete) $.fn.wl_Autocomplete.defaults = {
	//check http://jqueryui.com/demos/autocomplete/ for all options
};

if($.fn.wl_Breadcrump) $.fn.wl_Breadcrump.defaults = {
	start: 0,
	numbers: false,
	allownextonly: false,
	disabled: false,
	connect: null,
	onChange: function () {}
};

if($.fn.wl_Calendar) $.fn.wl_Calendar.defaults = {
	//check http://arshaw.com/fullcalendar/ for all options
};

if($.fn.wl_Chart) $.fn.wl_Chart.defaults = {
	width: null,
	height: 300,
	hideTable: true,
	data: {},
	stack: false,
	type: 'lines',
	points: null,
	shadowSize: 2,
	fill: null,
	fillColor: null,
	lineWidth: null,
	legend: true,
	legendPosition: "ne", // or "nw" or "se" or "sw"
	tooltip: true,
	tooltipGravity: 'n',
	tooltipPattern: function (value, legend, label, id) {
		return "value is " + value + " from " + legend + " at " + label + " (" + id + ")";
	},
	//tooltipPattern: "value is %1 from %2 at %3 (%4)", //also possible
	orientation: 'horizontal',
	colors: ['#b2e7b2', '#f0b7b7', '#b5f0f0', '#e8e8b3', '#efb7ef', '#bbb6f0'],
	flot: {},
	onClick: function (value, legend, label, id) {}
};

if($.fn.wl_Color) $.fn.wl_Color.defaults = {
	mousewheel: true,
	onChange: function (hsb, rgb) {}
};


if($.fn.wl_Date) $.fn.wl_Date.defaults = {
	value: null,
	mousewheel: true,
	
	//some datepicker standards
	dayNames : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesMin : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	dayNamesShort : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	firstDay: 0,
	nextText: 'next',
	prevText: 'prev',
	currentText: 'Today',
	showWeek: true,
	dateFormat: 'mm/dd/yy'
};


if($.confirm) $.confirm.defaults = {
	text:{
		header: 'Please confirm',
		ok: 'Yes',
		cancel: 'No'
	}
};
if($.prompt) $.prompt.defaults = {
	text:{
		header: 'Please prompt',
		ok: 'OK',
		cancel: 'Cancel'
	}
};
if($.alert) $.alert.defaults = {
	nativ: false,
	resizable: false,
	modal: true,
	text:{
		header: 'Notification',
		ok: 'OK'
	}
};

if($.fn.wl_Editor) $.fn.wl_Editor.defaults = {
	css: 'css/light/editor.css',
	buttons: 'bold|italic|underline|strikeThrough|justifyLeft|justifyCenter|justifyRight|justifyFull|highlight|indent|outdent|subscript|superscript|undo|redo|insertOrderedList|insertUnorderedList|insertHorizontalRule|createLink|insertImage|h1|h2|h3|h4|h5|h6|paragraph|rtl|ltr|cut|copy|paste|increaseFontSize|decreaseFontSize|html|code|removeFormat|insertTable',
	initialContent: ""
};

if($.fn.wl_Fileexplorer) $.fn.wl_Fileexplorer.defaults = {
	url: 'elfinder/php/connector.php',
	toolbar: [
		['back', 'reload', 'open', 'select', 'quicklook', 'info', 'rename', 'copy', 'cut', 'paste', 'rm', 'mkdir', 'mkfile', 'upload', 'duplicate', 'edit', 'archive', 'extract', 'resize', 'icons', 'list', 'help']
	]
};

if($.fn.wl_Form) $.fn.wl_Form.defaults = {
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

if($.fn.wl_Gallery) $.fn.wl_Gallery.defaults = {
	group: 'wl_gallery',
	fancybox: {},
	onEdit: function (element, href, title) {},
	onDelete: function (element, href, title) {}
};

if($.fn.wl_Number) $.fn.wl_Number.defaults = {
	step: 1,
	decimals: 0,
	start: 0,
	min: null,
	max: null,
	mousewheel: true,
	onChange: function (value) {},
	onError: function (value) {}
};

if($.fn.wl_Password) $.fn.wl_Password.defaults = {
	confirm: true,
	showStrength: true,
	words: ['too short', 'bad', 'medium', 'good', 'very good', 'excellent'],
	minLength: 3,
	text: {
		confirm: 'please confirm',
		nomatch: 'password doesn\'t match'
	}
};

if($.fn.wl_Slider) $.fn.wl_Slider.defaults = {
	min: 0,
	//the min value
	max: 100,
	//the max value
	step: 1,
	//steps
	animate: false,
	disabled: false,
	orientation: 'horizontal',
	range: false,
	mousewheel: true,
	connect: null,
	//id of the connected input field
	onSlide: function (value) {},
	//triggers on a slide event
	onChange: function (value) {} //triggers on a change event
};

if($.fn.wl_Time) $.fn.wl_Time.defaults = {
	step: 5,
	timeformat: 24,
	roundtime: true,
	time: null,
	value: null,
	mousewheel: true,
	onDateChange: function (offset) {},
	onHourChange: function (offset) {},
	onChange: function (value) {}
};

if($.fn.wl_Valid) $.fn.wl_Valid.defaults = {
	errorClass: 'error',
	instant: true,
	regex: /.*/,
	minLength: 0,
	onChange: function ($this, value) {},
	onError: function ($this, value) {}
};

if($.fn.wl_Mail) $.fn.wl_Mail.defaults = {
	regex: /^([\w-]+(?:\.[\w-]+)*)\@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$|(\[?(\d{1,3}\.){3}\d{1,3}\]?)$/i,
	onChange: function (element, value) {
		element.val(value.toLowerCase());
	}
};

if($.fn.wl_URL) $.fn.wl_URL.defaults = {
	regex: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w]))*\.+(([\w#!:.?+=&%@!\-\/]))?/,
	instant: false,
	onChange: function (element, value) {
		if (!/^(ftp|http|https):\/\//.test(value)) element.val('http://' + value).trigger('change.wl_Valid');
	}
};

if($.fn.wl_Widget) $.fn.wl_Widget.defaults = {
	collapsed: false,
	load: null,
	reload: false,
	removeContent: true,
	text: {
		loading: 'loading...',
		reload: 'reload',
		collapse: 'collapse widget',
		expand: 'expand widget'
	},
	onDrag: function () {},
	onDrop: function () {},
	onExpand: function () {},
	onCollapse: function () {}
};

