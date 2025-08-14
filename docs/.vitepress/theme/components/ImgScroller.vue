<template>
  <div class="img-scroll-wrapper" ref="wrapper">
    <!-- 提示框 -->
    <div :class="['swipe-hint', { show: showHint }]">
      <!-- slot 提示 -->
      <slot name="hint" :type="hintType">
        <!-- 默认提示文字（如果外部没定义 slot） -->
        <span v-if="hintType === 'start'">👉 向右滑动查看更多图片</span>
        <span v-else>这是最后一张图片了</span>
      </slot>
    </div>

    <!-- 滑动容器 -->
    <div class="img-scroll-inner" ref="scroller" @scroll="onScroll">
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'ImgScroller',
  props: {
    autoHideMs: { type: Number, default: 2500 }, // 提示自动隐藏时间（ms）
    mobileMaxWidth: { type: Number, default: 768 } // 认为是移动端的宽度阈值
  },
  setup(props) {
    const scroller = ref(null)
    const wrapper = ref(null)
    const showHint = ref(false)
    const hintType = ref('start') // 'start' | 'end'

    let hideTimer = null
    let showDelayTimer = null
    let atEndHintShown = false

    const isMobile = () => window.innerWidth <= props.mobileMaxWidth

    // 显示提示框并自动隐藏
    const startHintTimer = (type) => {
      if (!isMobile()) return
      clearTimeout(showDelayTimer)
      clearTimeout(hideTimer)

      hintType.value = type

      // 先延迟1.5秒显示提示
      showDelayTimer = setTimeout(() => {
        showHint.value = true
        // 显示后再等 autoHideMs 毫秒隐藏
        hideTimer = setTimeout(() => {
          showHint.value = false
        }, props.autoHideMs)
      }, 1500)
    }

    // onScroll 的依赖函数
    // 功能：判断滑动容器是否滚动到最右端
    // onScroll 通过这个函数来决定是否触发“末尾提示”
    const isScrollAtEnd = () => {
      if (!scroller.value) return false
      const el = scroller.value
      return el.scrollWidth - el.scrollLeft - el.clientWidth < 10
    }

    // onScroll 是绑定在滑动容器 .img-scroll-inner 的 @scroll 事件上的
    // 当用户横向滚动时，它会被触发
    const onScroll = () => {
      if (isScrollAtEnd()) {
        if (!atEndHintShown) {
          startHintTimer('end')
          atEndHintShown = true
        }
      } else {
        atEndHintShown = false
      }
    }

    onMounted(() => {
      if (isMobile()) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              startHintTimer('start')
              observer.disconnect()
            }
          },
          { threshold: 0.1 }
        )
        if (wrapper.value) {
          observer.observe(wrapper.value)
        }
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(hideTimer)
      clearTimeout(showDelayTimer)
    })

    return { scroller, wrapper, showHint, onScroll, hintType }
  }
}
</script>

<style scoped>
/* 滑动容器样式 */
.img-scroll-inner {
  height: 350px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
  overflow-x: auto;   /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动条 */
  scroll-snap-type: x mandatory; /* 可选：让滑动对齐 */
  -webkit-overflow-scrolling: touch; /* iOS 惯性滑动 */
  padding-bottom: 10px; /* 防止滚动条遮住内容 */
}

/* 图片样式 */
/* 穿透 slot 内 img 元素 */
::v-deep(.img-scroll-inner img) {
  flex: 0 0 auto;
  scroll-snap-align: start;
  border-radius: 4px;
}

/* 隐藏滚动条（可选） */
/* .img-scroll::-webkit-scrollbar {
  display: none;
} */

.img-scroll-wrapper {
  position: relative; /* 新增，建立定位上下文 */
}


/* 优化的 Toast 样式提示 */
.swipe-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80vw;
  padding: 10px 20px;
  background: rgba(58, 58, 58, 0.9);
  color: white;
  font-size: 16px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease;
  z-index: 1000;
  user-select: none;
  white-space: nowrap;
}

.swipe-hint.show {
  opacity: 1;
}
</style>
