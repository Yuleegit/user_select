import React, { useState } from 'react';
import { Card, Space, Button, message, Divider } from 'antd';
import OrgSelector from './components/OrgSelector';
import { OrgNode, Group, Role, RecentContact, Employee } from './types';
import './App.css';

// 模拟员工数据
const mockEmployees: Employee[] = [
  {
    id: '1-1-1',
    name: '张三',
    position: '前端工程师',
    department: '技术部 > 前端组',
    email: 'zhangsan@company.com',
    phone: '13800138001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    status: 'active'
  },
  {
    id: '1-1-2',
    name: '李四',
    position: '前端工程师',
    department: '技术部 > 前端组',
    email: 'lisi@company.com',
    phone: '13800138002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    status: 'active'
  },
  {
    id: '1-1-3',
    name: '王五',
    position: '前端组长',
    department: '技术部 > 前端组',
    email: 'wangwu@company.com',
    phone: '13800138003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    status: 'active'
  },
  {
    id: '1-2-1',
    name: '赵六',
    position: '后端工程师',
    department: '技术部 > 后端组',
    email: 'zhaoliu@company.com',
    phone: '13800138004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    status: 'active'
  },
  {
    id: '1-2-2',
    name: '钱七',
    position: '后端工程师',
    department: '技术部 > 后端组',
    email: 'qianqi@company.com',
    phone: '13800138005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi',
    status: 'active'
  },
  {
    id: '1-3-1',
    name: '孙八',
    position: '测试工程师',
    department: '技术部 > 测试组',
    email: 'sunba@company.com',
    phone: '13800138006',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunba',
    status: 'active'
  },
  {
    id: '2-1-1',
    name: '周九',
    position: '产品经理',
    department: '产品部 > 产品组',
    email: 'zhoujiu@company.com',
    phone: '13800138007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoujiu',
    status: 'active'
  },
  {
    id: '2-1-2',
    name: '吴十',
    position: '产品助理',
    department: '产品部 > 产品组',
    email: 'wushi@company.com',
    phone: '13800138008',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wushi',
    status: 'active'
  },
  {
    id: '3-1-1',
    name: '郑十一',
    position: 'UI设计师',
    department: '设计部 > UI组',
    email: 'zhengshiyi@company.com',
    phone: '13800138009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengshiyi',
    status: 'active'
  }
];

