import React, { useState, useMemo } from 'react';
import { Input, Checkbox, List, Avatar, Empty, Spin, Tag, Space, Card } from 'antd';
import { UserOutlined, SearchOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { SearchType, SearchCondition, SearchResult, Employee, OrgNode, Group, Role } from '../types';
import { advancedSearch, getAllEmployees } from '../utils/orgUtils';
import './TabContent.css';

const { Search } = Input;

interface AdvancedSearchTabProps {
  orgData: OrgNode[];
  groups: Group[];
  roles: Role[];
  selectedIds: string[];
  onSelect: (employeeId: string) => void;
  multiple: boolean;
  loading?: boolean;
}

const AdvancedSearchTab: React.FC<AdvancedSearchTabProps> = ({
  orgData,
  groups,
  roles,
  selectedIds,
  onSelect,
  multiple,
  loading = false
}) => {
  const [searchCondition, setSearchCondition] = useState<SearchCondition>({
    keyword: '',
    searchTypes: ['all']
  });

  // 获取所有员工
  const allEmployees = useMemo(() => {
    return getAllEmployees(orgData);
  }, [orgData]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchCondition.keyword.trim()) return [];
    return advancedSearch(searchCondition, orgData, groups, roles, allEmployees);
  }, [searchCondition, orgData, groups, roles, allEmployees]);

  const handleSearch = (keyword: string) => {
    setSearchCondition(prev => ({ ...prev, keyword }));
  };

  const handleSearchTypeChange = (searchType: SearchType, checked: boolean) => {
    setSearchCondition(prev => {
      if (searchType === 'all') {
        return { ...prev, searchTypes: checked ? ['all'] : [] };
      }
      
      const newTypes = checked 
        ? [...prev.searchTypes.filter(t => t !== 'all'), searchType]
        : prev.searchTypes.filter(t => t !== searchType);
      
      return { ...prev, searchTypes: newTypes.length > 0 ? newTypes : ['all'] };
    });
  };

  const handleSelect = (employeeId: string) => {
    onSelect(employeeId);
  };

  const renderSearchResult = (result: SearchResult) => {
    const isSelected = selectedIds.includes(result.node.id);
    const node = result.node;
    
    let icon, title, subtitle, typeColor;
    
    switch (result.type) {
      case 'employee':
        const employee = node as Employee;
        icon = <UserOutlined />;
        title = employee.name;
        subtitle = `${employee.position}${employee.department ? ` · ${employee.department}` : ''}`;
        typeColor = 'blue';
        break;
      case 'department':
        const department = node as OrgNode;
        icon = <TeamOutlined />;
        title = department.name;
        subtitle = result.path.join(' > ');
        typeColor = 'green';
        break;
      case 'group':
        const group = node as Group;
        icon = <TeamOutlined />;
        title = group.name;
        subtitle = group.description || result.path.join(' > ');
        typeColor = 'orange';
        break;
      case 'role':
        const role = node as Role;
        icon = <SafetyCertificateOutlined />;
        title = role.name;
        subtitle = role.description || result.path.join(' > ');
        typeColor = 'purple';
        break;
    }

    return (
      <List.Item
        className={`search-result-item ${isSelected ? 'selected' : ''}`}
        onClick={() => result.type === 'employee' && handleSelect(node.id)}
      >
        <div className="search-result-content">
          <Avatar 
            size="large" 
            src={'avatar' in node ? node.avatar : undefined}
            icon={icon}
            className="result-avatar"
          />
          <div className="result-info">
            <div className="result-title">
              {title}
              <Tag color={typeColor} className="result-type">
                {result.type === 'employee' ? '员工' : 
                 result.type === 'department' ? '部门' :
                 result.type === 'group' ? '群组' : '角色'}
              </Tag>
            </div>
            <div className="result-subtitle">{subtitle}</div>
            {result.path.length > 1 && (
              <div className="result-path">{result.path.join(' > ')}</div>
            )}
          </div>
          {isSelected && result.type === 'employee' && (
            <div className="result-selected-indicator">✓</div>
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
    <div className="tab-content advanced-search-tab">
      <div className="search-config">
        <Card title="搜索配置" size="small" className="search-config-card">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Search
                placeholder="输入关键字进行搜索"
                allowClear
                onSearch={handleSearch}
                onChange={(e) => setSearchCondition(prev => ({ ...prev, keyword: e.target.value }))}
                prefix={<SearchOutlined />}
                className="advanced-search-input"
              />
            </div>
            
            <div className="search-types">
              <div className="search-types-label">搜索范围：</div>
              <Space wrap>
                <Checkbox
                  checked={searchCondition.searchTypes.includes('all')}
                  onChange={(e) => handleSearchTypeChange('all', e.target.checked)}
                >
                  全部
                </Checkbox>
                <Checkbox
                  checked={searchCondition.searchTypes.includes('employee')}
                  onChange={(e) => handleSearchTypeChange('employee', e.target.checked)}
                >
                  员工
                </Checkbox>
                <Checkbox
                  checked={searchCondition.searchTypes.includes('department')}
                  onChange={(e) => handleSearchTypeChange('department', e.target.checked)}
                >
                  部门
                </Checkbox>
                <Checkbox
                  checked={searchCondition.searchTypes.includes('group')}
                  onChange={(e) => handleSearchTypeChange('group', e.target.checked)}
                >
                  群组
                </Checkbox>
                <Checkbox
                  checked={searchCondition.searchTypes.includes('role')}
                  onChange={(e) => handleSearchTypeChange('role', e.target.checked)}
                >
                  角色
                </Checkbox>
              </Space>
            </div>
          </Space>
        </Card>
      </div>

      <div className="search-results">
        <div className="results-header">
          <h4>搜索结果</h4>
          {searchCondition.keyword && (
            <span className="results-count">
              找到 {searchResults.length} 个结果
            </span>
          )}
        </div>
        
        <div className="results-body">
          {searchCondition.keyword ? (
            searchResults.length > 0 ? (
              <List
                dataSource={searchResults}
                renderItem={renderSearchResult}
                className="search-results-list"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 个结果`
                }}
              />
            ) : (
              <Empty 
                description="未找到匹配的结果"
                className="tab-empty"
              />
            )
          ) : (
            <Empty 
              description="请输入关键字开始搜索"
              className="tab-empty"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchTab; 