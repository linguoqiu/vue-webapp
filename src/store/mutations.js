import * as types from './mutation-types'

const mutations = {
    // mutations的第一个参数是state，第二个参数是commit过来的参数
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state, index) {
        state.disc = index
    },
    [types.SET_TOP_LIST](state, index) {
        state.topList = index
    },
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history
    }
}

export default mutations
