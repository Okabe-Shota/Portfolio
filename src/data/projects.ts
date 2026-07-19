export type ProjectDetailSection = {
  heading: string
  body?: string
  items?: string[]
}

export type ProjectMeta = {
  label: string
  value: string
}

export type ProjectLink = {
  label: string
  href: string
}

/** 統計タイル: 大きな数値を主役にして見せる 1 マス */
export type ProjectStat = {
  value: string
  label: string
  hint?: string
}

/** アーキテクチャの 1 層。外側（UI）→ 内側（ドメイン）の順で渡す */
export type ArchLayer = {
  name: string
  role: string
  tag?: string
}

/** レイヤー図 / データフロー図: 依存や流れの向きつきの図 */
export type ProjectArchitecture = {
  /** 見出し（任意）。省略時は Architecture / アーキテクチャ */
  title?: { en: string; ja: string }
  caption?: string
  layers: ArchLayer[]
  /** 層間コネクタのラベル（任意）。省略時は "depends on" */
  connectorLabel?: string
  dependencyNote?: string
}

/** 段階フローの 1 ステップ */
export type FlowStep = {
  title: string
  detail: string
  items?: string[]
}

/** 段階フロー: 順序のある処理ステップを段階表示する */
export type ProjectFlow = {
  title: { en: string; ja: string }
  /** ステップ番号の接頭辞（任意）。省略時は "S" */
  badgePrefix?: string
  note?: string
  steps: FlowStep[]
}

/** 性能ベンチの 1 行 */
export type BenchmarkRow = {
  name: string
  profile: string
  ms: number
  memMb?: number
}

/** 性能評価: 規模別のレンダリング時間を CSS バーで比較する */
export type ProjectBenchmark = {
  title?: { en: string; ja: string }
  caption?: string
  envNote?: string
  rows: BenchmarkRow[]
}

/** 深掘りページを持つプロジェクトの追加情報 */
export type ProjectDetail = {
  tagline: string
  overview: string
  meta?: ProjectMeta[]
  techStack: string[]
  sections: ProjectDetailSection[]
  highlights: string[]
  links?: ProjectLink[]
  /** 統計タイル群（任意）: 数値を大きく見せるグリッド */
  stats?: ProjectStat[]
  /** レイヤー図 / データフロー図（任意） */
  architecture?: ProjectArchitecture
  /** 段階フロー（任意）: 順序のある処理ステップを段階表示する */
  flow?: ProjectFlow
  /** 性能評価（任意）: 規模別のレンダリング時間を比較する */
  benchmark?: ProjectBenchmark
  /** 今後の実装予定 / 課題（任意）: 未実装・未整備を正直に記す */
  futureWork?: string[]
}

export type Project = {
  id: string
  title: string
  description: { ja: string; en: string }
  tags: string[]
  category: 'data' | 'backend' | 'frontend'
  github: string
  demo?: string
  image?: string
  /** 定義されている場合のみ深掘りページ（#/project/<id>）が存在する */
  detail?: ProjectDetail
}

export const CATEGORY_LABELS: Record<Project['category'] | 'all', string> = {
  all: 'All',
  data: 'Data Science',
  backend: 'Backend',
  frontend: 'Frontend',
}

