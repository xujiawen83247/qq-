import jsonp from '@/js/jsonp.js'
import { commonParams, options } from './config'
import Axios from 'axios';

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
    })
    return jsonp(url, data, options)
}

export function getDiscList() {
    let url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })
    return Axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getSongList(disstid) {
	let url = '/api/getSongList'
	const data = Object.assign({}, commonParams, {
		disstid,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		loginUin: 0,
		hostUin: 0,
		needNewCode: 0,
		g_tk: 5381,
		format: 'json',
	})
	return Axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

export function getTopList() {
	let url = '/api/getTopList'
	const data = Object.assign({}, commonParams, {
		g_tk: 5381,
		uin: 0,
		format: 'json',
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
	})
	return Axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}