// 商家智能助手对话框：点击悬浮条「智能助手」打开
// 今天只做静态展示（欢迎语 + FAQ 快捷问题列表），不接入真实问答逻辑——
// FAQ 按钮和底部发送框只是视觉还原，点击/发送不会有真实回复
import { useState } from 'react'
import elephantWelcome from '../assets/assistant-bar/elephant-welcome.png'
import sendIcon from '../assets/icons/send.png'
import { CloseIcon, NewChatIcon } from './Icons'

const FAQ_SUGGESTIONS = ['租赁物资管理', '租赁费发票、物流费发票、促销发票开具方式', '如何更改授权人', '新商入驻后如何建品', '需要维护哪些商家资质']

function AssistantChatPanel({ onClose }) {
  const [inputText, setInputText] = useState('')

  return (
    <div className="flex h-[700px] w-[400px] flex-col rounded-[20px] bg-gradient-to-b from-green-50 to-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {/* 头部：标题 + 新会话 + 关闭 */}
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <h3 className="text-lg font-semibold">商家智能助手</h3>
        <div className="flex items-center gap-3 text-ink-tertiary">
          <button type="button" className="flex cursor-pointer items-center gap-1 text-xs hover:text-ink-secondary">
            <NewChatIcon className="h-4 w-4" />
            新会话
          </button>
          <button type="button" onClick={onClose} className="cursor-pointer hover:text-ink-secondary">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-3 shrink-0 text-xs text-ink-tertiary">
        点击查看之前的<span className="cursor-pointer text-brand-text">会话记录</span>
      </p>

      {/* 欢迎语 */}
      <div className="mb-3 flex shrink-0 items-start gap-2">
        <img src={elephantWelcome} alt="" className="h-14 w-14 shrink-0" />
        <p className="pt-1 text-sm text-ink">亲爱的商家您好，我是您的专属智能助手，助您高效解决经营中的各类问题～</p>
      </div>

      {/* FAQ 快捷问题：静态展示，点击不接真实问答 */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-[12px] bg-white p-3">
        <p className="mb-2 text-xs text-ink-tertiary">大家都在问：</p>
        <div className="flex flex-col gap-2">
          {FAQ_SUGGESTIONS.map((text) => (
            <div
              key={text}
              className="flex cursor-pointer items-center justify-between gap-2 rounded bg-green-50/60 px-3 py-2 text-sm text-ink hover:bg-green-50"
            >
              <span className="truncate">{text}</span>
              <img src={sendIcon} alt="" className="h-4 w-4 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 底部输入区：静态，发送不会有真实回复 */}
      <div className="mt-3 shrink-0">
        <button
          type="button"
          className="mb-2 cursor-pointer rounded-full border border-gray-200 px-3 py-1 text-xs text-ink-secondary hover:bg-gray-50"
        >
          上传图片
        </button>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请在这里输入您想问的问题"
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm text-ink placeholder:text-ink-tertiary focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setInputText('')}
            className="cursor-pointer rounded bg-brand px-4 py-2 text-sm text-white transition hover:bg-brand-text active:brightness-90"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssistantChatPanel
