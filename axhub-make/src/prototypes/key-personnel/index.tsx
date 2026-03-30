import React, { useState } from 'react';
import { Button, Input, Table, Card, Tabs, Form, Select, DatePicker, Statistic, Row, Col, Alert, Modal, message } from 'antd';
import { UserOutlined, LockOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, EyeOutlined, NotificationOutlined, BarChartOutlined, SettingOutlined, HomeOutlined, TeamOutlined, UserAddOutlined, AlertOutlined, KeyOutlined, PieChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

// 定义人员类型接口
interface Person {
  id: string;
  name: string;
  gender: string;
  age: number;
  department: string;
  position: string;
  level: string;
  status: string;
  entryDate: string;
  lastUpdate: string;
}

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 模拟数据
const keyPersonnelData = [
  { id: '1', name: '张三', gender: '男', age: 35, department: '技术部', position: '高级工程师', level: 'A', status: '正常', entryDate: '2020-01-01', lastUpdate: '2026-03-30 10:00:00' },
  { id: '2', name: '李四', gender: '女', age: 28, department: '人力资源部', position: '招聘专员', level: 'B', status: '正常', entryDate: '2021-03-15', lastUpdate: '2026-03-29 14:30:00' },
  { id: '3', name: '王五', gender: '男', age: 42, department: '管理层', position: '部门经理', level: 'A', status: '异常', entryDate: '2018-06-01', lastUpdate: '2026-03-28 09:15:00' },
  { id: '4', name: '赵六', gender: '女', age: 31, department: '市场部', position: '市场主管', level: 'B', status: '正常', entryDate: '2019-09-10', lastUpdate: '2026-03-27 16:45:00' },
  { id: '5', name: '孙七', gender: '男', age: 29, department: '技术部', position: '工程师', level: 'C', status: '离职', entryDate: '2020-11-05', lastUpdate: '2026-03-26 11:20:00' },
];

const statusHistoryData = [
  { id: '1', personId: '1', oldStatus: '正常', newStatus: '正常', changeTime: '2026-03-30 10:00:00', operator: '系统管理员', reason: '定期更新' },
  { id: '2', personId: '3', oldStatus: '正常', newStatus: '异常', changeTime: '2026-03-28 09:15:00', operator: '部门主管', reason: '连续缺勤' },
  { id: '3', personId: '5', oldStatus: '正常', newStatus: '离职', changeTime: '2026-03-26 11:20:00', operator: '人力资源专员', reason: '个人原因' },
];

const roleData = [
  { id: '1', roleName: '系统管理员', permissions: '全部权限' },
  { id: '2', roleName: '部门主管', permissions: '管理本部门重点人员信息，查看相关统计报表' },
  { id: '3', roleName: '人力资源专员', permissions: '录入和管理重点人员信息，查看基本统计数据' },
  { id: '4', roleName: '普通用户', permissions: '查看授权范围内的重点人员信息' },
];

const departmentData = [
  { name: '技术部', value: 15 },
  { name: '人力资源部', value: 8 },
  { name: '管理层', value: 5 },
  { name: '市场部', value: 10 },
  { name: '财务部', value: 6 },
];

const levelData = [
  { name: 'A', value: 8 },
  { name: 'B', value: 15 },
  { name: 'C', value: 12 },
  { name: 'D', value: 4 },
];

const KeyPersonnelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  const handleLogin = () => {
    setActiveTab('dashboard');
  };

  const handleAddPerson = () => {
    setIsAddModalVisible(true);
  };

  const handleEditPerson = (record: any) => {
    setSelectedPerson(record);
    setIsEditModalVisible(true);
  };

  const handleStatusChange = (record: any) => {
    setSelectedPerson(record);
    setIsStatusModalVisible(true);
  };

  const handleSavePerson = () => {
    message.success('人员信息保存成功');
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleSaveStatus = () => {
    message.success('状态变更成功');
    setIsStatusModalVisible(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 登录页面 */}
      {activeTab === 'login' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>重点人员管理系统</h2>
            <Form layout="vertical">
              <Form.Item label="用户名" required>
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item label="密码" required>
                <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block onClick={handleLogin}>登录</Button>
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                <a href="#">忘记密码？</a>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* 主应用 */}
      {activeTab !== 'login' && (
        <div>
          {/* 导航栏 */}
          <div style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1890ff' }}>重点人员管理系统</h1>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span>欢迎，管理员</span>
                <Button type="link">退出</Button>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div style={{ display: 'flex' }}>
            <div style={{ width: 200, background: '#fff', minHeight: 'calc(100vh - 88px)', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>主导航</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Button 
                      type={activeTab === 'dashboard' ? 'primary' : 'default'} 
                      icon={<HomeOutlined />} 
                      onClick={() => setActiveTab('dashboard')}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      首页/仪表盘
                    </Button>
                    <Button 
                      type={activeTab === 'personnel' ? 'primary' : 'default'} 
                      icon={<TeamOutlined />} 
                      onClick={() => setActiveTab('personnel')}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      重点人员列表
                    </Button>
                    <Button 
                      type={activeTab === 'permissions' ? 'primary' : 'default'} 
                      icon={<KeyOutlined />} 
                      onClick={() => setActiveTab('permissions')}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      权限管理
                    </Button>
                    <Button 
                      type={activeTab === 'statistics' ? 'primary' : 'default'} 
                      icon={<BarChartOutlined />} 
                      onClick={() => setActiveTab('statistics')}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      统计分析
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div style={{ flex: 1, padding: 24 }}>
              {/* 首页/仪表盘 */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 style={{ margin: 0, marginBottom: 24 }}>首页/仪表盘</h2>
                  
                  {/* 统计卡片 */}
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                      <Card>
                        <Statistic title="重点人员总数" value={40} prefix={<UserOutlined />} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic title="正常状态" value={35} prefix={<AlertOutlined style={{ color: 'green' }} />} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic title="异常状态" value={3} prefix={<AlertOutlined style={{ color: 'orange' }} />} />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic title="离职状态" value={2} prefix={<AlertOutlined style={{ color: 'red' }} />} />
                      </Card>
                    </Col>
                  </Row>

                  {/* 图表 */}
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <Card title="部门分布">
                        <ReactECharts
                          option={{
                            tooltip: {},
                            legend: {},
                            series: [{
                              name: '部门分布',
                              type: 'pie',
                              radius: '50%',
                              data: departmentData,
                              label: {
                                formatter: '{b}: {d}%'
                              }
                            }]
                          }}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="级别分布">
                        <ReactECharts
                          option={{
                            tooltip: {},
                            grid: {
                              left: '3%',
                              right: '4%',
                              bottom: '3%',
                              containLabel: true
                            },
                            xAxis: {
                              type: 'category',
                              data: levelData.map(item => item.name)
                            },
                            yAxis: {
                              type: 'value'
                            },
                            series: [{
                              data: levelData.map(item => item.value),
                              type: 'bar',
                              itemStyle: {
                                color: '#82ca9d'
                              }
                            }]
                          }}
                          style={{ height: 300 }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 近期状态变更 */}
                  <Card title="近期状态变更" style={{ marginBottom: 24 }}>
                    <Table dataSource={statusHistoryData} rowKey="id">
                      <Table.Column title="人员ID" dataIndex="personId" />
                      <Table.Column title="旧状态" dataIndex="oldStatus" />
                      <Table.Column title="新状态" dataIndex="newStatus" />
                      <Table.Column title="变更时间" dataIndex="changeTime" />
                      <Table.Column title="操作人" dataIndex="operator" />
                      <Table.Column title="变更原因" dataIndex="reason" />
                    </Table>
                  </Card>

                  {/* 快速操作 */}
                  <Card title="快速操作">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Button type="primary" icon={<UserAddOutlined />} block>
                          添加重点人员
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button icon={<ExportOutlined />} block>
                          导出人员信息
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button icon={<NotificationOutlined />} block>
                          查看预警通知
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button icon={<SettingOutlined />} block>
                          系统设置
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </div>
              )}

              {/* 重点人员列表 */}
              {activeTab === 'personnel' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ margin: 0 }}>重点人员列表</h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Input.Search placeholder="搜索人员" style={{ width: 200 }} />
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPerson}>
                        添加人员
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <Table dataSource={keyPersonnelData} rowKey="id">
                      <Table.Column title="ID" dataIndex="id" />
                      <Table.Column title="姓名" dataIndex="name" />
                      <Table.Column title="性别" dataIndex="gender" />
                      <Table.Column title="年龄" dataIndex="age" />
                      <Table.Column title="部门" dataIndex="department" />
                      <Table.Column title="职位" dataIndex="position" />
                      <Table.Column title="级别" dataIndex="level" />
                      <Table.Column title="状态" dataIndex="status" />
                      <Table.Column title="入职日期" dataIndex="entryDate" />
                      <Table.Column title="最后更新" dataIndex="lastUpdate" />
                      <Table.Column 
                        title="操作" 
                        render={(text, record) => (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button size="small" icon={<EyeOutlined />} onClick={() => handleEditPerson(record)} />
                            <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPerson(record)} />
                            <Button size="small" icon={<DeleteOutlined />} danger />
                            <Button size="small" onClick={() => handleStatusChange(record)}>
                              状态变更
                            </Button>
                          </div>
                        )}
                      />
                    </Table>
                  </Card>
                </div>
              )}

              {/* 权限管理 */}
              {activeTab === 'permissions' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ margin: 0 }}>权限管理</h2>
                    <Button type="primary" icon={<PlusOutlined />}>
                      添加角色
                    </Button>
                  </div>
                  
                  <Card>
                    <Table dataSource={roleData} rowKey="id">
                      <Table.Column title="角色ID" dataIndex="id" />
                      <Table.Column title="角色名称" dataIndex="roleName" />
                      <Table.Column title="权限" dataIndex="permissions" />
                      <Table.Column 
                        title="操作" 
                        render={() => (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button size="small" icon={<EditOutlined />} />
                            <Button size="small" icon={<DeleteOutlined />} danger />
                          </div>
                        )}
                      />
                    </Table>
                  </Card>
                </div>
              )}

              {/* 统计分析 */}
              {activeTab === 'statistics' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ margin: 0 }}>统计分析</h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <RangePicker />
                      <Button icon={<ExportOutlined />}>
                        导出报表
                      </Button>
                    </div>
                  </div>
                  
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={24}>
                      <Card title="人员状态分布">
                        <ReactECharts
                          option={{
                            tooltip: {},
                            legend: {},
                            series: [{
                              name: '人员状态',
                              type: 'pie',
                              radius: '50%',
                              data: [
                                { name: '正常', value: 35 },
                                { name: '异常', value: 3 },
                                { name: '离职', value: 2 }
                              ],
                              label: {
                                formatter: '{b}: {d}%'
                              }
                            }]
                          }}
                          style={{ height: 400 }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 添加人员模态框 */}
      <Modal
        title="添加重点人员"
        open={isAddModalVisible}
        onOk={handleSavePerson}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" required>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="性别" required>
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item label="年龄" required>
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item label="部门" required>
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="职位" required>
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item label="级别" required>
            <Select placeholder="请选择级别">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" required>
            <Select placeholder="请选择状态">
              <Option value="正常">正常</Option>
              <Option value="异常">异常</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
          <Form.Item label="入职日期" required>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑人员模态框 */}
      <Modal
        title="编辑重点人员"
        open={isEditModalVisible}
        onOk={handleSavePerson}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" required>
            <Input placeholder="请输入姓名" value={selectedPerson?.name} />
          </Form.Item>
          <Form.Item label="性别" required>
            <Select placeholder="请选择性别" value={selectedPerson?.gender}>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item label="年龄" required>
            <Input type="number" placeholder="请输入年龄" value={selectedPerson?.age} />
          </Form.Item>
          <Form.Item label="部门" required>
            <Input placeholder="请输入部门" value={selectedPerson?.department} />
          </Form.Item>
          <Form.Item label="职位" required>
            <Input placeholder="请输入职位" value={selectedPerson?.position} />
          </Form.Item>
          <Form.Item label="级别" required>
            <Select placeholder="请选择级别" value={selectedPerson?.level}>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" required>
            <Select placeholder="请选择状态" value={selectedPerson?.status}>
              <Option value="正常">正常</Option>
              <Option value="异常">异常</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
          <Form.Item label="入职日期" required>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 状态变更模态框 */}
      <Modal
        title="状态变更"
        open={isStatusModalVisible}
        onOk={handleSaveStatus}
        onCancel={() => setIsStatusModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="人员名称">
            <Input disabled value={selectedPerson?.name} />
          </Form.Item>
          <Form.Item label="当前状态">
            <Input disabled value={selectedPerson?.status} />
          </Form.Item>
          <Form.Item label="新状态" required>
            <Select placeholder="请选择新状态" value={newStatus} onChange={setNewStatus}>
              <Option value="正常">正常</Option>
              <Option value="异常">异常</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
          <Form.Item label="变更原因">
            <Input.TextArea placeholder="请输入变更原因" value={statusReason} onChange={(e) => setStatusReason(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KeyPersonnelManagement;
