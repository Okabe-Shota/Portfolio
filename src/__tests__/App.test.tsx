import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// アニメーション系はテストでは無効化する
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }))
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: vi.fn(),
    create: vi.fn(),
    registerPlugin: vi.fn(),
    getAll: () => [],
  },
}))
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: () => ({ from() { return this } }),
  },
}))
vi.mock('../hooks/useVanta', () => ({ useVanta: () => ({ isReady: true }) }))
vi.mock('../hooks/useScrollAnimation', () => ({ useScrollAnimation: vi.fn() }))

function setHash(hash: string) {
  window.location.hash = hash
}

describe('App のハッシュルーティング', () => {
  beforeEach(() => {
    setHash('')
    window.scrollTo = vi.fn()
  })

  it('ハッシュ無しではトップページ(Hero)を表示する', () => {
    setHash('')
    render(<App />)
    expect(screen.getByText(/See My Work/i)).toBeInTheDocument()
  })

  it('#/project/scientist-agent-lab で深掘りページを表示しトップは隠す', () => {
    setHash('#/project/scientist-agent-lab')
    render(<App />)
    expect(screen.getByRole('heading', { name: /Scientist Agent Lab/i })).toBeInTheDocument()
    expect(screen.queryByText(/See My Work/i)).not.toBeInTheDocument()
  })

  it('#/project/markking で MarkKing の深掘りページを表示する', () => {
    setHash('#/project/markking')
    render(<App />)
    expect(screen.getByRole('heading', { name: /MarkKing/i })).toBeInTheDocument()
  })

  it('未知のプロジェクトIDはトップにフォールバックする', () => {
    setHash('#/project/does-not-exist')
    render(<App />)
    expect(screen.getByText(/See My Work/i)).toBeInTheDocument()
  })
})
