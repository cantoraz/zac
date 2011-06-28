debugMsg(LOG_LEVELS.info, 'Running script at document_idle');

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.msg == 'twit') {
		if (document.location.host == 't.dskb.cn') {
			if ($('#form_notice').length) {
				$('<iframe>').attr({'id' : 'iframe_bot'}).css({'display' : 'none'}).appendTo('body');
				$('#form_notice #notice_data-text').val(request.text);
				$('#form_notice').attr({'target' : 'iframe_bot'}).submit();
				setTimeout('document.location.reload()', 3000);
			}
		} else if (document.location.host == 'dskb.cindey.local') {
			$('body').append(request.text).append('<br />');
		}
		sendResponse({farewell: 'twitted'});
	} else {
		sendResponse({});
	}
});
