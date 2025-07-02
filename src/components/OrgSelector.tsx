import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, Tag, Button, Modal, Avatar, Space, Divider, Empty, Row, Col, Card } from 'antd';
import { UserOutlined, CloseOutlined } from '@ant-design/icons';
import { OrgSelectorProps, TabType, Employee } from '../types';
import { getSelectedNodes, getAllEmployees } from '../utils/orgUtils';
import RecentTab from './RecentTab';
import OrganizationTab from './OrganizationTab';
import GroupsTab from './GroupsTab';
import RolesTab from './RolesTab';
import AdvancedSearchTab from './AdvancedSearchTab';
import './OrgSelector.css';

const OrgSelector: React.FC<OrgSelectorProps> = ({
  data,
  groups = [],
  roles = [],
  recentContacts = [],
  value = [],
  onChange,
  multiple = true,
  placeholder = '请选择人员',
  disabled = false,
  showSearch = true,
  maxHeight = 400,
  width = 400
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  // 选中的节点详情
  const selectedNodes = useMemo(() => {
    return getSelectedNodes(data, value);
  }, [data, value]);

  // 处理选择变化
  const handleSelect = useCallback((employeeId: string) => {
    if (!multiple) {
      onChange?.([employeeId]);
      setVisible(false);
    } else {
      const newValue = value.includes(employeeId)
        ? value.filter(id => id !== employeeId)
        : [...value, employeeId];
      onChange?.(newValue);
    }
  }, [multiple, onChange, value]);

  // 移除选中项
  const handleRemove = (nodeId: string) => {
    const newValue = value.filter(id => id !== nodeId);
    onChange?.(newValue);
  };

  // 清空所有选中项
  const handleClear = () => {
    onChange?.([]);
  };

  // Tab配置
  const tabItems = [
    {
      key: 'recent',
      label: '最近',
      children: (
        <RecentTab
          recentContacts={recentContacts}
          selectedIds={value}
          onSelect={handleSelect}
          multiple={multiple}
        />
      )
    },
    {
      key: 'organization',
      label: '组织架构',
      children: (
        <OrganizationTab
          orgData={data}
          selectedIds={value}
          onSelect={handleSelect}
          multiple={multiple}
        />
      )
    },
    {
      key: 'groups',
      label: '常用群组',
      children: (
        <GroupsTab
          groups={groups}
          selectedIds={value}
          onSelect={handleSelect}
          multiple={multiple}
        />
      )
    },
    {
      key: 'roles',
      label: '系统角色',
      children: (
        <RolesTab
          roles={roles}
          orgData={data}
          selectedIds={value}
          onSelect={handleSelect}
          multiple={multiple}
        />
      )
    },
    {
      key: 'advanced',
      label: '高级搜索',
      children: (
        <AdvancedSearchTab
          orgData={data}
          groups={groups}
          roles={roles}
          selectedIds={value}
          onSelect={handleSelect}
          multiple={multiple}
        />
      )
    }
  ];

  const renderSelectedItem = (node: any) => {
    return (
      <Col xs={12} sm={8} md={6} lg={6} key={node.id}>
        <Card
          className="selected-item-card"
          size="small"
          hoverable
        >
          <div className="selected-item-content">
            <Avatar size="small" src={node.avatar} icon={<UserOutlined />} />
            <div className="selected-item-info">
              <div className="selected-item-name">{node.name}</div>
              {node.position && (
                <div className="selected-item-position">{node.position}</div>
              )}
            </div>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(node.id);
              }}
              className="remove-button"
            />
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div className="org-selector" style={{ width }}>
      {/* 触发器 */}
      <div 
        className={`org-selector-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setVisible(true)}
      >
        {selectedNodes.length > 0 ? (
          <div className="selected-tags">
            {selectedNodes.slice(0, 3).map(node => (
              <Tag 
                key={node.id}
                closable={!disabled}
                onClose={(e) => {
                  e.stopPropagation();
                  handleRemove(node.id);
                }}
              >
                <Avatar size="small" src={node.avatar} icon={<UserOutlined />} />
                {node.name}
              </Tag>
            ))}
            {selectedNodes.length > 3 && (
              <Tag>+{selectedNodes.length - 3}</Tag>
            )}
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
      </div>

      {/* 选择弹窗 */}
      <Modal
        title="选择人员"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="clear" onClick={handleClear}>
            清空
          </Button>,
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => setVisible(false)}
          >
            确定
          </Button>
        ]}
        width={1000}
        destroyOnClose
        style={{ top: 20 }}
      >
        <div className="org-selector-content">
          {/* Tab导航 */}
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabType)}
            items={tabItems}
            className="org-selector-tabs"
            style={{ height: 500 }}
          />

          {/* 已选择人员 */}
          {selectedNodes.length > 0 && (
            <div className="selected-section">
              <Divider orientation="left">已选择 ({selectedNodes.length})</Divider>
              <div className="selected-grid">
                <Row gutter={[8, 8]}>
                  {selectedNodes.map(renderSelectedItem)}
                </Row>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OrgSelector; 