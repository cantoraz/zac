debugMsg(LOG_LEVELS.info, 'Running script at document_start');

function isValidHost(doc) {
	return doc.location.host == 'dskb.cindey.local'
			|| doc.location.host == 't.dskb.cn';
}

if (isValidHost(document)) {
	chrome.extension.sendRequest( {
		msg : 't.dskb.cn'
	});
}
