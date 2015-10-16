define(function(require, exports, module) {
	exports.isSupport = function(localStorageJson) {
		return plus.storage;
	};
	exports.putJson = function(localStorageJson) {
		if (window.localStorage) {
			if (localStorageJson) {
				for (var key in localStorageJson) {
					if (typeof localStorageJson[key] == 'object') {
						plus.storage.setItem(key, JSON.stringify(localStorageJson[key]));
					} else {
						plus.storage.setItem(key, localStorageJson[key].toString());
					}
				}
			}
		}
	};
	exports.put = function(key, value) {
		if (plus.storage) {
			plus.storage.setItem(key, value);
		}
	};
	exports.removeItem = function(key) {
		if (plus.storage) {
			plus.storage.removeItem(key);
		}
	};
	exports.get = function(key) {
		if (plus.storage) {
			return $.trim(plus.storage.getItem(key));
		}
	};
	exports.clear = function(key) {
		if (plus.storage) {
			plus.storage.clear();
		}
	};

	exports.isAuthorize = function() {
		var flag = false;
		if (plus.storage) {
			var authorize = plus.storage.getItem('authorize');
			if (authorize && authorize == '0') {
				var authorizeType = plus.storage.getItem('authorizeType');
				if (authorizeType) {
					if (authorizeType == 'pwd') {
						var mobilePhone = plus.storage.getItem('mobilePhone');
						var password = plus.storage.getItem('password');
						if (mobilePhone && password) {
							if ($.trim(mobilePhone).length > 0 && $.trim(password).length > 0) {
								flag = true;
							}
						}
					} else if (authorizeType == 'weChat') {
						var unionId = plus.storage.getItem('unionId');
						var mobilePhone = plus.storage.getItem('mobilePhone');
						if (mobilePhone && unionId) {
							if ($.trim(mobilePhone).length > 0 && $.trim(unionId).length > 0) {
								flag = true;
							}
						}
					}
				}
			}
		}
		return flag;
	};
});