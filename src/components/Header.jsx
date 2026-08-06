// 顶部导航栏
// mock 数据：当前登录的供应商名称、右侧导航链接、当前登录账号
import { ChevronIcon } from './Icons'

const CURRENT_MERCHANT = '北京超大型生鲜供应商-鼎盛电子商...'

const NAV_LINKS = ['流程导览', '移动端下载', '廉正举报']

const CURRENT_USER = 'mtmccs123'

function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between bg-brand px-6 text-white">
      {/* 左侧：logo + 当前供应商切换下拉 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">小象超市</span>
          <span className="text-white/50">|</span>
          <span className="text-sm">供应商服务系统</span>
        </div>
        <button className="flex items-center gap-1 rounded bg-white/10 px-3 py-1.5 text-sm">
          <span className="max-w-[220px] truncate">{CURRENT_MERCHANT}</span>
          <ChevronIcon direction="down" className="h-4 w-4" />
        </button>
      </div>

      {/* 右侧：功能链接 + 当前账号 */}
      <div className="flex items-center gap-6 text-sm">
        {NAV_LINKS.map((link) => (
          <span key={link} className="cursor-pointer text-white/90 hover:text-white">
            {link}
          </span>
        ))}
        <button className="flex items-center gap-1 text-white/90 hover:text-white">
          <span>{CURRENT_USER}</span>
          <ChevronIcon direction="down" className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}

export default Header
