import React, { useState, useMemo } from 'react';
import { List, Avatar, Input, Empty, Spin, Row, Col, Card } from 'antd';
import { UserOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Employee, RecentContact } from '../types';
import { getRecentContacts } from '../utils/orgUtils';
import './TabContent.css';

const { Search } = Input;

interface RecentTabProps {
  recentContacts: RecentContact[];
  selectedIds: string[];
  onSelect: (employeeId: string) => void;
  multiple: boolean;
  loading?: boolean;
}

const RecentTab: React.FC<RecentTabProps> = ({
  recentContacts,
  selectedIds,
  onSelect,
  multiple,
  loading = false
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  // 过滤最近联系人
  const filteredContacts = useMemo(() => {
    const contacts = getRecentContacts(recentContacts);
    if (!searchKeyword.trim()) return contacts;
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      contact.position?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      contact.department?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [recentContacts, searchKeyword]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleSelect = (employeeId: string) => {
    onSelect(employeeId);
  };

  const renderContactCard = (contact: Employee) => {
    const isSelected = selectedIds.includes(contact.id);
    
    return (
      <Col xs={24} sm={12} md={8} key={contact.id}>
        <Card
          className={`contact-card ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSelect(contact.id)}
          hoverable
          size="small"
        >
          <div className="contact-card-content">
            <Avatar 
              size="large" 
              src={contact.avatar} 
              icon={<UserOutlined />}
              className="contact-avatar"
            />
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-details">
                <span className="contact-position">{contact.position}</span>
                {contact.department && (
                  <span className="contact-department">· {contact.department}</span>
                )}
              </div>
              <div className="contact-meta">
                <ClockCircleOutlined className="contact-time-icon" />
                <span className="contact-time">
                  {recentContacts.find(rc => rc.employee.id === contact.id)?.lastContactTime || ''}
                </span>
              </div>
            </div>
            {isSelected && (
              <div className="contact-selected-indicator">✓</div>
            )}
          </div>
        </Card>
      </Col>
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
    <div className="tab-content">
      <div className="tab-header">
        <Search
          placeholder="搜索最近联系人"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => setSearchKeyword(e.target.value)}
          prefix={<SearchOutlined />}
          className="tab-search"
        />
      </div>
      
      <div className="tab-body">
        {filteredContacts.length > 0 ? (
          <div className="contact-grid">
            <Row gutter={[16, 16]}>
              {filteredContacts.map(renderContactCard)}
            </Row>
          </div>
        ) : (
          <Empty 
            description={searchKeyword ? "未找到匹配的联系人" : "暂无最近联系人"}
            className="tab-empty"
          />
        )}
      </div>
    </div>
  );
};

export default RecentTab; 