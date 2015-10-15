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
	exports.share = function(id, ex, shareObj) {
		plus.share.getServices(function(s) {
			shares = {};
			for (var i in s) {
				var t = s[i];
				shares[t.id] = t;
				shareFlag = true;
			}
		}, function(e) {
			shareFlag = false;
			$nativeUIManager.alert('提示', '分享失败' + e.code + " - " + e.message, 'OK', function() {});
		});
		if (shareFlag) {
			var s = shares[id];
			if (s.authenticated) {
				shareMessage(s, ex, shareObj);
			} else {
				s.authorize(function() {
					shareMessage(s, ex, shareObj);
				}, function(e) {
					$nativeUIManager.alert('提示', '分享失败' + e.code + " - " + e.message, 'OK', function() {});
				});
			}
		}
	};

});