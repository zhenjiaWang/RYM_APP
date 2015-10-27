define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $validator = require('core/validator');
	var queryMap = parseURL();
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
		$nativeUIManager.watting('正在保存产品...');
		var financialCount = $('.productDataUL').size();
		if (financialCount <= 0) {
			$nativeUIManager.alert('提示', '没有理财产品无法保存', 'OK', function() {});
			return false;
		}
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(numSeq);
			$('#financialCount').val(financialCount);
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/edit',
				dataType: 'json',
				data: $('#editForm').serialize().replace(/\+/g, " "),
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('保存成功 重新加载产品');
							var productViewHeader = $windowManager.getById('product_view_header');
							if (productViewHeader) {
								productViewHeader.evalJS('loadViewData()');
								window.setTimeout(function() {
									$windowManager.reloadOtherWindow('product_view', true);
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										var footerWin = $windowManager.getById('product_edit_footer');
										if (footerWin) {
											footerWin.close();
										}
									}, 500);
								}, 1500);
							}
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
	
	bindEvent = function() {
		


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
					saveData();
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});


		dynamicEvent(1);
	};
addProduct = function() {
		var size = $('.productDataUL').size();
		if (size) {
			var index = (size + 1);
			var ul = $('.productDataUL').eq(0).clone(false);
			if (ul) {
				$('.delProduct').hide();
				$('li', ul).removeClass('has-error');
				$(ul).attr('index', index);
				var codeObj = $('input[name="code_1"]', ul);
				if (codeObj) {
					$(codeObj).attr('name', 'code_' + index).attr('id', 'code_' + index).val('');
				}
				var nameObj = $('input[name="name_1"]', ul);
				if (nameObj) {
					$(nameObj).attr('name', 'name_' + index).attr('id', 'name_' + index).val('');
				}
				var selectProductOrgObj = $('li[name="selectProductOrg_1"]', ul);
				if (selectProductOrgObj) {
					$(selectProductOrgObj).attr('name', 'selectProductOrg_' + index).attr('id', 'selectProductOrg_' + index).find('.placeTxt').text('请选择');
				}
				var productOrgIdObj = $('input[name="productOrgId_1"]', ul);
				if (productOrgIdObj) {
					$(productOrgIdObj).attr('name', 'productOrgId_' + index).attr('id', 'productOrgId_' + index).val('');
				}
				var selectPayOffTypeObj = $('li[name="selectPayOffType_1"]', ul);
				if (selectPayOffTypeObj) {
					$(selectPayOffTypeObj).attr('name', 'selectPayOffType_' + index).attr('id', 'selectPayOffType_' + index).find('.placeTxt').text('请选择');
				}
				var payOffTypeObj = $('input[name="payOffType_1"]', ul);
				if (payOffTypeObj) {
					$(payOffTypeObj).attr('name', 'payOffType_' + index).attr('id', 'payOffType_' + index).val('');
				}
				var purchaseAmountObj = $('input[name="purchaseAmount_1"]', ul);
				if (purchaseAmountObj) {
					$(purchaseAmountObj).attr('name', 'purchaseAmount_' + index).attr('id', 'purchaseAmount_' + index).val('');
				}
				var selectDateObj = $('li[name="selectDate_1"]', ul);
				if (selectDateObj) {
					$(selectDateObj).attr('name', 'selectDate_' + index).attr('id', 'selectDate_' + index).find('.placeTxt').text('请选择');
				}
				var startDateObj = $('input[name="startDate_1"]', ul);
				if (startDateObj) {
					$(startDateObj).attr('name', 'startDate_' + index).attr('id', 'startDate_' + index).val('');
				}
				var endDateObj = $('input[name="endDate_1"]', ul);
				if (endDateObj) {
					$(endDateObj).attr('name', 'endDate_' + index).attr('id', 'endDate_' + index).val('');
				}
				var accrualDayObj = $('input[name="accrualDay_1"]', ul);
				if (accrualDayObj) {
					$(accrualDayObj).attr('name', 'accrualDay_' + index).attr('id', 'accrualDay_' + index).val('');
				}
				var selectExpireDateObj = $('li[name="selectExpireDate_1"]', ul);
				if (selectExpireDateObj) {
					$(selectExpireDateObj).attr('name', 'selectExpireDate_' + index).attr('id', 'selectExpireDate_' + index).find('.placeTxt').text('请选择');
				}
				var expireDateObj = $('input[name="expireDate_1"]', ul);
				if (expireDateObj) {
					$(expireDateObj).attr('name', 'expireDate_' + index).attr('id', 'expireDate_' + index).val('');
				}
				var yieldObj = $('input[name="yield_1"]', ul);
				if (yieldObj) {
					$(yieldObj).attr('name', 'yield_' + index).attr('id', 'yield_' + index).val('');
				}
			}
			$('#descUL').before('<p class="productTitle title font14 clearfix alignright" style="position:relative;bottom:-5px;"><span class="floatleft marl10">第' + index + '个理财产品</span></p>');
			$('#descUL').before(ul);
		}
	};
	bindValidate = function() {
		$validator.init([{
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
	loadData = function() {
		var editJsonStr = $userInfo.get('editJson');
		console.info(editJsonStr)
		if (editJsonStr) {
			var editJson = JSON.parse(editJsonStr);
			if (editJson) {
				var productInfo = editJson['productInfo'];
				var financial = editJson['financial'];
				if (productInfo && financial) {
					$('#id').val(editJson['id']);
					$('#typeId').val(productInfo['typeId']);
					$('#productName').val(productInfo['name']);
					var financialArray = financial['financialArray'];
					if (financialArray && $(financialArray).size() > 0) {
						var index = 1;
						$(financialArray).each(function(i, financialObj) {
							if (i > 0) {
								addProduct();
							}
						});
						window.setTimeout(function() {
							$(financialArray).each(function(i, financialObj) {
								$('#code_' + index).val(financialObj['code']);
								$('#name_' + index).val(financialObj['name']);
								$('#productOrgId_' + index).val(financialObj['orgId']);
								$('.placeTxt', '#selectProductOrg_' + index).text(financialObj['orgName']);

								$('#payOffType_' + index).val(financialObj['payOffType']);
								$('.placeTxt', '#selectPayOffType_' + index).text(financialObj['payOffType']);

								$('#yield_' + index).val(financialObj['yield']);
								$('#purchaseAmount_' + index).val(financialObj['purchaseAmount']);
								$('#startDate_' + index).val(financialObj['startDate']);
								$('#endDate_' + index).val(financialObj['endDate']);

								$('.placeTxt', '#selectDate_' + index).text(financialObj['startDate'] + ' 至 ' + financialObj['endDate']);
								$('#accrualDay_' + index).val(financialObj['accrualDay']);
								$('#expireDate_' + index).val(financialObj['expireDate']);
								$('.placeTxt', '#selectExpireDate_' + index).text(financialObj['expireDate']);
								index++;
							});
						}, 500);
					}
					$('#remarks').val(productInfo['remarks']);
					var attArray = editJson['attArray'];
					if (attArray && $(attArray).size() > 0) {
						if (!$('#imgUL').is(':visible')) {
							$('#imgUL').show();
						}
						$(attArray).each(function(i, o) {
							var src = o['imgSrc'] + '!productEdit';
							$('div', '#imgUL').append('<span type="' + o['type'] + '" uid="' + o['id'] + '"><img src="' + src + '"><em>删 除</em></span>\n');
						});
					}
					bindEvent();
				}
			}
		}
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$('#attToken').val(attToken);
		bindValidate();
		loadData();
		autosize(document.querySelectorAll('.textBox'));
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.confirm('提示', '是否放弃保存?', ['确定', '取消'], function() {
				var footerWin = $windowManager.getById('product_edit_footer');
				if (footerWin) {
					footerWin.close();
				}
			}, function() {

			});
		});
		$userInfo.put('attCount', $('div', '#imgUL').find('img').size() + '');
//		var obj = $windowManager.current();
//		if (obj) {
//			obj.setStyle({
//				'softinputMode': 'adjustResize'
//			});
//		}
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});