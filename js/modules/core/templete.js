define(function(require, exports, module) {
	exports.getUpdate = function() {
		var update = new StringBuilder();
		update.append('<p class="font14">{title}</p>\n');
		update.append('<p>最新版本：{version}</p>\n');
		update.append('<p>{note}</p>\n');
		return update.toString();
	};
	exports.selectItem = function() {
		var selectItem = new StringBuilder();
		selectItem.append('<li uid="{uid}" class="clearfix">\n');
		selectItem.append('<span class="lable txt_hidden">{text}</span>\n');
		selectItem.append('</li>\n');
		return selectItem.toString();
	};
	exports.saleNumItem = function(moveFlag) {
		var selectItem = new StringBuilder();
		selectItem.append('<li uid="{uid}"  index="{index}" type="{action}" class="clearfix" style="top:{top}px;">\n');
		if (moveFlag) {
			selectItem.append('<span class="tips {typeClass} strong">{typeName}</span>\n');
		}else{
			selectItem.append('<span class="icon icon-{action}"></span>\n');
		}
		selectItem.append('<span class="lable txt_hidden block">{name}</span>\n');
		if (moveFlag) {
			selectItem.append('<span class="icon icon-move"></span>\n');
		}
		selectItem.append('</li>\n');
		return selectItem.toString();
	};
	exports.trustItem = function(relationYn) {
		var trustItem = new StringBuilder();
		trustItem.append('<div class="oneCard" typeId="{typeId}" uid="{uid}" productId="{productId}" userId="{userId}">\n');
		trustItem.append('<p class="font11 title color-a alignright">\n');
		trustItem.append('<span class="tips tips-x floatleft strong">{typeName}</span>\n');
		trustItem.append('<span class="floatleft marl5">{updateTime}</span>\n');
		if (relationYn && relationYn == 'Y') {
			trustItem.append('<span>关联自<em>{relationUser}</em></span>\n');
		}
		trustItem.append('</p>\n');
		trustItem.append('<p style="width:78%;" class="color-3 marl10 font17 mart10 strong">{name}<span class="tip font12">在售</span></p>\n');
		trustItem.append('<div class="clearfix mart5">\n');
		trustItem.append('<span class="font14 floatleft inlineblock marl10 p-top25 color-9">期限:<em class="color-6">{dayLimit}天</em></span>\n');
		trustItem.append('<div class="floatright alignright marr10">\n');
		trustItem.append('<p class="font11 color-a">预计年化率</p>\n');
		trustItem.append('<span class="tipsBig tips-x font20 color-white">{yield}<em class="font14 color-white">%</em></span>\n');
		trustItem.append('</div>\n');
		trustItem.append('</div>\n');
		trustItem.append('<div class="cardBottom clearfix alignright mart10">\n');
		trustItem.append('<span class="clearfix floatleft"><i class="icon icon-eye floatleft"></i><em class="color-9 floatleft">{viewCount}</em></span>\n');
		trustItem.append('<span class="clearfix floatleft"><i class="icon icon-change floatleft"></i><em class="color-9 floatleft">{relationCount}</em></span>\n');
		trustItem.append('<span class="commentBtn"><i class="icon icon-comment"></i></span>\n');
		trustItem.append('</div>\n');
		trustItem.append('</div>\n');
		return trustItem.toString();
	};
	exports.fundItem = function(relationYn) {
		var fundItem = new StringBuilder();
		fundItem.append('<div class="oneCard" typeId="{typeId}" uid="{uid}" productId="{productId}" userId="{userId}">\n');
		fundItem.append('<p class="font11 title color-a alignright">\n');
		fundItem.append('<span class="tips tips-j floatleft strong">{typeName}</span>\n');
		fundItem.append('<span class="floatleft marl5">{updateTime}</span>\n');
		if (relationYn && relationYn == 'Y') {
			fundItem.append('<span>关联自<em>{relationUser}</em></span>\n');
		}
		fundItem.append('</p>\n');
		fundItem.append('<p style="width:78%;" class="color-3 marl10 font17 mart10 strong">{name}<span class="tip font12">在售</span></p>\n');
		fundItem.append('<div class="clearfix mart5">\n');
		fundItem.append('<span class="font14 floatleft inlineblock marl10 p-top25 color-9">无期限</span>\n');
		fundItem.append('<div class="floatright alignright marr10">\n');
		fundItem.append('<p class="font11 color-a">基金类型</p>\n');
		fundItem.append('<span class="tipsBig tips-j font20 color-white strong">{fundType}</em></span>\n');
		fundItem.append('</div>\n');
		fundItem.append('</div>\n');
		fundItem.append('<div class="cardBottom clearfix alignright mart10">\n');
		fundItem.append('<span class="clearfix floatleft"><i class="icon icon-eye floatleft"></i><em class="color-9 floatleft">{viewCount}</em></span>\n');
		fundItem.append('<span class="clearfix floatleft"><i class="icon icon-change floatleft"></i><em class="color-9 floatleft">{relationCount}</em></span>\n');
		fundItem.append('<span class="commentBtn"><i class="icon icon-comment"></i></span>\n');
		fundItem.append('</div>\n');
		fundItem.append('</div>\n');
		return fundItem.toString();
	};
	exports.commentItem = function() {
		var commentItem = new StringBuilder();
		commentItem.append('<li class="clearfix" userId="{userId}">\n');
		commentItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		commentItem.append('<div class="marl60 marr10">\n');
		commentItem.append('<p class="font12 alignright clearfix">\n');
		commentItem.append('<span class="font17 floatleft">{userName}</span>\n');
		commentItem.append('<span class="color-a">{dateTime}</span>\n');
		commentItem.append('</p>\n');
		commentItem.append('<p class="font14 color-9">{content}</p>\n');
		commentItem.append('</div>\n');
		commentItem.append('</li>\n');
		return commentItem.toString();
	};
	exports.contactPlannerItem = function(addFlag) {
		var contactItem = new StringBuilder();
		contactItem.append('<li class="clearfix" userId="{userId}" mobilePhone="{mobilePhone}">\n');
		contactItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		contactItem.append('<p class="mart15"><span class="font16 marl10">{name}</span></p>\n');
		if(addFlag){
			contactItem.append('<span class="addBtn">{text}</span>\n');
		}else{
			contactItem.append('<span class="addBtn nobg noboder color-b">{text}</span>\n');
		}
		contactItem.append('</li>\n');
		return contactItem.toString();
	};
	exports.friendPlannerItem = function() {
		var friendItem = new StringBuilder();
		friendItem.append('<section class="personBoard" uid="{userId}">\n');
		friendItem.append('<div class="userInfo mart5 clearfix">\n');
		friendItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		friendItem.append('<div class="floatleft marl15 font13">\n');
		friendItem.append('<p class="font17">{userName}</p>\n');
		friendItem.append('<p>{orgName}</p>\n');
		friendItem.append('<p class="font11"><i class="icon {textClass}"></i>{text}</p>\n');
		friendItem.append('</div>\n');
		friendItem.append('<div class="floatright alignright color-6">\n');
		friendItem.append('<p><em>{follow}</em><i class="icon icon-3 marl5"></i></p>\n');
		friendItem.append('<p class="mart10"><em>{friends}</em><i class="icon icon-4 marl5"></i></p>\n');
		friendItem.append('</div>\n');
		friendItem.append('</div>\n');
		friendItem.append('<div class="signature mart5 font12 color-6"><i class="icon icon-arrow-t"></i><span class="txt_hidden">{signature}</span></div>\n');
		friendItem.append('</section>\n');
		return friendItem.toString();
	};	
});