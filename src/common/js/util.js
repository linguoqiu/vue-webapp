// 获取随机数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// 传入一个数组，并返回 顺序打乱的数组
export function shuffle(arr) {
    // 创建一个副本，不然会影响到原来的list
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

// 返回一个节流函数,设定的时间内只执行一次
export function debounce(func, delay) {
    let timer
    // 返回一个节流函数
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
