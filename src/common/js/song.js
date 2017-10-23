//  song类
export default class Song {
    constructor({
        id,
        mid,
        singer,
        name,
        album,
        duration,
        image,
        url
    }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
}

// 工厂方法创建song实例
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=38`
    })
}

// 分析歌手有2个人的情况
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    // 遍历singer，拆分歌手名字到ret数组中
    singer.forEach((s) => {
        ret.push(s.name)
    })
    // 返回带/的字符串
    return ret.join('/')
}
