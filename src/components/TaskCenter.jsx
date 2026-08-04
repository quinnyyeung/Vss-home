// 任务中心：4 个待办分类卡片，每张卡片第一项是高亮的"待处理"事项（带数字角标）
// mock 数据：每张卡片的标题和事项列表，highlight: true 表示要高亮显示、badge 是角标数字
const TASK_CARDS = [
  {
    title: '商品信息',
    items: [
      { label: '待提交商品资质', badge: 3, highlight: true },
      { label: '被驳回新品数' },
      { label: '被驳回内容信息' },
      { label: '内容未填写数' },
    ],
  },
  {
    title: '履约单据',
    items: [
      { label: '待确认采购单', badge: 3, highlight: true },
      { label: '待确认质检单' },
      { label: '待确认退供单' },
      { label: '待处理违规单' },
    ],
  },
  {
    title: '合同结算',
    items: [
      { label: '待对账单据', badge: 3, highlight: true },
      { label: '电子合同' },
    ],
  },
  {
    title: '价格管理',
    items: [
      { label: '待报价列表', badge: 3, highlight: true },
      { label: '待议价列表' },
    ],
  },
]

function TaskCenter() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">任务中心</h2>
      <div className="grid grid-cols-4 gap-4">
        {TASK_CARDS.map((card) => (
          <div key={card.title} className="rounded-[12px] border border-gray-100 p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink">{card.title}</h3>
            <div className="flex flex-col gap-2">
              {card.items.map((item) => (
                <div
                  key={item.label}
                  className={
                    'flex items-center justify-between rounded px-3 py-2 text-sm ' +
                    (item.highlight ? 'bg-green-50 text-ink' : 'text-ink-secondary')
                  }
                >
                  <span>{item.label}</span>
                  <span className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="font-number flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-ink-tertiary">›</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TaskCenter
