import { useEffect, useState } from 'react'

/**
 * 自前のハッシュルーティング。
 * GitHub Pages（base `/Portfolio/`）で直リンク・リロードしても 404 にならないよう、
 * BrowserRouter ではなくハッシュ（`window.location.hash`）でページを切り替える。
 *
 * ルート表現:
 *  - `#/project/<id>` … プロジェクト深掘りページ
 *  - それ以外（空・`#works` などのセクションアンカー）… トップページ
 */
export type Route =
  | { name: 'home' }
  | { name: 'project'; id: string }

const PROJECT_PREFIX = '#/project/'

export function parseHash(hash: string): Route {
  if (hash.startsWith(PROJECT_PREFIX)) {
    const raw = hash.slice(PROJECT_PREFIX.length)
    // 末尾のセクションアンカー等は無視し、ID 部分のみを取り出す
    const id = decodeURIComponent(raw.split(/[/?#]/)[0])
    if (id) return { name: 'project', id }
  }
  return { name: 'home' }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return route
}
