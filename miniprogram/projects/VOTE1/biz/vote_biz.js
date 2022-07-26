/**
 * Notes: 投票模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-24 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js'); 
const projectSetting = require('../public/project_setting.js');
const dataHelper = require('../../../helper/data_helper.js');

class VoteBiz extends BaseBiz { 

	static setOrderVoteItem(voteItem) {
		voteItem.sort(dataHelper.objArrSortDesc('cnt'));
		let oldCnt = -1;
		let orderTotal = 0;
		for (let k = 0; k < voteItem.length; k++)  { 
			if (voteItem[k].cnt != oldCnt) {
				orderTotal++;
				oldCnt = voteItem[k].cnt;
			}
			voteItem[k].order = orderTotal;
		} 
	}

	static getCateName(cateId) {
		return BaseBiz.getCateName(cateId, projectSetting.VOTE_CATE);
	}

	static getCateList() {
		return BaseBiz.getCateList(projectSetting.VOTE_CATE);
	}

	static setCateTitle() {
		return BaseBiz.setCateTitle(projectSetting.VOTE_CATE);
	} 

}

module.exports = VoteBiz;