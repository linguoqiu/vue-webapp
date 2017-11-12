import { mapGetters } from 'vuex'

// 如果你混合包含一个钩子而创建组件本身也有一个，两个函数将被调用。
// Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。
// 使用的组件的方法会覆盖mixin的方法
// 这个mixin给组件使用，使用了这个mixin的组件，必须实现handdlePlaylist 这个方法
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handdlePlaylist(this.playList)
    },
    activated() {
        this.handdlePlaylist(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handdlePlaylist(newVal)
        }
    },
    methods: {
        handdlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}