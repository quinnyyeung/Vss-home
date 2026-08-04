// 常见问题：编号列表
// mock 数据：问题文案、日期
const FAQ_ITEMS = [
  { text: 'VSS移动端如何登录？', date: '2023-09-01' },
  { text: '为什么无法提交结算单？', date: '2023-08-25' },
  { text: '付款日当天为什么没有收到货款？', date: '2023-08-18' },
  { text: '商家更改名称信息需要重签合同、重...', date: '2023-08-10' },
  { text: 'VSS移动端如何登录？', date: '2023-07-31' },
]

function FAQ() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">常见问题</h2>
        <span className="cursor-pointer text-xs text-ink-tertiary">知识库 ›</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="shrink-0 text-ink-tertiary">{index + 1}</span>
            <span className="flex-1 truncate text-ink-secondary">{item.text}</span>
            <span className="shrink-0 text-xs text-ink-tertiary">{item.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ
