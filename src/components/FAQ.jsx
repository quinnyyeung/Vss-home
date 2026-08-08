// 常见问题：编号列表
// mock 数据：问题文案、日期
import { ChevronIcon } from './Icons'

const FAQ_ITEMS = [
  { text: 'VSS移动端如何登录？', date: '2024-09-01' },
  { text: '为什么无法提交结算单？', date: '2024-08-25' },
  { text: '付款日当天为什么没有收到货款？', date: '2024-08-18' },
  { text: '商家更改名称信息需要重签合同、重...', date: '2024-08-10' },
  { text: 'VSS移动端如何登录？', date: '2024-07-31' },
]

function FAQ() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">常见问题</h2>
        <span className="flex cursor-pointer items-center gap-0.5 text-xs text-ink-tertiary">
          知识库
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>
      {FAQ_ITEMS.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-tertiary">暂无常见问题</p>
      ) : (
        <div className="flex flex-col gap-1">
          {FAQ_ITEMS.map((item, index) => (
            <button
              key={index}
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-left text-sm transition-colors hover:bg-gray-50"
            >
              <span className="shrink-0 text-ink-tertiary">{index + 1}</span>
              <span className="flex-1 truncate text-ink-secondary">{item.text}</span>
              <span className="shrink-0 text-xs text-ink-tertiary">{item.date}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default FAQ
