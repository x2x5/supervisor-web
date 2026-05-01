# Supervisor Skills Web

这是基于 `Supervisor-Skills` 内容生成的本地网页卡片版。

## 启动

```bash
cd /Users/25tian/x2x5/supervisor-web
python3 -m http.server 8090
```

打开 [http://localhost:8090](http://localhost:8090)

## 数据来源

- 网页读取 `skills.md`
- `skills.md` 由 `plugins/phd-research/skills/*/SKILL.md` 自动聚合生成

## 更新技能后重新生成

```bash
cd /Users/25tian/x2x5/supervisor-web
./scripts/build_skills_md.sh
```
