// 流程导览详情页：点击首页"流程导览"入口后跳转到这里
// Day 5 步骤 1：按计划"不需要做成真实可交互的流程图，用参考截图直接展示"，
// 所以这里不重新拼卡片+虚线箭头，直接用用户提供的 4 张流程图截图（src/assets/process-guide/）
//
// 图缩放：4 张图原图分辨率不一样（截图时内容多的图本身更宽更高，不是缩放比例不同），
// 所以不能都设成同一个显示宽度，而是统一按原图宽度 × 0.28 显示，缩放比例对每张图一致，
// 卡片文字才会一样大。0.28 是对照页面里旁边 tab 文字（14px）目测校准出来的，不是精确测出来的，
// 如果看着还是不对，需要用户确认目标字号后再调
// 顶部裁切：4 张图最上面都带一条"全部流程/仅看供应商协同流程"的按钮（这个高亮功能不做交互，
// 用户要求去掉），用 overflow-hidden + 图片负 margin-top 的方式裁掉。用 canvas 采样过像素确认
// 按钮绿色边框在原图 y=70~150 这段，裁剪量必须大于 150 才能保证 4 个 tab 都不露出按钮残影
import { useState } from 'react'
import { ChevronIcon } from './Icons'
import merchantOnboardingImg from '../assets/process-guide/merchant-onboarding.png'
import productQualificationImg from '../assets/process-guide/product-qualification.png'
import financialSettlementImg from '../assets/process-guide/financial-settlement.png'
import terminationImg from '../assets/process-guide/termination.png'

const SCALE = 0.28
const CROP_TOP_NATIVE_PX = 160 // 裁掉顶部按钮栏，用像素采样测过按钮绿色边框在原图 y=70~150，160 留了安全余量
const EXTRA_TOP_GAP_CLASS = 'pt-2' // 图片裁完后自带的顶部留白只有约 12px（原图按钮到卡片之间空白有限），
// 用外层容器的 padding 再补一点，凑够看起来舒服的间距，这部分是真 CSS padding，跟裁剪量无关

const TABS = [
  { label: '商家准入', img: merchantOnboardingImg, nativeWidth: 4008 },
  { label: '商品资质', img: productQualificationImg, nativeWidth: 4200 },
  { label: '财务结算', img: financialSettlementImg, nativeWidth: 5028 },
  { label: '终止合作', img: terminationImg, nativeWidth: 5088 },
].map((tab) => ({
  ...tab,
  displayWidth: Math.round(tab.nativeWidth * SCALE),
  cropTop: Math.round(CROP_TOP_NATIVE_PX * SCALE),
}))

function ProcessGuidePage({ initialTab, onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab ?? 0)

  // 外层固定高度（跟侧边栏一样是视口减 Header 的 64px），flex-1 的滚动容器才有边界可以撑满、
  // 不会被撑高的图片把整个页面顶下去——否则会变成页面本身滚动，图片下面的空白反而看不到
  return (
    <div className="flex h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col gap-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit shrink-0 cursor-pointer items-center gap-1 text-sm text-ink-secondary hover:text-ink"
      >
        <ChevronIcon direction="left" className="h-4 w-4" />
        返回首页
      </button>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[20px] bg-white p-5">
        <h2 className="mb-3 shrink-0 text-lg font-semibold">流程导览</h2>

        <div className="mb-4 flex shrink-0 gap-6 border-b border-gray-100 text-sm">
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(index)}
              className={
                'cursor-pointer border-b-2 pb-2 transition-colors ' +
                (index === activeTab
                  ? 'border-brand text-brand-text'
                  : 'border-transparent text-ink-tertiary hover:text-ink-secondary')
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 一屏放不下时容器左右上下滚动；内层 overflow-hidden + 图片负 margin-top 裁掉顶部按钮栏 */}
        <div
          className={
            'min-h-0 min-w-0 flex-1 overflow-auto rounded-[12px] border border-gray-100 bg-gray-50 ' +
            EXTRA_TOP_GAP_CLASS
          }
        >
          <div className="inline-block overflow-hidden">
            <img
              src={TABS[activeTab].img}
              alt={TABS[activeTab].label}
              style={{ width: TABS[activeTab].displayWidth, marginTop: -TABS[activeTab].cropTop, maxWidth: 'none' }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProcessGuidePage
