import React, { useState, useMemo } from 'react';
import { Tree, List, Avatar, Input, Empty, Spin, Badge } from 'antd';
import { UserOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import { Group, Employee } from '../types';
import { buildGroupTree, getGroupMembers } from '../utils/orgUtils';
import './TabContent.css';

const { Search } = Input;

interface GroupsTabProps {
  groups: Group[];
  selectedIds: string[];
  onSelect: (employeeId: string) => void;
  multiple: boolean;
  loading?: boolean;
}

const GroupsTab: React.FC<GroupsTabProps> = ({
  groups,
  selectedIds,
  onSelect,
  multiple,
  loading = false
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 构建群组树形数据
  const treeData = useMemo(() => {
    return buildGroupTree(groups).map(group => ({
      key: group.id,
      title: group.name,
      description: group.description,
      memberCount: group.members.length,
      children: group.children?.map(child => ({
        key: child.id,
        title: child.name,
        description: child.description,
        memberCount: child.members.length,
        children: child.children?.map(grandChild => ({
          key: grandChild.id,
          title: grandChild.name,
          description: grandChild.description,
          memberCount: grandChild.members.length,
        }))
      }))
    }));
  }, [groups]);

  // 获取当前群组的成员
  const currentMembers = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }
    return getGroupMembers(groups, selectedGroup);
  }, [groups, selectedGroup]);

  // 过滤成员
  const filteredMembers = useMemo(() => {
    if (!searchKeyword.trim()) return currentMembers;
    
    return currentMembers.filter(member => 
      member.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [currentMembers, searchKeyword]);

  const handleGroupSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const groupId = selectedKeys[0] as string;
      setSelectedGroup(groupId);
    }
  };

  const handleMemberSelect = (employeeId: string) => {
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
      <div className="group-tree-node">
        <TeamOutlined className="group-icon" />
        <span className="node-name">{node.title}</span>
        <Badge count={node.memberCount} size="small" className="member-count" />
      </div>
    );
  };

  const renderMemberItem = (member: Employee) => {
    const isSelected = selectedIds.includes(member.id);
    
    return (
      <List.Item
        className={`member-item ${isSelected ? 'selected' : ''}`}
        onClick={() => handleMemberSelect(member.id)}
      >
        <div className="member-item-content">
          <Avatar 
            size="large" 
            src={member.avatar} 
            icon={<UserOutlined />}
            className="member-avatar"
          />
          <div className="member-info">
            <div className="member-name">{member.name}</div>
            <div className="member-details">
              <span className="member-position">{member.position}</span>
              {member.department && (
                <span className="member-department">· {member.department}</span>
              )}
            </div>
            {member.email && (
              <div className="member-email">{member.email}</div>
            )}
          </div>
          {isSelected && (
            <div className="member-selected-indicator">✓</div>
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
    <div className="tab-content groups-tab">
      <div className="tab-layout">
        {/* 左侧群组树 */}
        <div className="tab-sidebar">
          <div className="sidebar-header">
            <h4>常用群组</h4>
          </div>
          <div className="sidebar-body">
            <Tree
              treeData={treeData}
              selectedKeys={selectedGroup ? [selectedGroup] : []}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={handleGroupSelect}
              titleRender={titleRender}
              showLine
              showIcon={false}
              className="group-tree"
            />
          </div>
        </div>

        {/* 右侧成员列表 */}
        <div className="tab-main">
          <div className="tab-header">
            <Search
              placeholder="搜索群组成员"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              className="tab-search"
            />
          </div>
          
          <div className="tab-body">
            {filteredMembers.length > 0 ? (
              <List
                dataSource={filteredMembers}
                renderItem={renderMemberItem}
                className="member-list"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 个成员`
                }}
              />
            ) : (
              <Empty 
                description={
                  !selectedGroup 
                    ? "请选择一个群组" 
                    : searchKeyword 
                      ? "未找到匹配的成员" 
                      : "该群组暂无成员"
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

export default GroupsTab; 