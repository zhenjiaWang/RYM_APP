define(function(require, exports, module) {
	var $common = require('core/common');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $userInfo = require('core/userInfo');
	var shares = null;
	var shareFlag = false;
	shareMessage = function(s, ex, shareObj) {
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
		s.send(msg, function() {}, function(e) {});
	};
	exports.auth = function(id) {
		plus.share.getServices(function(s) {
			shares = {};
			for (var i in s) {
				var t = s[i];
				shares[t.id] = t;
				var s = shares[id];
				if (s.authenticated) {
					shareFlag = true;
				} else {
					s.authorize(function() {
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
	exports.share = function(id, ex, shareObj) {
		if (shareFlag) {
			shareMessage(s, ex, shareObj);
		}
	};

});