# 发版指南

本项目使用 GitHub Actions 自动化发版流程。当你推送一个版本 tag 时，会自动构建并发布到 GitHub Releases。

## 📋 发版步骤

### 1. 更新版本号

在 `package.json` 中更新版本号：

```json
{
  "version": "1.4.0"
}
```

### 2. 提交更改

```bash
git add .
git commit -m "chore: bump version to 1.4.0"
```

### 3. 创建版本 Tag 并推送

```bash
# 创建 tag（版本号前加 v）
git tag v1.4.0

# 推送代码和 tag
git push origin master
git push origin v1.4.0
```

或者一次性推送所有 tag：

```bash
git push origin master --tags
```

### 4. 等待自动构建

推送 tag 后，GitHub Actions 会自动：
1. ✅ 拉取代码
2. ✅ 安装依赖
3. ✅ 构建 Chrome 扩展
4. ✅ 构建 Firefox 扩展
5. ✅ 生成更新日志（基于 Git 提交记录）
6. ✅ 创建 GitHub Release 并上传构建文件

### 5. 查看发布结果

前往仓库的 [Releases](../../releases) 页面查看发布结果。

---

## 💡 最佳实践

### 提交信息规范

建议使用规范的提交信息，这样自动生成的更新日志会更清晰：

```bash
# 新功能
git commit -m "feat: 添加 UP 主名称通配符支持"

# Bug 修复
git commit -m "fix: 修复首页过滤失效问题"

# 样式更新
git commit -m "style: 更新首页 DOM CSS 代码"

# 文档更新
git commit -m "docs: 更新 README 说明"

# 构建/配置更新
git commit -m "chore: 更新依赖版本"
```

### 手动编辑 Release Notes

如果自动生成的更新日志不够详细，你可以在 Release 发布后，点击编辑按钮手动修改。

---

## ⚠️ 注意事项

1. **Tag 格式**：必须以 `v` 开头，如 `v1.4.0`、`v2.0.0-beta`
2. **版本一致性**：`package.json` 中的版本号应与 tag 版本一致（不含 `v` 前缀）
3. **构建失败**：如果构建失败，可以在 Actions 页面查看详细日志
