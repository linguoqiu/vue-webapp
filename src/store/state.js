import {
    playMode
} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

//  定义状态
const state = {
    singer: {},
    playing: false, // 播放状态
    fullScreen: false, // 全屏状态
    playList: [], // 歌曲列表
    sequenceList: [], // 歌曲序列列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前歌曲的index
    disc: {},
    topList: {},
    searchHistory: loadSearch() // 从本地存储获取初始值
}

export default state
