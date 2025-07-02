import { OrgNode, SearchResult, Employee, Group, Role, RecentContact, SearchCondition, SearchType } from '../types';

// 将扁平数据转换为树形结构
export const buildTree = (nodes: OrgNode[]): OrgNode[] => {
  const nodeMap = new Map<string, OrgNode>();
  const roots: OrgNode[] = [];

  // 创建节点映射
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // 构建树形结构
  nodes.forEach(node => {
    const treeNode = nodeMap.get(node.id)!;
    if (node.parentId && nodeMap.has(node.parentId)) {
      const parent = nodeMap.get(node.parentId)!;
      parent.children!.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  });

  return roots;
};

// 构建群组树
export const buildGroupTree = (groups: Group[]): Group[] => {
  const groupMap = new Map<string, Group>();
  const roots: Group[] = [];

  groups.forEach(group => {
    groupMap.set(group.id, { ...group, children: [] });
  });

  groups.forEach(group => {
    const treeGroup = groupMap.get(group.id)!;
    if (group.parentId && groupMap.has(group.parentId)) {
      const parent = groupMap.get(group.parentId)!;
      parent.children!.push(treeGroup);
    } else {
      roots.push(treeGroup);
    }
  });

  return roots;
};

// 构建角色树
export const buildRoleTree = (roles: Role[]): Role[] => {
  const roleMap = new Map<string, Role>();
  const roots: Role[] = [];

  roles.forEach(role => {
    roleMap.set(role.id, { ...role, children: [] });
  });

  roles.forEach(role => {
    const treeRole = roleMap.get(role.id)!;
    if (role.parentId && roleMap.has(role.parentId)) {
      const parent = roleMap.get(role.parentId)!;
      parent.children!.push(treeRole);
    } else {
      roots.push(treeRole);
    }
  });

  return roots;
};

// 搜索节点
export const searchNodes = (
  nodes: OrgNode[],
  keyword: string,
  path: string[] = []
): SearchResult[] => {
  const results: SearchResult[] = [];

  const searchInNode = (node: OrgNode, currentPath: string[]) => {
    const newPath = [...currentPath, node.name];
    
    // 检查当前节点是否匹配
    if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
      results.push({
        node,
        path: newPath,
        type: node.type === 'employee' ? 'employee' : 'department'
      });
    }

    // 递归搜索子节点
    if (node.children) {
      node.children.forEach(child => searchInNode(child, newPath));
    }
  };

  nodes.forEach(node => searchInNode(node, path));
  return results;
};

// 搜索群组
export const searchGroups = (
  groups: Group[],
  keyword: string,
  path: string[] = []
): SearchResult[] => {
  const results: SearchResult[] = [];

  const searchInGroup = (group: Group, currentPath: string[]) => {
    const newPath = [...currentPath, group.name];
    
    if (group.name.toLowerCase().includes(keyword.toLowerCase())) {
      results.push({
        node: group,
        path: newPath,
        type: 'group'
      });
    }

    if (group.children) {
      group.children.forEach(child => searchInGroup(child, newPath));
    }
  };

  groups.forEach(group => searchInGroup(group, path));
  return results;
};

// 搜索角色
export const searchRoles = (
  roles: Role[],
  keyword: string,
  path: string[] = []
): SearchResult[] => {
  const results: SearchResult[] = [];

  const searchInRole = (role: Role, currentPath: string[]) => {
    const newPath = [...currentPath, role.name];
    
    if (role.name.toLowerCase().includes(keyword.toLowerCase())) {
      results.push({
        node: role,
        path: newPath,
        type: 'role'
      });
    }

    if (role.children) {
      role.children.forEach(child => searchInRole(child, newPath));
    }
  };

  roles.forEach(role => searchInRole(role, path));
  return results;
};

// 高级搜索
export const advancedSearch = (
  condition: SearchCondition,
  orgData: OrgNode[],
  groups: Group[],
  roles: Role[],
  employees: Employee[]
): SearchResult[] => {
  const results: SearchResult[] = [];
  const keyword = condition.keyword.toLowerCase();

  // 搜索员工
  if (condition.searchTypes.includes('employee') || condition.searchTypes.includes('all')) {
    employees.forEach(employee => {
      if (employee.name.toLowerCase().includes(keyword) ||
          employee.position?.toLowerCase().includes(keyword) ||
          employee.email?.toLowerCase().includes(keyword)) {
        results.push({
          node: employee,
          path: [employee.department || '', employee.name],
          type: 'employee'
        });
      }
    });
  }

  // 搜索部门
  if (condition.searchTypes.includes('department') || condition.searchTypes.includes('all')) {
    const orgResults = searchNodes(orgData, condition.keyword);
    results.push(...orgResults.filter(r => r.type === 'department'));
  }

  // 搜索群组
  if (condition.searchTypes.includes('group') || condition.searchTypes.includes('all')) {
    const groupResults = searchGroups(groups, condition.keyword);
    results.push(...groupResults);
  }

  // 搜索角色
  if (condition.searchTypes.includes('role') || condition.searchTypes.includes('all')) {
    const roleResults = searchRoles(roles, condition.keyword);
    results.push(...roleResults);
  }

  return results;
};

