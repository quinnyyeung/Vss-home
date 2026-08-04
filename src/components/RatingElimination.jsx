// 评级汰换：评级结果 / 汰换预警 两个 tab
// 今天(骨架阶段)只做"评级结果"这个 tab 的静态内容，趋势图先用占位色块代替，等选定图表库后再画真实图表
// mock 数据：评级说明表格
const TABS = ['评级结果', '汰换预警']

const RATING_TABLE = [
  { level: 'S级', status: '正常合作' },
  { level: 'A级', status: '正常合作' },
  { level: 'B级', status: '有停采风险' },
  { level: 'C级', status: '停采高风险' },
]

function RatingElimination() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">评级汰换</h2>

      {/* tab 切换：今天只做视觉，"评级结果"固定是选中态 */}
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
        <span>根据供应商的采购规模与履约水平，平台定义S、A、B、C分别为绩效优秀、良好、合格、较差</span>
        <span className="cursor-pointer whitespace-nowrap text-notice-text">具体说明 ›</span>
      </div>

      <div className="flex gap-6">
        {/* 左侧：趋势图占位区域，固定尺寸按设计稿给的 518×212，等选定图表库后替换成真实图表 */}
        <div className="shrink-0">
          <div className="mb-2 text-sm font-semibold text-ink">近半年各城市评级趋势图</div>
          <div className="flex h-[212px] w-[518px] items-center justify-center rounded bg-gray-100 text-sm text-ink-tertiary">
            图表占位（待接入图表库）
          </div>
        </div>

        {/* 右侧：评级说明表格，宽度随图表占位剩下的空间自适应 */}
        <div className="flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-ink-tertiary">
                <th className="pb-2 text-left font-normal">评级结果</th>
                <th className="pb-2 text-left font-normal">预警信息</th>
              </tr>
            </thead>
            <tbody>
              {RATING_TABLE.map((row) => (
                <tr key={row.level} className="border-b border-gray-50">
                  <td className="py-2 text-ink-secondary">{row.level}</td>
                  <td className="py-2 text-ink-secondary">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default RatingElimination
