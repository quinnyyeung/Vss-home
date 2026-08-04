// 数据看板：履约数据 / 采购订单数据 两个 tab
// 今天(骨架阶段)只做"履约数据"这个 tab 的静态内容，"采购订单数据"先只显示 tab 标签、内容留到做交互的那天再接
// mock 数据：达标指标卡片，ok: true 表示已达标（绿色），false 表示未达标（红色）
const TABS = ['履约数据', '采购订单数据']

const METRIC_CARDS = [
  { label: '到货满足率', desc: '需大于目标值 95%', value: '94.5%', ok: false },
  { label: '到货准时率', desc: '需大于目标值 95%', value: '100%', ok: true },
  { label: '拒收率', desc: '需小于目标值 1.2%', value: '1.1%', ok: true },
  { label: '二配质检率', desc: '需小于目标值 1.2%', value: '1.6%', ok: false },
  { label: '综合货损率', desc: '需小于目标值 1.2%', value: '1.1%', ok: true },
]

function DataDashboard() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">数据看板</h2>

      {/* tab 切换：今天只做视觉，"履约数据"固定是选中态 */}
      <div className="mb-4 flex gap-6 border-b border-gray-100 text-sm">
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

      {/* 提示条 */}
      <div className="mb-4 flex items-center justify-between rounded bg-amber-50 px-4 py-2 text-sm text-notice-text">
        <span>当前展示6月份履约各指标数据情况</span>
        <span className="cursor-pointer whitespace-nowrap text-notice-text">查看更多 ›</span>
      </div>

      {/* 城市筛选下拉（今天只做视觉） */}
      <button className="mb-4 flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-sm text-ink-secondary">
        北京（含廊坊） <span className="text-xs text-ink-tertiary">⌄</span>
      </button>

      {/* 指标卡片 */}
      <div className="grid grid-cols-5 gap-4">
        {METRIC_CARDS.map((m) => (
          <div
            key={m.label}
            className={
              'rounded-[12px] p-4 ' + (m.ok ? 'bg-green-50' : 'bg-red-50')
            }
          >
            <span
              className={
                'mb-2 inline-block rounded px-1.5 py-0.5 text-xs ' +
                (m.ok ? 'bg-green-100 text-brand-text' : 'bg-red-100 text-danger')
              }
            >
              {m.ok ? '✓ 已达标' : '! 未达标'}
            </span>
            <div className="text-sm text-ink-secondary">{m.label}</div>
            <div className="mb-1 text-[10px] text-ink-tertiary">{m.desc}</div>
            <div
              className={
                'font-number text-2xl font-semibold ' + (m.ok ? 'text-brand-text' : 'text-danger')
              }
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DataDashboard
