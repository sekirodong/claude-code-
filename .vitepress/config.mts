import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI 开发者部署指南',
  description: 'Claude Code、Codex CLI、OpenClaw、Hermes Agent 与 CC Switch 完整部署教程',
  lang: 'zh-CN',
  base: '/claude-code-/',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '开始之前',
        items: [
          { text: '环境准备（npm / Node.js / pip）', link: '/guide/prerequisites' },
          { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
        ],
      },
      {
        text: 'Claude Code',
        items: [
          { text: '简介', link: '/claude-code/' },
          { text: '快速上手（Datawhale）', link: '/claude-code/quickstart' },
          { text: '多系统安装指南', link: '/claude-code/windows-install' },
          { text: 'Cursor 集成', link: '/claude-code/cursor-integration' },
        ],
      },
      {
        text: 'OpenAI Codex CLI',
        items: [
          { text: '简介', link: '/codex/' },
          { text: '官方快速启动', link: '/codex/quickstart' },
          { text: '多系统安装教程', link: '/codex/multi-system-install' },
          { text: 'AWS Agent 编排', link: '/codex/aws-orchestrator' },
        ],
      },
      {
        text: '更多工具',
        items: [
          { text: 'OpenClaw 部署指南', link: '/openclaw/' },
          { text: 'Hermes Agent 部署指南', link: '/hermes/' },
          { text: 'CC Switch 统一管理', link: '/cc-switch/' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始之前',
          items: [
            { text: '环境准备（npm / Node.js / pip）', link: '/guide/prerequisites' },
            { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
          ],
        },
        {
          text: '工具文档',
          items: [
            { text: 'Claude Code', link: '/claude-code/' },
            { text: 'OpenAI Codex CLI', link: '/codex/' },
            { text: 'OpenClaw', link: '/openclaw/' },
            { text: 'Hermes Agent', link: '/hermes/' },
            { text: 'CC Switch', link: '/cc-switch/' },
          ],
        },
      ],
      '/claude-code/': [
        {
          text: '开始之前',
          items: [
            { text: '环境准备（npm / Node.js）', link: '/guide/prerequisites' },
            { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
          ],
        },
        {
          text: 'Claude Code',
          items: [
            { text: '简介与概述', link: '/claude-code/' },
            { text: '快速上手（Datawhale）', link: '/claude-code/quickstart' },
            { text: '多系统安装指南', link: '/claude-code/windows-install' },
            { text: 'Cursor 集成', link: '/claude-code/cursor-integration' },
          ],
        },
        {
          text: '相关工具',
          items: [
            { text: 'CC Switch 统一管理', link: '/cc-switch/' },
            { text: 'OpenClaw', link: '/openclaw/' },
            { text: 'Hermes Agent', link: '/hermes/' },
          ],
        },
      ],
      '/codex/': [
        {
          text: '开始之前',
          items: [
            { text: '环境准备（npm / Node.js 22+）', link: '/guide/prerequisites' },
            { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
          ],
        },
        {
          text: 'OpenAI Codex CLI',
          items: [
            { text: '简介与概述', link: '/codex/' },
            { text: '官方快速启动', link: '/codex/quickstart' },
            { text: '多系统安装教程', link: '/codex/multi-system-install' },
            { text: 'AWS Agent 编排', link: '/codex/aws-orchestrator' },
          ],
        },
        {
          text: '相关工具',
          items: [
            { text: 'CC Switch 统一管理', link: '/cc-switch/' },
            { text: 'OpenClaw', link: '/openclaw/' },
            { text: 'Hermes Agent', link: '/hermes/' },
          ],
        },
      ],
      '/openclaw/': [
        {
          text: '开始之前',
          items: [
            { text: '环境准备（npm / Node.js 22+）', link: '/guide/prerequisites' },
            { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
          ],
        },
        {
          text: 'OpenClaw',
          items: [
            { text: '部署指南', link: '/openclaw/' },
          ],
        },
        {
          text: '相关工具',
          items: [
            { text: 'Hermes Agent', link: '/hermes/' },
            { text: 'CC Switch 统一管理', link: '/cc-switch/' },
          ],
        },
      ],
      '/hermes/': [
        {
          text: '开始之前',
          items: [
            { text: '环境准备（Python / pip / uv）', link: '/guide/prerequisites' },
            { text: '网络代理（FlClash + 机场）', link: '/guide/proxy' },
          ],
        },
        {
          text: 'Hermes Agent',
          items: [
            { text: '部署指南', link: '/hermes/' },
          ],
        },
        {
          text: '相关工具',
          items: [
            { text: 'OpenClaw', link: '/openclaw/' },
            { text: 'CC Switch 统一管理', link: '/cc-switch/' },
          ],
        },
      ],
      '/cc-switch/': [
        {
          text: 'CC Switch',
          items: [
            { text: '简介与下载', link: '/cc-switch/' },
          ],
        },
        {
          text: '管理的工具',
          items: [
            { text: 'Claude Code', link: '/claude-code/' },
            { text: 'OpenAI Codex CLI', link: '/codex/' },
            { text: 'OpenClaw', link: '/openclaw/' },
            { text: 'Hermes Agent', link: '/hermes/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/farion1231/cc-switch' },
    ],

    footer: {
      message: '基于开源社区教程整理',
      copyright: 'Copyright © 2026',
    },

    search: {
      provider: 'local',
    },
  },
})
