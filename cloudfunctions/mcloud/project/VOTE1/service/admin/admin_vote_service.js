/**
 * Notes: 投票后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-07-05 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const VoteService = require('../vote_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const VoteModel = require('../../model/vote_model.js');
const VoteJoinModel = require('../../model/vote_join_model.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');

// 导出投票数据KEY
const EXPORT_VOTE_DATA_KEY = 'EXPORT_VOTE_DATA';

class AdminVoteService extends BaseProjectAdminService {

	// 按项目统计
	async statVoteAll(voteId) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730'); 
	}


	/** 推荐首页SETUP */
	async vouchVoteSetup(id, vouch) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**取得分页列表 */
	async getAdminVoteList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'VOTE_ORDER': 'asc',
			'VOTE_ADD_TIME': 'desc'
		};
		let fields = 'VOTE_TITLE,VOTE_CATE_ID,VOTE_CATE_NAME,VOTE_EDIT_TIME,VOTE_ADD_TIME,VOTE_ORDER,VOTE_STATUS,VOTE_VOUCH,VOTE_CNT,VOTE_USER_CNT,VOTE_START,VOTE_END,VOTE_THEME,VOTE_IS_REG,VOTE_QR,VOTE_TYPE,VOTE_MAX_CNT,VOTE_SHOW_START';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				VOTE_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.VOTE_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.VOTE_STATUS = Number(sortVal);
					break
				}
				case 'sort': {
					// 排序
					if (sortVal == 'start') {
						orderBy = {
							'VOTE_START': 'desc',
							'VOTE_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'cnt') {
						orderBy = {
							'VOTE_CNT': 'desc',
							'VOTE_ADD_TIME': 'desc'
						};
					}

					if (sortVal == 'user') {
						orderBy = {
							'VOTE_USER_CNT': 'desc',
							'VOTE_ADD_TIME': 'desc'
						};
					}

					if (sortVal == 'vouch') {
						where.and.VOTE_VOUCH = 1;
					}
					if (sortVal == 'top') {
						where.and.VOTE_ORDER = 0;
					}
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

	/**置顶与排序设定 */
	async sortVote(id, sort) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**首页设定 */
	async vouchVote(id, vouch) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**添加 */
	async insertVote({
		title,
		cateId,
		cateName,
		order,
		start,
		end,
		theme,
		isReg,
		showStart,
		type,
		maxCnt,
		item,
		forms
	}) {

		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取信息 */
	async getVoteDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let vote = await VoteModel.getOne(where, fields);
		if (!vote) return null;

		return vote;
	}

	/**获取统计信息 */
	async getVoteDetailStat(id) {
		let fields = 'VOTE_ITEM.label,VOTE_ITEM.cnt,VOTE_CNT';

		let where = {
			_id: id
		}

		let vote = await VoteModel.getOne(where, fields);
		if (!vote) return null;

		return vote;
	}

	// 更新forms信息
	async updateVoteForms({
		id,
		hasImageForms
	}) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**更新数据 */
	async editVote({
		id,
		title,
		cateId, // 二级分类 
		cateName,
		order,
		start,
		end,
		theme,
		isReg,
		showStart,
		type,
		maxCnt,
		item,
		forms
	}) {

		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**修改状态 */
	async statusVote(id, status) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	//#############################   
	/** 取消某项目的投票记录 */
	async clearVoteAll(voteId) {
		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730'); 
	}


	// #####################导出投票结果数据

	/**获取投票数据 */
	async getVoteDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_VOTE_DATA_KEY);
	}

	/**删除投票数据 */
	async deleteVoteDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_VOTE_DATA_KEY);
	}

	/**导出投票数据 */
	async exportVoteDataExcel(stat) { 

		this.AppError('该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminVoteService;