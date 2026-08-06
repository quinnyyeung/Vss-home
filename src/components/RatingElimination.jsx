// 评级汰换：评级结果 / 汰换预警 两个 tab
// Day3：评级结果 tab 是 ECharts 折线图；汰换预警 tab 是预警卡片列表（里面还有"商汰换/SKU汰换"两个子 tab）+ 分页
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { ChevronIcon } from './Icons'

const TABS = ['评级结果', '汰换预警']

// mock 数据：评级说明表格
const RATING_TABLE = [
  { level: 'S级', status: '正常合作' },
  { level: 'A级', status: '正常合作' },
  { level: 'B级', status: '有停采风险' },
  { level: 'C级', status: '停采高风险' },
]

// mock 数据：近半年(2024-01~2024-06)各城市评级趋势
// 数值是参照截图曲线走势编写的示意数据，唯一有确切依据的锚点是截图里 hover 在 2024-03 时显示的
// 5 个城市评级（北京S/上海A/深圳B/广州C/苏州无评级），其余月份是按曲线形状估的，
// 如果要跟设计稿逐点对上，需要你提供真实评级数据表
const RATING_LEVELS = ['无评级', 'C级', 'B级', 'A级', 'S级'] // 从下到上，y轴分类顺序
const RATING_MONTHS = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06']

const CITY_TREND_SERIES = [
  { name: '北京（含廊坊）', color: '#347BED', data: ['S级', 'S级', 'S级', 'S级', 'S级', 'S级'] },
  { name: '上海', color: '#3DC29D', data: ['B级', 'B级', 'A级', 'A级', 'S级', 'S级'] },
  { name: '深圳', color: '#FAD400', data: ['C级', 'C级', 'B级', 'B级', 'A级', 'A级'] },
  { name: '广州（含佛山）', color: '#6FCEF7', data: ['A级', 'A级', 'C级', '无评级', '无评级', 'C级'] },
  { name: '苏州', color: '#F08605', data: ['无评级', '无评级', '无评级', 'C级', 'B级', 'C级'] },
]

// mock 数据：汰换预警列表用到的"城市 → 公司"对照表，每个城市对应不同的公司，不是同一家公司在不同城市
const WARNING_CITY_MERCHANTS = {
  '北京（含廊坊）': '北京超大型生鲜供应商-鼎盛电子商务公司-P8商品/1008366',
  上海: '上海鲜沐农业科技有限公司-P6商品/1009215',
  '广州（含佛山）': '广州穗丰果蔬供应链有限公司-P5商品/1007766',
  深圳: '深圳前海优选生鲜贸易有限公司-P7商品/1006654',
  苏州: '苏州吴中鲜品配送有限公司-P4商品/1005321',
}
const WARNING_CITIES = Object.keys(WARNING_CITY_MERCHANTS)
const WARNING_CATEGORIES = ['快销品/粮油调味', '生鲜/水果', '餐饮熟食/烘焙糕点', '生鲜/水产', '日用百货/清洁用品', '快销品/休闲食品']
const WARNING_PRODUCTS = [
  '闽越山野枸杞200g',
  '阳光玫瑰葡萄500g',
  '智利车厘子1kg',
  '东北长粒香米5kg',
  '特级初榨橄榄油1L',
  '有机小白菜300g',
  '新疆哈密瓜1个',
  '内蒙古草原羊排500g',
]

// "商汰换"子 tab 的预警卡片列表：40 条，5条/页 x 8页，跟截图的分页数量对上，不是只做第1页样子货
// 城市/公司/品类是从上面几个对照表里循环取的，为的是让分页翻起来内容看着不一样，不是要还原真实业务数据
const CATEGORY_WARNINGS = Array.from({ length: 40 }, (_, i) => {
  const city = WARNING_CITIES[i % WARNING_CITIES.length]
  return {
    level: i % 3 === 2 ? 'medium' : 'high',
    title: WARNING_CATEGORIES[i % WARNING_CATEGORIES.length],
    city,
    merchant: WARNING_CITY_MERCHANTS[city],
    period: '202406',
    dueMonth: '202409',
    dataRange: '综合1~2月',
    result: 'C',
  }
})

