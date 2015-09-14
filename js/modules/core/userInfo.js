define(function(require, exports, module) {
	exports.isSupport = function(localStorageJson) {
		return window.localStorage;
	};
	exports.putJson = function(localStorageJson) {
		if (window.localStorage) {
			if (localStorageJson) {
				for (var key in localStorageJson) {
					if(typeof localStorageJson[key]=='object'){
						localStorage.setItem(key, JSON.stringify(localStorageJson[key]));
					}else{
						localStorage.setItem(key, localStorageJson[key].toString());
					}
				}
			}
		}
	};
	exports.put = function(key, value) {
		if (window.localStorage) {
			localStorage.setItem(key, value);
		}
	};
	exports.removeItem = function(key) {
		if (window.localStorage) {
			localStorage.removeItem(key);
		}
	};
	exports.get = function(key) {
		if (window.localStorage) {
			return $.trim(localStorage.getItem(key));
		}
	};
	exports.isAuthorize = function() {
		var flag = false;
		if (window.localStorage) {
			var authorize = localStorage.getItem('authorize');
			if (authorize && authorize == '0') {
				var mobilePhone = localStorage.getItem('mobilePhone');
				var password = localStorage.getItem('password');
				if (mobilePhone && password) {
					if ($.trim(mobilePhone).length > 0 && $.trim(password).length > 0) {
						flag = true;
					}
				}
			}
		}
		return flag;
	};
});
