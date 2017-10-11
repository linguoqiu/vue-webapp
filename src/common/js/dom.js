export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }
    // 将el.className拆分成一个class数组
    let newClass = el.className.split(' ')
    // 将新的className加入到原来的class中
    newClass.push(className)
    // 将newClass数组转换为字符串，并返回给el.class
    el.className = newClass.join(' ')
}

// 判断是否有此类
export function hasClass(el, className) {
    // 字符串中包含className的正则
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

// 设置或者获取一个el上的data-xx 属性，传入参数为： el dom对象，name 属性名，val 属性值
export function getData(el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}
