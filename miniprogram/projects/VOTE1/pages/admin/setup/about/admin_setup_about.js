const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const constants = require('../../../../../../comm/constants.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,


	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		this._loadDetail();
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
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let opts = {
			'title': 'bar'
		};
		let params = {
			key: constants.SETUP_ABOUT_KEY
		}

		try {
			await cloudHelper.callCloudSumbit('home/setup_get', params, opts).then(res => {
				let formContent = [{ type: 'text', val: '关于我们' }];
				let content = res.data;
				if (content && Array.isArray(content)) {
					formContent = content;
				}
				this.setData({
					isLoad: true,

					// 表单数据   
					formContent

				});


			});
		}
		catch (err) {
			console.log(err);
		}


	},


	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let formContent = this.selectComponent("#contentEditor").getNodeList();

		await cloudHelper.transRichEditorTempPics(formContent, 'setup/', constants.SETUP_ABOUT_KEY, 'admin/setup_set_content');

		let callback = () => {
			wx.navigateBack();
		}
		pageHelper.showSuccToast('修改成功', 1500, callback);

	},

})