define(function(require, exports, module) {
	var $common = require('core/common');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $userInfo = require('core/userInfo');
	var shares = null;
	var shareFlag = false;
	var service = false;
	shareStart = function(ex, shareObj, sharePic) {
		var shareUrl = String.formatmodel($templete.weixinShare(), {
			url: shareObj['url']
		});
		var msg = {
			content: shareObj['content'],
			extra: {
				scene: ex
			},
			title: shareObj['title'],
			href: shareUrl
		};
		msg.thumbs = [sharePic];
		msg.pictures = [sharePic];
		service.send(msg, function() {}, function(e) {});
		if (sharePic != '_www/logo.png') {
			window.setTimeout(function() {
				plus.io.resolveLocalFileSystemURL(sharePic, function(entry) {
					if (entry) {
						entry.remove();
					}
				}, function(e) {
				});
			}, 2000);
		}
	}
	shareMessage = function(ex, shareObj, userId) {
		if (userId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/common/common/getHeadImg',
				dataType: 'json',
				data: {
					userId: userId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							shareStart(ex, shareObj, jsonData['headImgUrl']);
						} else {
							shareStart(ex, shareObj, '_www/logo.png');
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					shareStart(ex, shareObj, '_www/logo.png');
				}
			});
		}
	};
	exports.auth = function(id) {
		plus.share.getServices(function(s) {
			shares = {};
			for (var i in s) {
				var t = s[i];
				shares[t.id] = t;
				service = shares[id];
				if (service.authenticated) {
					shareFlag = true;
				} else {
					service.authorize(function() {
						shareFlag = true;
					}, function(e) {
						$nativeUIManager.alert('提示', '暂时无法分享' + e.code + " - " + e.message, 'OK', function() {});
					});
				}
			}
		}, function(e) {
			shareFlag = false;
			$nativeUIManager.alert('提示', '暂时无法分享' + e.code + " - " + e.message, 'OK', function() {});
		});
	};
	exports.share = function(ex, shareObj, userId) {
		if (shareFlag) {
			shareMessage(ex, shareObj, userId);
		}
	};

});