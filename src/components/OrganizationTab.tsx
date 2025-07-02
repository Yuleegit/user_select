import React, { useState, useMemo } from 'react';
import { Tree, List, Avatar, Input, Empty, Spin } from 'antd';
import { UserOutlined, TeamOutlined, SearchOutlined, BankOutlined, HomeOutlined } from '@ant-design/icons';
import { OrgNode, Employee } from '../types';
import { buildTree, getEmployeesByDepartment, getAllEmployees } from '../utils/orgUtils';
import './TabContent.css';

const { Search } = Input;

interface OrganizationTabProps {
  orgData: OrgNode[];
  selectedIds: string[];
  onSelect: (employeeId: string) => void;
  multiple: boolean;
  loading?: boolean;
}

const OrganizationTab: React.FC<OrganizationTabProps> = ({
  orgData,
  selectedIds,
  onSelect,
  multiple,
  loading = false
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 构建集团级数的树形数据（只到组级别）
  const treeData = useMemo(() => {
    // 模拟集团级数数据
    const groupData = [
      {
        key: 'group-1',
        title: '集团总部',
        type: 'group',
        icon: <BankOutlined />,
        children: [
          {
            key: 'company-1',
            title: '北京公司',
            type: 'company',
            icon: <HomeOutlined />,
            children: [
              {
                key: '1',
                title: '技术部',
                type: 'department',
                icon: <TeamOutlined />,
                children: [
                  {
                    key: '1-1',
                    title: '前端组',
                    type: 'team',
                    icon: <TeamOutlined />
                  },
                  {
                    key: '1-2',
                    title: '后端组',
                    type: 'team',
                    icon: <TeamOutlined />
                  },
                  {
                    key: '1-3',
                    title: '测试组',
                    type: 'team',
                    icon: <TeamOutlined />
                  }
                ]
              },
              {
                key: '2',
                title: '产品部',
                type: 'department',
                icon: <TeamOutlined />,
                children: [
                  {
                    key: '2-1',
                    title: '产品组',
                    type: 'team',
                    icon: <TeamOutlined />
                  }
                ]
              },
              {
                key: '3',
                title: '设计部',
                type: 'department',
                icon: <TeamOutlined />,
                children: [
                  {
                    key: '3-1',
                    title: 'UI组',
                    type: 'team',
                    icon: <TeamOutlined />
                  }
                ]
              }
            ]
          },
          {
            key: 'company-2',
            title: '上海公司',
            type: 'company',
            icon: <HomeOutlined />,
            children: [
              {
                key: 'sh-1',
                title: '技术部',
                type: 'department',
                icon: <TeamOutlined />,
                children: [
                  {
                    key: 'sh-1-1',
                    title: '开发组',
                    type: 'team',
                    icon: <TeamOutlined />
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    
    return groupData;
  }, []);

  // 获取当前部门的员工
  const currentEmployees = useMemo(() => {
    if (!selectedDepartment) {
      return getAllEmployees(orgData);
    }
    return getEmployeesByDepartment(orgData, selectedDepartment);
  }, [orgData, selectedDepartment]);

  // 过滤员工
  const filteredEmployees = useMemo(() => {
    if (!searchKeyword.trim()) return currentEmployees;
    
    return currentEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [currentEmployees, searchKeyword]);

  const handleDepartmentSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const departmentId = selectedKeys[0] as string;
      setSelectedDepartment(departmentId);
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    onSelect(employeeId);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  // 自定义树节点渲染
  const titleRender = (node: any) => {
    const getNodeStyle = () => {
      switch (node.type) {
        case 'group':
          return { color: '#1890ff', fontWeight: 'bold' };
        case 'company':
          return { color: '#52c41a', fontWeight: 'bold' };
        case 'department':
          return { color: '#fa8c16', fontWeight: '500' };
        case 'team':
          return { color: '#722ed1', fontWeight: '500' };
        default:
          return { color: '#262626' };
      }
    };

    return (
      <div className="org-tree-node" style={getNodeStyle()}>
        {node.icon}
        <span className="node-name">{node.title}</span>
      </div>
    );
  };

  const renderEmployeeItem = (employee: Employee) => {
    const isSelected = selectedIds.includes(employee.id);
    
    return (
      <List.Item
        className={`employee-item ${isSelected ? 'selected' : ''}`}
        onClick={() => handleEmployeeSelect(employee.id)}
      >
        <div className="employee-item-content">
          <Avatar 
            size="large" 
            src={employee.avatar} 
            icon={<UserOutlined />}
            className="employee-avatar"
          />
          <div className="employee-info">
            <div className="employee-name">{employee.name}</div>
            <div className="employee-details">
              <span className="employee-position">{employee.position}</span>
              {employee.department && (
                <span className="employee-department">· {employee.department}</span>
              )}
            </div>
            {employee.email && (
              <div className="employee-email">{employee.email}</div>
            )}
          </div>
          {isSelected && (
            <div className="employee-selected-indicator">✓</div>
          )}
        </div>
      </List.Item>
    );
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <Spin size="large" />
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div className="tab-content organization-tab">
      <div className="tab-layout">
        {/* 左侧集团级数树 */}
        <div className="tab-sidebar">
          <div className="sidebar-header">
            <h4>组织架构</h4>
          </div>
          <div className="sidebar-body">
            <Tree
              treeData={treeData}
              selectedKeys={selectedDepartment ? [selectedDepartment] : []}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={handleDepartmentSelect}
              titleRender={titleRender}
              showLine
              showIcon={false}
              className="org-tree"
            />
          </div>
        </div>

        {/* 右侧员工列表 */}
        <div className="tab-main">
          <div className="tab-header">
            <Search
              placeholder="搜索员工"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              className="tab-search"
            />
          </div>
          
          <div className="tab-body">
            {filteredEmployees.length > 0 ? (
              <List
                dataSource={filteredEmployees}
                renderItem={renderEmployeeItem}
                className="employee-list"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 个员工`
                }}
              />
            ) : (
              <Empty 
                description={searchKeyword ? "未找到匹配的员工" : "该部门暂无员工"}
                className="tab-empty"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTab; 