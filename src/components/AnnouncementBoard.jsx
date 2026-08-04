// 公告栏：最新 / 预警 / 通知 / 规则 / 函件 几个 tab，今天只做"最新"这个 tab 的静态列表
// mock 数据：每条公告的类型标签、标题、日期
const TABS = ['最新', '预警', '通知', '规则', '函件']

const ANNOUNCEMENTS = [
  { tag: '预警', title: '采购单CG202203987222确认时...', date: '2023-07-26' },
  { tag: '通知', title: '苏州仓周转筐租赁及使用注意事项', date: '2023-07-26' },
  { tag: '规则', title: 'SP-GYSM-39供应商品质履约 管...', date: '2023-07-20' },
  { tag: '通知', title: '采购单确认时效通知', date: '2023-07-xx' },
  { tag: '通知', title: '供应商杂筐送货 切勿与我方仓内...', date: '2023-07-xx' },
]

function AnnouncementBoard() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">公告栏</h2>
        <span className="cursor-pointer text-xs text-ink-tertiary">更多 ›</span>
      </div>

      <div className="mb-3 flex gap-4 border-b border-gray-100 text-sm">
        {TABS.map((tab, index) => (
          <div
            key={tab}
            className={
              'cursor-pointer border-b-2 pb-2 ' +
              (index === 0
                ? 'border-brand text-brand-text'
                : 'border-transparent text-ink-tertiary')
            }
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {ANNOUNCEMENTS.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-ink-secondary">
              {item.tag}
            </span>
            <span className="flex-1 truncate text-ink-secondary">{item.title}</span>
            <span className="shrink-0 text-xs text-ink-tertiary">{item.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AnnouncementBoard
