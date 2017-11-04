// 获取随机数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// 传入一个数组，并返回 顺序打乱的数组
export function shufffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = arr[i]
        arr[i] = arr[j]
        arr[j] = t
    }
    return arr
}
