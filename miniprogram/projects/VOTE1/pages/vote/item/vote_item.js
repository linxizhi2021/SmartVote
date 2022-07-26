const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this, { isSetNavColor: false }); 

		if (!options || !options.theme) options.theme = 0;

		let theme = projectSetting.VOTE_THEME[options.theme];
		if (theme) {
			wx.setNavigationBarColor({
				backgroundColor: theme.color1,
				frontColor: '#ffffff',
			});
			this.setData({
				color1: theme.color1,
				color2: theme.color2,
			});
		}

		if (!options || !options.idx) options.idx = 0;
		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		let idx = options.idx;
		if (!parent.data.vote || !parent.data.vote.VOTE_ITEM || !parent.data.vote.VOTE_ITEM[idx]) return;

		this.setData({
			vote: parent.data.vote,
			voteItem: parent.data.vote.VOTE_ITEM[idx]
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
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () { },

	top: function (e) {
		// 回页首事件
		pageHelper.top();
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	onShareAppMessage: function (res) {
		return {
			title: this.data.vote.VOTE_TITLE,
			path: pageHelper.fmtURLByPID('/pages/vote/vote_detail?id=' + this.data.vote._id + '&theme=' + this.data.vote.VOTE_THEME),
			imageUrl: this.data.vote.VOTE_OBJ.cover[0]
		}
	},

	top: function (e) {
		// 回页首事件
		pageHelper.top();
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},
})