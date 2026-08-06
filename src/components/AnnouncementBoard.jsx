// 公告栏：最新 / 预警 / 通知 / 规则 / 函件 5 个 tab
// 交互规则参考 docs/interaction-notes.md 的"⑦ 公告栏"：
// - "最新" tab 混合展示所有类型，按发布时间排序，每条前面带类型标签
// - 切到具体分类 tab 后只展示该类型的条目，不展示标签
// - demo 没有真实详情页，"更多"和单条点击目前只做视觉反馈
import { useState } from 'react'
import { ChevronIcon } from './Icons'

const TABS = ['最新', '预警', '通知', '规则', '函件']

// mock 数据：id 用于 React key，tag 用于按分类过滤，日期倒序排列即代表发布时间排序
const ANNOUNCEMENTS = [
  { id: 1, tag: '通知', title: 'SP-GYSM-39供应商违规申诉必知', date: '2024-07-29' },
  { id: 2, tag: '预警', title: '采购单CG202403987222确认时...', date: '2024-07-26' },
  { id: 3, tag: '通知', title: '苏州仓周转筐租赁及使用注意事项', date: '2024-07-26' },
  { id: 4, tag: '规则', title: 'SP-GYSM-39供应商品质履约 管...', date: '2024-07-20' },
  { id: 5, tag: '通知', title: '供应商杂筐送货 切勿与我方仓内...', date: '2024-07-18' },
  { id: 6, tag: '预警', title: '采购单CG202404561120存在异常，请核实', date: '2024-07-15' },
  { id: 7, tag: '规则', title: '供应商结算规则调整说明', date: '2024-07-10' },
  { id: 8, tag: '函件', title: '关于开展2024年供应商合规自查的函', date: '2024-07-05' },
]

function AnnouncementBoard() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  // 每个 tab 最多展示 5 条，更多内容点击"更多"查看（demo 暂不做详情页跳转）
  const list = (
    activeTab === '最新' ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter((item) => item.tag === activeTab)
  ).slice(0, 5)

  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">公告栏</h2>
        <span className="flex cursor-pointer items-center gap-0.5 text-xs text-ink-tertiary transition-colors hover:text-brand-text">
          更多
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>

      <div className="mb-3 flex gap-4 border-b border-gray-100 text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={
              'cursor-pointer border-b-2 pb-2 transition-colors ' +
              (tab === activeTab
                ? 'border-brand text-brand-text'
                : 'border-transparent text-ink-tertiary hover:text-ink-secondary')
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-tertiary">暂无公告</p>
      ) : (
        <div className="flex flex-col gap-1">
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-left text-sm transition-colors hover:bg-gray-50"
            >
              {activeTab === '最新' && (
                <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-ink-secondary">
                  {item.tag}
                </span>
              )}
              <span className="flex-1 truncate text-ink-secondary">{item.title}</span>
              <span className="shrink-0 text-xs text-ink-tertiary">{item.date}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default AnnouncementBoard
