define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $keyManager = require('manager/key');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	reset = function() {
		$('#content').attr('replyUserId', '').text('');
		$('#replyTip').text('').hide();
	};
	reply = function(userId, userName) {
		$nativeUIManager.watting();
		window.setTimeout(function() {
			$keyManager.openSoftKeyboard(function() {
				$('#replyTip').text('回复 ' + userName).show();
				$('#content').attr('replyUserId', userId).text('').get(0).focus();
				$nativeUIManager.wattingClose();
			});
		}, 500)
	};
	bindEvent = function() {
		$common.touchSE($('.btnSend'), function(event, startTouch, o) {}, function(event, o) {
			var content = $('#content').text();
			if (content && content != '') {
				var replyUserId = $('#content').attr('replyUserId');
				var commentWindow = $windowManager.getById('product_comment');
				if (commentWindow) {
					commentWindow.evalJS('sendComment("' + content + '","' + replyUserId + '",reset)');
				}
			} else {
				$nativeUIManager.alert('提示', '请先输入评论内容', 'OK', function() {});
			}
		});
		$('#content').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode) {
				var value = $(this).text();
				if (value && value != '') {
					$('#replyTip').hide();
				}
			}
		});
		$('#content').off('keyup').on('keyup', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode) {
				var value = $(this).text();
				if (value == '') {
					$('#replyTip').show();
				}
			}
		});
		$('#content').off('blur').on('blur', function(e) {
			var value = $(this).text();
			if (value && value != '') {
				$('#replyTip').hide();
			}
		});
	};
	loadWebview = function() {
		var commontFooter = plus.webview.create("commentHeader.html?id=" + id, "product_commentHeader", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		commontFooter.addEventListener("loaded", function() {
			$windowManager.current().append(commontFooter);
		}, false);
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});