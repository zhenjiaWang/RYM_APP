define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $templete = require('core/templete');
	var checkInterval = 1000 * 60 * 60 * 24;
	checkUpdateData = function(j) {
		var curVer = plus.runtime.version;
		var inf = j[plus.os.name];
		if (inf) {
			$userInfo.put('updateInfo', JSON.stringify(inf));
			var srvVer = inf['version'];
			if (compareVersion(curVer, srvVer)) {
				var productWin = $windowManager.getById('product_user');
				if (productWin) {
					productWin.evalJS('showUpdate()');
				}
			}
		}
	};
	compareVersion = function(ov, nv) {
		if (!ov || !nv || ov == "" || nv == "") {
			return false;
		}
		var b = false,
			ova = ov.split(".", 4),
			nva = nv.split(".", 4);
		for (var i = 0; i < ova.length && i < nva.length; i++) {
			var so = ova[i],
				no = parseInt(so),
				sn = nva[i],
				nn = parseInt(sn);
			if (nn > no || sn.length > so.length) {
				return true;
			} else if (nn < no) {
				return false;
			}
		}
		if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
			return true;
		}
	};

	exports.execute = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/update',
			dataType: 'json',
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var update = jsonData['update'];
						if (update) {
							checkUpdateData(update);
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	};
});