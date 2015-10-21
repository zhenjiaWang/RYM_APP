define(function(require, exports, module) {
	var $common = require('core/common');
	var $inputManager = require('manager/input');
	var regObj = {
		"_pwd": /^[a-zA-Z][a-zA-Z0-9]{7,19}/,
		"_require": /.+/,
		"_email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"_phone": /(\d{2,5}-\d{7,8}?)/,
		"_mobile": /^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/,
		"_url": /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
		"_idCard": /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
		"_currency": /^\d+(\.\d+)?$/,
		"_number": /^\d+$/,
		"_number1": /^[0-9]\d*([.][1-9]{1})?$/,
		"_zip": /^[1-9]\d{5}$/,
		"_qq": /^[1-9]\d{4,8}$/,
		"_integer": /^[-\+]?\d+$/,
		"_double": /^[-\+]?\d+(\.\d+)?$/,
		"_english": /^[A-Za-z]+$/,
		"_chinese": /^[\u0391-\uFFE5]+$/,
		"_unSafe": /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
		"_upload": /[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]+/,
		"_date": /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/
	}
	var modeMapList = false;
	var modeErrorMapList = false;
	buildEvent = function (mid) {
        var mode = modeMapList.get(mid);
        if (mode) {
            var obj = $('#' + mid);
            if (obj) {
                var elem = $(obj).get(0);
                if (elem) {
                    $(obj).off('blur').on('blur', function () {
                        var mid = $(this).attr('id');
                        alert(mid);
                        if (mid) {
                            mid = mid.replaceAll('\\.', '\\.');
                            validate(mid);
                            var callback = mode['callback'];
                            if (callback && typeof  callback == 'function') {
                                callback(modeErrorMapList.get(mid));
                            }
                        }
                    });
                    if (mode['pattern']) {
                        $(mode['pattern']).each(function (i, o) {
                            if (o['type'].trim() == 'number') {
                                $(elem).css({imeMode: 'disabled'});
                                $(elem).attr({oncopy: 'return false', onpaste: 'return false'});
                                $(elem).bind('keypress', function (e) {
                                    e = (e) ? e : ((window.event) ? window.event : "")
                                    var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
                                    if ((keyCode >= 48 && keyCode <= 57) || (keyCode == 46 || keyCode == 45) || keyCode == 8) {
                                        e.returnValue = true;
                                    } else {
                                        e.returnValue = false;
                                        return false;
                                    }
                                });
                            } else if (o['type'].trim() == 'int') {
                                $(elem).css({imeMode: 'disabled'});
                                $(elem).attr({oncopy: 'return false', onpaste: 'return false'});
                                $(elem).bind('keypress', function (e) {
                                    e = (e) ? e : ((window.event) ? window.event : "")
                                    var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
                                    if ((keyCode >= 48 && keyCode <= 57) || keyCode == 8) {
                                        e.returnValue = true;
                                    } else {
                                        e.returnValue = false;
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
    };
	buildExp = function(condition, value) {
		var conditions = condition.ToCharArray();
		var exp = '';
		var history = '';
		$.each(conditions, function(i, o) {
			if (i == 0 && o != '(') {
				exp += value + o;
			} else {
				if (o.trim() == '(') {
					exp += o + value;
				} else if (o.trim() == '(') {
					exp += o;
				} else if (o.trim() == '>' || o.trim() == '<') {
					exp += o;
				} else if (o.trim() == '=' && o.trim() != history.trim()) {
					exp += o;
				} else if (o.trim() == '=' && o.trim() == history.trim()) {
					exp += o;
				} else {
					exp += o;
				}
			}
			history = o;
		});
		return exp;
	};
	refresh = function(result, elem, mode, msg) {
		modeErrorMapList.put(mode['id'], result);
		var li = $(elem).closest('li');
		if (li) {
			var controlType = $(li).attr('controlType');
			var errorEL = false;
			if (controlType) {
				if (controlType == 'checkbox' || controlType == 'radio') {
					errorEL = false;
				} else {
					errorEL = li;
				}
				if (result) {
					if ($(errorEL).hasClass('has-error')) {
						$(errorEL).removeClass('has-error');
					}
				} else {
					var lableTxtObj = $('.lableTxt', errorEL);
					$(lableTxtObj).text(msg);
					if (!$(errorEL).hasClass('has-error')) {
						$(errorEL).addClass('has-error');
					}
					$common.touchSE(lableTxtObj, function(event, startTouch, o) {}, function(event, o) {
						if ($(errorEL).hasClass('has-error')) {
							$(errorEL).removeClass('has-error');
							$(elem).get(0).focus();
						}
					});
				}
			}
		}
	};
	validateMeans = function(elem, v, mode) {
		var inputType = $(elem).attr('type');
		var badInput = false;
		if (inputType) {
			if (inputType == 'number') {
				badInput = elem.validity.badInput;
			}
		}
		var result = false;
		var msg = '';
		if (!mode['required']) {
			if (v.trim() == '' && !badInput) {
				return true;
			}
		}
		if (mode['pattern']) {
			$(mode['pattern']).each(function(i, pattern) {
				result = false;
				msg = pattern.msg;
				switch (pattern.type.trim()) {
					case 'blank':
						if (badInput) {
							result = true;
						} else {
							if (pattern.exp.trim() == '!=') {
								result = v.trim() != '';
							} else if (pattern.exp.trim() == '==') {
								result = v.trim() == '';
							}
						}
						refresh(result, elem, mode, msg);
						break;
					case 'length':
						var exp = buildExp(pattern.exp, v.length);
						result = eval(exp);
						refresh(result, elem, mode, msg);
						break;
					case 'number':
						if (badInput) {
							result = false;
						} else {
							if (pattern.exp.trim() == '!=') {
								result = v.IsNumeric() == false;
							} else if (pattern.exp.trim() == '==') {
								result = v.IsNumeric()
							} else {
								if (v.IsNumeric()) {
									var exp = buildExp(pattern.exp, v.trim());
									result = eval(exp);
								}
							}
						}

						refresh(result, elem, mode, msg);
						break;
					case 'int':
						if (badInput) {
							result = false;
						} else {
							if (pattern.exp.trim() == '!=') {
								result = v.IsInt() == false;
							} else if (pattern.exp.trim() == '==') {
								result = v.IsInt()
							} else {
								if (v.IsInt()) {
									var exp = buildExp(pattern.exp, v.trim());
									result = eval(exp);
								}
							}
						}
						refresh(result, elem, mode, msg);
						break;
					case 'eq':
						result = v.trim() == pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case '!eq':
						result = v.trim() != pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case 'gt':
						result = v.trim() > pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case 'ge':
						result = v.trim() >= pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case 'lt':
						result = v.trim() < pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case 'le':
						result = v.trim() <= pattern.exp;
						refresh(result, elem, mode, msg);
						break;
					case 'reg':
						if (pattern.exp == '_any') {
							result = true;
						} else {
							result = regObj[pattern.exp].test(v.trim());
						}
						refresh(result, elem, mode, msg);
						break;
					case 'radio':

						break;
					case 'ajax':

						break;
				}
				if (!result) {
					return false;
				}
			});
		}
		return result;
	};
	isBlank = function(el) {
		var inputValue = $(el).val();
		var inputType = $(el).attr('type');
		var blank = false;
		if (inputType == 'number') {
			var badInput = $(el).get(0).validity.badInput;
			if ($.trim(inputValue).length <= 0 && !badInput) {
				blank = true;
			}
		} else {
			if ($.trim(inputValue).length <= 0) {
				blank = true;
			}
		}
		if (inputType == 'hidden') {
			blank = false;
		}
		return blank;
	};
	validate = function(el, mid) {
		var mode = modeMapList.get(mid);
		if (mode) {
			var blank = isBlank(el);
			if ($(el).hasClass('inputFocus')) {
				$(el).removeClass('inputFocus');
			}
			var inputValue = $(el).val();
			if (blank) {
				if ($(el).closest('li').size() > 0) {
					var parentObj = $(el).closest('li');
					if (parentObj) {
						if (mode['required']) {
							if (!$(parentObj).hasClass('has-error')) {
								$(parentObj).addClass('has-error');
								var elem = $(el).get(0);
								result = validateMeans(elem, inputValue, mode);
							}
						}
					}
				}
			} else {
				var elem = $(el).get(0);
				result = validateMeans(elem, inputValue, mode);
			}
		}
	};
	exports.init = function(modes) {
		if (modes) {
			$(modes).each(function(i, mode) {
				exports.addMode(mode);
			});
			exports.setUp();
		}
	};
	exports.addMode = function(mode,be) {
		if (mode) {
			if (mode['id']) {
				if (!modeMapList) {
					modeMapList = new HashMap();
				}
				if(!modeMapList.containsKey(mode['id'])){
                    modeMapList.put(mode['id'], mode);
                }
			}
		}
	};
	exports.removeMode = function(id) {
		modeMapList.remove(id);
		modeErrorMapList.remove(id);
		$('#' + id).off('blur');
		$('#' + id).closest('li').removeClass('has-error');
	};
	exports.clear = function() {
		if (modeMapList) {
			var keys = modeMapList.keys();
			if (keys) {
				for (var index = 0; index < modeMapList.size(); index++) {
					var mode = modeMapList.get(keys[index]);
					if (mode) {
						$('#' + mode['id']).off('blur');
						$('#' + mode['id']).closest('li').removeClass('has-error');
					}
				}
			}
			modeMapList.clear();
			modeErrorMapList.clear();
		}

	};
	exports.setUp = function() {
		if (modeMapList) {
			var keys = modeMapList.keys();
			if (keys) {
				if (!modeErrorMapList) {
					modeErrorMapList = new HashMap();
				}
				for (var index = 0; index < modeMapList.size(); index++) {
					var mode = modeMapList.get(keys[index]);
					if (mode) {
						modeErrorMapList.put(mode['id'], false);
						var obj = $('#' + mode['id']);
						if (obj) {
							var li = $(obj).closest('li');
							if (li) {
								var controlType = $(li).attr('controlType');
								if (controlType) {
									if (controlType.endsWith('password') || controlType.endsWith('number') || controlType.endsWith('text')) {
										if (mode['required']) {
											var errorMsg = mode['msg'];
											if (!errorMsg || errorMsg == '') {
												errorMsg = '必填';
											}
											$('.lableTxt', li).text(errorMsg);
										}
										$inputManager.blur(obj, function(el, e) {
											var uid = $(el).attr('id');
											if (uid) {
												validate(el, uid);
												var currentMode = modeMapList.get(uid);
												var callback = currentMode['callback'];
												if (callback && typeof callback == 'function') {
													callback(modeErrorMapList.get(uid));
												}
											}
										}, true);
									}
								}
							}
						}
					}
				}
			}
		}
	};
	exports.getMode = function(id) {
		if (modeMapList) {
			return modeMapList.get(id);
		}
	};
	exports.setMode = function(id, mode) {
		if (modeMapList) {
			modeMapList.put(id, mode);
		}
	};
	exports.check = function(id) {
		var obj = $('#' + id);
		if (obj) {
			var el = $(obj).get(0);
			if (el) {
				validate(el, id);
			}
		}
	};
	exports.checkAll = function() {
		if (modeMapList) {
			var keys = modeMapList.keys();
			if (keys) {
				for (var index = 0; index < modeMapList.size(); index++) {
					var mode = modeMapList.get(keys[index]);
					if (mode) {
						var obj = $('#' + mode['id']);
						if (obj) {
							var el = $(obj).get(0);
							if (el) {
								validate(el, mode['id']);
							}
						}
					}
				}
			}
		}
	};
	exports.isPassed = function(id) {
		var isPassCount = 0;
		if (modeErrorMapList) {
			var keys = modeErrorMapList.keys();
			if (keys) {
				for (var index = 0; index < modeErrorMapList.size(); index++) {
					var mode = modeMapList.get(keys[index]);
					if (mode) {
						if (mode['required']) {
							var pass = modeErrorMapList.get(keys[index]);
							if (!pass) {
								isPassCount++;
							}
						} else {
							var el = $('#' + keys[index]);
							if (el) {
								var blank = isBlank(el);
								if (!blank) {
									var pass = modeErrorMapList.get(keys[index]);
									if (!pass) {
										isPassCount++;
									}
								}
							}
						}
					}
				}
			}
		}
		if (isPassCount == 0) {
			return true;
		} else {
			return false;
		}
	};
});