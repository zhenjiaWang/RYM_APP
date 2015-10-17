define(function(require, exports, module) {
	var $common = require('core/common');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $userInfo = require('core/userInfo');
	var shares = null;
	var shareFlag = false;
	var service=false;
	shareMessage = function(ex, shareObj) {
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
		msg.thumbs = ["_www/logo.png"];
		msg.pictures = ["_www/logo.png"];
		service.send(msg, function() {}, function(e) {});
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
	exports.share = function(ex, shareObj) {
		if (shareFlag) {
			shareMessage(ex, shareObj);
		}
	};

});