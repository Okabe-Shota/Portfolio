import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './components/ui/Navbar'
import { Hero } from './components/sections/Hero'
import { Works } from './components/sections/Works'
import { Skills } from './components/sections/Skills'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { ProjectDetail } from './components/pages/ProjectDetail'
import { useHashRoute } from './hooks/useHashRoute'
import { projects } from './data/projects'

export default function App() {
  const route = useHashRoute()

  // route が 'project' でも該当する detail 付きプロジェクトが無ければ undefined（トップへフォールバック）
  const detailProject =
    route.name === 'project'
      ? projects.find(p => p.id === route.id && p.detail)
      : undefined
  const showDetail = Boolean(detailProject)

  useEffect(() => {
    // ページ切替のたびに ScrollTrigger の位置を再計算する
    ScrollTrigger.refresh()

    if (showDetail) {
      // 深掘りページはトップから表示する
      window.scrollTo(0, 0)
      return
    }

    // トップページ: #works 等のセクションアンカーが指定されていればそこへスクロール
    const hash = window.location.hash
    if (hash && hash !== '#' && !hash.startsWith('#/')) {
      const target = document.querySelector(hash)
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto' }))
        return
      }
    }
    window.scrollTo(0, 0)
  }, [showDetail, detailProject?.id])

  if (showDetail && detailProject) {
    return (
      <>
        <ProjectDetail project={detailProject} />
        <footer className="text-center py-8 text-fg/20 text-xs font-mono border-t border-white/5 bg-bg">
          © {new Date().getFullYear()} AiLink CTO 岡部翔太 — Built with React + GSAP
        </footer>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Works />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="text-center py-8 text-fg/20 text-xs font-mono border-t border-white/5">
        © {new Date().getFullYear()} AiLink CTO 岡部翔太 — Built with React + GSAP
      </footer>
    </>
  )
}
