/**
 * Notes: 投票模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminVoteService = require('../../service/admin/admin_vote_service.js');
const VoteService = require('../../service/vote_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');
const VoteModel = require('../../model/vote_model.js');

class AdminVoteController extends BaseProjectAdminController {

	async statVoteAll() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		await service.statVoteAll(input.id);
	}

	/** 置顶与排序设定 */
	async sortVote() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		await service.sortVote(input.id, input.sort);
	}

	/** 首页设定 */
	async vouchVote() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			vouch: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		await service.vouchVote(input.id, input.vouch);
	}

	/** 状态修改 */
	async statusVote() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		return await service.statusVote(input.id, input.status);
	}

	/** 列表 */
	async getAdminVoteList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let adminService = new AdminVoteService();
		let result = await adminService.getAdminVoteList(input);

		let service = new VoteService();

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].statusDesc = service.getVoteStatusDesc(list[k]);

			list[k].VOTE_ADD_TIME = timeUtil.timestamp2Time(list[k].VOTE_ADD_TIME, 'Y-M-D h:m:s');
			list[k].VOTE_START = timeUtil.timestamp2Time(list[k].VOTE_START, 'Y-M-D h:m');
			list[k].VOTE_END = timeUtil.timestamp2Time(list[k].VOTE_END, 'Y-M-D h:m');

			//list[k] = service.fmtVoteItem(list[k]);

		}
		result.list = list;

		return result;

	}

	/** 发布 */
	async insertVote() {
		await this.isAdmin();

		// 数据校验 
		let rules = {
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|int|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			start: 'must|string|name=开始时间',
			end: 'must|string|name=截止时间',
			theme: 'must|int|name=主题',
			isReg: 'must|int|name=是否注册',
			showStart: 'must|int|name=是否展示开始时间',
			type: 'must|int|name=投票模式',
			maxCnt: 'must|int|name=可投票数',
			item: 'must|array|name=投票选项',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminVoteService();
		let result = await service.insertVote(input);

		this.logOther('添加了投票《' + input.title + '》');

		return result;

	}

	/** 获取信息用于编辑修改 */
	async getVoteDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		let vote = await service.getVoteDetail(input.id);
		if (vote) {
			vote.VOTE_START = timeUtil.timestamp2Time(vote.VOTE_START, 'Y-M-D h:m');
			vote.VOTE_END = timeUtil.timestamp2Time(vote.VOTE_END, 'Y-M-D h:m');
		}

		return vote;

	}

	/** 获取信息用于显示统计结果 */
	async getVoteDetailStat() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		let vote = await service.getVoteDetailStat(input.id);
		if (vote) {
			let svr = new VoteService();
			vote = svr.fmtVoteItem(vote);
		}
		return vote;

	}

	/** 编辑 */
	async editVote() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|int|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			start: 'must|string|name=开始时间',
			end: 'must|string|name=截止时间',
			theme: 'must|int|name=主题',
			isReg: 'must|int|name=是否注册',
			showStart: 'must|int|name=是否展示开始时间',
			type: 'must|int|name=投票模式',
			maxCnt: 'must|int|name=可投票数',
			item: 'must|array|name=投票选项',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminVoteService();
		let result = service.editVote(input);

		this.logOther('修改了投票《' + input.title + '》');

		return result;
	}

	/** 删除 */
	async delVote() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await VoteModel.getOneField(input.id, 'VOTE_TITLE');

		let service = new AdminVoteService();
		await service.delVote(input.id);

		if (title)
			this.logOther('删除了投票《' + title + '》');

	}

	/** 更新图片信息 */
	async updateVoteForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminVoteService();
		return await service.updateVoteForms(input);
	}

	//########################## 名单 

	// 清空所有投票记录
	async clearVoteAll() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id', 
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		return await service.clearVoteAll(input.id);
	}


	/************** 投票数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async voteDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();

		if (input.isDel === 1)
			await service.deleteVoteDataExcel(); //先删除 

		return await service.getVoteDataURL();
	}

	/** 导出数据 */
	async voteDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			stat: 'array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		return await service.exportVoteDataExcel(input.stat);
	}

	/** 删除导出的用户数据 */
	async voteDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminVoteService();
		return await service.deleteVoteDataExcel();
	}

}

module.exports = AdminVoteController;