export const projects: Project[] = [
  {
    id: 'markking',
    title: 'MarkKing',
    description: {
      ja: 'マインドマップで文書構造を俯瞰し、図表・数式をサイドパネルに動的レンダリングする次世代 Markdown エディタ。',
      en: 'A next-gen Markdown editor that maps document structure as a mind map and dynamically renders charts and formulas in a side panel.',
    },
    tags: ['Electron', 'TypeScript', 'markmap'],
    category: 'frontend',
    github: 'https://github.com/Okabe-Shota/MarkKing',
    detail: {
      tagline:
        'マインドマップによる構造俯瞰と詳細への瞬間アクセス — 文書構造を可視化し動的レンダリングする次世代 Markdown エディタ',
      overview:
        '長文の Markdown は全体構造の把握が難しい。従来ツールは構造ツリー表示のみで、図表・数式を確認するにはエディタをスクロールして探し戻る必要があり、「構造俯瞰」と「詳細確認」が分断されていた。頻繁な視点移動は認知負荷を高める（特に図表の多いデータ分析レポートや技術仕様書）。MarkKing は左ペインのマインドマップで文書全体を地図として俯瞰しながら、見出しをクリックすると対応セクションの図表・数式・コードを右ペインのサイドパネルへ即座にレンダリングする。マインドマップで現在地を把握したまま詳細を確認できるため、長文でも「今どこを読んでいるか」を見失わない。学位プロジェクト（卒業研究）として開発した。',
      meta: [
        { label: 'ライセンス', value: 'MIT' },
        { label: 'プラットフォーム', value: 'デスクトップ（Electron）' },
        { label: '位置づけ', value: '学位プロジェクト（卒業研究）' },
      ],
      stats: [
        { value: '12+', label: '対応レンダリングライブラリ', hint: 'Adapter Pattern で統一' },
        {
          value: '4段',
          label: '見出し対応付けの処理フロー',
          hint: 'SCAN → DETECT → DEFINE RANGE → GENERATE MAP',
        },
        { value: '0.1秒以下', label: 'ノードクリック応答' },
        { value: '0.57秒', label: '約1万行のレンダリング平均', hint: 'Large ベンチ・約217KB' },
        { value: '1,554', label: '大規模ベンチの見出し数' },
      ],
      architecture: {
        title: { en: 'Architecture', ja: 'アーキテクチャ' },
        caption:
          '見出しクリックを起点に、責務を分離した各機構がコンテンツを受け渡してレンダリングする（責務分割アーキテクチャ）。',
        connectorLabel: '受け渡し',
        layers: [
          {
            name: 'マインドマップ (markmap)',
            role: 'markmap で見出し階層をツリー可視化する。ノードをクリックして、対応セクションの表示を要求する。',
            tag: 'NAVIGATION',
          },
          {
            name: 'MarkmapController',
            role: 'クリックを検知し、buildHeadingContentMap を参照して対応コンテンツを特定。サイドパネルへ受け渡す。',
            tag: 'CONTROLLER',
          },
          {
            name: 'サイドパネル機構',
            role: 'コンテンツの種類を判定し、種類対応アダプタでハイドレーションして DOM に反映する。',
            tag: 'DETAIL VIEW',
          },
        ],
        dependencyNote: 'データの流れ: マインドマップ → MarkmapController → サイドパネル機構',
      },
      flow: {
        title: { en: 'Core Pipeline', ja: 'コア処理フロー' },
        badgePrefix: 'S',
        note: 'buildHeadingContentMap は 4 段階で目次マップを生成する。markmap 等の既存ライブラリには無い、見出しと内容を正確に対応付けるマッピング機能で、ノードクリック時 0.1 秒以下でコンテンツを切り出す。',
        steps: [
          { title: 'SCAN', detail: '文書の全行を走査する。' },
          { title: 'DETECT', detail: '# 見出し行を検出し、その階層レベルを判定する。' },
          {
            title: 'DEFINE RANGE',
            detail: '次の見出しの直前までを、その見出しの管轄範囲として確定する。',
          },
          {
            title: 'GENERATE MAP',
            detail: '目次マップを生成する。ノードクリック時に 0.1 秒以下でコンテンツを切り出せる。',
          },
        ],
      },
      techStack: [
        'Electron 36.3.1',
        'TypeScript 5.8.3',
        'Monaco Editor 0.52.2',
        'Marked 4.3.0',
        'Highlight.js 11.11.1',
        'markmap',
        'Highcharts',
        'KaTeX',
        'Mermaid',
        'Cytoscape.js',
      ],
      sections: [
        {
          heading: '2 ペイン構成（NAVIGATION + DETAIL VIEW）',
          body: '左ペインはマインドマップ（NAVIGATION）。見出し階層をツリーで可視化し、ノード操作で情報粒度を調整する。右ペインはサイドパネル（DETAIL VIEW）。見出しクリックで対応セクションの図表・数式・コードを即座にレンダリングし、スクロールで「探す」手間を排除する。',
        },
        {
          heading: 'State Persistence（編集後もノード開閉状態を維持）',
          body: '既存ライブラリは一時的な内部 ID でノードを管理するため、編集のたびに ID が再生成され開閉状態がリセットされる。MarkKing は「Root / 第1章 / 1.1節」のような階層パスで永続的に識別し、保存のたびにノードが閉じる現象を根本解決。編集と構造確認をシームレスに往復できる。',
        },
        {
          heading: '統一的図表ハイドレーション（Adapter Pattern）',
          body: '12 種類以上のライブラリのバラバラな API を、共通インターフェース render(element, content) で統一する。各ライブラリ用アダプタを実装し、種類に応じて動的選択する。新規ライブラリはアダプタを 1 つ追加するだけで対応でき、コアロジックは変更しない（拡張性・保守性）。',
        },
        {
          heading: '対応レンダリング（12 種類以上）',
          body: '見出しに対応した図表・数式・楽譜を、種類に応じたライブラリで動的にレンダリングする。マインドマップの基盤は markmap。',
          items: [
            'Highcharts（チャート）',
            'KaTeX（数式）',
            'Mermaid（ダイアグラム）',
            'ABC 記法（楽譜）',
            'Cytoscape.js（グラフ可視化）',
            'markmap（マインドマップ基盤）',
          ],
        },
      ],
      benchmark: {
        title: { en: 'Performance', ja: '性能評価' },
        caption:
          '見出しとチャートを大量に含む Markdown を 3 段階の規模で実測。約 1 万行の大規模ファイルでも平均約 0.57 秒でレンダリングする実用速度を確認した。',
        envNote:
          '評価環境: Windows 11 / Core i7-11700 / 32GB / Electron 36.3.1 / Node.js 22.15.21。数値はレンダリング時間の平均、ヒープはヒープ実測値。一般的な 8GB 以上の PC で快適動作する。',
        rows: [
          {
            name: 'Small',
            profile: '約1,000行 / 21.52KB / 見出し154 / チャート91',
            ms: 97.84,
            memMb: 170.11,
          },
          {
            name: 'Medium',
            profile: '約5,000行 / 108.37KB / 見出し776 / チャート491',
            ms: 305.82,
            memMb: 262.54,
          },
          {
            name: 'Large',
            profile: '約10,000行 / 217.51KB / 見出し1,554 / チャート991',
            ms: 565.68,
            memMb: 425.29,
          },
        ],
      },
      highlights: [
        'buildHeadingContentMap — markmap 等の既存ライブラリには無い、見出しと内容の正確な対応付け（ノードクリック 0.1 秒以下で切り出し）',
        'State Persistence — 階層パスによる永続的識別で、編集のたびにノードが閉じる問題を根本解決',
        '責務分割アーキテクチャ — MarkmapController と サイドパネル機構に責務を分離',
        'Adapter Pattern による統一的ハイドレーション — 12 種類以上のライブラリを render(element, content) で統一し、新規追加はアダプタ 1 つ',
        '約 1 万行の大規模ファイルでも平均約 0.57 秒でレンダリングする実用速度（実測）',
      ],
      futureWork: [
        'Phase 1: ブックマーク機能',
        'Phase 1: エクスポート機能（PDF / HTML）',
        'Phase 2: 協調編集',
        'Phase 2: AI によるセクション要約',
      ],
      links: [{ label: 'GitHub', href: 'https://github.com/Okabe-Shota/MarkKing' }],
    },
  },
  {
    id: 'scientist-agent-lab',
    title: 'Scientist Agent Lab',
    description: {
      ja: 'ニッチ科学領域の閉ループ研究を 24/7 自動実行する自己成長型 AI 研究エージェント基盤。Rust 製。',
      en: 'A self-growing AI research agent platform that autonomously runs closed-loop research in niche scientific domains around the clock. Built in Rust.',
    },
    tags: ['Rust', 'AI Agent', 'Tauri'],
    category: 'backend',
    github: 'https://github.com/Okabe-Shota/Scientist-agent-lab',
    detail: {
      tagline:
        'ニッチ科学領域の閉ループ研究（仮説生成 → 実験設計 → 成果解釈）を 24/7 自動実行する自己成長型 AI 研究エージェント基盤',
      overview:
        'ニッチな科学領域における閉ループ研究（仮説生成 → 実験設計 → 成果解釈）を 24 時間 365 日自動で回す、自己成長型の AI 研究エージェント基盤。中核は Rust 製 CLI「sal」。単一のコードベースから CLI / TUI / REST API / デスクトップ GUI / MCP / P2P までを提供する。',
      meta: [
        { label: 'バージョン', value: 'v1.1.0（151 マイルストーン完了）' },
        { label: 'ライセンス', value: 'MIT OR Apache-2.0' },
        { label: 'コード規模', value: 'Rust 約2.9万行（src + tests 実測）' },
        { label: 'テスト', value: '508 件（468 unit + 40 integration）' },
        { label: '品質', value: 'clippy clean' },
        { label: 'CI', value: 'ubuntu / windows / macos マルチプラットフォーム' },
      ],
      techStack: [
        'Rust 2024 edition',
        'Ratatui 0.30（常駐 TUI）',
        'axum 0.8（REST API 16 エンドポイント + SSE）',
        'OpenAPI 3.1 + Swagger UI',
        'Tauri 2 + React 19 + Vite 6',
        'SQLite + sqlite-vec（768 次元 embedding）',
        'FTS5 全文検索',
        'Ollama 対応 LLM 層（Mock フォールバック / MoA 対応）',
        'libp2p 0.56（mDNS + gossipsub）',
        'MCP（JSON-RPC 2.0 stdio）',
      ],
      sections: [
        {
          heading: '3 層メモリ',
          body: 'Layer1 は凍結スナップショット（自動 trim）、Layer2 は SQLite + FTS5 のセッション履歴、Layer3 は Skill マニフェスト。30 ターンを超えると履歴を自動圧縮し、Insight として永続化する。',
        },
        {
          heading: '9 つの科学ドメイン Skill',
          body: '9 つの科学ドメイン Skill を内蔵する。',
          items: [
            '量子凝縮系（Hubbard モデル）',
            'プラスチック分解酵素',
            'Li-ion 正極材料',
            'MOF ガス分離',
            '高温超伝導体',
            '太陽電池',
            '不均一系触媒（14 種）',
            '創薬',
            '半導体プロセス',
          ],
        },
        {
          heading: 'Self-aware Autopilot',
          body: '自身の状態を観察して次アクションを優先度付きで提案する。Claude Code 風の常駐 TUI で監視でき、shell injection に対する安全機構を備える。',
        },
        {
          heading: '24/7 自律デーモン',
          body: 'goal を指定すると自律的に動作し、定期的に Markdown レポートを生成する。whitelist による自動実行と、Discord / Slack への通知に対応する。',
        },
        {
          heading: '再現性',
          body: '全実験を SHA256 + 環境情報で永続化し、再実行で bit-exact / Jaccard ≥ 0.85 を判定する。vault export で実験一式を引き継げるほか、因果仮説の頻度マイニング（LLM 不要・決定的）を行う。',
        },
        {
          heading: 'Crystal Memory',
          body: '768 次元 embedding で Insight を蓄積し、kNN による意味検索と BFS による関係トラバースを提供する。',
        },
        {
          heading: 'ベンチマーク',
          body: 'TOML で記述したテストケースを 5 軸でスコアリングする。LLM 不要の決定的判定で、CI に統合できる。',
        },
      ],
      highlights: [
        'LLM 不要の決定論的 Skill ランナー（再現性 100% / hallucination 排除）',
        '実験再現性の自動検証（bit-exact / Jaccard 判定）',
        '3 層メモリの自動圧縮と Insight 永続化',
        '単一コードベースで CLI / TUI / REST / GUI / MCP / P2P を提供',
        '9 つの科学ドメインを同時運用できる設計',
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/Okabe-Shota/Scientist-agent-lab' },
      ],
    },
  },
]