// 模拟组织架构数据
const mockOrgData: OrgNode[] = [
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
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'
          },
          {
            id: '1-1-2',
            name: '李四',
            type: 'employee',
            parentId: '1-1',
            position: '前端工程师',
            email: 'lisi@company.com',
            phone: '13800138002',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi'
          },
          {
            id: '1-1-3',
            name: '王五',
            type: 'employee',
            parentId: '1-1',
            position: '前端组长',
            email: 'wangwu@company.com',
            phone: '13800138003',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu'
          }
        ]
      },
      {
        id: '1-2',
        name: '后端组',
        type: 'department',
        parentId: '1',
        children: [
          {
            id: '1-2-1',
            name: '赵六',
            type: 'employee',
            parentId: '1-2',
            position: '后端工程师',
            email: 'zhaoliu@company.com',
            phone: '13800138004',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu'
          },
          {
            id: '1-2-2',
            name: '钱七',
            type: 'employee',
            parentId: '1-2',
            position: '后端工程师',
            email: 'qianqi@company.com',
            phone: '13800138005',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi'
          }
        ]
      },
      {
        id: '1-3',
        name: '测试组',
        type: 'department',
        parentId: '1',
        children: [
          {
            id: '1-3-1',
            name: '孙八',
            type: 'employee',
            parentId: '1-3',
            position: '测试工程师',
            email: 'sunba@company.com',
            phone: '13800138006',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunba'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '产品部',
    type: 'department',
    children: [
      {
        id: '2-1',
        name: '产品组',
        type: 'department',
        parentId: '2',
        children: [
          {
            id: '2-1-1',
            name: '周九',
            type: 'employee',
            parentId: '2-1',
            position: '产品经理',
            email: 'zhoujiu@company.com',
            phone: '13800138007',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoujiu'
          },
          {
            id: '2-1-2',
            name: '吴十',
            type: 'employee',
            parentId: '2-1',
            position: '产品助理',
            email: 'wushi@company.com',
            phone: '13800138008',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wushi'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: '设计部',
    type: 'department',
    children: [
      {
        id: '3-1',
        name: 'UI组',
        type: 'department',
        parentId: '3',
        children: [
          {
            id: '3-1-1',
            name: '郑十一',
            type: 'employee',
            parentId: '3-1',
            position: 'UI设计师',
            email: 'zhengshiyi@company.com',
            phone: '13800138009',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengshiyi'
          }
        ]
      }
    ]
  }
];

// 模拟群组数据
const mockGroups: Group[] = [
  {
    id: 'g1',
    name: '技术交流群',
    description: '技术讨论和分享',
    members: [mockEmployees[0], mockEmployees[1], mockEmployees[2], mockEmployees[3]],
    children: [
      {
        id: 'g1-1',
        name: '前端技术群',
        description: '前端技术交流',
        members: [mockEmployees[0], mockEmployees[1], mockEmployees[2]],
        parentId: 'g1'
      },
      {
        id: 'g1-2',
        name: '后端技术群',
        description: '后端技术交流',
        members: [mockEmployees[3], mockEmployees[4]],
        parentId: 'g1'
      }
    ]
  },
  {
    id: 'g2',
    name: '项目管理群',
    description: '项目管理和协调',
    members: [mockEmployees[6], mockEmployees[7], mockEmployees[8]],
    children: [
      {
        id: 'g2-1',
        name: '产品设计群',
        description: '产品设计讨论',
        members: [mockEmployees[6], mockEmployees[7], mockEmployees[8]],
        parentId: 'g2'
      }
    ]
  }
];

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 'r1',
    name: '管理员',
    description: '系统管理员',
    permissions: ['user:read', 'user:write', 'system:admin'],
    children: [
      {
        id: 'r1-1',
        name: '超级管理员',
        description: '拥有所有权限',
        permissions: ['*'],
        parentId: 'r1'
      }
    ]
  },
  {
    id: 'r2',
    name: '开发者',
    description: '开发人员',
    permissions: ['code:read', 'code:write'],
    children: [
      {
        id: 'r2-1',
        name: '前端开发者',
        description: '前端开发人员',
        permissions: ['frontend:read', 'frontend:write'],
        parentId: 'r2'
      },
      {
        id: 'r2-2',
        name: '后端开发者',
        description: '后端开发人员',
        permissions: ['backend:read', 'backend:write'],
        parentId: 'r2'
      }
    ]
  },
  {
    id: 'r3',
    name: '产品经理',
    description: '产品管理',
    permissions: ['product:read', 'product:write'],
    children: [
      {
        id: 'r3-1',
        name: '高级产品经理',
        description: '高级产品管理',
        permissions: ['product:read', 'product:write', 'product:admin'],
        parentId: 'r3'
      }
    ]
  }
];

// 模拟最近联系人数据
const mockRecentContacts: RecentContact[] = [
  {
    employee: mockEmployees[0],
    lastContactTime: '2024-01-15 14:30:00',
    contactCount: 15
  },
  {
    employee: mockEmployees[1],
    lastContactTime: '2024-01-15 13:20:00',
    contactCount: 8
  },
  {
    employee: mockEmployees[2],
    lastContactTime: '2024-01-15 12:15:00',
    contactCount: 12
  },
  {
    employee: mockEmployees[6],
    lastContactTime: '2024-01-15 11:45:00',
    contactCount: 6
  },
  {
    employee: mockEmployees[8],
    lastContactTime: '2024-01-15 10:30:00',
    contactCount: 3
  }
];

const App: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [singleSelectedUser, setSingleSelectedUser] = useState<string[]>([]);

  const handleMultiSelect = (userIds: string[]) => {
    setSelectedUsers(userIds);
    message.success(`已选择 ${userIds.length} 个用户`);
  };

  const handleSingleSelect = (userIds: string[]) => {
    setSingleSelectedUser(userIds);
    if (userIds.length > 0) {
      message.success(`已选择用户: ${userIds[0]}`);
    }
  };

  const handleClear = () => {
    setSelectedUsers([]);
    setSingleSelectedUser([]);
    message.info('已清空选择');
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>组织架构人员选择组件</h1>
        <p>支持多选、搜索、树形展示等功能</p>
      </div>

      <div className="app-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 多选示例 */}
          <Card title="多选模式" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>当前选择:</strong> {selectedUsers.length > 0 ? selectedUsers.join(', ') : '无'}
              </div>
              <OrgSelector
                data={mockOrgData}
                groups={mockGroups}
                roles={mockRoles}
                recentContacts={mockRecentContacts}
                value={selectedUsers}
                onChange={handleMultiSelect}
                multiple={true}
                placeholder="请选择多个人员"
                showSearch={true}
                width={500}
              />
            </Space>
          </Card>

          <Divider />

          {/* 单选示例 */}
          <Card title="单选模式" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>当前选择:</strong> {singleSelectedUser.length > 0 ? singleSelectedUser[0] : '无'}
              </div>
              <OrgSelector
                data={mockOrgData}
                groups={mockGroups}
                roles={mockRoles}
                recentContacts={mockRecentContacts}
                value={singleSelectedUser}
                onChange={handleSingleSelect}
                multiple={false}
                placeholder="请选择单个人员"
                showSearch={true}
                width={500}
              />
            </Space>
          </Card>

          <Divider />

          {/* 禁用状态示例 */}
          <Card title="禁用状态" size="small">
            <OrgSelector
              data={mockOrgData}
              groups={mockGroups}
              roles={mockRoles}
              recentContacts={mockRecentContacts}
              value={['1-1-1']}
              onChange={() => {}}
              multiple={true}
              placeholder="禁用状态"
              disabled={true}
              width={500}
            />
          </Card>

          <Divider />

          {/* 操作按钮 */}
          <Card title="操作" size="small">
            <Space>
              <Button type="primary" onClick={() => message.info('组件功能演示')}>
                查看功能说明
              </Button>
              <Button onClick={handleClear}>
                清空所有选择
              </Button>
            </Space>
          </Card>

          {/* 功能说明 */}
          <Card title="功能特性" size="small">
            <ul>
              <li>✅ 支持组织架构树形展示</li>
              <li>✅ 支持人员多选和单选</li>
              <li>✅ 支持搜索功能（部门名称、人员姓名）</li>
              <li>✅ 支持已选择人员展示和管理</li>
              <li>✅ 支持禁用状态</li>
              <li>✅ 响应式设计，支持移动端</li>
              <li>✅ 现代化UI设计，基于Ant Design</li>
              <li>✅ TypeScript支持，类型安全</li>
              <li>✅ 最近联系人展示</li>
              <li>✅ 常用群组管理</li>
              <li>✅ 系统角色管理</li>
              <li>✅ 高级搜索功能</li>
            </ul>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default App; 