<div align="center">
  <img src="https://nb-data.klpbbs.com/file/tc/2025/09/10/68c0fe1a281e6_1757478426.png" alt="RailMemo Logo" height="160">
</div>

# RailMemo - 火车票生成器

一个基于 Next.js 和 Mantine UI 的现代化火车票生成工具，支持批量生成、图片导出和 PDF 打印功能。

> **声明**  
> 本项目仅用于纪念收藏，所有生成的车票 **不具备真实报销或乘车效力**。

## 项目背景

随着铁路全面推行 **电子发票**，自 2025 年 10 月 1 日起，纸质报销凭证将正式退出历史舞台。  
对于许多喜欢收藏车票、把它们当作旅行纪念的人来说，这无疑是一个遗憾 —— 我们将失去一种独特的"旅行印记"。  

**RailMemo** 的诞生，正是为了解决这个遗憾：  
- 它让用户依然能够 **自定义生成纪念版火车票**；  
- 除了个人收藏外，还可以作为 **旅行纪念册、礼物** 的一部分。  

本项目的目标不是替代真实车票，而是帮助人们在无纸化时代，依然能保留那份 **乘车的仪式感与回忆**。

## 功能特性

- **火车票生成**：填写车票信息，一键生成逼真的火车票
- **批量处理**：支持生成多张车票，建立候补列表
- **图片导出**：单张PNG直接下载，多张自动打包ZIP
- **PDF导出**：智能排版，A4纸张批量打印
- **现代UI**：基于Mantine组件库，界面美观易用
- **响应式设计**：支持桌面端和移动端访问
- **原创设计**：复兴号票面背景为原创

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI组件库**：Mantine 7.x
- **样式方案**：CSS Modules + Mantine主题
- **图片处理**：html2canvas
- **PDF生成**：jsPDF
- **文件打包**：JSZip
- **开发语言**：TypeScript
- **包管理器**：npm/pnpm

## 安装与运行

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 pnpm 包管理器

### 快速开始

1. **克隆项目**
```bash
git clone <repository-url>
cd RailMemo
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
pnpm dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3001](http://localhost:3001)

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 导出静态文件
npm run export
```

## 使用说明

### 基本操作

1. **填写车票信息**
   - 车次号码
   - 出发站/到达站
   - 出发时间/到达时间
   - 座位信息
   - 乘客姓名
   - 身份证号
   - 票价信息

2. **生成车票**
   - 点击"生成车票"按钮
   - 车票将添加到候补列表
   - 可重复操作生成多张车票

3. **导出功能**
   - **导出图片**：单张PNG或多张ZIP包
   - **导出PDF**：A4纸张智能排版，适合打印

### 高级功能

- **批量生成**：修改信息后重复点击生成，建立车票队列
- **实时预览**：所见即所得的车票预览效果
- **智能排版**：PDF导出时自动计算最佳排版方案

## 项目结构

```
RailMemo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局组件
│   │   └── page.tsx         # 首页组件
│   ├── components/          # React组件
│   │   ├── ActionButtons.tsx    # 操作按钮组件
│   │   ├── FooterSocial.tsx     # 页脚组件
│   │   ├── TicketForm.tsx       # 车票表单组件
│   │   └── TicketPreview.tsx    # 车票预览组件
│   ├── lib/                 # 工具库
│   │   └── templateProcessor.ts # 模板处理器
│   └── types/               # TypeScript类型定义
│       └── ticket.ts        # 车票数据类型
├── public/                  # 静态资源
│   ├── background.png       # 车票背景图
│   ├── qrcode.png          # 二维码图片
│   └── ticket_template.html # 车票HTML模板
├── package.json             # 项目配置
├── next.config.js          # Next.js配置
├── tsconfig.json           # TypeScript配置
└── README.md               # 项目文档
```

## 自定义配置

### 修改车票模板

车票模板位于 `public/ticket_template.html`，可以根据需要修改：
- 调整布局样式
- 修改字体和颜色
- 添加新的字段
- 更换背景图片

### 主题定制

项目使用 Mantine 主题系统，可在 `src/app/layout.tsx` 中自定义：
- 主色调配置
- 组件默认属性
- 响应式断点
- 字体配置

## 开发指南

### 添加新功能

1. **新增表单字段**
   - 在 `src/types/ticket.ts` 中添加类型定义
   - 在 `TicketForm.tsx` 中添加表单控件
   - 在模板中添加对应的显示位置

2. **自定义导出格式**
   - 修改 `ActionButtons.tsx` 中的导出逻辑
   - 调整 `html2canvas` 或 `jsPDF` 的配置参数

### 调试技巧

- 使用浏览器开发者工具查看生成的HTML结构
- 检查控制台输出的错误信息
- 使用 Next.js 的 Fast Refresh 功能快速预览修改

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 支持与反馈

如果您在使用过程中遇到问题或有改进建议，请：
- 提交 [GitHub Issue](../../issues)
- 发送邮件至开发者
- 参与项目讨论

---

**RailMemo** - 让火车票生成变得简单高效！