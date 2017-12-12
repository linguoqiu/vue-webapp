import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 插入搜索数据，如果本来已有，则移到第一位
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        // 删除里面的项目并在第一位插入
        arr.splice(index, 1)
    }
    arr.unshift(val)
    // 是否超过15，是的话删除最后一个
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

//  从列表中删除一个项目
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 把query插入到Searches中，并保存到storage中，最后返回出去
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}