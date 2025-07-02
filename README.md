# 组织架构人员选择组件

一个功能完整的组织架构人员选择组件，支持多选、搜索、树形展示等功能。

## 功能特性

- ✅ 支持组织架构树形展示
- ✅ 支持人员多选和单选
- ✅ 支持搜索功能（部门名称、人员姓名）
- ✅ 支持已选择人员展示和管理
- ✅ 支持禁用状态
- ✅ 响应式设计，支持移动端
- ✅ 现代化UI设计，基于Ant Design
- ✅ TypeScript支持，类型安全

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 使用方法

### 基本用法

```tsx
import React, { useState } from 'react';
import OrgSelector from './components/OrgSelector';
import { OrgNode } from './types';

const App: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 组织架构数据
  const orgData: OrgNode[] = [
    {
      id: '1',
      name: '技术部',
      type: 'department',
      children: [
        {
          id: '1-1',
          name: '前端组',
          type: 'department',
          parentId: '1',
          children: [
            {
              id: '1-1-1',
              name: '张三',
              type: 'employee',
              parentId: '1-1',
              position: '前端工程师',
              email: 'zhangsan@company.com',
              phone: '13800138001',
              avatar: 'https://example.com/avatar.jpg'
            }
          ]
        }
      ]
    }
  ];

  return (
    <OrgSelector
      data={orgData}
      value={selectedUsers}
      onChange={setSelectedUsers}
      multiple={true}
      placeholder="请选择人员"
      showSearch={true}
      width={500}
    />
  );
};
```

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `OrgNode[]` | - | 组织架构数据 |
| `value` | `string[]` | `[]` | 选中的用户ID数组 |
| `onChange` | `(selectedIds: string[]) => void` | - | 选择变化回调 |
| `multiple` | `boolean` | `true` | 是否支持多选 |
| `placeholder` | `string` | `'请选择人员'` | 占位符文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `showSearch` | `boolean` | `true` | 是否显示搜索框 |
| `maxHeight` | `number` | `400` | 树形组件最大高度 |
| `width` | `number \| string` | `400` | 组件宽度 |

### 数据类型

```typescript
interface OrgNode {
  id: string;                    // 唯一标识
  name: string;                  // 名称
  type: 'department' | 'employee'; // 类型：部门或员工
  parentId?: string;             // 父级ID
  children?: OrgNode[];          // 子节点
  avatar?: string;               // 头像URL
  position?: string;             // 职位
  email?: string;                // 邮箱
  phone?: string;                // 电话
}
```

## 项目结构

```
src/
├── components/
│   ├── OrgSelector.tsx      # 主组件
│   └── OrgSelector.css      # 组件样式
├── types/
│   └── index.ts             # 类型定义
├── utils/
│   └── orgUtils.ts          # 工具函数
├── App.tsx                  # 示例应用
├── App.css                  # 应用样式
├── main.tsx                 # 入口文件
└── index.css                # 全局样式
```

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **Vite** - 构建工具

## 开发说明

### 数据格式

组件支持两种数据格式：

1. **树形结构**：直接使用嵌套的children属性
2. **扁平结构**：使用parentId关联，组件会自动转换为树形结构

### 搜索功能

搜索功能支持：
- 部门名称搜索
- 人员姓名搜索
- 实时搜索，支持中文
- 搜索结果高亮显示

### 自定义样式

可以通过CSS变量或直接修改样式文件来自定义组件外观：

```css
.org-selector {
  --primary-color: #1890ff;
  --border-radius: 6px;
}
```

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 许可证

MIT License 