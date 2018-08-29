import jsonp from '@/js/jsonp'
import {commonParams, options} from './config'

//出现了不知名跨域警告亲求不到数据，改用node代理的方式请求数据了,具体请求代码在recommend中
export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getMusicList(topid) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	const data = Object.assign({}, commonParams, {
		topid,
		platform: 'h5',
		needNewCode: 1,
		page: 'detail',
		type: 'top',
		tpl: 3,
	})
	return jsonp(url, data, options)
}