// 左侧导航栏
// mock 数据：导航分组、每个分组的图标、分组下的子菜单项
// 图标用的是用户提供的真实 PNG 文件，见 Icons.jsx（CSS mask-image 让图标参与变色）
//
// 交互参考 Day 4 用户发的 6 状态截图：
// 1. 每个分组可以单独展开/收起（点分组标题右边的箭头，展开朝上、收起朝下）
// 2. 整个侧边栏可以收起成一条窄边（点顶部箭头按钮），收起后只剩一个展开按钮
// 3. 点击二级菜单项会高亮成选中态（浅绿底+绿字）
// 4. 侧边栏自己独立滚动（sticky 定位 + 内部 overflow-y-auto），滚动条隐藏（见 index.css 的 .no-scrollbar）
// 截图里还有"文字超长时 hover 弹出完整文案"的 tooltip 细节，今天先跳过——现有 mock 数据的条目都不会触发换行/截断，
// 且 tooltip 的颜色/间距截图上也看不出精确值，等真的有超长文案再做
import { useState } from 'react'
import {
  HomeIcon,
  CartIcon,
  FileTextIcon,
  DatabaseIcon,
  PrinterIcon,
  CreditCardIcon,
  ContactIcon,
  GridIcon,
  ChevronIcon,
} from './Icons'

const NAV_GROUPS = [
  { title: '商品信息', icon: CartIcon, items: ['可供商品', '创建新品', '信息和图文', '修改进度', '自定义标签'] },
  { title: '资质管理', icon: FileTextIcon, items: ['生产商列表', '品牌资质'] },
  { title: '报价管理', icon: DatabaseIcon, items: ['报价单列表', '询价结果', '采购价变更'] },
  {
    title: '履约单据',
    icon: PrinterIcon,
    items: ['采购单列表', '预约查询', '退货单列表', '履约违规单', '今日预采', '明日预采'],
  },
  {
    title: '结算管理',
    icon: CreditCardIcon,
    items: ['待对账单', '结算单列表', '发票管理', '押金单列表', '违规金单', '税率确认'],
  },
  { title: '供应商信息', icon: ContactIcon, items: ['基本信息', '评级结果', '汰换预警', '数据罗盘'] },
  { title: '周转物资管理', icon: GridIcon, items: ['租赁物资', '采购物资'] },
]

function Sidebar() {
  // 侧边栏整体收起/展开
  const [collapsed, setCollapsed] = useState(false)
  // 每个分组的展开状态，默认全部展开（跟截图默认态一致）
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(NAV_GROUPS.map((g) => g.title)))
  // 当前选中的二级菜单项，默认没有选中
  const [selectedItem, setSelectedItem] = useState(null)

  const toggleGroup = (title) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  // 收起整体侧边栏：宽度收窄成一条窄边，只留展开按钮
  // 这里的收起宽度（48px）截图上看不出精确值，是估算的，写完截图给用户对比确认
  if (collapsed) {
    return (
      <aside className="sticky top-16 h-[calc(100vh-4rem)] w-12 shrink-0 border-r border-gray-200 bg-white">
        <div className="flex justify-center border-b border-gray-100 py-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="cursor-pointer text-ink hover:text-ink-secondary"
          >
            <ChevronIcon direction="right" className="h-4 w-4" />
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-[200px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* 顶部：后台首页入口 + 收起按钮（这一行不参与下面导航区域的滚动） */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-brand-text">
          <HomeIcon className="h-4 w-4" />
          <span className="font-semibold">后台首页</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="cursor-pointer text-ink hover:text-ink-secondary"
        >
          <ChevronIcon direction="left" className="h-4 w-4" />
        </button>
      </div>

      {/* 分组导航：独立滚动区域，内容超高时内部滚动，滚动条隐藏 */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-2">
        {NAV_GROUPS.map((group) => {
          const isOpen = expandedGroups.has(group.title)
          return (
            <div key={group.title} className="mb-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-2 text-left text-lg font-semibold text-ink hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <group.icon className="h-4 w-4" />
                  <span>{group.title}</span>
                </span>
                <ChevronIcon
                  direction={isOpen ? 'up' : 'down'}
                  className="h-4 w-4 text-ink transition-transform"
                />
              </button>

              {isOpen && (
                <div className="grid grid-cols-2 gap-x-1 gap-y-1 px-2 pb-2">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={
                        'cursor-pointer truncate rounded px-2 py-1 text-left text-xs transition-colors ' +
                        (selectedItem === item
                          ? 'bg-green-50 text-brand-text'
                          : 'text-ink-secondary hover:bg-gray-50 hover:text-brand-text')
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
