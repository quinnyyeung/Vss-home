// 右侧悬浮条：智能助手/意见反馈/首页评价/问卷调研 + 收起
// 支持垂直方向手动拖拽调整位置（不跨刷新记忆，刷新回到默认位置）
// 面板尺寸、拖拽范围、收起态样式截图上看不出精确值，是估算的，截图给用户对比确认
import { useEffect, useRef, useState } from 'react'
import elephantEntry from '../assets/assistant-bar/elephant-entry.png'
import dragHandleIcon from '../assets/icons/drag-handle.png'
import { FeedbackIcon, CommentIcon, SurveyIcon, ChevronIcon } from './Icons'
import AssistantChatPanel from './AssistantChatPanel'
import HomepageRatingPanel from './HomepageRatingPanel'

const BAR_WIDTH = 64
const DEFAULT_TOP = 460 // 默认位置避开数据看板/商家信息卡片顶部的"更多"链接，参考截图里悬浮条也是停在页面偏下的位置
const DRAG_MARGIN_TOP = 80 // 顶部导航栏(64px)下方留一点距离，不让悬浮条挡住导航

function AssistantBar() {
  const [topPosition, setTopPosition] = useState(DEFAULT_TOP)
  const [collapsed, setCollapsed] = useState(false)
  const [openPanel, setOpenPanel] = useState(null) // null | 'chat' | 'rating'
  const draggingRef = useRef(false)
  const dragOffsetRef = useRef(0)

  const clampTop = (value) => {
    const maxTop = window.innerHeight - 200 // 给悬浮条本身留出高度，不让它拖出视口底部
    return Math.min(Math.max(value, DRAG_MARGIN_TOP), Math.max(maxTop, DRAG_MARGIN_TOP))
  }

  const handleDragStart = (e) => {
    draggingRef.current = true
    dragOffsetRef.current = e.clientY - topPosition
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return
      setTopPosition(clampTop(e.clientY - dragOffsetRef.current))
    }
    const handleMouseUp = () => {
      draggingRef.current = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // 面板紧贴悬浮条左边，纵向对齐悬浮条当前位置，同时不超出视口底部
  const getPanelStyle = (panelHeight) => ({
    position: 'fixed',
    right: BAR_WIDTH + 16,
    top: Math.min(topPosition - 16, window.innerHeight - panelHeight - 16),
    zIndex: 50,
  })

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        style={{ position: 'fixed', top: topPosition, right: 0, zIndex: 40 }}
        className="flex cursor-pointer items-center gap-1 rounded-l-[12px] bg-white py-3 pl-2 pr-1 text-ink-tertiary shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:text-ink-secondary"
      >
        <img src={elephantEntry} alt="智能助手" className="h-8 w-auto object-contain" />
        <ChevronIcon direction="left" className="h-4 w-4" />
      </button>
    )
  }

  return (
    <>
      <div
        style={{ position: 'fixed', top: topPosition, right: 0, width: BAR_WIDTH, zIndex: 40 }}
        className="flex flex-col items-center rounded-l-[12px] bg-white pb-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
      >
        {/* 拖拽手柄：按住上下拖动调整悬浮条位置 */}
        <div
          onMouseDown={handleDragStart}
          className="mb-2 flex w-full cursor-grab justify-center active:cursor-grabbing"
        >
          <img src={dragHandleIcon} alt="" className="h-4 w-6" draggable={false} />
        </div>

        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === 'chat' ? null : 'chat')}
          className="flex w-full cursor-pointer flex-col items-center gap-1 px-1 py-2 hover:bg-gray-50"
        >
          <img src={elephantEntry} alt="" className="h-10 w-auto object-contain" />
          <span className="text-xs text-ink">智能助手</span>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer flex-col items-center gap-1 px-1 py-2 hover:bg-gray-50"
        >
          <FeedbackIcon className="h-5 w-5 text-ink" />
          <span className="text-xs text-ink">意见反馈</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === 'rating' ? null : 'rating')}
          className="flex w-full cursor-pointer flex-col items-center gap-1 px-1 py-2 hover:bg-gray-50"
        >
          <CommentIcon className="h-5 w-5 text-ink" />
          <span className="text-xs text-ink">首页评价</span>
        </button>

        <button
          type="button"
          className="flex w-full cursor-pointer flex-col items-center gap-1 px-1 py-2 hover:bg-gray-50"
        >
          <SurveyIcon className="h-5 w-5 text-ink" />
          <span className="text-xs text-ink">问卷调研</span>
        </button>

        <div className="my-1 h-px w-8 bg-gray-100" />

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex w-full cursor-pointer flex-col items-center gap-0.5 px-1 py-2 text-ink-tertiary hover:text-ink-secondary"
        >
          <span className="flex items-center gap-0.5 text-xs">
            收起
            <ChevronIcon direction="right" className="h-3 w-3" />
          </span>
        </button>
      </div>

      {openPanel === 'chat' && (
        // 固定贴右上角（导航栏下方留 16px），带完整投影的浮层卡片；视口不够高时顶部位置自动上移，保证卡片不被截断
        <div style={{ position: 'fixed', top: Math.max(16, Math.min(80, window.innerHeight - 700 - 16)), right: 16, zIndex: 50 }}>
          <AssistantChatPanel onClose={() => setOpenPanel(null)} />
        </div>
      )}
      {openPanel === 'rating' && (
        <div style={getPanelStyle(380)}>
          <HomepageRatingPanel onClose={() => setOpenPanel(null)} />
        </div>
      )}
    </>
  )
}

export default AssistantBar
