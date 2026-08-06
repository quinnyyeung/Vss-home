// 商家信息：右侧信息栏第一块，展示当前供应商的基本信息
// mock 数据：联系人、供货规则、经营品类
import { ChevronIcon } from './Icons'

const MERCHANT_INFO = [
  { label: '授权联系人', value: '王大锤' },
  { label: '供货规则', value: '北京超大型生鲜供应商-鼎盛电子商务公司-P8商品' },
  { label: '经营品类', value: '蔬菜瓜果；日用百货' },
]

function MerchantInfo() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">商家信息</h2>
        <span className="flex cursor-pointer items-center gap-0.5 text-xs text-ink-tertiary">
          更多
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {MERCHANT_INFO.map((row) => (
          <div key={row.label} className="flex text-sm">
            <span className="w-20 shrink-0 text-ink-tertiary">{row.label}</span>
            <span className="text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MerchantInfo
