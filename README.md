# Supervisor Skills Web

一个将科研 AI 技能以网页卡片形式展示的本地 Web 应用。

## 项目说明

本项目是一个独立的网页应用，旨在将科研辅助技能以更直观、易用的方式呈现给用户。

**技能来源**：本项目中的所有技能内容参考自 [Supervisor-Skills](https://github.com/HKUSTDial/Supervisor-Skills) 项目。该项目由香港科技大学（广州）助理教授[骆昱宇](https://luoyuyu.vip/)发起，将十年科研经验提炼为可被大语言模型执行的结构化 AI 技能。本项目仅对这些内容进行了网页化的展示与整合。

## 快速开始

```bash
# 启动本地服务器
python3 -m http.server 8090
```

打开 [http://localhost:8090](http://localhost:8090) 即可访问。

## 项目结构

```
├── index.html          # 网页入口
├── styles.css          # 样式文件
├── app.js              # 前端逻辑
├── skills.md           # 技能数据源（由脚本自动聚合生成）
├── handbook/           # 科研指南文档
├── plugins/            # 原始技能定义文件
├── scripts/            # 构建脚本
└── assets/             # 静态资源
```

## 数据来源

- 网页内容读取自 `skills.md`
- `skills.md` 由 `plugins/phd-research/skills/*/SKILL.md` 自动聚合生成

## 更新技能

```bash
./scripts/build_skills_md.sh
```

## 致谢

技能内容参考自 [Supervisor-Skills](https://github.com/HKUSTDial/Supervisor-Skills) 项目，感谢骆昱宇老师及其团队的开源贡献。

## License

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议开源。
