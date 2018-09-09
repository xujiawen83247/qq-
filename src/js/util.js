//洗牌函数
function getRandomInt (min, max) {	//返回一个min max 之间的数
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
	let _arr = arr.slice()
	for (let i=0; i < _arr.length; i++) {
		let j = getRandomInt(0, i) 
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	return _arr
}

//截留函数 用来延迟用户搜索结果,不至于没输入或删除一个字就请求一次数据
export function debounce(func, delay) {
	let timer
	return function (...arge) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout( () => {
			func.apply(this, arge)
		}, delay)
	}
}