// "SKU汰换"子 tab 的预警卡片列表：同样 40 条，城市顺序跟"商汰换"错开，避免两个子 tab 看起来像同一份数据
const SKU_WARNINGS = Array.from({ length: 40 }, (_, i) => {
  const city = WARNING_CITIES[(i + 2) % WARNING_CITIES.length]
  return {
    level: i % 3 === 2 ? 'medium' : 'high',
    title: WARNING_PRODUCTS[i % WARNING_PRODUCTS.length],
    city,
    merchant: WARNING_CITY_MERCHANTS[city],
    skuId: String(24795 + i),
    category: WARNING_CATEGORIES[i % WARNING_CATEGORIES.length],
    period: '202406',
    dueMonth: '202409',
    currentResult: 'C',
    totalResult: 'C',
  }
})

const WARNING_PAGE_SIZE = 5

// 评级结果 tab：近半年各城市评级趋势图，用 ECharts 画分类折线图（Y轴是评级档位，不是数字）
function CityRatingTrendChart() {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      // grid.bottom / 容器高度跟数据看板的采购订单折线图保持一致，让两个图表和图例的间距看起来一样
      grid: { left: 60, right: 20, top: 20, bottom: 52 },
      xAxis: {
        type: 'category',
        data: RATING_MONTHS,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5e5e5' } },
        axisTick: { show: false },
        axisLabel: { color: '#949494', fontSize: 12 },
      },
      yAxis: {
        type: 'category',
        data: RATING_LEVELS,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#949494', fontSize: 12 },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 20,
        textStyle: { color: '#666666', fontSize: 12 },
      },
      // hover 浮层：垂直参考线 + 白色卡片（标题日期 + 每个城市色块/名称/评级，"无评级"用灰色字）
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: { color: '#dcdcdc' },
        },
        backgroundColor: '#ffffff',
        borderWidth: 0,
        padding: [12, 16],
        extraCssText: 'box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-radius: 8px;',
        formatter: (params) => {
          const rows = params
            .map((p) => {
              const isUnrated = p.value === '无评级'
              return `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:8px; font-size:12px;">
                  <span style="display:flex; align-items:center; gap:6px; color:#666666;">
                    <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${p.color};"></span>
                    ${p.seriesName}
                  </span>
                  <span style="color:${isUnrated ? '#949494' : '#191919'};">${p.value}</span>
                </div>
              `
            })
            .join('')
          return `<div style="font-size:13px; font-weight:600; color:#191919;">${params[0].axisValue}</div>${rows}`
        },
      },
      series: CITY_TREND_SERIES.map((s) => ({
        name: s.name,
        type: 'line',
        data: s.data,
        color: s.color,
        showSymbol: false,
        lineStyle: { width: 2 },
      })),
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  // 容器高度跟数据看板图表一样用 300px，给图例留出一致的间距
  return <div ref={chartRef} className="h-[300px] w-[518px]" />
}

// 评级结果 tab 的整体内容：左边趋势图 + 右边评级说明表格，表格顶部跟图表（不是图表上面的标题文字）对齐
function RatingResultPanel() {
  return (
    <div className="flex gap-6">
      <div className="shrink-0">
        <div className="mb-2 text-sm font-semibold text-ink">近半年各城市评级趋势图</div>
        <CityRatingTrendChart />
      </div>

      <div className="flex-1">
        {/* 占位撑高：跟左边"近半年各城市评级趋势图"这行标题文字（含下边距）同高，
            再加 42.8px —— 这是用 chart.convertToPixel 实测出来的，S级 这条线（分类轴第一条，
            在 grid.top:20 的基础上还要再往下半个分类带高度）距图表容器顶部的精确像素值，
            这样下面的表格顶部才会跟 S级 那条线对齐，而不是跟图表容器的外边缘对齐 */}
        <div aria-hidden className="invisible mb-2 text-sm font-semibold">占位</div>
        <div aria-hidden className="h-[42.8px]" />
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
  )
}

