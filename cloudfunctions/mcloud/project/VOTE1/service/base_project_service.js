/**
 * Notes: 业务基类 
 * Date: 2021-03-15 04:00:00 
 */

const dbUtil = require('../../../framework/database/db_util.js');
const util = require('../../../framework/utils/util.js');
const AdminModel = require('../../../framework/platform/model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const VoteModel = require('../model/vote_model.js');
const BaseService = require('../../../framework/platform/service/base_service.js');

class BaseProjectService extends BaseService {
	getProjectId() {
		return util.getProjectId();
	}

	async initSetup() {
		let F = (c) => 'bx_' + c;
		const INSTALL_CL = 'setup_vote1';
		const COLLECTIONS = ['setup', 'admin', 'log', 'news', 'vote', 'vote_join', 'fav', 'user'];
		const CONST_PIC = '/images/cover.gif';

		const NEWS_CATE = '1=动态';
		const VOTE_CATE = '1=节日投票,2=活动评比,3=才艺比拼,4=单位政企,5=其他投票';


		if (await dbUtil.isExistCollection(F(INSTALL_CL))) {
			return;
		}

		console.log('### initSetup...');

		let arr = COLLECTIONS;
		for (let k = 0; k < arr.length; k++) {
			if (!await dbUtil.isExistCollection(F(arr[k]))) {
				await dbUtil.createCollection(F(arr[k]));
			}
		}

		if (await dbUtil.isExistCollection(F('admin'))) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {
				let data = {};
				data.ADMIN_NAME = 'admin';
				data.ADMIN_PASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
				data.ADMIN_DESC = '超管';
				data.ADMIN_TYPE = 1;
				await AdminModel.insert(data);
			}
		}


		if (await dbUtil.isExistCollection(F('news'))) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {
				let newsArr = NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_CONTENT = [{ type: 'text', val: title + '内容1' }];
					data.NEWS_PIC = [CONST_PIC];

					await NewsModel.insert(data);
				}
			}
		}

		if (await dbUtil.isExistCollection(F('vote'))) {
			let voteCnt = await VoteModel.count({});
			if (voteCnt == 0) {
				let voteArr = VOTE_CATE.split(',');
				for (let j in voteArr) {
					let title = voteArr[j].split('=')[1];
					let cateId = voteArr[j].split('=')[0];

					let data = {};
					data.VOTE_TITLE = title + '1';
					data.VOTE_CATE_ID = cateId;
					data.VOTE_CATE_NAME = title;
					data.VOTE_START = this._timestamp;
					data.VOTE_END = this._timestamp + 86400 * 1000 * 30;
					data.VOTE_THEME = j;
					data.VOTE_ITEM = [
						{ label: '选项1', cnt: 0, pic: CONST_PIC },
						{ label: '选项2', cnt: 0, pic: CONST_PIC },
						{ label: '选项3', cnt: 0, pic: CONST_PIC },
						{ label: '选项4', cnt: 0, pic: CONST_PIC },
						{ label: '选项5', cnt: 0, pic: CONST_PIC },
						{ label: '选项6', cnt: 0, pic: CONST_PIC },
						{ label: '选项7', cnt: 0, pic: CONST_PIC },
						{ label: '选项8', cnt: 0, pic: CONST_PIC }
					]

					data.VOTE_OBJ = {
						cover: [CONST_PIC],
						desc: []
					};

					await VoteModel.insert(data);
				}
			}
		}


		if (!await dbUtil.isExistCollection(F(INSTALL_CL))) {
			await dbUtil.createCollection(F(INSTALL_CL));
		}
	}

}

module.exports = BaseProjectService;