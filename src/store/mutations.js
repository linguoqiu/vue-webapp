import * as types from './mutation-types'

const mutations = {
    // mutations的第一个参数是state，第二个参数是commit过来的参数
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}

export default mutations