// 高危/中危标签：不是纯色胶囊，是"实心图标块 + 浅底文字"两段拼接的样式，圆角 4px，外面还有一圈同色描边
// 浅底用了纯色的 bg-red-50/bg-orange-50（不是透明度混色），避免透明度跟卡片背景叠加出多余的接缝
// 图标块和文字块左右间距 4px（px-1）、上下间距 1px（py-[1px]）
function RiskBadge({ level }) {
  const isHigh = level === 'high'
  const solidBg = isHigh ? 'bg-danger' : 'bg-warning'
  const tintBg = isHigh ? 'bg-red-50 text-danger' : 'bg-orange-50 text-warning'
  const borderColor = isHigh ? 'border-danger' : 'border-warning'

  return (
    <span className={'inline-flex shrink-0 items-stretch overflow-hidden rounded-[4px] border text-xs ' + borderColor}>
      <span className={'flex items-center px-1 py-[1px] ' + solidBg}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1" />
          <line x1="6" y1="3.5" x2="6" y2="6.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="6" cy="8.4" r="0.6" fill="white" />
        </svg>
      </span>
      <span className={'flex items-center px-1 py-[1px] font-medium ' + tintBg}>{isHigh ? '高危' : '中危'}</span>
    </span>
  )
}

// "查看明细"按钮：边框 #ebebeb（截图给的精确值，项目 token 里没有这个灰度，就近似用 border-[#ebebeb]），文字黑色加粗
function DetailButton() {
  return (
    <button className="shrink-0 rounded border border-[#ebebeb] px-4 py-1.5 text-sm font-semibold text-ink">
      查看明细
    </button>
  )
}

// "商汰换"子 tab 的一张预警卡片
function CategoryWarningCard({ item, isLast }) {
  return (
    <div className={'flex items-center justify-between gap-4 py-4 ' + (isLast ? '' : 'border-b border-gray-100')}>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <RiskBadge level={item.level} />
          <span className="text-sm font-semibold text-ink">
            {item.title}｜{item.city}
          </span>
        </div>
        <div className="mb-3 text-xs text-ink-tertiary">{item.merchant}</div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-1.5 text-xs">
          <div className="flex gap-2">
            <span className="text-ink-tertiary">预警周期（T月）</span>
            <span className="text-ink">{item.period}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">当前评级数据范围</span>
            <span className="text-ink">{item.dataRange}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">濒临汰换月</span>
            <span className="text-ink">{item.dueMonth}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">当前综合评级结果</span>
            <span className="text-ink">{item.result}</span>
          </div>
        </div>
      </div>
      <DetailButton />
    </div>
  )
}

// "SKU汰换"子 tab 的一张预警卡片
function SkuWarningCard({ item, isLast }) {
  return (
    <div className={'flex items-center justify-between gap-4 py-4 ' + (isLast ? '' : 'border-b border-gray-100')}>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <RiskBadge level={item.level} />
          <span className="text-sm font-semibold text-ink">
            {item.title}｜{item.city}
          </span>
        </div>
        <div className="mb-3 text-xs text-ink-tertiary">{item.merchant}</div>
        <div className="grid grid-cols-3 gap-x-16 gap-y-1.5 text-xs">
          <div className="flex gap-2">
            <span className="text-ink-tertiary">SKU ID</span>
            <span className="text-ink">{item.skuId}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">预警周期（T月）</span>
            <span className="text-ink">{item.period}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">当期（T-1月）评级结果</span>
            <span className="text-ink">{item.currentResult}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">一/二级品类</span>
            <span className="text-ink">{item.category}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">濒临汰换月</span>
            <span className="text-ink">{item.dueMonth}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-ink-tertiary">综合（T-2与T-1月）评级结果</span>
            <span className="text-ink">{item.totalResult}</span>
          </div>
        </div>
      </div>
      <DetailButton />
    </div>
  )
}

