// 数据看板：履约数据 / 采购订单数据 两个 tab
// Day2：履约数据 tab 还原了 5 个指标卡片；采购订单数据 tab 还原了 4 条折线趋势图（用 ECharts 画）
// 两个 tab 内容高度不一样，容器高度跟着当前选中的 tab 内容自然撑高，没有做固定高度
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

const TABS = ['履约数据', '采购订单数据']

// mock 数据：履约数据 tab 的 5 个指标卡片，ok: true 表示已达标（绿色），false 表示未达标（红色）
const METRIC_CARDS = [
  { label: '到货满足率', desc: '需大于目标值 95%', value: '97.5%', ok: false },
  { label: '到货准时率', desc: '需大于目标值 95%', value: '100%', ok: true },
  { label: '拒收率', desc: '需小于目标值 1.2%', value: '1.1%', ok: true },
  { label: '二配质检率', desc: '需小于目标值 1.2%', value: '1.6%', ok: false },
  { label: '综合货损率', desc: '需小于目标值 1.2%', value: '1.1%', ok: true },
]

// mock 数据：采购订单数据 tab 的折线图，9月1日-9月30日共30天
// 数值是参照截图曲线走势（金额两条线在上、数量两条线在下，9/7附近有个上扬拐点）编写的示意数据，
// 不是逐点抠图读出来的精确值，如果要跟设计稿完全对上数字，需要你提供真实数据表
const ORDER_TREND_DATES = [
  '09-01', '09-02', '09-03', '09-04', '09-05', '09-06', '09-07', '09-08', '09-09', '09-10',
  '09-11', '09-12', '09-13', '09-14', '09-15', '09-16', '09-17', '09-18', '09-19', '09-20',
  '09-21', '09-22', '09-23', '09-24', '09-25', '09-26', '09-27', '09-28', '09-29', '09-30',
]

const ORDER_TREND_SERIES = [
  {
    name: '实收采购金额',
    color: '#347BED', // 深蓝，用户确认的色值
    axis: 'amount', // 对应左侧"金额(万元)"轴
    data: [
      0.30, 0.31, 0.32, 0.33, 0.34, 0.35, 0.42, 0.43, 0.44, 0.45,
      0.46, 0.47, 0.48, 0.49, 0.50, 0.52, 0.54, 0.56, 0.59, 0.62,
      0.65, 0.69, 0.73, 0.77, 0.81, 0.85, 0.89, 0.93, 0.97, 1.00,
    ],
  },
  {
    name: '计划采购金额',
    color: '#6FCEF7', // 浅蓝，用户确认的色值
    axis: 'amount',
    data: [
      0.45, 0.47, 0.49, 0.51, 0.53, 0.55, 0.66, 0.665, 0.665, 0.665,
      0.67, 0.675, 0.68, 0.685, 0.69, 0.70, 0.71, 0.73, 0.75, 0.78,
      0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1.02, 1.05, 1.08,
    ],
  },
  {
    name: '实收采购数量',
    color: '#3DC29D', // 深绿，用户确认的色值
    axis: 'quantity', // 对应右侧"数量(PCS)"轴
    data: [
      0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.30, 0.31, 0.32, 0.33,
      0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.40, 0.41, 0.42, 0.43,
      0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.50, 0.51, 0.52, 0.53,
    ],
  },
  {
    name: '计划采购数量',
    color: '#A8E4A6', // 浅绿，用户确认的色值
    axis: 'quantity',
    data: [
      0.08, 0.09, 0.09, 0.10, 0.10, 0.11, 0.18, 0.19, 0.19, 0.20,
      0.20, 0.21, 0.21, 0.22, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27,
      0.27, 0.28, 0.29, 0.29, 0.30, 0.30, 0.31, 0.32, 0.32, 0.33,
    ],
  },
]

// 达标徽章图标：白色圆圈里一个对勾，画在实心色底的胶囊徽章上
function CheckBadgeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1" />
      <path d="M3.5 6L5.2 7.7L8.5 4.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 未达标徽章图标：白色圆圈里一个感叹号
function WarnBadgeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1" />
      <line x1="6" y1="3.5" x2="6" y2="6.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="8.4" r="0.6" fill="white" />
    </svg>
  )
}

// 指标名旁的说明图标（ⓘ），颜色跟随文字颜色（currentColor），用在三级灰 text-ink-tertiary 上
function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="5.2" x2="6" y2="8.3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="6" cy="3.4" r="0.6" fill="currentColor" />
    </svg>
  )
}

