import { describe, it, expect } from 'vitest'
import { parseHash } from '../useHashRoute'

describe('parseHash', () => {
  it('空ハッシュはホームルート', () => {
    expect(parseHash('')).toEqual({ name: 'home' })
  })

  it('通常のセクションアンカーはホームルート扱い', () => {
    expect(parseHash('#')).toEqual({ name: 'home' })
    expect(parseHash('#works')).toEqual({ name: 'home' })
    expect(parseHash('#contact')).toEqual({ name: 'home' })
  })

  it('プロジェクトハッシュはプロジェクトルートになる', () => {
    expect(parseHash('#/project/markking')).toEqual({ name: 'project', id: 'markking' })
    expect(parseHash('#/project/scientist-agent-lab')).toEqual({
      name: 'project',
      id: 'scientist-agent-lab',
    })
  })

  it('ID が空のプロジェクトハッシュはホームにフォールバック', () => {
    expect(parseHash('#/project/')).toEqual({ name: 'home' })
  })

  it('URL エンコードされた ID をデコードする', () => {
    expect(parseHash('#/project/a%20b')).toEqual({ name: 'project', id: 'a b' })
  })
})
