import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectDetail } from '../ProjectDetail'
import { projects } from '../../../data/projects'

const sal = projects.find(p => p.id === 'scientist-agent-lab')!
const markking = projects.find(p => p.id === 'markking')!

describe('ProjectDetail', () => {
  it('プロジェクトタイトルとタグラインを表示する', () => {
    render(<ProjectDetail project={sal} />)
    expect(screen.getByRole('heading', { name: /Scientist Agent Lab/i })).toBeInTheDocument()
    expect(screen.getByText(sal.detail!.tagline)).toBeInTheDocument()
  })

  it('技術スタックの項目を表示する', () => {
    render(<ProjectDetail project={sal} />)
    expect(screen.getByText(sal.detail!.techStack[0])).toBeInTheDocument()
  })

  it('見どころの項目を表示する', () => {
    render(<ProjectDetail project={sal} />)
    expect(screen.getByText(sal.detail!.highlights[0])).toBeInTheDocument()
  })

  it('Works セクションへ戻る導線がある', () => {
    render(<ProjectDetail project={sal} />)
    const backLinks = screen.getAllByRole('link', { name: /works/i })
    expect(backLinks.length).toBeGreaterThan(0)
    backLinks.forEach(link => expect(link).toHaveAttribute('href', '#works'))
  })
})

describe('ProjectDetail 拡張セクション（MarkKing / PDF 素材準拠）', () => {
  it('統計タイル群を PDF 実測値で表示する', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.getByText('数字で見る')).toBeInTheDocument()
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('対応レンダリングライブラリ')).toBeInTheDocument()
    expect(screen.getByText('0.1秒以下')).toBeInTheDocument()
  })

  it('責務分割アーキテクチャのデータフロー（3 ノード + 受け渡し）を表示する', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.getByText('アーキテクチャ')).toBeInTheDocument()
    expect(screen.getByText('MarkmapController')).toBeInTheDocument()
    expect(screen.getByText('サイドパネル機構')).toBeInTheDocument()
    // コネクタラベルはノード間に描画される（3 ノードなら 2 本）
    expect(screen.getAllByText('受け渡し').length).toBe(2)
  })

  it('buildHeadingContentMap の 4 段フローを段階表示する', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.getByText('コア処理フロー')).toBeInTheDocument()
    expect(screen.getByText('SCAN')).toBeInTheDocument()
    expect(screen.getByText('DEFINE RANGE')).toBeInTheDocument()
    expect(screen.getByText('GENERATE MAP')).toBeInTheDocument()
    expect(screen.getByText('S1')).toBeInTheDocument()
    expect(screen.getByText('S4')).toBeInTheDocument()
  })

  it('性能評価（Small / Medium / Large）を実測値で表示する', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.getByText('性能評価')).toBeInTheDocument()
    expect(screen.getByText('Small')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Large')).toBeInTheDocument()
    expect(screen.getByText('97.84')).toBeInTheDocument()
  })

  it('ロードマップ（今後の実装予定）を実装予定として表示する', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.getByText('今後の実装予定')).toBeInTheDocument()
    expect(screen.getByText('Phase 1: ブックマーク機能')).toBeInTheDocument()
    expect(screen.getByText('Phase 2: 協調編集')).toBeInTheDocument()
  })

  it('破棄した旧内容（事実性の無い記述）を含まない', () => {
    render(<ProjectDetail project={markking} />)
    expect(screen.queryByText(/IPC ホワイトリスト/)).not.toBeInTheDocument()
    expect(screen.queryByText(/多層防御/)).not.toBeInTheDocument()
    expect(screen.queryByText(/統合ターミナル/)).not.toBeInTheDocument()
    expect(screen.queryByText(/コード実行エンジン/)).not.toBeInTheDocument()
    expect(screen.queryByText(/ドメインエンティティ/)).not.toBeInTheDocument()
  })
})

describe('ProjectDetail 後方互換（拡張セクションを持たない SAL）', () => {
  it('新セクション種を持たない SAL では拡張セクションを描画しない', () => {
    render(<ProjectDetail project={sal} />)
    expect(screen.queryByText('数字で見る')).not.toBeInTheDocument()
    expect(screen.queryByText('アーキテクチャ')).not.toBeInTheDocument()
    expect(screen.queryByText('コア処理フロー')).not.toBeInTheDocument()
    expect(screen.queryByText('性能評価')).not.toBeInTheDocument()
    expect(screen.queryByText('今後の実装予定')).not.toBeInTheDocument()
  })

  it('従来のセクション（概要・技術スタック・主要機能）は従来通り表示する', () => {
    render(<ProjectDetail project={sal} />)
    expect(screen.getByText('概要')).toBeInTheDocument()
    expect(screen.getByText('技術スタック')).toBeInTheDocument()
    expect(screen.getByText('主要機能')).toBeInTheDocument()
  })
})