// 履约数据 tab：5 个指标卡片
function FulfillmentMetrics() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {METRIC_CARDS.map((m) => (
        <div
          key={m.label}
          className={'rounded-[12px] p-4 ' + (m.ok ? 'bg-green-50' : 'bg-red-50')}
        >
          {/* 达标/未达标徽章：实心胶囊底 + 白色图标 + 白色文字 */}
          <span
            className={
              'mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-white ' +
              (m.ok ? 'bg-brand-text' : 'bg-danger')
            }
          >
            {m.ok ? <CheckBadgeIcon /> : <WarnBadgeIcon />}
            {m.ok ? '已达标' : '未达标'}
          </span>
          <div className="flex items-center gap-1 text-sm text-ink-secondary">
            {m.label}
            <span className="text-ink-tertiary">
              <InfoIcon />
            </span>
          </div>
          <div className="mb-1 text-[10px] text-ink-tertiary">{m.desc}</div>
          <div
            className={
              'font-number text-2xl font-semibold ' + (m.ok ? 'text-brand-text' : 'text-danger')
            }
          >
            {m.value}
          </div>
        </div>
      ))}
    </div>
  )
}

// 采购订单数据 tab：ECharts 双 Y 轴折线图（左轴金额、右轴数量）
// 用 useRef 拿到容器 DOM，useEffect 里手动 echarts.init，组件卸载时 dispose，避免内存泄漏
function PurchaseOrderChart() {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      grid: { left: 55, right: 55, top: 20, bottom: 52 },
      xAxis: {
        type: 'category',
        data: ORDER_TREND_DATES,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5e5e5' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#949494',
          fontSize: 12,
          // 只显示单数日期的标签（09-01/09-03/.../09-29），跟截图一致
          interval: (index) => {
            const day = Number(ORDER_TREND_DATES[index].split('-')[1])
            return day % 2 === 1
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '金额(万元)',
          nameLocation: 'middle',
          nameGap: 40,
          nameRotate: 90,
          nameTextStyle: { color: '#949494', fontSize: 12 },
          min: 0,
          max: 1,
          interval: 0.2,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#949494', fontSize: 12 },
          splitLine: { lineStyle: { color: '#f0f0f0' } },
        },
        {
          type: 'value',
          name: '数量(PCS)',
          nameLocation: 'middle',
          nameGap: 40,
          nameRotate: -90,
          nameTextStyle: { color: '#949494', fontSize: 12 },
          min: 0,
          max: 1,
          interval: 0.2,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#949494', fontSize: 12 },
          splitLine: { show: false },
        },
      ],
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 24,
        textStyle: { color: '#666666', fontSize: 12 },
      },
      // hover 时的浮层：垂直参考线 + 白色卡片（标题"累计到MM-DD" + 每条线的色块/名称/数值）
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
            .map(
              (p) => `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:8px; font-size:12px;">
                  <span style="display:flex; align-items:center; gap:6px; color:#666666;">
                    <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${p.color};"></span>
                    ${p.seriesName}
                  </span>
                  <span style="color:#191919;">${p.value}</span>
                </div>
              `
            )
            .join('')
          return `<div style="font-size:13px; font-weight:600; color:#191919;">累计到${params[0].axisValue}</div>${rows}`
        },
      },
      series: ORDER_TREND_SERIES.map((s) => ({
        name: s.name,
        type: 'line',
        yAxisIndex: s.axis === 'quantity' ? 1 : 0,
        data: s.data,
        color: s.color,
        showSymbol: false,
        lineStyle: { width: 2 },
      })),
    })

    // 窗口尺寸变化（比如响应式断点切换、侧边栏展开收起）时让图表跟着重新计算尺寸
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  return <div ref={chartRef} className="h-[300px] w-full" />
}

// 两个 tab 各自的提示条文案
const NOTICE_TEXT = {
  0: '当前展示6月份履约各指标数据情况',
  1: '默认展示累计到当日/近30天订单金额、数量情况',
}

function DataDashboard() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="rounded-[20px] bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">数据看板</h2>

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

      {/* 提示条 */}
      <div className="mb-4 flex items-center justify-between rounded bg-amber-50 px-4 py-2 text-sm text-notice-text">
        <span>{NOTICE_TEXT[activeTab]}</span>
        <span className="cursor-pointer whitespace-nowrap text-notice-text">查看更多 ›</span>
      </div>

      {/* 城市筛选下拉（今天只做视觉） */}
      <button className="mb-4 flex items-center gap-1 rounded border border-gray-200 px-3 py-1.5 text-sm text-ink-secondary">
        北京（含廊坊） <span className="text-xs text-ink-tertiary">⌄</span>
      </button>

      {activeTab === 0 ? <FulfillmentMetrics /> : <PurchaseOrderChart />}
    </section>
  )
}

export default DataDashboard
