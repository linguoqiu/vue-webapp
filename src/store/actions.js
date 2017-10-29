// 此处应该放一些异步操作，目前暂时没用到，直接用commit  mutation 改变 state
import * as types from './mutation-types'

// 提交多个mutations，改变状态
export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}