// 分页：真的能点，页码在 1~totalPages 之间变化，翻页时下面的列表内容也会跟着换（40条 mock 数据，5条/页）
function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="text-ink-secondary disabled:cursor-not-allowed disabled:text-ink-tertiary"
      >
        <ChevronIcon direction="left" className="h-4 w-4" />
      </button>
      <span className="text-ink-secondary">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="text-ink-secondary disabled:cursor-not-allowed disabled:text-ink-tertiary"
      >
        <ChevronIcon direction="right" className="h-4 w-4" />
      </button>
    </div>
  )
}

const WARNING_SUB_TABS = ['商汰换', 'SKU汰换']

// 汰换预警 tab 的整体内容：里面还有一层"商汰换/SKU汰换"子 tab + 预警卡片列表 + 分页
function RatingWarningsPanel() {
  const [subTab, setSubTab] = useState(0)
  const [page, setPage] = useState(1)

  const fullList = subTab === 0 ? CATEGORY_WARNINGS : SKU_WARNINGS
  const totalPages = Math.ceil(fullList.length / WARNING_PAGE_SIZE)
  const pageItems = fullList.slice((page - 1) * WARNING_PAGE_SIZE, page * WARNING_PAGE_SIZE)

  // 切换"商汰换/SKU汰换"子 tab 时页码重置到第1页，避免停在一个可能超出另一份列表页数的页码上
  const handleSubTabChange = (index) => {
    setSubTab(index)
    setPage(1)
  }

  return (
    <div>
      {/* 提示条 */}
      <div className="mb-4 flex items-center justify-between rounded bg-amber-50 px-4 py-2 text-sm text-notice-text">
        <span>首页至多展示排序靠前的5条预警信息</span>
        <span className="flex cursor-pointer items-center gap-0.5 whitespace-nowrap text-notice-text">
          具体说明
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
      </div>

      {/* 外层边框容器圆角 4px，跟任务条/分段控件同一个规格
          底部不留 padding：靠最后一张卡片自己的 py-4 撑出 16px，避免跟这里的 padding 叠加变成 32px+ */}
      <div className="rounded border border-gray-200 p-5 pb-0">
        {/* 子 tab：商汰换 / SKU汰换，分段控件样式，圆角同样是 4px
            不加 margin-bottom：靠第一张卡片自己的 py-4 撑出跟其他卡片间距一样的 16px */}
        <div className="inline-flex rounded border border-gray-200 text-sm">
          {WARNING_SUB_TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleSubTabChange(index)}
              className={
                'px-4 py-1.5 first:rounded-l last:rounded-r ' +
                (index === subTab
                  ? 'border border-brand text-brand-text'
                  : 'border border-transparent text-ink-secondary')
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {pageItems.map((item, index) =>
            subTab === 0 ? (
              <CategoryWarningCard key={index} item={item} isLast={index === pageItems.length - 1} />
            ) : (
              <SkuWarningCard key={index} item={item} isLast={index === pageItems.length - 1} />
            )
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}

function RatingElimination() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="rounded-[20px] bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">评级汰换</h2>

      {/* tab 切换 */}
      <div className="mb-4 flex gap-6 border-b border-gray-100 text-sm">
        {TABS.map((tab, index) => (
          <div
            key={tab}
            onClick={() => setActiveTab(index)}
            className={
              'cursor-pointer border-b-2 pb-2 ' +
              (index === activeTab
                ? 'border-brand text-brand-text'
                : 'border-transparent text-ink-tertiary')
            }
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 0 ? (
        <>
          {/* 提示条（评级结果 tab 自己的提示条，跟汰换预警 tab 的不一样） */}
          <div className="mb-4 flex items-center justify-between rounded bg-amber-50 px-4 py-2 text-sm text-notice-text">
            <span>根据供应商的采购规模与履约水平，平台定义S、A、B、C分别为绩效优秀、良好、合格、较差</span>
            <span className="flex cursor-pointer items-center gap-0.5 whitespace-nowrap text-notice-text">
          具体说明
          <ChevronIcon direction="right" className="h-4 w-4" />
        </span>
          </div>
          <RatingResultPanel />
        </>
      ) : (
        <RatingWarningsPanel />
      )}
    </section>
  )
}

export default RatingElimination
