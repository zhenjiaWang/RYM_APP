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
	loadFundType = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/fundTypeList',
			dataType: 'json',
			data: {},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var fundTypeList = jsonData['fundTypeList'];
						if (fundTypeList && $(fundTypeList).size() > 0) {
							$userInfo.put("selectList", JSON.stringify(fundTypeList));
							var controlValue = $('#fundType').val();
							$windowManager.create('select', 'select.html?title=基金类型&controlId=fundType&controlValue=' + controlValue + '&win=product_add_product', false, true, function(show) {
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

		$common.touchSE($('#selectFundType'), function(event, startTouch, o) {}, function(event, o) {
			loadFundType();
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
			id: 'fundType',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择基金类型'
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