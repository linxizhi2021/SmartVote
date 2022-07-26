/**
 * Notes: 投票模块后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const VoteBiz = require('./vote_biz.js');
const projectSetting = require('../public/project_setting.js');

class AdminVoteBiz extends BaseBiz {


	static initFormData(id = '') {
		let cateIdOptions = VoteBiz.getCateList();

		return {
			id,

			cateIdOptions,
			fields: projectSetting.VOTE_FIELDS,

			formTitle: '',
			formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '',
			formOrder: 9999,

			formStart: '',
			formEnd: '',

			formTheme: 0,

			formIsReg: 0,
			formShowStart: 1,
			formMaxCnt: 1,
			formType: 0,
			formItem:
				[
					{ label: '', cnt: 0, pic: '', content: [] },
					{ label: '', cnt: 0, pic: '', content: [] }
				],

			formForms: [],

		}

	}
}

AdminVoteBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:2|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:0|max:9999|name=排序号',
	start: 'formStart|must|string|name=开始时间',
	end: 'formEnd|must|string|name=截止时间',
	isReg: 'formIsReg|must|int|name=是否注册',
	showStart: 'formShowStart|must|int|name=是否显示开始时间',
	theme: 'formTheme|must|int|name=主题色',
	type: 'formType|must|int|name=投票模式',
	maxCnt: 'formMaxCnt|must|int|name=可投票数',
	item: 'formItem|must|array|name=投票选项',
	forms: 'formForms|array'
};

module.exports = AdminVoteBiz;