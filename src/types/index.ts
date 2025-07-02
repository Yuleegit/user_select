// 组织架构节点类型
export interface OrgNode {
  id: string;
  name: string;
  type: 'department' | 'employee';
  parentId?: string;
  children?: OrgNode[];
  avatar?: string;
  position?: string;
  email?: string;
  phone?: string;
}

// 群组类型
export interface Group {
  id: string;
  name: string;
  description?: string;
  members: Employee[];
  parentId?: string;
  children?: Group[];
}

// 角色类型
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  parentId?: string;
  children?: Role[];
}

// 员工类型
export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  lastActiveTime?: string;
}

// 最近联系人类型
export interface RecentContact {
  employee: Employee;
  lastContactTime: string;
  contactCount: number;
}

// 搜索类型
export type SearchType = 'all' | 'employee' | 'department' | 'position' | 'group' | 'role';

// 高级搜索条件
export interface SearchCondition {
  keyword: string;
  searchTypes: SearchType[];
  departments?: string[];
  positions?: string[];
  groups?: string[];
  roles?: string[];
}

// 组件属性类型
export interface OrgSelectorProps {
  data: OrgNode[];
  groups?: Group[];
  roles?: Role[];
  recentContacts?: RecentContact[];
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean;
  maxHeight?: number;
  width?: number | string;
}

// 搜索结果类型
export interface SearchResult {
  node: OrgNode | Employee | Group | Role;
  path: string[];
  type: 'employee' | 'department' | 'group' | 'role';
}

// Tab类型
export type TabType = 'recent' | 'organization' | 'groups' | 'roles' | 'advanced'; 