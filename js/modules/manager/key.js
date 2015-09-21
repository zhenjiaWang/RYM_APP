define(function(require, exports, module) {
	exports.backButton = function(backCallback) {
		if (typeof backCallback == 'function') {
			plus.key.addEventListener('backbutton', backCallback, false);
		}
	};
	exports.openSoftKeyboard = function(callback) {
		var osName = plus.os.name;
		if (osName) {
			if (osName == 'Android') {
				var webview = plus.android.currentWebview();
				plus.android.importClass(webview);
				webview.requestFocus();
				var Context = plus.android.importClass("android.content.Context");
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				if (typeof callback == 'function') {
					callback();
				}
			} else if (osName == 'iOS') {
				var webView = plus.webview.currentWebview().nativeInstanceObject();
				webView.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
				if (typeof callback == 'function') {
					callback();
				}
			}
		}
	};
});