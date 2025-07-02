import React, { useState, useMemo } from 'react';
import { Tree, List, Avatar, Input, Empty, Spin, Tag } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, SearchOutlined } from '@ant-design/icons';
import { Role, Employee } from '../types';
import { buildRoleTree, getEmployeesByRole, getAllEmployees } from '../utils/orgUtils';
import './TabContent.css';

const { Search } = Input;

interface RolesTabProps {
  roles: Role[];
  orgData: any[];
  selectedIds: string[];
  onSelect: (employeeId: string) => void;
  multiple: boolean;
  loading?: boolean;
}

const RolesTab: React.FC<RolesTabProps> = ({
  roles,
  orgData,
  selectedIds,
  onSelect,
  multiple,
  loading = false
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 构建角色树形数据
  const treeData = useMemo(() => {
    return buildRoleTree(roles).map(role => ({
      key: role.id,
      title: role.name,
      description: role.description,
      permissions: role.permissions,
      children: role.children?.map(child => ({
        key: child.id,
        title: child.name,
        description: child.description,
        permissions: child.permissions,
        children: child.children?.map(grandChild => ({
          key: grandChild.id,
          title: grandChild.name,
          description: grandChild.description,
          permissions: grandChild.permissions,
        }))
      }))
    }));
  }, [roles]);

  // 获取所有员工
  const allEmployees = useMemo(() => {
    return getAllEmployees(orgData);
  }, [orgData]);

  // 获取当前角色的员工
  const currentEmployees = useMemo(() => {
    if (!selectedRole) {
      return [];
    }
    return getEmployeesByRole(roles, selectedRole, allEmployees);
  }, [roles, selectedRole, allEmployees]);

  // 过滤员工
  const filteredEmployees = useMemo(() => {
    if (!searchKeyword.trim()) return currentEmployees;
    
    return currentEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [currentEmployees, searchKeyword]);

  const handleRoleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const roleId = selectedKeys[0] as string;
      setSelectedRole(roleId);
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
    return (
      <div className="role-tree-node">
        <SafetyCertificateOutlined className="role-icon" />
        <span className="node-name">{node.title}</span>
        {node.permissions && node.permissions.length > 0 && (
          <Tag color="blue">{node.permissions.length} 权限</Tag>
        )}
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
    <div className="tab-content roles-tab">
      <div className="tab-layout">
        {/* 左侧角色树 */}
        <div className="tab-sidebar">
          <div className="sidebar-header">
            <h4>系统角色</h4>
          </div>
          <div className="sidebar-body">
            <Tree
              treeData={treeData}
              selectedKeys={selectedRole ? [selectedRole] : []}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={handleRoleSelect}
              titleRender={titleRender}
              showLine
              showIcon={false}
              className="role-tree"
            />
          </div>
        </div>

        {/* 右侧员工列表 */}
        <div className="tab-main">
          <div className="tab-header">
            <Search
              placeholder="搜索角色下的员工"
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
                description={
                  !selectedRole 
                    ? "请选择一个角色" 
                    : searchKeyword 
                      ? "未找到匹配的员工" 
                      : "该角色下暂无员工"
                }
                className="tab-empty"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesTab; 