# CloudBase Run 部署说明

这个项目适合部署到 CloudBase Run（云托管），不建议用静态托管。

## 推荐方式

优先使用 CloudBase Run 的 GitHub / Dockerfile 部署能力。

本项目已经提供：

- `next.config.ts` 中的 `output: "standalone"`
- 生产可用的 `Dockerfile`

## 运行端口

容器监听端口：`3000`

## 必填环境变量

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

如果 CloudBase 需要额外设置：

- `NODE_ENV=production`
- `PORT=3000`

## 本地自测

```bash
docker build -t couple-help-community .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
  -e ADMIN_PASSWORD=your_admin_password \
  couple-help-community
```

## CloudBase 控制台建议填写

- 部署方式：GitHub / 代码仓库
- 运行方式：Dockerfile
- Dockerfile 路径：`./Dockerfile`
- 服务端口：`3000`

部署成功后，CloudBase 会分配一个默认公网访问地址，后续再决定是否绑定自定义域名。
