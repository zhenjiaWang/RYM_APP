define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $validator = require('core/validator');
	var queryMap = parseURL();
	var typeId = queryMap.get('typeId');
	var typeName = queryMap.get('typeName');
	var attToken = queryMap.get('attToken');
	addFileSuccess = function(src) {
		var jsonDataStr = $userInfo.get('uploadFiles');
		if (jsonDataStr) {
			var jsonData = JSON.parse(jsonDataStr);
			if (!$('#imgUL').is(':visible')) {
				$('#imgUL').show();
			}
			$('div', '#imgUL').append('<span type="' + jsonData['type'] + '" uid="' + jsonData['id'] + '"><img src="' + src + '"><em>删 除</em></span>\n');
			bindEvent();
			$userInfo.removeItem('uploadFiles');
			$userInfo.put('attCount', $('div', '#imgUL').find('img').size() + '');
		}
	};
	saveData = function(numSeq) {
		$nativeUIManager.watting('正在发布产品...');
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(numSeq);
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/saveMobile',
				dataType: 'json',
				data: $('#editForm').serialize().replace(/\+/g, " "),
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								var footerWin = $windowManager.getById('product_add_footer');
								if (footerWin) {
									footerWin.close();
								}
								var addWin = $windowManager.getById('product_add');
								if (addWin) {
									addWin.close();
								}
							}, 300);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
				}
			});
		});
	};

	deleteAtt = function(attId, type) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/deleteAtt',
				dataType: 'json',
				data: {
					id: attId,
					type: type,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('删除成功!');
							$('span[uid="' + attId + '"]', '#imgUL').remove();
							$nativeUIManager.wattingClose();
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '删除失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '删除失败', 'OK', function() {});
				}
			});
		});
	};
	selectItem = function(controlId, uid, text) {
		var li = $('#' + controlId).closest('li');
		if (li) {
			$('.placeTxt', li).text(text);
			$('#' + controlId).val(uid);
			$validator.check(controlId);
		}
	};
	loadOrg = function(orgCompany) {
		$nativeUIManager.watting('请稍等...');
		var controlValue = $('#productOrgId').val();
		$windowManager.create('selectOrg', 'selectOrg.html?title=' + orgCompany + '&controlId=productOrgId&controlValue=' + controlValue + '&win=product_add_product', false, true, function(show) {
			show();
			$nativeUIManager.wattingClose();
		});
	};
	loadPayoffType = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/payOffTypeList',
			dataType: 'json',
			data: {
				typeId: $('#typeId').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var payOffTypeList = jsonData['payOffTypeList'];
						if (payOffTypeList && $(payOffTypeList).size() > 0) {
							$userInfo.put("selectList", JSON.stringify(payOffTypeList));
							var controlValue = $('#payOffType').val();
							$windowManager.create('select', 'select.html?title=收益类型&controlId=payOffType&controlValue=' + controlValue + '&win=product_add_product', false, true, function(show) {
								show();
								$nativeUIManager.wattingClose();
							});
						}
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
			}
		});
	};
	bindEvent = function() {
		$('#remarksDIV').off('valuechange').on('valuechange', function(e) {
			var value = $(this).text();
			if (value) {
				if (value != '') {
					$('#remarks').val($(this).html());
					$validator.check('remarks');
				}
			}
		});
		$common.touchSE($('span', '#imgUL'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $(o).attr('uid');
			var type = $(o).attr('type');
			if (uid && type) {
				$nativeUIManager.confirm('提示', '你确定删除此图片?删除将无法恢复!', ['确定', '取消'], function() {
					deleteAtt(uid, type);
				}, function() {

				});
			}
		});


		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$nativeUIManager.watting('请选择发布栏位...');
					window.setTimeout(function() {
						var productName = $('#productName').val();
						$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_add_product&saveFunction=saveData', false, true, function(show) {
							show();
							$nativeUIManager.wattingClose();
						});
					}, 1500);
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});

		$common.touchSE($('#selectProductOrg'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/common/common/orgCompanyList',
				dataType: 'json',
				data: {},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingClose();
							var orgCompanyList = jsonData['orgCompanyList'];
							if (orgCompanyList && $(orgCompanyList).size() > 0) {
								$nativeUIManager.confactionSheetirm('请选择机构公司', '取消', orgCompanyList,
									function(index) {
										if (index > 0) {
											var orgCompany = orgCompanyList[index - 1]['title'];
											if (orgCompany) {
												loadOrg(orgCompany);
											}
										}
									});
							}
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
				}
			});
		});

		$common.touchSE($('#selectPayOffType'), function(event, startTouch, o) {}, function(event, o) {
			loadPayoffType();
		});
		$common.touchSE($('#selectDate'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请先选择募集开始日期');
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
				$nativeUIManager.pickDate(function(date1) {
					var startDateStr = date1.Format('yyyy-MM-dd');
					var endDateStr = null;
					$nativeUIManager.watting('募集开始日期是:' + startDateStr + ',选择募集结束时间');
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
						$nativeUIManager.pickDate(function(date2) {
							endDateStr = date2.Format('yyyy-MM-dd');
							var ckFlag = checkDate(startDateStr, endDateStr);
							if (!ckFlag) {
								$nativeUIManager.alert('错误提示', '结束日期不能小于开始日期', 'OK', function() {});
								$('#startDate').val('');
								$('#endDate').val('');
								return false;
							}
							$('#startDate').val(startDateStr);
							$('#endDate').val(endDateStr);
							$('.placeTxt', '#selectDate').text(startDateStr + ' 至 ' + endDateStr);
							$validator.check('startDate');
							$validator.check('endDate');
						}, function() {});
					}, 1000);
				}, function() {});
			}, 1000);
		});

		$common.touchSE($('#selectExpireDate'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.pickDate(function(date) {
				var dateStr = date.Format('yyyy-MM-dd');
				$('#expireDate').val(dateStr);
				$('.placeTxt', '#selectExpireDate').text(dateStr);
				$validator.check('expireDate');
			}, function() {});
		});


	};
	bindValidate = function() {
		$validator.init([{
			id: 'productName',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入名称'
			}, {
				type: 'length',
				exp: '<=40',
				msg: '名称不能大于40字'
			}]
		}, {
			id: 'productOrgId',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择发行机构'
			}]
		}, {
			id: 'payOffType',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择收益类型'
			}],
			callback: function(t) {
				if (t) {
					if ($('#payOffType').val() == '固定收益') {
						$validator.addMode({
							id: 'yield',
							required: true,
							pattern: [{
								type: 'blank',
								exp: '!=',
								msg: '请输入预期收益率'
							}, {
								type: 'number',
								exp: '==',
								msg: '预期收益率格式不正确'
							}]
						});
						$validator.setUp();
					} else {
						$validator.removeMode('yield');
					}
				}
			}
		}, {
			id: 'purchaseAmount',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入起购金额'
			}, {
				type: 'number',
				exp: '==',
				msg: '起购金额格式不正确'
			}, {
				type: 'reg',
				exp: '_number1',
				msg: '正整数或者保留一位小数'
			}]
		}, {
			id: 'startDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集开始日期'
			}]
		}, {
			id: 'endDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集结束日期'
			}]
		}, {
			id: 'accrualDay',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入计息天数'
			}, {
				type: 'int',
				exp: '==',
				msg: '计息天数格式不正确'
			}]
		}, {
			id: 'expireDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择到期日'
			}]
		}, {
			id: 'remarks',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入产品描述'
			}]
		}]);
		$validator.setUp();
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$('#typeId').val(typeId);
		$('.placeTxt', '#selectProductType').text(typeName);
		$('#attToken').val(attToken);
		bindValidate();
		bindEvent();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			var footerWin = $windowManager.getById('product_add_footer');
			if (footerWin) {
				footerWin.close();
			}
		});
		$userInfo.put('attCount', $('div', '#imgUL').find('img').size() + '');
		var obj = $windowManager.current();
		if (obj) {
			obj.setStyle({
				'softinputMode': 'adjustResize'
			});
		}
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});