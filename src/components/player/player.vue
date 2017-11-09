<template>
  <div class="player" v-show="playList.length > 0">
      <!-- 监听transition的钩子事件 -->
      <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
            <!-- 背景图 -->
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <!-- 返回按钮和title -->
            <div class="top">
                <div class="back" @click='back'>
                    <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <!-- 唱片图片 -->
            <div class="middle" 
                @touchstart.prevent="middleTouchStart"
                @touchmove.prevent="middleTouchMove"
                @touchend="middleTouchEnd">
                <div class="middle-l" ref= "middleL">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img class="image" :src="currentSong.image">
                        </div>
                    </div>
                </div>
                <!-- 歌词 -->
                <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index }" v-for="(line, index) in currentLyric.lines">
                                {{line.txt}}
                            </p>
                        </div>
                    </div>
                </scroll>
            </div>
            <!-- 底部的操作区 -->
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                    <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode">
                        <i :class="iconMode"></i>
                    </div>
                    <div class="icon i-left" :class="disableCls">
                        <i @click="prev" class="icon-prev"></i>
                    </div>
                    <div class="icon i-center" :class="disableCls">
                        <i @click="togglePlaying" :class="playIcon"></i>
                    </div>
                    <div class="icon i-right" :class="disableCls">
                        <i @click="next" class="icon-next"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon icon-not-favorite"></i>
                    </div>
                </div>
            </div>
        </div>
      </transition>
      <!-- mini-player -->
       <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click='open'>
                <div class="icon">
                    <!-- cdCls控制旋转和暂停旋转 -->
                    <img :class="cdCls" width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <!-- 要阻止冒泡 -->
                        <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
       </transition>
       <!-- audio提供了ready、timeupdate 和erro事件 -->
       <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"
       @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
    data() {
        return {
            songReady: false, // 歌曲是否准备好
            currentTime: 0,
            radius: 32,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd'
        }
    },
    computed: {
        // 监听playing的变化，不同的类和icon都做出变化
        cdCls() {
            return this.playing ? 'play' : 'play pause'
        },
        playIcon() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon() {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        disableCls() {
            return this.songReady ? '' : 'disable'
        },
        // 计算当前进度的百分比
        percent() {
            return this.currentTime / this.currentSong.duration
        },
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        // 获取vuex的状态
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    created() {
        // 不需要getter，setter，所以在created声明，不在data()声明
        this.touch = {}
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll
    },
    methods: {
        // 关闭大播放器界面
        back() {
            this.setFullScreen(false)
        },
        // 开启大播放器界面
        open() {
            this.setFullScreen(true)
        },
        // done为执行函数，执行后会跳转到afterEnter
        enter(el, done) {
            const { x, y, scale } = this._getPosAndScale()
            // 定义动画（定义动画帧）,使用到create-keyframe-animation插件
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(${1.1})`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(${1})`
                }
            }
            // 注册动画
            animations.registerAnimation({
                name: 'move', // 动画名称
                animation,
                presets: { // 动画预设的内容
                    duration: 400,
                    easing: 'linear'
                }
            })
            // 运行动画:第一个参数为动画的dom，第二个为指定的动画名称， 第三个为回调函数
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
            // 清空animation
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = `all 0.4s`
            // es6 语法
            const { x, y, scale } = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            // 监听transitionend事件，完成后执行done
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            // 清空transition
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        togglePlaying() {
            // 控制暂停和开始
            this.setPlayingState(!this.playing)
        },
        // audio的结束事件响应方法
        end() {
            if (this.mode === playMode.loop) {
                this.loop()
            } else {
                this.next()
            }
        },
        // 单曲循环结束时的处理方法
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
        },
        // 下一首歌
        next() {
            if (!this.songReady) {
                return
            }
            let index = this.currentIndex + 1
            // 最后一首的时候，返回到第一首
            if (index === this.playList.length) {
                index = 0
            }
            this.setCurrentIndex(index)
            // 下一首的时候如果不是非播放状态，则改变状态
            if (!this.playing) {
                this.togglePlaying()
            }
            this.songReady = false
        },
        // 上一首歌
        prev() {
            if (!this.songReady) {
                return
            }
            let index = this.currentIndex - 1
            // 最后一首的时候，返回到第一首
            if (index === -1) {
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
                this.togglePlaying()
            }
            this.songReady = false
        },
        ready() {
            this.songReady = true
        },
        // 当歌曲加载失败的时候，做处理
        error() {
            this.songReady = true
        },
        // audio播放时的timeupdate事件相应方法
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        // 格式化时间格式
        format(interval) {
            // 向下取整
            interval = interval | 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60)
            return `${minute}:${second}`
        },
        onProgressBarChange(percent) {
            this.$refs.audio.currentTime = this.currentSong.duration * percent
            // 如果没播放的，选择播放
            if (!this.playing) {
                this.togglePlaying()
            }
        },
        //  改变播放模式
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                // 打乱sequenceList的顺序
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 索引和列表同时改变
            this.resetCurrentIndex(list)
            this.setPlaylist(list)
        },
        // 设置当前索引
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                // 如果item.id等于当前歌曲的id。则返回这个item的index
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        getLyric() {
            // 获取歌词
            this.currentSong.getLyric().then((lyric) => {
                // 解析歌词
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                if (this.playing) {
                    // 播放歌词
                    this.currentLyric.play()
                }
                console.log(this.currentLyric)
            })
        },
        // 创建歌词的回调函数,当歌词变化的时候调用
        handleLyric({ lineNum, txt }) {
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            } else {
                this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
        },
        // 以下是milldle的切换监听事件函数，用于切换歌词和图片页面
        middleTouchStart(e) {
            // 初始化，并记录move开始的坐标
            this.touch.initiated = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        middleTouchMove(e) {
            // 没初始化的话，什么都不做
            if (!this.touch.initiated) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            // 如果移动的纵坐标大于横坐标，直接返回
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            // 以屏幕最右边为中心，this.currentShow === 'cd'的话，歌词的最左边在屏幕的最右边，否则，在屏幕左边
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            // 计算移动的width的范围（在屏幕之间，屏幕最右边开始加移动的距离）
            const offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.touch.percent = Math.abs(offsetwidth / window.innerWidth)
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = 0
            this.$refs.middleL.style.opacity = 1 - this.touch.percent
            this.$refs.middleL.style[transitionDuration] = 0
        },
        middleTouchEnd() {
            let offsetwidth
            let opacity
            // 判断滑动超过屏的1/10的时候，切换页面,cd的界面设置透明度
            if (this.currentShow === 'cd') {
                if (this.touch.percent > 0.1) {
                    offsetwidth = -window.innerWidth
                    this.currentShow = 'lyric'
                    opacity = 0
                } else {
                    offsetwidth = 0
                    opacity = 1
                }
            } else {
                if (this.touch.percent < 0.9) {
                    offsetwidth = 0
                    this.currentShow = 'cd'
                    opacity = 1
                } else {
                    offsetwidth = -window.innerWidth
                    opacity = 0
                }
            }
            const time = 300
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
            //  设置动画过度时间
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
            this.$refs.middleL.style.opacity = opacity
            this.$refs.middleL.style[transitionDuration] = 0
        },
        // 补0操作
        _pad(num, n = 2) {
            // 获取num的长度
            let len = num.toString().length
            while (len < n) {
                num = '0' + num
                len++
            }
            return num
        },
        _getPosAndScale() {
            const targetWidth = 40 // 小图宽度
            const paddingLeft = 40  // 小图左边padding
            const paddingBottom = 30 // 小图下边padding
            const paddingTop = 80  // 大图上边的padding
            const width = window.innerHeight * 0.8 // 大图的宽度
            const scale = targetWidth / width // 缩放比例
            const x = -(window.innerWidth / 2 - paddingLeft) // 偏移量x
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // 偏移量y
            return {
                x,
                y,
                scale
            }
        },
        // 映射到vuex的mutations上
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlaylist: 'SET_PLAYLIST'
        })
    },
    watch: {
        // 监听歌曲的变化
        currentSong(newSong, oldSong) {
            // 当song改变时，前后id相同的话，不作变化
            if (newSong.id === oldSong.id) {
                return
            }
            // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新
            // 如果不调用的话会出现dom错误
            this.$nextTick(() => {
                this.$refs.audio.play()
                this.getLyric()
            })
        },
        // 监听播放状态的变化,控制audio的播放和暂停
        playing(newPlaying) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 3px;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite; // 不停的旋转
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-theme;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-theme;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>


