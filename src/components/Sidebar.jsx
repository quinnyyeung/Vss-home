// 左侧导航栏
// mock 数据：导航分组、每个分组的图标、分组下的子菜单项
// 图标目前用 emoji 简单代替，不是设计稿里的真实图标（没有图标资源），后面有图标库/svg 素材了再换
// 今天(骨架阶段)所有分组都是静态展开状态，收起/展开的点击效果留到后面做交互的那天再接
const NAV_GROUPS = [
  { title: '商品信息', icon: '🛒', items: ['可供商品', '创建新品', '信息和图文', '修改进度', '自定义标签'] },
  { title: '资质管理', icon: '📄', items: ['生产商列表', '品牌资质'] },
  { title: '报价管理', icon: '🗄️', items: ['报价单列表', '询价结果', '采购价变更'] },
  {
    title: '履约单据',
    icon: '🔄',
    items: ['采购单列表', '预约查询', '退货单列表', '履约违规单', '今日预采', '明日预采'],
  },
  {
    title: '结算管理',
    icon: '📋',
    items: ['待对账单', '结算单列表', '发票管理', '押金单列表', '违规金单', '税率确认'],
  },
  { title: '供应商信息', icon: '👤', items: ['基本信息', '评级结果', '汰换预警', '数据罗盘'] },
  { title: '周转物资管理', icon: '▦', items: ['租赁物资', '采购物资'] },
]

function Sidebar() {
  return (
    <aside className="w-[200px] shrink-0 border-r border-gray-200 bg-white">
      {/* 顶部：后台首页入口 + 收起按钮（今天只做视觉，先不接点击） */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-brand-text">
          <span>🏠</span>
          <span className="font-medium">后台首页</span>
        </div>
        <button className="text-ink-tertiary">‹</button>
      </div>

      {/* 分组导航 */}
      <nav className="px-2 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-1">
            <div className="flex cursor-pointer items-center justify-between rounded px-2 py-2 text-lg font-semibold text-ink hover:bg-gray-50">
              <span className="flex items-center gap-2">
                <span className="text-base">{group.icon}</span>
                <span>{group.title}</span>
              </span>
              <span className="text-xs text-ink-tertiary">⌃</span>
            </div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-1 px-2 pb-2">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="cursor-pointer truncate rounded px-2 py-1 text-xs text-ink-secondary hover:bg-gray-50 hover:text-brand-text"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
