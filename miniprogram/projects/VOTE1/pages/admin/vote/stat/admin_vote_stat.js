const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const VoteBiz = require('../../../../biz/vote_biz.js');

Page({


	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		mode: 'desc'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;

		this._loadDetail();
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
	onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;


		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let vote = await cloudHelper.callCloudData('admin/vote_detail_stat', params, opt);
		if (!vote) {
			this.setData({ isLoad: null });
			return;
		};

		let stat = vote.VOTE_ITEM;
		VoteBiz.setOrderVoteItem(stat);

		this.setData({
			isLoad: true,
			stat
		});
	},

	bindModeTap: function (e) {
		let mode = pageHelper.dataset(e, 'mode');
		let stat = this.data.stat;
		if (mode == 'order') {
			stat.sort(dataHelper.objArrSortAsc('idx'));
		}
		else if (mode == 'desc') {
			stat.sort(dataHelper.objArrSortDesc('cnt'));
		}
		else if (mode == 'asc') {
			stat.sort(dataHelper.objArrSortAsc('cnt'));
		}

		this.setData({
			mode,
			stat
		});
	},

	url: function (e) {
		pageHelper.url(e, this);
	}

})