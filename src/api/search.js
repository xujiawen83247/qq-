import jsonp from '@/js/jsonp'
import { commonParams, options } from './config'
import Axios from 'axios';

export function getHotKey() {
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
	})
	return jsonp(url, data, options)
}
//同样遇到跨域请求不到数据问题，改用node代理了
// export function search(query, page, zhida) {
// 	const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
// 	const data = Object.assign({}, commonParams, {
// 		w: query,
// 		p: page,
// 		catZhida: zhida ? 1 : 0,
// 		format: 'json',
// 		inCharset: 'utf-8',
// 		outCharset: 'utf-8',
// 		notice: 0,
// 		platform: 'h5',
// 		needNewCode: 1,
// 		zhidaqu: 1,
// 		t: 0,
// 		flag: 1,
// 		ie: 'utf-8',
// 		sem: 1,
// 		aggr: 0,
// 		perpage: 20,
// 		n: 20,
// 		remoteplace: 'txt.mqq.all'
// 	})
// 	return jsonp(url, data, options)
// }

export function search(query, page, zhida, perpage) {
	const url = '/api/search'
	const data = Object.assign({}, commonParams, {
		w: query,
		p: page,
		perpage,
		catZhida: zhida ? 1 : 0,
		format: 'json',
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
		zhidaqu: 1,
		t: 0,
		flag: 1,
		ie: 'utf-8',
		sem: 1,
		aggr: 0,
		n: perpage,
		remoteplace: 'txt.mqq.all'
	})
	return Axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}