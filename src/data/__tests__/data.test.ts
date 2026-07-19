import { describe, it, expect } from 'vitest'
import { projects, CATEGORY_LABELS } from '../projects'
import { skills } from '../skills'
import { profile } from '../profile'

describe('projects data', () => {
  it('各プロジェクトに必須フィールドがある', () => {
    projects.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.github).toMatch(/^https:\/\/github\.com/)
      expect(['data', 'backend', 'frontend']).toContain(p.category)
    })
  })
  it('CATEGORY_LABELS に全カテゴリが含まれる', () => {
    expect(CATEGORY_LABELS.all).toBe('All')
    expect(CATEGORY_LABELS.data).toBe('Data Science')
    expect(CATEGORY_LABELS.backend).toBe('Backend')
    expect(CATEGORY_LABELS.frontend).toBe('Frontend')
  })
  it('全プロジェクトの github が新アカウント(Okabe-Shota)を指す', () => {
    projects.forEach(p =>
      expect(p.github).toMatch(/^https:\/\/github\.com\/Okabe-Shota\//)
    )
  })
})

describe('深掘り対象プロジェクト', () => {
  it('MarkKing と Scientist Agent Lab が追加されている', () => {
    const ids = projects.map(p => p.id)
    expect(ids).toContain('markking')
    expect(ids).toContain('scientist-agent-lab')
  })
  it('追加プロジェクトは Okabe-Shota の GitHub を指し detail を持つ', () => {
    const added = projects.filter(p => ['markking', 'scientist-agent-lab'].includes(p.id))
    expect(added).toHaveLength(2)
    added.forEach(p => {
      expect(p.github).toMatch(/^https:\/\/github\.com\/Okabe-Shota\//)
      expect(p.detail).toBeTruthy()
      expect(p.detail!.tagline).toBeTruthy()
      expect(p.detail!.techStack.length).toBeGreaterThan(0)
      expect(p.detail!.highlights.length).toBeGreaterThan(0)
    })
  })
  it('detail を持つのは追加した2プロジェクトのみ', () => {
    const withDetail = projects.filter(p => p.detail).map(p => p.id).sort()
    expect(withDetail).toEqual(['markking', 'scientist-agent-lab'])
  })
})

describe('skills data', () => {
  it('全スキルに必須フィールドがある', () => {
    skills.forEach(s => {
      expect(s.name).toBeTruthy()
      expect(['1-2年', '3-4年']).toContain(s.years)
      expect(['data', 'backend', 'frontend']).toContain(s.domain)
    })
  })
})

describe('profile data', () => {
  it('catchcopy が日英両方ある', () => {
    expect(profile.catchcopy.ja).toBeTruthy()
    expect(profile.catchcopy.en).toBeTruthy()
  })
  it('contact.github が設定されている', () => {
    expect(profile.contact.github).toMatch(/^https:\/\/github\.com/)
  })
})
