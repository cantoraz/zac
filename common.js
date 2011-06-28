var LOG_LEVELS = {
	'none' : 0,
	'error' : 1,
	'info' : 2
};

var currLogLevel = LOG_LEVELS.none;

function debugMsg(logLevel, text) {
	if (logLevel <= currLogLevel) {
		console.log('bot extensioin: ' + text);
	}
}
