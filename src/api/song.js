import { commonParams } from './config'
import axios from 'axios'

// export function getLyric(mid) {
// 	const url = '/api/lyric'
// 	
// 	const data = Object.assign({}, commonParams, {
// 		callback: 'MusicJsonCallback_lrc',
// 		songmid: mid,
// 		pcachetime: +new Date(),
// 		platform: 'yqq',
// 		hostUin: 0,
// 		needNewCode: 0,
// 		g_tk: 67232076,
// 		format: 'json',
// 		notice: 0,
// 		
// 	})
// 	return axios.get(url, {
// 		params: data
// 	}).then((res) => {
// 		return Promise.resolve(res.data)
// 	})
// }


export function getLyric (mid) {
  const url = '/api/lyric'
 
  const data = Object.assign({}, commonParams, {
    g_tk: 1930664565,
    pcachetime: +new Date(),
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    songmid: mid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}  