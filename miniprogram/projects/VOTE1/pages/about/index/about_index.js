const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const constants = require('../../../../../comm/constants.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		const accountInfo = wx.getAccountInfoSync();
		this.setData({
			accountInfo
		});

		this._loadDetail();
	},

	_loadDetail: async function () {
		let opts = {
			title: 'bar'
		}
		let params = {
			key: constants.SETUP_ABOUT_KEY
		}
		let about = await cloudHelper.callCloudData('home/setup_get', params, opts);
		if (!about) {
			about = [{ 'type': 'text', 'val': '关于我们' }];
		}

		if (about) this.setData({
			about,
			isLoad: true
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this._loadDetail();
		wx.stopPullDownRefresh();
	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	url: function (e) {
		pageHelper.url(e, this);
	}
})