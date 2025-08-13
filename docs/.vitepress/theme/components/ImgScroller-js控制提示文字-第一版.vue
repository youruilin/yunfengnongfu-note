<!-- .vitepress/theme/components/ImgScroller.vue -->
<template>
  <div class="img-scroll-wrapper" ref="wrapper">
    <div :class="['swipe-hint', { show: showHint }]" ref="hint">{{ currentHintText }}</div>

    <!-- 滑动容器：slot 模式，方便直接在 Markdown 里放 <img> -->
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
    hintText: { type: String, default: '👉 向右滑动查看更多图片' },
    endHintText: { type: String, default: '这是最后一张图片了' },
    autoHideMs: { type: Number, default: 2000 }, // 提示自动隐藏时间（ms）
    mobileMaxWidth: { type: Number, default: 768 } // 认为是移动端的宽度阈值
  },
  setup(props) {

    const currentHintText = ref(props.hintText)

    const scroller = ref(null)
    const wrapper = ref(null)
    const showHint = ref(false)
    let hideTimer = null
    let showDelayTimer = null

    const isMobile = () => window.innerWidth <= props.mobileMaxWidth

    let isInitialHint = false
    const startHintTimer = (text, isInitial = false) => {
      if (!isMobile()) return
      clearTimeout(showDelayTimer)
      clearTimeout(hideTimer)

      isInitialHint = isInitial

      currentHintText.value = text  // 设置当前提示文字

      console.log('触发', text)

      // 先延迟1.5秒显示提示
      showDelayTimer = setTimeout(() => {
        showHint.value = true
        // 显示后再等 autoHideMs 毫秒隐藏
        hideTimer = setTimeout(() => {
          showHint.value = false
        }, props.autoHideMs)
      }, 1500)
      console.log('已弹出提示', currentHintText.value)
    }

    const hideHintNow = () => {
      showHint.value = false
      clearTimeout(hideTimer)
      clearTimeout(showDelayTimer) // 取消延迟显示
    }

    const isScrollAtEnd = () => {
      if (!scroller.value) return false
      const el = scroller.value
      return el.scrollWidth - el.scrollLeft - el.clientWidth < 10
    }

    let atEndHintShown = false

    const onScroll = () => {
      if (isScrollAtEnd()) {
        if (!atEndHintShown) {
          hideHintNow()
          startHintTimer(props.endHintText, true)
          console.log('Scrolled to end')
          atEndHintShown = true
        }
      } else {
        atEndHintShown = false
      }
    }

    const onUserInteract = () => {
      if (isInitialHint) return // 首次提示不被中断
      hideHintNow()
    }

    onMounted(() => {
      if (isMobile()) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              startHintTimer(props.hintText, true) // 初始提示
              observer.disconnect()
            }
          },
          { threshold: 0.1 }
        )
        if (wrapper.value) {
          observer.observe(wrapper.value)
        }
      }

      const el = scroller.value
      if (!el) return
      el.addEventListener('touchstart', onUserInteract, { passive: true })
      el.addEventListener('touchmove', onUserInteract, { passive: true })
      el.addEventListener('wheel', onUserInteract, { passive: true })
      el.addEventListener('pointerdown', onUserInteract, { passive: true })
    })

    onBeforeUnmount(() => {
      clearTimeout(hideTimer)
      clearTimeout(showDelayTimer)
      const el = scroller.value
      if (!el) return
      el.removeEventListener('touchstart', onUserInteract)
      el.removeEventListener('touchmove', onUserInteract)
      el.removeEventListener('wheel', onUserInteract)
      el.removeEventListener('pointerdown', onUserInteract)
    })

    return { scroller, wrapper, showHint, onScroll, currentHintText}
  }
}
</script>

<style scoped>

.img-scroll-inner {
  height: 350px;
  display: flex;
  gap: 10px;
  overflow-x: auto;   /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动条 */
  scroll-snap-type: x mandatory; /* 可选：让滑动对齐 */
  -webkit-overflow-scrolling: touch; /* iOS 惯性滑动 */
  padding-bottom: 10px; /* 防止滚动条遮住内容 */
}

/* 图片样式 */
.img-scroll-inner img {
  flex: 0 0 auto;     /* 防止图片被压缩 */
  scroll-snap-align: start; /* 滑动时对齐 */
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
  transition: opacity 0.9s ease;
  z-index: 1000;
  user-select: none;
  white-space: nowrap;
}

.swipe-hint.show {
  opacity: 1;
}
</style>
