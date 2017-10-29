// state.singer发生改变，则singer就发生改变
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequnceList = state => state.sequnceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}