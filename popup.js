$(function($) {
	$('#team_1 input[type=text], #team_2 input[type=text], #settings input[type=text]').each(function(i, item) {
		//load saved data
		if (window.localStorage[$(this).attr('name')]) {
			$(this).val(window.localStorage[$(this).attr('name')]);
			//console.log('load "' + $(this).attr('name') + '" = "' + window.localStorage[$(this).attr('name')] + '"');
		}
		
		// register data change
		$(item).change(function() {
			window.localStorage[$(this).attr('name')] = $(this).val();
			//console.log('save "' + $(this).attr('name') + '" = "' + $(this).val() + '"');
		});
	});
	
	// register test button
	$('#btn_test').click(function() {
		var text = '... ' + getNow(new Date());
		chrome.extension.sendRequest({
			msg : 'btn_test',
			text : text
		});
		$('#info').val(text);
	});

	// register timing button
	$('#btn_timing').click(function() {
		var text = getTextTiming();
		chrome.extension.sendRequest({
			msg : 'btn_timing',
			text : text
		});
		$('#info').val(text);
	});

	// register cheeron button
	$('#btn_cheeron').click(function() {
		var text = getTextCheeron($('#team_' + Math.round(Math.random() + 1) + '_name').val());
		chrome.extension.sendRequest({
			msg : 'btn_cheeron',
			text : text
		});
		$('#info').val(text);
	});

	// register cheeron team 1 button
	$('#btn_cheeron_1').click(function() {
		var text = getTextCheeron($('#team_1_name').val());
		chrome.extension.sendRequest({
			msg : 'btn_cheeron_1',
			text : text
		});
		$('#info').val(text);
	});

	// register cheeron team 2 button
	$('#btn_cheeron_2').click(function() {
		var text = getTextCheeron($('#team_2_name').val());
		chrome.extension.sendRequest({
			msg : 'btn_cheeron_2',
			text : text
		});
		$('#info').val(text);
	});

	$('#team_1 input[type=button], #team_2 input[type=button]').each(function(i, item) {
		// register goal button
		$(item).click(function() {
			var team_name = $(this).closest('ul').prev().find('input').val();
			var player_no = $(this).prev().prev().val();
			var player_name = $(this).prev().val();
			var text = getTextGoal(team_name, player_no, player_name);
			chrome.extension.sendRequest({
				msg : 'btn_goal',
				text : text
			});
			$('#info').val(text);
		});
	});
});

var template_timing_bc = '还有%min\' %sec"开赛 %team_1 VS %team_2 现在是北京时间%now';
var template_timing_ad = '第%min分钟%sec秒 校时 北京时间%now';
var template_cheeron_bc = '还有%min\' %sec"开赛 挺%team~ 现在是北京时间%now';
var template_cheeron_ad = '%min\' %sec" %team队加油!';
var template_goal = '第%min分钟，%team队%playerno号%playername进球了！';
var time_halflength = 60 * 45;
var time_halftime = 900;

var now = null;

function getNow(now) {
	var mon = now.getMonth() + 1;
	var date = now.getDate();
	var hours = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	
	return now.getFullYear() + '-'
					+ (mon < 10 ? '0' + mon : mon) + '-'
					+ (date < 10 ? '0' + date : date) + ' '
					+ (hours < 10 ? '0' + hours : hours) + ':'
					+ (min < 10 ? '0' + min : min) + ':'
					+ (sec < 10 ? '0' + sec : sec);
}

function getDiff() {
	now = new Date();
	return Math.floor((now.getTime() - new Date($('#time_begin').val()).getTime()) / 1000);
}

function getDiffInMatch() {
	var diff = getDiff();
	if (diff < 0) {
		return diff;
	} else {
		diff = diff - $('#time_tune_1').val();
		if (diff <= (time_halflength + parseInt($('#time_added_1').val()))) {
			return diff;
		} else {
			return diff - parseInt($('#time_added_1').val()) - time_halftime - parseInt($('#time_tune_2').val());
		}
	}
}

function getMin(diff) {
	var min = diff / 60;
	return min >=0 ? Math.floor(min) : Math.ceil(min);
}

function getSec(diff) {
	return diff % 60;
}

function getTextTiming() {
	var diff = getDiffInMatch();
	var sec = getSec(diff);
	var min = getMin(diff);
	if (min < 0 || sec < 0) {
		return template_timing_bc
							.replace('%min', -min)
							.replace('%sec', -sec)
							.replace('%team_1', $('#team_1_name').val())
							.replace('%team_2', $('#team_2_name').val())
							.replace('%now', getNow(now));
	} else {
		return template_timing_ad
							.replace('%min', min + 1)
							.replace('%sec', sec)
							.replace('%now', getNow(now));
	}
}

function getTextCheeron(team_name) {
	var diff = getDiffInMatch();
	var sec = getSec(diff);
	var min = getMin(diff);
	if (min < 0 || sec < 0) {
		return template_cheeron_bc
							.replace('%min', -min)
							.replace('%sec', -sec)
							.replace('%team', team_name)
							.replace('%now', getNow(now));
	} else {
		return template_cheeron_ad
							.replace('%min', min)
							.replace('%sec', sec)
							.replace('%team', team_name);
	}
}

function getTextGoal(team_name, player_no, player_name) {
	var diff = getDiffInMatch();
	var sec = getSec(diff);
	var min = getMin(diff);
	if (min < 0 || sec < 0) {
		return null;
	} else {
		return template_goal
							.replace('%min', min + 1)
							.replace('%team', team_name)
							.replace('%playerno', player_no)
							.replace('%playername', player_name);
	}
}
