//
import storage from 'good-storage'

const SEARCH_KEY = '__search__' //搜索历史列表
const SEARCH_MAX_LENGTH = 15 //最大储存条数

const PLAY_KEY = '__play__' //播放历史列表
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__' //收藏列表
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) { //新数据插入函数，新数据插入到数组的第一个，如果数组中有同样的把原数据删除后插入到第一个
    const index = arr.findIndex(compare) //查找数组中是否有传入的数据，返回该数据的下标,compare是一个函数
    if (index === 0) { //传入的数据在第一位
        return
    }
    if (index > 0) { //数组中有同样的数据，并且不再数组的第一位
        arr.splice(index, 1) //删除数组同样的数据
    }
    arr.unshift(val) //在第一位插入数据
    if (maxLen && arr.length > maxLen) { //数组数据超过15条时，删除最后一个
        arr.pop()
    }
}

function deleteFormArray(arr, compare) { //删除数据
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, []) //获取当前的储存列表，如果没有为空数组
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches) //插入新的数据
    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
    const searches = storage.get(SEARCH_KEY, [])
    deleteFormArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function clearSearch() { //清空
    storage.remove(SEARCH_KEY)
    return []
}

export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs)
    return songs
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFormArray(songs, (item) => {
        return song.id === item.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}