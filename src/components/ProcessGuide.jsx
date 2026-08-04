// 流程导览：2x2 的功能入口格子
// mock 数据：入口名称
const PROCESS_ITEMS = ['商家准入', '商品资质', '财务结算', '终止合作']

function ProcessGuide() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">流程导览</h2>
        <span className="cursor-pointer text-xs text-ink-tertiary">全部 ›</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PROCESS_ITEMS.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-[12px] border border-gray-100 px-3 py-2.5 text-sm text-ink-secondary"
          >
            <span>{item}</span>
            <span className="text-ink-tertiary">›</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProcessGuide
