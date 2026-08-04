// Day 1 步骤 2：整体页面骨架
// 布局用 flex 分三栏：左侧导航栏（固定宽） / 中间主内容区（自适应宽） / 右侧信息栏（固定宽）
// 中间主内容区和右侧信息栏内部都是纵向堆叠模块，具体每个模块的内容在各自的组件文件里
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* 侧边栏和内容区之间空 16px（gap-4），内容区右边留 16px 页面边距（pr-4） */}
      <div className="flex gap-4 pr-4">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-4 py-4">
          {/* 任务中心：通栏满宽，右边没有信息栏跟它并排 */}
          <TaskCenter />

          {/* 从这里开始分两栏：左边主内容区（数据看板+评级汰换），右边信息栏 */}
          <div className="flex gap-4">
            <main className="flex flex-1 flex-col gap-4">
              <DataDashboard />
              <RatingElimination />
            </main>

            {/* 右侧信息栏：商家信息 + 公告栏 + 流程导览 + 培训中心 + 常见问题 纵向排列，固定 392px 宽 */}
            <aside className="flex w-[392px] shrink-0 flex-col gap-4">
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
