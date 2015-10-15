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
		} else {
			selectItem.append('<span class="icon icon-{action}"></span>\n');
		}
		selectItem.append('<span class="lable txt_hidden block">{name}</span>\n');
		if (moveFlag) {
			selectItem.append('<span class="icon icon-move"></span>\n');
		}
		selectItem.append('</li>\n');
		return selectItem.toString();
	};
	exports.trustItem = function(relationYn, endFlag) {
		var trustItem = new StringBuilder();
		trustItem.append('<li class="oneCard" viewCount="{viewCount}" numSeq="{numSeq}" productName="{name}" typeId="{typeId}" uid="{uid}" productId="{productId}" userId="{userId}">\n');
		trustItem.append('<p class="font11 title color-a alignright">\n');
		trustItem.append('<span class="tips tips-x floatleft strong">{typeName}</span>\n');
		trustItem.append('<span class="floatleft marl5">{updateTime}</span>\n');
		if (relationYn && relationYn == 'Y') {
			trustItem.append('<span class="relationSpan" uid="{relationUserId}" rUserName="{relationUserName}">关联自<em>{relationUserName}</em></span>\n');
		}
		trustItem.append('</p>\n');
		trustItem.append('<p style="width:78%;" class="color-3 marl10 font17 mart10 strong openView">{name}');
		if (endFlag) {
			if (endFlag == 'Y') {
				trustItem.append('<span class="tip tip-over font12">募集期结束</span>\n');
			} else if (endFlag == 'N') {
				trustItem.append('<span class="tip font12">在售</span>\n');
			}
		}
		trustItem.append('</p>\n');
		trustItem.append('<div class="clearfix mart5 openView">\n');
		trustItem.append('<span class="font14 floatleft inlineblock marl10 p-top25 color-9">期限:<em class="color-6">{dayLimit}天</em></span>\n');
		trustItem.append('<div class="floatright alignright marr10">\n');
		trustItem.append('<p class="font11 color-a">预计年化率</p>\n');
		trustItem.append('<span class="tipsBig tips-x font20 color-white">{yield}<em class="font14 color-white">%</em></span>\n');
		trustItem.append('</div>\n');
		trustItem.append('</div>\n');
		trustItem.append('<div class="cardBottom clearfix alignright mart10">\n');
		trustItem.append('<span class="clearfix floatleft viewSpan"><i class="icon icon-eye floatleft"></i><em class="color-9 floatleft">{viewCount}</em></span>\n');
		trustItem.append('<span class="clearfix floatleft"><i class="icon icon-change floatleft"></i><em class="color-9 floatleft">{relationCount}</em></span>\n');
		trustItem.append('<span class="commentBtn"><i class="icon icon-comment"></i></span>\n');
		trustItem.append('</div>\n');
		trustItem.append('</li>\n');
		return trustItem.toString();
	};
	exports.fundItem = function(relationYn, endFlag) {
		var fundItem = new StringBuilder();
		fundItem.append('<li class="oneCard" viewCount="{viewCount}" numSeq="{numSeq}"  productName="{name}" typeId="{typeId}" uid="{uid}" productId="{productId}" userId="{userId}">\n');
		fundItem.append('<p class="font11 title color-a alignright">\n');
		fundItem.append('<span class="tips tips-j floatleft strong">{typeName}</span>\n');
		fundItem.append('<span class="floatleft marl5">{updateTime}</span>\n');
		if (relationYn && relationYn == 'Y') {
			fundItem.append('<span class="relationSpan" uid="{relationUserId}" rUserName="{relationUserName}">关联自<em>{relationUserName}</em></span>\n');
		}
		fundItem.append('</p>\n');
		fundItem.append('<p style="width:78%;" class="color-3 marl10 font17 mart10 strong openView">{name}');
		if (endFlag) {
			if (endFlag == 'Y') {
				fundItem.append('<span class="tip tip-over font12">募集期结束</span>\n');
			} else if (endFlag == 'N') {
				fundItem.append('<span class="tip font12">在售</span>\n');
			}
		}
		fundItem.append('</p>\n');
		fundItem.append('<div class="clearfix mart5 openView">\n');
		fundItem.append('<span class="font14 floatleft inlineblock marl10 p-top25 color-9">无期限</span>\n');
		fundItem.append('<div class="floatright alignright marr10">\n');
		fundItem.append('<p class="font11 color-a">基金类型</p>\n');
		fundItem.append('<span class="tipsBig tips-j font20 color-white strong">{fundType}</em></span>\n');
		fundItem.append('</div>\n');
		fundItem.append('</div>\n');
		fundItem.append('<div class="cardBottom clearfix alignright mart10">\n');
		fundItem.append('<span class="clearfix floatleft viewSpan"><i class="icon icon-eye floatleft"></i><em class="color-9 floatleft">{viewCount}</em></span>\n');
		fundItem.append('<span class="clearfix floatleft"><i class="icon icon-change floatleft"></i><em class="color-9 floatleft">{relationCount}</em></span>\n');
		fundItem.append('<span class="commentBtn"><i class="icon icon-comment"></i></span>\n');
		fundItem.append('</div>\n');
		fundItem.append('</li>\n');
		return fundItem.toString();
	};
	exports.waitingItem = function(relationYn) {
		var waitingItem = new StringBuilder();
		waitingItem.append('<li class="oneCard  aligncenter" viewCount="{viewCount}" numSeq="{numSeq}"  productName="{name}" typeId="{typeId}" uid="{uid}" productId="{productId}" userId="{userId}">\n');
		waitingItem.append('<p class="font11 title color-a alignright">\n');
		if (relationYn && relationYn == 'Y') {
			waitingItem.append('<span class="relationSpan" uid="{relationUserId}">关联自<em>{relationUserName}</em></span>\n');
		}
		waitingItem.append('</p>\n');
		waitingItem.append('<p class="color-b opacityMask mart20">我还在为您精心挑选中</p>\n');
		waitingItem.append('<p class="color-b  opacityMask p-bt20">尽请期待...</p>\n');
	
		waitingItem.append('<div class="cardBottom clearfix alignright mart10">\n');
		waitingItem.append('<span class="clearfix floatleft"><i class="icon icon-change floatleft"></i><em class="color-9 floatleft">{relationCount}</em></span>\n');
		waitingItem.append('</div>\n');
		waitingItem.append('</li>\n');
		return waitingItem.toString();
	};
	exports.commentContentItem = function(replyFlag) {
		var commentItem = new StringBuilder();
		commentItem.append('<li class="clearfix" userId="{userId}" userName="{userName}" uid="{uid}">\n');
		commentItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		commentItem.append('<div class="marl60 marr10">\n');
		commentItem.append('<p class="font12 alignright clearfix">\n');
		console.info(replyFlag);
		if (replyFlag == '0') {
			commentItem.append('<span class="font17 floatleft"><em class="nameSpan">{userName}</em>回复<em class="nameSpan">{replyUserName}</em></span>\n');
		} else {
			commentItem.append('<span class="font17 floatleft">{userName}</span>\n');
		}
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
		if (addFlag) {
			contactItem.append('<span class="addBtn">{text}</span>\n');
		} else {
			contactItem.append('<span class="addBtn nobg noboder color-b">{text}</span>\n');
		}
		contactItem.append('</li>\n');
		return contactItem.toString();
	};
	exports.friendPlannerItem = function() {
		var friendItem = new StringBuilder();
		friendItem.append('<section class="personBoard" uid="{userId}" userName="{userName}">\n');
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
	exports.relationPlannerItem = function() {
		var relationPlannerItem = new StringBuilder();
		relationPlannerItem.append('<section class="UserCard" userId="{userId}" saleCount="{saleCount}">\n');
		relationPlannerItem.append('<span class="icon-new"></span>\n');
		relationPlannerItem.append('<div class="UserBg "><img src="{headImgUrl}"></div>\n');
		relationPlannerItem.append('<p class="font14 aligncenter" style="margin-top:-25px;">{userName}</p>\n');
		relationPlannerItem.append('<p class="font10 aligncenter color-8">在售中: {saleCount}</p>\n');
		relationPlannerItem.append('<p><img src="../../img/w-bg1.png" width="100%"></p>\n');
		relationPlannerItem.append('<table width="100%" class="mart10">\n');
		relationPlannerItem.append('<tr>\n');
		relationPlannerItem.append('<th>理财</th>\n');
		relationPlannerItem.append('<th>信托/资管</th>\n');
		relationPlannerItem.append('<th>基金</th>\n');
		relationPlannerItem.append('</tr>\n');
		relationPlannerItem.append('<tr>\n');
		relationPlannerItem.append('<td>{financialContent}</td>\n');
		relationPlannerItem.append('<td>{trustContent}</td>\n');
		relationPlannerItem.append('<td>{fundContent}</td>\n');
		relationPlannerItem.append('</tr>\n');
		relationPlannerItem.append('</table>\n');
		relationPlannerItem.append('</section>\n');
		return relationPlannerItem.toString();
	};
	exports.friendFollowPlannerItem = function(newFlag) {
		var relationPlannerItem = new StringBuilder();
		relationPlannerItem.append('<section class="UserCard" userId="{userId}" saleCount="{saleCount}" userName="{userName}">\n');
		if(newFlag){
			relationPlannerItem.append('<span class="icon-new"></span>\n');
			relationPlannerItem.append('<span class="rightBtn rightBtnAdd"></span>\n');
		}else{
			relationPlannerItem.append('<span class="rightBtn">共同好友</span>\n');
		}
		relationPlannerItem.append('<div class="UserBg "><img src="{headImgUrl}"></div>\n');
		relationPlannerItem.append('<p class="font14 aligncenter" style="margin-top:-25px;">{userName}</p>\n');
		relationPlannerItem.append('<p class="font10 aligncenter color-8">在售中: {saleCount}</p>\n');
		relationPlannerItem.append('<p><img src="../../img/w-bg1.png" width="100%"></p>\n');
		relationPlannerItem.append('<table width="100%" class="mart10">\n');
		relationPlannerItem.append('<tr>\n');
		relationPlannerItem.append('<th>理财</th>\n');
		relationPlannerItem.append('<th>信托/资管</th>\n');
		relationPlannerItem.append('<th>基金</th>\n');
		relationPlannerItem.append('</tr>\n');
		relationPlannerItem.append('<tr>\n');
		relationPlannerItem.append('<td>{financialContent}</td>\n');
		relationPlannerItem.append('<td>{trustContent}</td>\n');
		relationPlannerItem.append('<td>{fundContent}</td>\n');
		relationPlannerItem.append('</tr>\n');
		relationPlannerItem.append('</table>\n');
		relationPlannerItem.append('</section>\n');
		return relationPlannerItem.toString();
	};
	
	exports.footer1 = function() {
		var footerItem = new StringBuilder();
		footerItem.append('<footer class="footer footerInner aligncenter clearfix" style="bottom:0;" id="footerTools">\n');
		footerItem.append('<span dir="{action1}" class="nofloat block width-auto">{text1}</span>\n');
		footerItem.append('</footer>\n');
		return footerItem.toString();
	};
	
	exports.footer2 = function() {
		var footerItem = new StringBuilder();
		footerItem.append('<footer class="footer footerInner clearfix" style="bottom:0;" id="footerTools">\n');
		footerItem.append('<span dir="{action1}" class="floatleft marl15">{text1}</span>\n');
		footerItem.append('<span dir="{action2}" class="floatright">{text2}</span>\n');
		footerItem.append('</footer>\n');
		return footerItem.toString();
	};
	
	exports.footer3 = function() {
		var footerItem = new StringBuilder();
		footerItem.append('<footer class="footer footerInner footerThree  clearfix" style="bottom:0;" id="footerTools">\n');
		footerItem.append('<span dir="{action1}" class="floatleft">{text1}</span>\n');
		footerItem.append('<span dir="{action2}" class="floatleft">{text2}</span>\n');
		footerItem.append('<span dir="{action3}" class="floatright">{text3}</span>\n');
		footerItem.append('</footer>\n');
		return footerItem.toString();
	};
	exports.footer4 = function() {
		var footerItem = new StringBuilder();
		footerItem.append('<footer class="footer footerInner footerFour  clearfix" style="bottom:0;" id="footerTools">\n');
		footerItem.append('<span dir="{action1}" class="floatleft">{text1}</span>\n');
		footerItem.append('<span dir="{action2}" class="floatleft">{text2}</span>\n');
		footerItem.append('<span dir="{action3}" class="floatleft">{text3}</span>\n');
		footerItem.append('<span dir="{action4}" class="floatright">{text4}</span>\n');
		footerItem.append('</footer>\n');
		return footerItem.toString();
	};
	
	exports.visitItem = function() {
		var visitItem = new StringBuilder();
		visitItem.append('<section class="personBoard" userId="{userId}" visitType="{visitType}" userName="{userName}">\n');
		visitItem.append('<div class="userInfo mart5 clearfix">\n');
		visitItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		visitItem.append('<div class="floatleft marl15 mart10 font13">\n');
		visitItem.append('<p class="font17">{userName}</p>\n');
		visitItem.append('<p class="mart10">{type}</p>\n');
		visitItem.append('</div>\n');
		visitItem.append('<div class="floatright mart15 color-9">\n');
		visitItem.append('<p class="font11 alignright">{updateTime}访问了你</p>\n');
		visitItem.append('</div>\n');
		visitItem.append('</div>\n');
		visitItem.append('</section>\n');
		return visitItem.toString();
	};
	
	exports.likeItem = function() {
		var likeItem = new StringBuilder();
		likeItem.append('<section class="personBoard" userId="{userId}" productId="{productId}" likeType="{likeType}" userName="{userName}">\n');
		likeItem.append('<div class="userInfo mart5 clearfix">\n');
		likeItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		likeItem.append('<div class="floatleft marl15 mart10 font13">\n');
		likeItem.append('<p class="font17">{userName}</p>\n');
		likeItem.append('<p class="mart10">{type}</p>\n');
		likeItem.append('</div>\n');
		likeItem.append('<div class="floatright alignright color-9">\n');
		likeItem.append('<p class="font11 alignright">{updateTime}赞了你的产品</p>\n');
		likeItem.append('<p class="color-6">{productName}</p>\n');
		likeItem.append('</div>\n');
		likeItem.append('</div>\n');
		likeItem.append('</section>\n');
		return likeItem.toString();
	};
	exports.commentItem = function() {
		var commentItem = new StringBuilder();
		commentItem.append('<section class="personBoard" userId="{userId}" productId="{productId}">\n');
		commentItem.append('<div class="userInfo mart5 clearfix">\n');
		commentItem.append('<span class="userPhoto floatleft"><img src="{headImgUrl}"></span>\n');
		commentItem.append('<div class="floatleft marl15 mart10 font13">\n');
		commentItem.append('<p class="font17">{userName}</p>\n');
		commentItem.append('<p class="mart10">{type}</p>\n');
		commentItem.append('</div>\n');
		commentItem.append('<div class="floatright color-9">\n');
		commentItem.append('<p class="font11 alignright">{updateTime}</p>\n');
		commentItem.append('<pre class="color-6">{content}</pre>\n');
		commentItem.append('</div>\n');
		commentItem.append('</div>\n');
		commentItem.append('</section>\n');
		return commentItem.toString();
	};
	exports.weixinShare = function() {
		var weixinShare = new StringBuilder();
		weixinShare.append('https://open.weixin.qq.com/connect/oauth2/authorize?');
		weixinShare.append('appid=wx7ec527daa5585fc3');
		weixinShare.append('&redirect_uri={url}');
		weixinShare.append('&response_type=code');
		weixinShare.append('&scope=snsapi_base');
		weixinShare.append('&state=1#wechat_redirect');
		return weixinShare.toString();
	};
});