import {
    getLyric
} from 'api/song'
import {
    ERR_OK
} from 'api/config'
import {
    Base64
} from 'js-base64'

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

    // 封装获取歌词的方法
    getLyric() {
        // 如果此song已经有lyric，则直接返回Promise.resolve,防止重复请求歌词
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
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
export function filterSinger(singer) {
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
