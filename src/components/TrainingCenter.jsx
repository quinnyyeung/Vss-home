// 培训中心：两个课程统计小方块
// mock 数据：课程分类、待学习数量
import { ChevronIcon } from './Icons'

const TRAINING_STATS = [
  { label: '功能前置课程', count: 6 },
  { label: '推送课程', count: 22 },
]

function TrainingCenter() {
  return (
    <section className="rounded-[20px] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">培训中心</h2>
        <span className="flex cursor-pointer items-center gap-0.5 text-xs text-ink-tertiary">
          更多
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TRAINING_STATS.map((stat) => (
          <div key={stat.label} className="rounded border border-gray-100 p-3">
            <div className="mb-1 text-xs text-ink-tertiary">{stat.label} ⓘ</div>
            <div className="text-xl font-semibold text-ink">
              <span className="font-number">{stat.count}</span>{' '}
              <span className="text-xs font-normal text-ink-tertiary">门</span>
            </div>
            <div className="text-xs text-ink-tertiary">待学习</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrainingCenter
