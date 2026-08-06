// 流程导览：2x2 的功能入口格子
// mock 数据：入口名称
import { ChevronIcon } from './Icons'

const PROCESS_ITEMS = ['商家准入', '商品资质', '财务结算', '终止合作']

function ProcessGuide() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">流程导览</h2>
        <span className="flex cursor-pointer items-center gap-0.5 text-xs text-ink-tertiary">
          全部
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PROCESS_ITEMS.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-[12px] border border-gray-100 px-3 py-2.5 text-sm text-ink-secondary"
          >
            <span>{item}</span>
            <ChevronIcon direction="right" className="h-4 w-4 text-ink-tertiary" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProcessGuide
