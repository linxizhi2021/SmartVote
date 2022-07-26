module.exports = {
	PROJECT_COLOR: '#347DFF',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#347DFF',

	// 用户
	USER_FIELDS: [
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'area', title: '所在地区', type: 'text' },
		{ mark: 'work', title: '行业领域', type: 'area' },
	],

	// 资讯  
	NEWS_CATE: [
		{ id: 1, title: '动态', style: 'leftbig1' } 
	], 


	// 投票 
	VOTE_THEME: [
		{ color1: '#347DFF', color2: '#A376FB' },
		{ color1: '#c3272b', color2: '#827100' },
		{ color1: '#21a675', color2: '#ffa400' },
		{ color1: '#1685a9', color2: '#16a951' },
		{ color1: '#75664d', color2: '#f2be45' },
		{ color1: '#2e4e7e', color2: '#177cb0' },
		{ color1: '#424c50', color2: '#20CE96' },
		{ color1: '#c93756', color2: '#ffb3a7' },
		{ color1: '#e54d42', color2: '#f37b1d' },
		{ color1: '#0E9489', color2: '#8dc63f' },
		{ color1: '#347DFF', color2: '#50BFFF' },
		{ color1: '#6739b6', color2: '#9B7ACD' },
		{ color1: '#9c26b0', color2: '#CF97D9' },
		{ color1: '#e03997', color2: '#EF94C6' },
		{ color1: '#a5673f', color2: '#CEAD97' },
		{ color1: '#000000', color2: '#999999' },
	], 
	VOTE_CATE: [
		{ id: 1, title: '节日投票' },
		{ id: 2, title: '活动评比' },
		{ id: 3, title: '才艺比拼' },
		{ id: 4, title: '单位政企' },
		{ id: 5, title: '其他投票' }
	],
	VOTE_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '投票简介与须知', type: 'content', must: false },
	],

}