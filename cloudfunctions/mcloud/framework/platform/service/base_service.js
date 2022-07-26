/**
 * Notes: 基础业务逻辑
 * Ver : CCMiniCloud Framework 2.0.9 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-04-24 04:00:00 
 */

const AppError = require('../../core/app_error.js');
const appCode = require('../../core/app_code.js');
const timeUtil = require('../../utils/time_util.js');

class BaseService {
	constructor() {
		// 当前时间戳
		this._timestamp = timeUtil.time();

	}

	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	AppError(msg, code = appCode.LOGIC) {
		throw new AppError(msg, code);
	}

}

module.exports = BaseService;