import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Terre Tools',
  description: '一个持续进化的 AI 工具库、工作流档案和个人技术写作站点。',
  base: isGitHubActions && repoName ? `/${repoName}/` : '/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/mark.svg',
    siteTitle: 'Terre Tools',
    nav: [
      { text: '首页', link: '/' },
      { text: '工具栈', link: '/stack/' },
      { text: '工作流', link: '/workflows/' },
      { text: '博客', link: '/blog/' },
      { text: '指南', link: '/guide/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '站点说明', link: '/guide/' },
            { text: '发布到 GitHub Pages', link: '/guide/publish' }
          ]
        }
      ],
      '/stack/': [
        {
          text: '工具栈',
          items: [
            { text: '总览', link: '/stack/' },
            { text: '模型与聊天', link: '/stack/llm-stack' },
            { text: '终端与编码', link: '/stack/dev-stack' },
            { text: '自动化与发布', link: '/stack/automation-stack' }
          ]
        }
      ],
      '/workflows/': [
        {
          text: '工作流',
          items: [
            { text: '总览', link: '/workflows/' },
            { text: '选题到发布', link: '/workflows/publish-pipeline' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '文章',
          items: [
            { text: '博客首页', link: '/blog/' },
            { text: 'AI 编码台搭建', link: '/blog/ai-coding-desk' },
            { text: '一条内容工作流', link: '/blog/content-loop' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/outhsics/ai-workflow-library' }
    ],
    footer: {
      message: 'Built with VitePress and shipped through GitHub Pages.',
      copyright: 'Copyright © 2026 Terre'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '页面目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最近更新'
    }
  }
})
