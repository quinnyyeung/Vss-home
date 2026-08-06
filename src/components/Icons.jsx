// 全局图标：用户提供的真实 PNG 文件（src/assets/icons/），不手绘 SVG，保证形状跟原图一致
// 用 CSS mask-image 让图标参与变色：mask 用 PNG 的透明通道抠出形状，
// 图标本身的颜色由 background-color: currentColor 决定，跟着外层文字颜色走
//
// ChevronIcon 例外：改成手写 inline SVG（不用 expand-less.png 走 mask）。
// 原因：expand-less.png 是很细的线条图标，缩到列表里常用的 16-20px 时，栅格 mask 缩放会让边缘发糊、
// 颜色比设置的 currentColor 深，浅灰看起来发黑。chevron 形状本身极简单（就是个 ^），手写 SVG 描边
// 不存在这个问题，用 direction 转角度复用同一个形状：up 不转、right 转 90°、down 转 180°、left 转 -90°。
import homeIcon from '../assets/icons/home.png'
import cartIcon from '../assets/icons/cart.png'
import fileIcon from '../assets/icons/file.png'
import databaseIcon from '../assets/icons/database.png'
import printerIcon from '../assets/icons/printer.png'
import bankCardIcon from '../assets/icons/bank-card.png'
import contactsIcon from '../assets/icons/contacts.png'
import themeIcon from '../assets/icons/theme.png'

function MaskIcon({ src, className }) {
  return (
    <span
      className={'inline-block shrink-0 bg-current ' + (className || '')}
      style={{
        maskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}

export function HomeIcon({ className }) {
  return <MaskIcon src={homeIcon} className={className} />
}
export function CartIcon({ className }) {
  return <MaskIcon src={cartIcon} className={className} />
}
export function FileTextIcon({ className }) {
  return <MaskIcon src={fileIcon} className={className} />
}
export function DatabaseIcon({ className }) {
  return <MaskIcon src={databaseIcon} className={className} />
}
export function PrinterIcon({ className }) {
  return <MaskIcon src={printerIcon} className={className} />
}
export function CreditCardIcon({ className }) {
  return <MaskIcon src={bankCardIcon} className={className} />
}
export function ContactIcon({ className }) {
  return <MaskIcon src={contactsIcon} className={className} />
}
export function GridIcon({ className }) {
  return <MaskIcon src={themeIcon} className={className} />
}

const CHEVRON_ROTATION = {
  up: '',
  right: 'rotate-90',
  down: 'rotate-180',
  left: '-rotate-90',
}

// 全局统一箭头，direction 默认 'right'（"更多 ›" 这类最常见的场景）
// 手写 SVG 描边（不走 mask），保证任何尺寸下颜色都精确等于 currentColor，边缘清晰不发糊
export function ChevronIcon({ className, direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={'shrink-0 transition-transform ' + (className || '') + ' ' + CHEVRON_ROTATION[direction]}
    >
      <path d="M5 15l7-7 7 7" />
    </svg>
  )
}
