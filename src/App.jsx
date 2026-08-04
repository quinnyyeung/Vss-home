// Day 1 步骤 2：整体页面骨架
// 布局用 flex 分三栏：左侧导航栏（固定宽） / 中间主内容区（自适应宽） / 右侧信息栏（固定宽）
// 中间主内容区和右侧信息栏内部都是纵向堆叠模块，具体每个模块的内容在各自的组件文件里
//
// Day 1 步骤 3：响应式
// 断点 1200px（wide:，定义在 index.css 里）：≥1200px 主内容区和右侧信息栏左右并排；
// <1200px 右侧信息栏移到主内容区下方（纵向堆叠）
// 最小宽度 1024px：低于这个宽度不再收缩，允许出现横向滚动条
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import TaskCenter from './components/TaskCenter'
import DataDashboard from './components/DataDashboard'
import RatingElimination from './components/RatingElimination'
import MerchantInfo from './components/MerchantInfo'
import AnnouncementBoard from './components/AnnouncementBoard'
import ProcessGuide from './components/ProcessGuide'
import TrainingCenter from './components/TrainingCenter'
import FAQ from './components/FAQ'

function App() {
  return (
    // min-w-[1024px]：整个页面最窄只收缩到 1024px，再窄就出现横向滚动条，不继续挤压布局
    <div className="min-h-screen min-w-[1024px] bg-gray-100">
      <Header />
      {/* 侧边栏和内容区之间空 16px（gap-4），内容区右边留 16px 页面边距（pr-4） */}
      <div className="flex gap-4 pr-4">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-4 py-4">
          {/* 任务中心：通栏满宽，右边没有信息栏跟它并排（这块不受断点影响，任何宽度都是满宽） */}
          <TaskCenter />

          {/* 主内容区+右侧信息栏：默认（<1200px）纵向堆叠，wide:（≥1200px）左右并排 */}
          <div className="flex flex-col gap-4 wide:flex-row">
            <main className="flex flex-1 flex-col gap-4">
              <DataDashboard />
              <RatingElimination />
            </main>

            {/* 右侧信息栏：<1200px 时是普通的满宽栏，≥1200px 收窄成固定 392px 宽 */}
            <aside className="flex flex-col gap-4 wide:w-[392px] wide:shrink-0">
              <MerchantInfo />
              <AnnouncementBoard />
              <ProcessGuide />
              <TrainingCenter />
              <FAQ />
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
