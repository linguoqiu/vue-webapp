import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    // 常用的拼接url方法，把参数都拼接在url后面
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

    // 返回promise对象
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    // 拼接参数
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }

    // 如果url存在，去除最前边的&
    return url ? url.substring(1) : ''
}