// 获取节点的完整路径
export const getNodePath = (nodes: OrgNode[], targetId: string): string[] => {
  const findPath = (nodeList: OrgNode[], target: string, path: string[] = []): string[] | null => {
    for (const node of nodeList) {
      const currentPath = [...path, node.name];
      
      if (node.id === target) {
        return currentPath;
      }
      
      if (node.children) {
        const result = findPath(node.children, target, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  return findPath(nodes, targetId) || [];
};

// 获取所有员工节点
export const getAllEmployees = (nodes: OrgNode[]): Employee[] => {
  const employees: Employee[] = [];

  const collectEmployees = (nodeList: OrgNode[]) => {
    nodeList.forEach(node => {
      if (node.type === 'employee') {
        employees.push({
          id: node.id,
          name: node.name,
          avatar: node.avatar,
          position: node.position,
          department: getNodePath(nodes, node.id).slice(0, -1).join(' > '),
          email: node.email,
          phone: node.phone,
          status: 'active'
        });
      }
      if (node.children) {
        collectEmployees(node.children);
      }
    });
  };

  collectEmployees(nodes);
  return employees;
};

// 获取部门下的所有员工
export const getEmployeesByDepartment = (nodes: OrgNode[], departmentId: string): Employee[] => {
  const employees: Employee[] = [];

  const findDepartment = (nodeList: OrgNode[]): OrgNode | null => {
    for (const node of nodeList) {
      if (node.id === departmentId) {
        return node;
      }
      if (node.children) {
        const found = findDepartment(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const department = findDepartment(nodes);
  if (department) {
    const collectEmployees = (node: OrgNode) => {
      if (node.type === 'employee') {
        employees.push({
          id: node.id,
          name: node.name,
          avatar: node.avatar,
          position: node.position,
          department: getNodePath(nodes, node.id).slice(0, -1).join(' > '),
          email: node.email,
          phone: node.phone,
          status: 'active'
        });
      }
      if (node.children) {
        node.children.forEach(collectEmployees);
      }
    };
    collectEmployees(department);
  }

  return employees;
};

// 获取群组成员
export const getGroupMembers = (groups: Group[], groupId: string): Employee[] => {
  const findGroup = (groupList: Group[]): Group | null => {
    for (const group of groupList) {
      if (group.id === groupId) {
        return group;
      }
      if (group.children) {
        const found = findGroup(group.children);
        if (found) return found;
      }
    }
    return null;
  };

  const group = findGroup(groups);
  return group ? group.members : [];
};

// 获取角色下的员工
export const getEmployeesByRole = (roles: Role[], roleId: string, allEmployees: Employee[]): Employee[] => {
  // 这里需要根据实际业务逻辑来实现
  // 假设角色和员工是多对多关系，需要额外的映射表
  return allEmployees.filter(emp => emp.id.includes(roleId)); // 简化实现
};

// 检查节点是否被选中
export const isNodeSelected = (nodeId: string, selectedIds: string[]): boolean => {
  return selectedIds.includes(nodeId);
};

// 获取选中节点的详细信息
export const getSelectedNodes = (nodes: OrgNode[], selectedIds: string[]): OrgNode[] => {
  const selectedNodes: OrgNode[] = [];

  const findNode = (nodeList: OrgNode[]) => {
    nodeList.forEach(node => {
      if (selectedIds.includes(node.id)) {
        selectedNodes.push(node);
      }
      if (node.children) {
        findNode(node.children);
      }
    });
  };

  findNode(nodes);
  return selectedNodes;
};

// 获取最近联系人
export const getRecentContacts = (recentContacts: RecentContact[]): Employee[] => {
  return recentContacts
    .sort((a, b) => new Date(b.lastContactTime).getTime() - new Date(a.lastContactTime).getTime())
    .map(contact => contact.employee);
}; 