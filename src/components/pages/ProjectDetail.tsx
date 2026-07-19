import type {
  Project,
  ProjectStat,
  ProjectArchitecture,
  ProjectFlow,
  ProjectBenchmark,
} from '../../data/projects'
import { SectionTitle } from '../ui/SectionTitle'

/** Works セクションへ戻るためのハッシュ（App 側で該当セクションへスクロールする） */
const BACK_HREF = '#works'

/** 統計タイル群: 数値を大きく見せるグリッド */
function StatGrid({ stats }: { stats: ProjectStat[] }) {
  return (
    <section className="detail-reveal py-10" style={{ animationDelay: '0.09s' }}>
      <SectionTitle en="By the Numbers" ja="数字で見る" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-500/40"
          >
            {/* 上辺のさりげないアクセント */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-500/0 via-cyan-400/70 to-purple-500/0"
            />
            <div className="font-mono text-4xl md:text-5xl font-black tabular-nums text-gradient-cyan-purple leading-none">
              {s.value}
            </div>
            <p className="mt-3 text-xs text-fg/70 leading-snug">{s.label}</p>
            {s.hint && (
              <p className="mt-1 text-[0.65rem] text-fg/40 leading-snug">{s.hint}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/** レイヤー図 / データフロー図: 向きつきの図（外部図ライブラリ不使用・CSS のみ） */
function ArchitectureDiagram({ arch }: { arch: ProjectArchitecture }) {
  const coreIndex = arch.layers.length - 1
  const connector = arch.connectorLabel ?? 'depends on'
  return (
    <section className="detail-reveal py-10" style={{ animationDelay: '0.18s' }}>
      <SectionTitle en={arch.title?.en ?? 'Architecture'} ja={arch.title?.ja ?? 'アーキテクチャ'} />
      {arch.caption && (
        <p className="text-fg/70 leading-relaxed max-w-3xl mb-8">{arch.caption}</p>
      )}
      <div>
        {arch.layers.map((layer, i) => {
          const isCore = i === coreIndex
          return (
            <div key={layer.name}>
              {i > 0 && (
                <div className="flex items-center gap-2 py-2 pl-1 text-[0.65rem] font-mono uppercase tracking-[0.2em] text-cyan-500/80">
                  <span aria-hidden="true">↓</span>
                  <span>{connector}</span>
                </div>
              )}
              <div
                className={`flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                  isCore
                    ? 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-white/[0.02] to-purple-500/10 shadow-[0_0_45px_-18px_rgba(34,211,238,0.55)]'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <span
                  className={`font-mono text-lg font-bold ${
                    isCore ? 'text-gradient-cyan-purple' : 'text-fg'
                  }`}
                >
                  {layer.name}
                </span>
                <p className="text-sm text-fg/65 leading-relaxed sm:max-w-md">{layer.role}</p>
                {layer.tag && (
                  <span
                    className={`shrink-0 self-start rounded-full border px-3 py-1 font-mono text-[0.65rem] ${
                      isCore
                        ? 'border-cyan-400/40 text-cyan-300'
                        : 'border-white/15 text-fg/50'
                    }`}
                  >
                    {layer.tag}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {arch.dependencyNote && (
        <p className="mt-6 font-mono text-xs text-fg/50">{arch.dependencyNote}</p>
      )}
    </section>
  )
}

/** 段階フロー: 順序のある処理ステップを段階的に見せる（見出し・番号は data 駆動） */
function StageFlow({ flow }: { flow: ProjectFlow }) {
  const prefix = flow.badgePrefix ?? 'S'
  return (
    <section className="detail-reveal py-10" style={{ animationDelay: '0.24s' }}>
      <SectionTitle en={flow.title.en} ja={flow.title.ja} />
      {flow.note && (
        <p className="text-fg/70 leading-relaxed max-w-3xl mb-8">{flow.note}</p>
      )}
      <div className="space-y-3">
        {flow.steps.map((step, i) => (
          <div
            key={step.title}
            className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 pl-6 transition-colors hover:border-purple-500/30"
          >
            {/* 左端のアクセント（ステップの区切りを示す） */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-purple-500"
            />
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-cyan-500">
                {prefix}
                {i + 1}
              </span>
              <h3 className="text-base font-bold text-fg">{step.title}</h3>
            </div>
            <p className="text-sm text-fg/65 leading-relaxed">{step.detail}</p>
            {step.items && step.items.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {step.items.map(item => (
                  <span
                    key={item}
                    className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[0.7rem] text-fg/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/** 性能評価: 規模別のレンダリング時間を CSS 横バーで比較する（外部チャートライブラリ不使用） */
function BenchmarkChart({ benchmark }: { benchmark: ProjectBenchmark }) {
  const maxMs = Math.max(...benchmark.rows.map(r => r.ms))
  return (
    <section className="detail-reveal py-10" style={{ animationDelay: '0.27s' }}>
      <SectionTitle
        en={benchmark.title?.en ?? 'Performance'}
        ja={benchmark.title?.ja ?? '性能評価'}
      />
      {benchmark.caption && (
        <p className="text-fg/70 leading-relaxed max-w-3xl mb-8">{benchmark.caption}</p>
      )}
      <div className="space-y-4">
        {benchmark.rows.map(row => {
          // 最速でもバーが視認できるよう下限を設ける
          const pct = Math.max(6, Math.round((row.ms / maxMs) * 100))
          return (
            <div
              key={row.name}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-fg">{row.name}</span>
                <span className="font-mono text-lg font-black tabular-nums text-gradient-cyan-purple">
                  {row.ms.toFixed(2)}
                  <span className="text-xs font-normal text-fg/50"> ms</span>
                </span>
              </div>
              <p className="text-xs text-fg/50 mb-3 font-mono">{row.profile}</p>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-white/5"
                role="img"
                aria-label={`${row.name}: 平均 ${row.ms.toFixed(2)} ミリ秒`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {row.memMb != null && (
                <p className="mt-2 font-mono text-[0.7rem] text-fg/40">
                  ヒープ {row.memMb.toFixed(2)} MB
                </p>
              )}
            </div>
          )
        })}
      </div>
      {benchmark.envNote && (
        <p className="mt-6 font-mono text-xs text-fg/50 leading-relaxed">{benchmark.envNote}</p>
      )}
    </section>
  )
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const detail = project.detail
  // detail を持たないプロジェクトは深掘りページを描画しない（App 側でフォールバック）
  if (!detail) return null

  const links = detail.links && detail.links.length > 0
    ? detail.links
    : [{ label: 'GitHub', href: project.github }]

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* トップバー（戻る導線 + ホームへ） */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href={BACK_HREF}
            className="text-sm font-mono text-fg/70 hover:text-cyan-400 transition-colors"
          >
            ← Works に戻る
          </a>
          <a href="#" className="text-lg font-bold font-mono text-gradient-cyan-purple">
            AiLink CTO 岡部翔太
          </a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* ヒーロー */}
        <section className="detail-reveal pt-16 pb-10 border-b border-white/10" style={{ animationDelay: '0s' }}>
          <p className="text-xs font-mono tracking-[0.3em] text-cyan-500 uppercase mb-4">Project</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5">{project.title}</h1>
          <p className="text-base md:text-lg text-fg/70 leading-relaxed mb-6 max-w-3xl">
            {detail.tagline}
          </p>

          {/* タグ */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 外部リンク */}
          <div className="flex flex-wrap gap-3">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-fg/70 hover:text-cyan-400 border border-white/15 hover:border-cyan-500/50 rounded px-4 py-2 transition-colors"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </section>

        {/* メタ情報 */}
        {detail.meta && detail.meta.length > 0 && (
          <section
            className="detail-reveal grid grid-cols-2 md:grid-cols-3 gap-3 py-10"
            style={{ animationDelay: '0.06s' }}
          >
            {detail.meta.map(m => (
              <div key={m.label} className="p-4 rounded border border-white/10 bg-white/5">
                <p className="text-[0.65rem] font-mono text-cyan-500 tracking-widest uppercase mb-1.5">
                  {m.label}
                </p>
                <p className="text-sm text-fg/85 font-medium leading-snug">{m.value}</p>
              </div>
            ))}
          </section>
        )}

        {/* 統計タイル群（任意） */}
        {detail.stats && detail.stats.length > 0 && <StatGrid stats={detail.stats} />}

        {/* 概要 */}
        <section className="detail-reveal py-10" style={{ animationDelay: '0.12s' }}>
          <SectionTitle en="Overview" ja="概要" />
          <p className="text-fg/75 leading-relaxed max-w-3xl">{detail.overview}</p>
        </section>

        {/* アーキテクチャ図（任意） */}
        {detail.architecture && detail.architecture.layers.length > 0 && (
          <ArchitectureDiagram arch={detail.architecture} />
        )}

        {/* 段階フロー（任意） */}
        {detail.flow && detail.flow.steps.length > 0 && <StageFlow flow={detail.flow} />}

        {/* 技術スタック */}
        <section className="detail-reveal py-10" style={{ animationDelay: '0.18s' }}>
          <SectionTitle en="Tech Stack" ja="技術スタック" />
          <div className="flex flex-wrap gap-2">
            {detail.techStack.map(t => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-fg/80 font-mono border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 主要機能 */}
        {detail.sections.length > 0 && (
          <section className="detail-reveal py-10" style={{ animationDelay: '0.24s' }}>
            <SectionTitle en="Features" ja="主要機能" />
            <div className="space-y-4">
              {detail.sections.map(s => (
                <div
                  key={s.heading}
                  className="p-5 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-500/30 transition-colors"
                >
                  <h3 className="text-base font-bold text-fg mb-2">{s.heading}</h3>
                  {s.body && <p className="text-sm text-fg/65 leading-relaxed">{s.body}</p>}
                  {s.items && s.items.length > 0 && (
                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {s.items.map(item => (
                        <li key={item} className="text-sm text-fg/70 flex items-start gap-2">
                          <span className="text-cyan-500 mt-0.5">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 性能評価（任意） */}
        {detail.benchmark && detail.benchmark.rows.length > 0 && (
          <BenchmarkChart benchmark={detail.benchmark} />
        )}

        {/* 見どころ */}
        {detail.highlights.length > 0 && (
          <section className="detail-reveal py-10" style={{ animationDelay: '0.3s' }}>
            <SectionTitle en="Highlights" ja="見どころ" />
            <ul className="space-y-2.5">
              {detail.highlights.map(h => (
                <li key={h} className="flex items-start gap-3 text-fg/80 leading-relaxed">
                  <span className="text-purple-400 mt-1 font-mono">◆</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 今後の実装予定 / 課題（任意・実装済み機能とは区別して見せる） */}
        {detail.futureWork && detail.futureWork.length > 0 && (
          <section className="detail-reveal py-10" style={{ animationDelay: '0.36s' }}>
            <SectionTitle en="Roadmap" ja="今後の実装予定" />
            <ul className="space-y-2.5">
              {detail.futureWork.map(w => (
                <li key={w} className="flex items-start gap-3 text-fg/60 leading-relaxed">
                  <span aria-hidden="true" className="mt-1 font-mono text-fg/30">
                    ○
                  </span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* フッター戻る導線 */}
        <div className="pt-10 border-t border-white/10">
          <a
            href={BACK_HREF}
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Works 一覧に戻る
          </a>
        </div>
      </main>
    </div>
  )
}
