# 发版指南

本项目使用 GitHub Actions 自动化发版流程。当你推送一个版本 tag 时，会自动构建、发布到 GitHub Releases，并提交到 Firefox 和 Edge 扩展商店。

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
7. ✅ 提交到 Firefox Add-ons（如已配置）
8. ✅ 提交到 Edge Add-ons（如已配置）

### 5. 查看发布结果

前往仓库的 [Releases](../../releases) 页面查看发布结果。

---

## 🚀 商店自动发布配置

要启用自动发布到 Firefox 和 Edge 商店，需要在 GitHub 仓库中配置 Secrets。

### 配置 GitHub Secrets

前往仓库 **Settings → Secrets and variables → Actions**，添加以下 Secrets：

#### Firefox Add-ons

| Secret 名称 | 描述 | 获取方式 |
|-------------|------|----------|
| `FIREFOX_JWT_ISSUER` | API Key（JWT issuer） | [API Credentials 页面](https://addons.mozilla.org/developers/addon/api/key/) |
| `FIREFOX_JWT_SECRET` | API Secret | 同上 |
| `FIREFOX_EXTENSION_ID` | 扩展 UUID | 格式：`{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}` |

#### Edge Add-ons（API v1.1）

> **注意**：Edge API 已更新到 v1.1 版本，使用 API Key 认证（不再需要 Access Token URL）

| Secret 名称 | 描述 | 获取方式 |
|-------------|------|----------|
| `EDGE_CLIENT_ID` | Client ID | Partner Center → Publish API |
| `EDGE_API_KEY` | API Key（72天过期） | Partner Center → Publish API → Opt-in 新版 → 生成 |
| `EDGE_PRODUCT_ID` | 扩展 Product ID | 扩展概览页面 URL 中的 GUID |

**Edge API Key 获取步骤：**
1. 登录 [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/)
2. 进入你的扩展 → **Publish API**
3. 点击 **Opt-in** 启用新版 API
4. 生成 **API Key**
5. ⚠️ API Key 每 72 天过期，需要定期更新

### 本地发布（可选）

如果需要在本地手动发布，可以：

1. 填写 `.env.submit` 文件中的凭据
2. 构建 zip 包：`npm run zip:all`
3. 发布到商店：`npm run submit`

可用的发布命令：
- `npm run submit` - 发布到 Firefox 和 Edge
- `npm run submit:firefox` - 仅发布到 Firefox
- `npm run submit:edge` - 仅发布到 Edge

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
4. **商店审核**：提交到商店后，扩展需要经过人工审核才会上架
5. **凭据安全**：`.env.submit` 包含敏感凭据，已添加到 `.gitignore`，切勿提交
6. **Edge API Key 过期**：API Key 每 72 天过期，需要定期在 Partner Center 重新生成并更新 GitHub Secret
