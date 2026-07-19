import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '../ProjectCard'
import type { Project } from '../../../data/projects'

const mockProject: Project = {
  id: 'test',
  title: 'Test Project',
  description: { ja: 'テスト説明', en: 'Test description' },
  tags: ['React', 'TypeScript'],
  category: 'frontend',
  github: 'https://github.com/test/repo',
}

describe('ProjectCard', () => {
  it('タイトルと説明をレンダーする', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('テスト説明')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('GitHub リンクが正しい href を持つ', () => {
    render(<ProjectCard project={mockProject} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/test/repo')
  })

  it('タグを全て表示する', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('detail が無い場合は詳細ページへのリンクを表示しない', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.queryByRole('link', { name: /詳細/ })).not.toBeInTheDocument()
  })

  it('detail がある場合は深掘りページへのリンクを表示する', () => {
    const withDetail: Project = {
      ...mockProject,
      id: 'demo-detail',
      detail: {
        tagline: 'タグライン',
        overview: '概要',
        techStack: ['Tech'],
        sections: [],
        highlights: ['見どころ'],
      },
    }
    render(<ProjectCard project={withDetail} />)
    const link = screen.getByRole('link', { name: /詳細/ })
    expect(link).toHaveAttribute('href', '#/project/demo-detail')
  })
})
