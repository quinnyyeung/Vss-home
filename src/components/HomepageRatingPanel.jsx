// 首页评价面板：点击悬浮条「首页评价」打开
// 五星评分 + 建议文本，提交后校验必须先选星级；成功后按钮禁用防止重复提交
// 评价数据现在只是收集在本地 state 里（handleSubmit 里打印出完整 payload），
// 后续接真实接口时把 payload 发出去即可，不用改这个组件的交互逻辑
import { useState } from 'react'
import starOutline from '../assets/icons/star-outline.png'
import starFilled from '../assets/icons/star-filled.png'
import { CloseIcon } from './Icons'

const STAR_LABELS = {
  0: '请选择',
  1: '非常不满意',
  2: '比较不满意',
  3: '感觉一般',
  4: '比较满意',
  5: '非常满意',
}

function HomepageRatingPanel({ onClose }) {
  const [hoverStars, setHoverStars] = useState(0)
  const [selectedStars, setSelectedStars] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'success' | 'error'

  const displayStars = hoverStars || selectedStars

  const handleSubmit = () => {
    if (selectedStars === 0) {
      setStatus('error')
      return
    }
    // 后续接真实接口：把这个 payload POST 给评价接口即可
    const payload = {
      stars: selectedStars,
      feedback: feedbackText,
      submittedAt: new Date().toISOString(),
    }
    console.log('首页评价提交', payload)
    setStatus('success')
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <div className="w-[300px] rounded-[12px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">首页评价</h3>
        <button type="button" onClick={onClose} className="cursor-pointer text-ink-tertiary hover:text-ink">
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-2 text-sm text-ink">您对首页的使用感到满意吗？</p>
      <div className="mb-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="cursor-pointer"
            onMouseEnter={() => setHoverStars(n)}
            onMouseLeave={() => setHoverStars(0)}
            onClick={() => {
              setSelectedStars(n)
              setStatus('idle')
            }}
          >
            <img src={n <= displayStars ? starFilled : starOutline} alt="" className="h-5 w-5" />
          </button>
        ))}
        <span className="ml-1 text-sm text-ink-secondary">{STAR_LABELS[displayStars]}</span>
      </div>

      <p className="mb-2 text-sm text-ink">您对首页建设有什么建议吗？</p>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value.slice(0, 200))}
        maxLength={200}
        placeholder="输入内容不超过200个字符"
        rows={4}
        className="mb-4 w-full resize-none rounded border border-gray-200 p-2 text-sm text-ink placeholder:text-ink-tertiary focus:border-brand focus:outline-none"
      />

      {status === 'error' && (
        <p className="mb-2 text-xs text-danger">提交失败，请评价后提交</p>
      )}
      {status === 'success' && (
        <p className="mb-2 text-xs text-brand-text">评价成功，请勿重复操作</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === 'success'}
        className="w-full cursor-pointer rounded bg-brand py-2 text-sm text-white transition hover:bg-brand-text active:brightness-90 disabled:cursor-not-allowed disabled:bg-brand/40"
      >
        提交
      </button>
    </div>
  )
}

export default HomepageRatingPanel
