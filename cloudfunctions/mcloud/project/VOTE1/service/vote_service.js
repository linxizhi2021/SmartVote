/**
 * Notes: 投票模块业务逻辑
 * Ver : CCMiniCloud Framework 3.2.11 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 05:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const VoteModel = require('../model/vote_model.js');
const VoteJoinModel = require('../model/vote_join_model.js');

class VoteService extends BaseProjectService {

	// 获取当前投票状态
	getVoteStatusDesc(vote) {
		let timestamp = this._timestamp;

		if (vote.VOTE_STATUS == 0)
			return '已停用';
		else if (vote.VOTE_START > timestamp)
			return '未开始';
		else if (vote.VOTE_END <= timestamp)
			return '已截止';
		else
			return '进行中';
	}

	fmtVoteItem(vote) {
		let total = vote.VOTE_CNT;
		let colors = ['red', 'green', 'orange', 'darkgreen', 'yellow', 'olive', 'blue', 'grey', 'purple', 'mauve', 'cyan', 'brown', 'pink', 'black', 'red', 'green', 'orange', 'darkgreen', 'yellow', 'olive', 'blue', 'grey', 'purple', 'mauve', 'cyan', 'brown', 'pink', 'black'];
		for (let k = 0; k < vote.VOTE_ITEM.length; k++) {
			if (total == 0)
				vote.VOTE_ITEM[k].per = 0;
			else {
				let per = vote.VOTE_ITEM[k].cnt * 100 / total;
				vote.VOTE_ITEM[k].per = per.toFixed(1);
			}
			vote.VOTE_ITEM[k].color = colors[k];
			vote.VOTE_ITEM[k].idx = Number(k);

		}
		return vote;
	}





	/** 浏览信息 */
	async viewVote(userId, voteId, isPv = true) {

		let fields = '*';

		let where = {
			_id: voteId,
			VOTE_STATUS: VoteModel.STATUS.COMM
		}
		let vote = await VoteModel.getOne(where, fields);
		if (!vote) return null;

		if (isPv) VoteModel.inc(voteId, 'VOTE_VIEW_CNT', 1);

		// 我的投票数组 
		let whereMy = {
			VOTE_JOIN_VOTE_ID: voteId,
			VOTE_JOIN_USER_ID: userId
		}
		let voteJoinList = [];
		if (vote.VOTE_TYPE == 0) {
			voteJoinList = await VoteJoinModel.getAll(whereMy, 'VOTE_JOIN_IDX');
		}
		else {
			whereMy.VOTE_JOIN_DAY = timeUtil.time('Y-M-D');
			voteJoinList = await VoteJoinModel.getAll(whereMy, 'VOTE_JOIN_IDX');
		}
		vote.myVoteIds = dataUtil.getArrByKey(voteJoinList, 'VOTE_JOIN_IDX');

		return vote;
	}


	/** 取得分页列表 */
	async getVoteList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'VOTE_ORDER': 'asc',
			'VOTE_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_IS_REG,VOTE_THEME,VOTE_STOP,VOTE_USER_CNT,VOTE_CNT,VOTE_OBJ,VOTE_VIEW_CNT,VOTE_TITLE,VOTE_START,VOTE_END,VOTE_ORDER,VOTE_STATUS,VOTE_CATE_NAME,VOTE_SHOW_START';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		where.and.VOTE_STATUS = VoteModel.STATUS.COMM; // 状态  


		if (util.isDefined(search) && search) {
			where.or = [{
				VOTE_TITLE: ['like', search]
			},];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					if (sortVal) where.and.VOTE_CATE_ID = String(sortVal);
					break;
				}
				case 'sort': {
					// 排序 
					if (sortVal == 'new') {
						orderBy = {
							'VOTE_ADD_TIME': 'desc'
						};
					}
					break;
				}

			}
		}

		return await VoteModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	//################## 投票 
	// 统计
	async statVoteItem(voteId, idx, isStatUser = true) {
		idx = Number(idx);

		let vote = await VoteModel.getOne(voteId);
		if (!vote) return;

		if (!util.isDefined(vote.VOTE_ITEM[idx]))
			this.AppError('该投票项不存在');

		let cnt = await VoteJoinModel.count({ VOTE_JOIN_VOTE_ID: voteId });

		let whereIdx = {
			VOTE_JOIN_VOTE_ID: voteId,
			VOTE_JOIN_IDX: idx
		}
		let cntIdx = await VoteJoinModel.count(whereIdx);

		let item = vote.VOTE_ITEM;
		item[idx].cnt = cntIdx;
		let dataItem = {
			VOTE_CNT: cnt,
			VOTE_ITEM: item
		}

		if (isStatUser) {
			let whereUser = {
				VOTE_JOIN_VOTE_ID: voteId
			}

			let cntUser = await VoteJoinModel.distinctCnt(whereUser, 'VOTE_JOIN_USER_ID');
			dataItem.VOTE_USER_CNT = cntUser;
		}
		await VoteModel.edit(voteId, dataItem);

	}

	// 投票 
	async doVote(userId, voteId, idx) {

		// 投票是否结束
		let whereVote = {
			_id: voteId,
			VOTE_STATUS: VoteModel.STATUS.COMM
		}
		let vote = await VoteModel.getOne(whereVote);
		if (!vote)
			this.AppError('该投票不存在或者已经停止');


		// 是否投票开始
		if (vote.VOTE_START > this._timestamp)
			this.AppError('该投票尚未开始');

		// 是否过了投票截止期
		if (vote.VOTE_END < this._timestamp)
			this.AppError('该投票已经截止');

		if (!util.isDefined(vote.VOTE_ITEM[idx]))
			this.AppError('该投票项不存在');


		// 模式
		let whereCnt = {
			VOTE_JOIN_VOTE_ID: voteId,
			VOTE_JOIN_USER_ID: userId,
		}
		if (vote.VOTE_TYPE == 0) {
			// 全程
			let cnt = await VoteJoinModel.count(whereCnt);
			if (cnt >= vote.VOTE_MAX_CNT)
				this.AppError('您总投票数已满' + vote.VOTE_MAX_CNT + '票，无须再投票');

			whereCnt.VOTE_JOIN_IDX = idx;
			cnt = await VoteJoinModel.count(whereCnt);
			if (cnt)
				this.AppError('您已经投过该项，请选择其他');
		}
		else {
			// 当天
			whereCnt.VOTE_JOIN_DAY = timeUtil.time('Y-M-D');
			let cnt = await VoteJoinModel.count(whereCnt);
			if (cnt >= vote.VOTE_MAX_CNT)
				this.AppError('您今日投票数已满' + vote.VOTE_MAX_CNT + '票，明天再来吧!');

			whereCnt.VOTE_JOIN_IDX = idx;
			cnt = await VoteJoinModel.count(whereCnt);
			if (cnt)
				this.AppError('您今日已经投过该项，请选择其他或者明日再来');
		}

		// 入库
		let data = {
			VOTE_JOIN_USER_ID: userId,
			VOTE_JOIN_VOTE_ID: voteId,
			VOTE_JOIN_DAY: timeUtil.time('Y-M-D'),
			VOTE_JOIN_IDX: idx,
			VOTE_JOIN_VOTE_TITLE: vote.VOTE_TITLE,
			VOTE_JOIN_ITEM_LABEL: vote.VOTE_ITEM[idx].label
		}
		await VoteJoinModel.insert(data);

		await this.statVoteItem(voteId, idx);
	}

	/** 我的投票列表 */
	async getMyVoteList(userId, {
		search, // 搜索条件 
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序  
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {
		orderBy = orderBy || {
			'VOTE_JOIN_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		if (util.isDefined(search) && search) {
			where.VOTE_JOIN_VOTE_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		}
		where.VOTE_JOIN_USER_ID = userId;

		return await VoteJoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

	}

}

module.exports = VoteService;