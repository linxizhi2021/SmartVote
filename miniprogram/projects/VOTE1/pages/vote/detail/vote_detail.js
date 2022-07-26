const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const dataHelper = require('../../../../../helper/data_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const VoteBiz = require('../../../biz/vote_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		showView: 'order',
		myVoteIds: [],
		clock: [0, 0, 0, 0],

		search: '',
		list: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this, { isSetNavColor: false }); 

		if (!pageHelper.getOptions(this, options)) return;
		this._loadDetail();


		if (!options || !options.theme) options.theme = 0;
		this._setTheme(options.theme);
	},

	_setTheme(themeIdx) {
		let theme = projectSetting.VOTE_THEME[themeIdx];
		if (theme) {
			wx.setNavigationBarColor({
				backgroundColor: theme.color1,
				frontColor: '#ffffff',
			});
			this.setData({
				color1: theme.color1,
				color2: theme.color2,
			})
		}
	},

	_loadDetail: async function (isPv = 1) {
		pageHelper.clearTimer(this);

		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
			isPv
		};
		let opt = {
			title: 'bar'
		};
		let vote = await cloudHelper.callCloudData('vote/view', params, opt);
		if (!vote) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this._setTheme(vote.VOTE_THEME);

		let now = timeHelper.time();
		let start = vote.VOTE_START;
		let end = vote.VOTE_END;

		this.setData({
			isLoad: true,
			isStart: now >= start,
			isEnd: now > end,
			vote,
			list: vote.VOTE_ITEM,
			myVoteIds: vote.myVoteIds
		}, () => {
			if (!this.data.isStart)
				this._loadStart(start, end);
			else if (!this.data.isEnd)
				this._loadEnd(end);
		});
		wx.setNavigationBarTitle({
			title: vote.VOTE_TITLE
		});



	},

	_loadStart(start, end) {
		this.data.timer = setInterval(() => {
			let clock = timeHelper.getTimeLeft(start, 1);
			if (clock[0] == 0 && clock[1] == 0 && clock[2] == 0 && clock[3] <= 0) {
				this.setData({ isStart: true, clock });
				clearInterval(this.data.timer);
				this._loadEnd(end);
				return;
			}
			this.setData({ clock });
		}, 1000);
	},

	_loadEnd(end) {
		this.data.timer = setInterval(() => {
			let clock = timeHelper.getTimeLeft(end, 1);
			if (clock[0] == 0 && clock[1] == 0 && clock[2] == 0 && clock[3] <= 0) {
				this.setData({ isEnd: true, clock });
				clearInterval(this.data.timer);
				return;
			}
			this.setData({ clock });
		}, 1000);
	},

	bindSearchTap: async function () {
		let search = this.data.search.trim();
		if (!search) return;

		let arr = [];
		let list = this.data.vote.VOTE_ITEM;
		for (let k = 0; k < list.length; k++)  { 
			if (list[k].label.includes(search)
				|| (list[k].idx + 1) == search
				|| (list[k].idx + 1) == search.replace('号', ''))
				arr.push(list[k]);
		}
		this.setData({
			list: arr,
			showView: 'order'
		});
	},

	bindClearTap: async function () {
		this.setData({
			list: this.data.vote.VOTE_ITEM,
			search: '',
			showView: 'order'
		});
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		pageHelper.clearTimer(this);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		pageHelper.clearTimer(this);

		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () { },

	bindVoteTap: async function (e) {
		if (this.data.vote.VOTE_IS_REG == 1 && !await PassportBiz.loginMustCancelWin(this)) return;

		try {
			let idx = pageHelper.dataset(e, 'idx');
			let params = {
				voteId: this.data.id,
				idx
			}
			let opts = {
				title: '提交中'
			}

			await cloudHelper.callCloudSumbit('vote/do', params, opts).then(res => {
				let vote = this.data.vote;
				let myVoteIds = this.data.myVoteIds;
				vote.VOTE_CNT++;
				myVoteIds.push(idx);
				this.setData({
					vote,
					myVoteIds
				});
				this._loadDetail(0);
				pageHelper.showSuccToast('投票成功', 1500);
			});
		} catch (err) {
			console.log(err);
		}


	},

	bindShowTap: function (e) {
		let showView = pageHelper.dataset(e, 'view');
		this.setData({
			showView
		});

		if (showView == 'rank') {
			// 投票榜
			let orderList = dataHelper.deepClone(this.data.vote.VOTE_ITEM);
			VoteBiz.setOrderVoteItem(orderList); 
			this.setData({
				orderList
			})
		}
	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},
	onShareAppMessage: function (res) {
		return {
			title: this.data.vote.VOTE_TITLE,
			imageUrl: this.data.vote.VOTE_OBJ.cover[0]
		}
	},
})