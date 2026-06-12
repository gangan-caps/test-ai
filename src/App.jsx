import React, { useState, createContext, useContext } from 'react';
import { ConfigProvider, Input, Button, Tag, Tree, Breadcrumb, Avatar, Drawer, Form, Checkbox, Table, Modal, Select, Switch, Popconfirm, message } from 'antd';
import {
  SearchOutlined, UserOutlined, PlayCircleFilled,
  ClockCircleOutlined, CalendarOutlined, RightOutlined,
  FileTextOutlined, ArrowLeftOutlined, CheckCircleFilled,
  SoundOutlined, LogoutOutlined, LoginOutlined,
  SettingOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  LockOutlined, VideoCameraOutlined
} from '@ant-design/icons';

/* =========================================================
   Simple Navigation Context
   ========================================================= */

const NavContext = createContext({
  route: { page: 'home', id: null, query: '' },
  navigate: () => {},
});

function useNav() {
  return useContext(NavContext);
}

/* =========================================================
   Mock Data
   ========================================================= */

const videoCategories = ['全部', '合规培训', '技能培训', '入职培训', '管理培训'];

const initialVideoData = [
  { id: 1, title: '2024年度信息安全合规培训', category: '合规培训', duration: '45:30', date: '2024-03-15', desc: '本课程涵盖企业信息安全的基本原则、数据保护法规及日常操作规范，帮助员工建立安全意识。', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', videoType: 'direct', published: true, chapters: [{ title: '信息安全概述', time: '00:00' }, { title: '数据保护法规', time: '08:30' }, { title: '密码安全与操作规范', time: '18:45' }, { title: '案例分析与问答', time: '32:10' }] },
  { id: 2, title: '新员工入职引导 — 公司文化与制度', category: '入职培训', duration: '32:15', date: '2024-03-10', desc: '全面介绍公司的发展历程、核心价值观、组织架构以及日常行政制度。', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', videoUrl: '', videoType: 'mock', published: true, chapters: [{ title: '公司简介', time: '00:00' }, { title: '核心价值观', time: '06:20' }, { title: '组织架构介绍', time: '14:50' }, { title: '行政制度说明', time: '24:30' }] },
  { id: 3, title: '高效沟通技巧与团队协作', category: '技能培训', duration: '28:40', date: '2024-03-08', desc: '提升职场沟通效率的实用技巧，包含跨部门协作、会议管理和书面沟通要点。', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', videoUrl: '', videoType: 'mock', published: true, chapters: [{ title: '沟通的基本原则', time: '00:00' }, { title: '跨部门协作技巧', time: '07:15' }, { title: '高效会议管理', time: '16:40' }, { title: '书面沟通规范', time: '23:50' }] },
  { id: 4, title: '项目管理基础方法论', category: '技能培训', duration: '52:20', date: '2024-03-05', desc: '从项目启动到收尾的全流程管理方法，涵盖敏捷与瀑布两种主流框架。', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', videoUrl: '', videoType: 'mock', published: true, chapters: [{ title: '项目管理概述', time: '00:00' }, { title: '敏捷开发方法', time: '10:30' }, { title: '瀑布模型实践', time: '25:15' }, { title: '项目风险与收尾', time: '40:00' }] },
  { id: 5, title: '领导力发展与团队管理', category: '管理培训', duration: '38:55', date: '2024-02-28', desc: '面向中高层管理者的领导力课程，聚焦团队建设、目标管理和绩效辅导。', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', videoUrl: '', videoType: 'mock', published: true, chapters: [{ title: '领导力模型', time: '00:00' }, { title: '团队建设策略', time: '09:40' }, { title: '目标管理与OKR', time: '20:15' }, { title: '绩效辅导技巧', time: '30:20' }] },
  { id: 6, title: '财务报销制度详解', category: '合规培训', duration: '18:30', date: '2024-02-25', desc: '详解公司财务报销流程、票据规范和常见审批问题，确保合规操作。', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', videoUrl: '', videoType: 'mock', published: true, chapters: [{ title: '报销流程概述', time: '00:00' }, { title: '票据规范', time: '05:30' }, { title: '审批流程', time: '11:20' }, { title: '常见问题解答', time: '15:40' }] },
];

const watchHistory = [
  { videoId: 1, title: '2024年度信息安全合规培训', watchedAt: '今天 14:30', progress: 75 },
  { videoId: 3, title: '高效沟通技巧与团队协作', watchedAt: '昨天 09:15', progress: 100 },
  { videoId: 5, title: '领导力发展与团队管理', watchedAt: '3天前', progress: 45 },
];

const docCategories = [
  {
    title: '公司制度', key: 'policy',
    children: [
      { title: '合规文件', key: 'compliance' },
      { title: '人事制度', key: 'hr-policy' },
    ],
  },
  {
    title: '技术规范', key: 'tech',
    children: [
      { title: '开发规范', key: 'dev-standards' },
      { title: '安全标准', key: 'security-standards' },
    ],
  },
  {
    title: '培训资料', key: 'training',
    children: [
      { title: '入职手册', key: 'onboarding' },
      { title: '安全培训', key: 'safety-training' },
    ],
  },
];

const docData = [
  { id: 1, title: '企业信息安全管理制度 v3.2', category: 'compliance', categoryName: '合规文件', summary: '本文档详细阐述了企业信息安全的管理体系，包括数据保护、网络安全、应急响应等方面的制度和规范。', date: '2024-03-12', content: { sections: [{ title: '第一章 总则', text: '为加强企业信息安全管理，保障企业信息资产安全，根据国家相关法律法规，结合公司实际情况，特制定本管理制度。本制度适用于公司全体员工及合作方人员。' }, { title: '第二章 数据保护', text: '公司数据按照敏感程度分为公开、内部、机密和绝密四个等级。所有员工应当严格遵守数据分级管理要求，未经授权不得访问、复制或传播机密及以上等级的数据。' }, { title: '第三章 网络安全', text: '公司网络实行分区分域管理，核心业务网络与办公网络物理隔离。所有接入公司网络的设备须安装统一管控的安全软件，定期进行安全扫描和漏洞修复。' }, { title: '第四章 应急响应', text: '公司建立信息安全事件应急响应机制，设立安全事件应急小组。发现安全事件后，相关人员应在30分钟内上报，应急小组在2小时内启动应急响应流程。' }] } },
  { id: 2, title: '员工考勤与请假管理规定', category: 'hr-policy', categoryName: '人事制度', summary: '明确员工日常考勤规范、各类请假流程及审批权限，确保人事管理的规范性和公平性。', date: '2024-03-01', content: { sections: [{ title: '第一章 考勤管理', text: '公司实行弹性工作制，核心工作时间为上午10:00至下午16:00。员工应通过OA系统进行打卡，每月迟到超过3次将影响绩效考核。' }, { title: '第二章 请假类型', text: '公司设立年假、病假、事假、婚假、产假等多种假期类型。各类假期的天数和使用条件详见员工手册。' }, { title: '第三章 审批流程', text: '1天以内的请假由直属上级审批；1-3天需部门负责人审批；3天以上须人力资源部审批。所有请假须提前在OA系统提交申请。' }] } },
  { id: 3, title: '前端开发技术规范手册', category: 'dev-standards', categoryName: '开发规范', summary: '涵盖前端代码风格、组件化开发、性能优化和测试覆盖等技术要求，统一团队开发标准。', date: '2024-02-28', content: { sections: [{ title: '第一章 代码风格', text: '前端项目统一使用 ESLint + Prettier 进行代码格式化，采用 TypeScript 进行类型安全开发。命名规范遵循驼峰命名法。' }, { title: '第二章 组件化开发', text: '采用 React 函数组件 + Hooks 的开发模式，公共组件统一放入 components 目录，业务组件按功能模块组织。' }, { title: '第三章 性能优化', text: '页面首屏加载时间应控制在2秒以内。采用代码分割、懒加载、图片压缩等技术手段持续优化性能指标。' }] } },
  { id: 4, title: '新员工入职培训手册', category: 'onboarding', categoryName: '入职手册', summary: '为新入职员工提供全面的入职指引，包含公司文化、组织架构、办公系统使用等内容。', date: '2024-02-20', content: { sections: [{ title: '欢迎加入', text: '欢迎加入我们的团队！本手册将帮助您快速了解公司的基本情况和日常工作环境，请在入职第一周内完成阅读。' }, { title: '办公系统', text: '公司使用统一的OA办公系统处理日常审批、考勤和沟通。请在入职当天完成系统账号的初始设置和密码修改。' }, { title: '福利待遇', text: '公司为员工提供五险一金、补充商业保险、年度体检、节日福利等完善的薪酬福利体系。详情参见员工手册。' }] } },
  { id: 5, title: '企业信息安全管理体系文档', category: 'security-standards', categoryName: '安全标准', summary: '系统介绍企业信息安全管理体系的建设要求，涵盖数据保护、网络安全和应急响应等核心领域。', date: '2024-02-15', content: { sections: [{ title: '体系概述', text: '本体系基于ISO 27001标准构建，覆盖信息安全的组织管理、技术防护和运营监控三大维度。' }, { title: '技术防护', text: '采用多层防御策略，包括网络边界防护、终端安全管控、数据加密传输和访问控制机制。' }, { title: '运营监控', text: '建立7×24小时安全运营中心，实施日志审计、威胁检测和漏洞管理，确保安全事件的及时发现和处置。' }] } },
  { id: 6, title: '差旅报销管理制度', category: 'compliance', categoryName: '合规文件', summary: '规定员工因公出差的交通、住宿和餐饮报销标准及审批流程，规范差旅费用管理。', date: '2024-02-10', content: { sections: [{ title: '出差审批', text: '所有出差须提前在OA系统提交出差申请，注明出差目的、时间和预算。跨省出差需部门总监审批。' }, { title: '报销标准', text: '交通费按实际发生额报销，住宿标准为一线城市500元/天、其他城市350元/天，餐饮补贴150元/天。' }, { title: '报销流程', text: '出差结束后5个工作日内提交报销申请，附齐发票原件。财务部在收到申请后10个工作日内完成审核。' }] } },
  { id: 7, title: '员工绩效考核管理办法', category: 'hr-policy', categoryName: '人事制度', summary: '阐述公司绩效考核的周期、维度、评分标准和结果应用，建立科学的绩效管理体系。', date: '2024-01-25', content: { sections: [{ title: '考核周期', text: '公司实行季度考核与年度考核相结合的绩效管理制度。季度考核侧重目标达成，年度考核综合评价。' }, { title: '考核维度', text: '绩效考核包括业绩目标（60%）、能力发展（20%）和价值观践行（20%）三个维度。' }, { title: '结果应用', text: '考核结果与薪酬调整、晋升发展和培训资源分配直接挂钩。连续两个季度考核为C及以下将启动绩效改进计划。' }] } },
  { id: 8, title: '安全生产培训教材', category: 'safety-training', categoryName: '安全培训', summary: '面向全体员工的安全生产基础知识教材，涵盖办公安全、消防知识和应急预案。', date: '2024-01-15', content: { sections: [{ title: '办公安全', text: '保持办公区域通道畅通，不私拉电线，不在安全出口堆放物品。使用电器设备时注意用电安全，离开时关闭电源。' }, { title: '消防知识', text: '熟悉所在楼层的消防通道和灭火器位置。掌握灭火器的正确使用方法：拔掉保险销，对准火焰根部喷射。' }, { title: '应急预案', text: '发生火灾或其他紧急情况时，保持冷静，迅速沿安全通道撤离。到达安全区域后，向部门负责人报到。' }] } },
];

const announcements = [
  { id: 1, title: '2024年Q2培训计划已发布', desc: '新一季度培训课程已上线，涵盖信息安全、项目管理等热门方向。', date: '2024-03-14', isNew: true },
  { id: 2, title: '系统维护通知', desc: '3月20日 22:00-23:00 将进行系统升级维护，届时平台暂停服务。', date: '2024-03-12', isNew: true },
  { id: 3, title: '年度合规培训截止提醒', desc: '请尚未完成年度合规培训的同事于3月31日前完成所有必修课程。', date: '2024-03-10', isNew: false },
];

const gradientOptions = [
  { label: '紫蓝渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '粉红渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '蓝色渐变', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: '绿色渐变', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: '橙粉渐变', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: '紫粉渐变', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
];

/* =========================================================
   Theme Configuration
   ========================================================= */

const themeConfig = {
  token: {
    colorPrimary: '#0071e3',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 15,
    colorBgContainer: '#ffffff',
    colorBorder: '#d2d2d7',
    colorText: '#1d1d1f',
    colorTextSecondary: '#6e6e73',
    colorTextTertiary: '#86868b',
    controlHeight: 44,
    lineWidth: 1,
  },
};

/* =========================================================
   Shared Components
   ========================================================= */

function VideoThumb({ gradient, duration, size = 'normal', ...qoderProps }) {
  const iconSize = size === 'small' ? 18 : 28;
  return (
    <div className={["video-thumb", qoderProps?.className].filter(Boolean).join(" ")} style={{ ...({ background: gradient }), ...(qoderProps?.style) }} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
      <div className="video-thumb-overlay" data-qoder-id="qel-video-thumb-overlay-8435f7a6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-thumb-overlay-8435f7a6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoThumb&quot;,&quot;elementRole&quot;:&quot;video-thumb-overlay&quot;,&quot;loc&quot;:{&quot;line&quot;:124,&quot;column&quot;:7}}">
        <PlayCircleFilled style={{ color: '#fff', fontSize: iconSize, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}  data-qoder-id="qel-playcirclefilled-4c9d2a99" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-playcirclefilled-4c9d2a99&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoThumb&quot;,&quot;elementRole&quot;:&quot;playcirclefilled&quot;,&quot;loc&quot;:{&quot;line&quot;:125,&quot;column&quot;:9}}"/>
      </div>
      {duration && <span className="video-thumb-duration" data-qoder-id="qel-video-thumb-duration-088bdd11" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-thumb-duration-088bdd11&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoThumb&quot;,&quot;elementRole&quot;:&quot;video-thumb-duration&quot;,&quot;loc&quot;:{&quot;line&quot;:127,&quot;column&quot;:20}}">{duration}</span>}
    </div>
  );
}

function NavBar({ isLoggedIn, userName, onSearch, onLogout, isAdmin, onAdminNavigate }) {
  const { navigate, route } = useNav();
  const [query, setQuery] = useState('');

  const handleSearch = (value) => {
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  if (!isLoggedIn) return null;

  const navItems = [
    { page: 'home', label: '首页' },
    { page: 'videos', label: '培训视频' },
    { page: 'docs', label: '答疑文档' },
  ];

  const isActive = (page) => {
    if (page === 'home') return route.page === 'home';
    if (page === 'videos') return route.page === 'videos' || route.page === 'videoDetail';
    if (page === 'docs') return route.page === 'docs' || route.page === 'docDetail';
    return false;
  };

  return (
    <header className="nav-bar" data-component="Navigation Bar" data-qoder-id="qel-navigation-bar-6b5d4e39" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-navigation-bar-6b5d4e39&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;navigation-bar&quot;,&quot;loc&quot;:{&quot;line&quot;:157,&quot;column&quot;:5}}">
      <div className="nav-bar-inner" data-qoder-id="qel-nav-bar-inner-5fab16c2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-bar-inner-5fab16c2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav-bar-inner&quot;,&quot;loc&quot;:{&quot;line&quot;:158,&quot;column&quot;:7}}">
        <div className="nav-logo" onClick={() => navigate('home')} data-qoder-id="qel-nav-logo-e720517e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-logo-e720517e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav-logo&quot;,&quot;loc&quot;:{&quot;line&quot;:159,&quot;column&quot;:9}}">
          <div className="nav-logo-icon" data-qoder-id="qel-nav-logo-icon-f9545e4b" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-logo-icon-f9545e4b&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav-logo-icon&quot;,&quot;loc&quot;:{&quot;line&quot;:160,&quot;column&quot;:11}}">
            <SoundOutlined style={{ fontSize: 15 }}  data-qoder-id="qel-soundoutlined-ab6c7320" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-soundoutlined-ab6c7320&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;soundoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:161,&quot;column&quot;:13}}"/>
          </div>
          培训中心
        </div>

        <nav data-qoder-id="qel-nav-058f218c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-058f218c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav&quot;,&quot;loc&quot;:{&quot;line&quot;:166,&quot;column&quot;:9}}">
          <ul style={{ display: 'flex', listStyle: 'none', gap: 4, margin: 0, padding: 0 }} data-qoder-id="qel-ul-79170439" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-ul-79170439&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;ul&quot;,&quot;loc&quot;:{&quot;line&quot;:167,&quot;column&quot;:11}}">
            {navItems.map((item) => (
              <li
                key={item.page}
                onClick={() => navigate(item.page)}
                style={{
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: isActive(item.page) ? 500 : 400,
                  color: 'var(--seed-fg)',
                  borderRadius: 8,
                  background: isActive(item.page) ? 'var(--seed-surface)' : 'transparent',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.01em',
                }}
               data-qoder-id="qel-li-b8cb1dac" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-li-b8cb1dac&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;li&quot;,&quot;loc&quot;:{&quot;line&quot;:169,&quot;column&quot;:15}}">
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-search" data-qoder-id="qel-nav-search-31a52d34" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-search-31a52d34&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav-search&quot;,&quot;loc&quot;:{&quot;line&quot;:190,&quot;column&quot;:9}}">
          <Input
            prefix={<SearchOutlined style={{ color: '#86868b' }} />}
            placeholder="搜索课程或文档"
            size="small"
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={() => handleSearch(query)}
           data-qoder-id="qel-input-751485a8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-751485a8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:191,&quot;column&quot;:11}}"/>
        </div>

        <div className="nav-right" data-qoder-id="qel-nav-right-a902bdf8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-right-a902bdf8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;nav-right&quot;,&quot;loc&quot;:{&quot;line&quot;:202,&quot;column&quot;:9}}">
          {isAdmin && (
            <Button
              type="text"
              icon={<SettingOutlined  data-qoder-id="qel-settingoutlined-8b6775f9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-settingoutlined-8b6775f9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;settingoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:206,&quot;column&quot;:21}}"/>}
              onClick={onAdminNavigate}
              style={{ fontSize: 13, color: 'var(--seed-primary)', fontWeight: 500, gap: 4 }}
             data-qoder-id="qel-button-75843fc2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-75843fc2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:204,&quot;column&quot;:13}}">
              管理后台
            </Button>
          )}
          <span style={{ fontSize: 13, color: 'var(--seed-muted)', whiteSpace: 'nowrap' }} data-qoder-id="qel-span-c70e0214" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-c70e0214&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:213,&quot;column&quot;:11}}">{userName}</span>
          <Avatar
            size={32}
            style={{ backgroundColor: '#0071e3', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
            icon={<UserOutlined />}
           data-qoder-id="qel-avatar-c2c9e291" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-avatar-c2c9e291&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;avatar&quot;,&quot;loc&quot;:{&quot;line&quot;:214,&quot;column&quot;:11}}"/>
          <Button type="text" icon={<LogoutOutlined />} onClick={onLogout} style={{ color: 'var(--seed-muted)', fontSize: 13 }}  data-qoder-id="qel-button-818b0e6b" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-818b0e6b&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;NavBar&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:219,&quot;column&quot;:11}}"/>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Pages
   ========================================================= */

/* ---- Home / Login ---- */
function HomePage({ isLoggedIn, onLogin, onAdminLink, ...qoderProps }) {
  const { navigate } = useNav();

  if (!isLoggedIn) {
    return (
      <div className={["login-page", qoderProps?.className].filter(Boolean).join(" ")} data-component="Login Page" style={qoderProps?.style} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
        <div className="login-card fade-in" data-qoder-id="qel-login-card-2422e398" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-card-2422e398&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;login-card&quot;,&quot;loc&quot;:{&quot;line&quot;:237,&quot;column&quot;:9}}">
          <div className="login-logo" data-qoder-id="qel-login-logo-6f888cc8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-logo-6f888cc8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;login-logo&quot;,&quot;loc&quot;:{&quot;line&quot;:238,&quot;column&quot;:11}}">
            <div className="nav-logo-icon" style={{ width: 36, height: 36, backgroundColor: "rgb(137, 227, 0)" }} data-qoder-id="qel-nav-logo-icon-be2eda85" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-logo-icon-be2eda85&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;nav-logo-icon&quot;,&quot;loc&quot;:{&quot;line&quot;:239,&quot;column&quot;:13}}">
              <SoundOutlined style={{ fontSize: 18 }}  data-qoder-id="qel-soundoutlined-1e1c5606" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-soundoutlined-1e1c5606&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;soundoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:240,&quot;column&quot;:15}}"/>
            </div>
            培训中心
          </div>
          <h1 className="login-title" data-qoder-id="qel-login-title-6e6aa6c2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-title-6e6aa6c2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;login-title&quot;,&quot;loc&quot;:{&quot;line&quot;:244,&quot;column&quot;:11}}">欢迎回来</h1>
          <p className="login-subtitle" data-qoder-id="qel-login-subtitle-1074fd9a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-subtitle-1074fd9a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;login-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:245,&quot;column&quot;:11}}">登录您的企业账户，开始学习之旅</p>
          <Form
            className="login-form"
            onFinish={(values) => { onLogin(values.username || '张明'); }}
            layout="vertical"
            size="large"
           data-qoder-id="qel-login-form-b6ea8295" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-form-b6ea8295&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;login-form&quot;,&quot;loc&quot;:{&quot;line&quot;:246,&quot;column&quot;:11}}">
            <Form.Item name="username" label={<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--seed-fg)' }} data-qoder-id="qel-span-47a0eee8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-47a0eee8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:252,&quot;column&quot;:47}}">用户名</span>} rules={[{ required: true, message: '请输入用户名' }]} data-qoder-id="qel-form-item-3b0c3f11" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-3b0c3f11&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:252,&quot;column&quot;:13}}">
              <Input placeholder="请输入用户名"  data-qoder-id="qel-input-06d04b7b" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-06d04b7b&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:253,&quot;column&quot;:15}}"/>
            </Form.Item>
            <Form.Item name="password" label={<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--seed-fg)' }} data-qoder-id="qel-span-4aa0f3a1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-4aa0f3a1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:255,&quot;column&quot;:47}}">密码</span>} rules={[{ required: true, message: '请输入密码' }]} data-qoder-id="qel-form-item-ba0f4595" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-ba0f4595&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:255,&quot;column&quot;:13}}">
              <Input.Password placeholder="请输入密码"  data-qoder-id="qel-input-password-01f884f9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-password-01f884f9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;input-password&quot;,&quot;loc&quot;:{&quot;line&quot;:256,&quot;column&quot;:15}}"/>
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 20 }} data-qoder-id="qel-form-item-b30f3a90" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-b30f3a90&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:258,&quot;column&quot;:13}}">
              <Checkbox data-qoder-id="qel-checkbox-fbd593f0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-checkbox-fbd593f0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;checkbox&quot;,&quot;loc&quot;:{&quot;line&quot;:259,&quot;column&quot;:15}}">记住登录状态</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 12 }} data-qoder-id="qel-form-item-b50f3db6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-b50f3db6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:261,&quot;column&quot;:13}}">
              <Button type="primary" htmlType="submit" block icon={<LoginOutlined  data-qoder-id="qel-loginoutlined-e010bb4f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-loginoutlined-e010bb4f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;loginoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:262,&quot;column&quot;:68}}"/>} style={{ fontWeight: 500 }} data-qoder-id="qel-button-ebbb141c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-ebbb141c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:262,&quot;column&quot;:15}}">
                登录
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 16 }} data-qoder-id="qel-div-afb63f13" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-afb63f13&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:266,&quot;column&quot;:13}}">
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14, color: 'var(--seed-primary)', textDecoration: 'none' }} data-qoder-id="qel-a-bfc560cc" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-a-bfc560cc&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;a&quot;,&quot;loc&quot;:{&quot;line&quot;:267,&quot;column&quot;:15}}">忘记密码？</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onAdminLink(); }} style={{ fontSize: 14, color: 'var(--seed-muted)', textDecoration: 'none' }} data-qoder-id="qel-a-c2c56585" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-a-c2c56585&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;a&quot;,&quot;loc&quot;:{&quot;line&quot;:268,&quot;column&quot;:15}}">
                <LockOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-lockoutlined-94de7788" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-lockoutlined-94de7788&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;lockoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:269,&quot;column&quot;:17}}"/>管理员入口
              </a>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" data-component="Home Page" data-qoder-id="qel-home-page-39bdc319" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-home-page-39bdc319&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;home-page&quot;,&quot;loc&quot;:{&quot;line&quot;:279,&quot;column&quot;:5}}">
      <div className="page-content" data-qoder-id="qel-page-content-cf659980" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-content-cf659980&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;page-content&quot;,&quot;loc&quot;:{&quot;line&quot;:280,&quot;column&quot;:7}}">
        {/* Banner */}
        <div className="home-banner" data-component="Hero Banner" data-qoder-id="qel-hero-banner-6c00851f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-hero-banner-6c00851f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;hero-banner&quot;,&quot;loc&quot;:{&quot;line&quot;:282,&quot;column&quot;:9}}">
          <h1 className="home-banner-title" data-qoder-id="qel-home-banner-title-ad20f9f0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-home-banner-title-ad20f9f0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;home-banner-title&quot;,&quot;loc&quot;:{&quot;line&quot;:283,&quot;column&quot;:11}}">欢迎来到培训中心</h1>
          <p className="home-banner-subtitle" data-qoder-id="qel-home-banner-subtitle-80418534" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-home-banner-subtitle-80418534&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;home-banner-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:284,&quot;column&quot;:11}}">在这里观看培训视频回放、查阅答疑文档，持续提升您的专业能力。</p>
          <Button className="home-banner-btn" onClick={() => navigate('videos')} data-qoder-id="qel-home-banner-btn-9b2a3bc5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-home-banner-btn-9b2a3bc5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;home-banner-btn&quot;,&quot;loc&quot;:{&quot;line&quot;:285,&quot;column&quot;:11}}">
            浏览全部课程
          </Button>
        </div>

        {/* Recent Videos */}
        <section style={{ marginTop: 48 }} data-component="Recent Videos" data-qoder-id="qel-recent-videos-c9d132f1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-recent-videos-c9d132f1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;recent-videos&quot;,&quot;loc&quot;:{&quot;line&quot;:291,&quot;column&quot;:9}}">
          <div className="section-header" data-qoder-id="qel-section-header-da128f95" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-header-da128f95&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;section-header&quot;,&quot;loc&quot;:{&quot;line&quot;:292,&quot;column&quot;:11}}">
            <h2 className="section-title" data-qoder-id="qel-section-title-d2cc9bb4" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-title-d2cc9bb4&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;section-title&quot;,&quot;loc&quot;:{&quot;line&quot;:293,&quot;column&quot;:13}}">最近观看</h2>
            <a className="section-link" onClick={() => navigate('videos')} style={{ cursor: 'pointer' }} data-qoder-id="qel-section-link-dcb278ec" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-link-dcb278ec&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;section-link&quot;,&quot;loc&quot;:{&quot;line&quot;:294,&quot;column&quot;:13}}">
              查看全部 <RightOutlined style={{ fontSize: 11 }}  data-qoder-id="qel-rightoutlined-0ff1f532" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-rightoutlined-0ff1f532&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;rightoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:295,&quot;column&quot;:20}}"/>
            </a>
          </div>
          <div className="video-grid" data-qoder-id="qel-video-grid-3d0a8482" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-grid-3d0a8482&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;video-grid&quot;,&quot;loc&quot;:{&quot;line&quot;:298,&quot;column&quot;:11}}">
            {watchHistory.map((h) => {
              const video = initialVideoData.find((v) => v.id === h.videoId);
              if (!video) return null;
              return (
                <div key={h.videoId} className="video-card ant-card" onClick={() => navigate('videoDetail', video.id)} data-qoder-id="qel-video-card-115662ad" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-card-115662ad&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;video-card&quot;,&quot;loc&quot;:{&quot;line&quot;:303,&quot;column&quot;:17}}">
                  <VideoThumb gradient={video.gradient} duration={video.duration}  data-qoder-id="qel-videothumb-61c143cd" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-videothumb-61c143cd&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;videothumb&quot;,&quot;loc&quot;:{&quot;line&quot;:304,&quot;column&quot;:19}}"/>
                  <div style={{ padding: 16 }} data-qoder-id="qel-div-c1b41cd2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c1b41cd2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:305,&quot;column&quot;:19}}">
                    <div className="video-title" data-qoder-id="qel-video-title-e7f1e018" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-title-e7f1e018&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;video-title&quot;,&quot;loc&quot;:{&quot;line&quot;:306,&quot;column&quot;:21}}">{video.title}</div>
                    <div className="video-meta" data-qoder-id="qel-video-meta-33f497e5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-meta-33f497e5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;video-meta&quot;,&quot;loc&quot;:{&quot;line&quot;:307,&quot;column&quot;:21}}">
                      <span data-qoder-id="qel-span-c4aceca2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-c4aceca2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:308,&quot;column&quot;:23}}"><ClockCircleOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-clockcircleoutlined-50be4257" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-clockcircleoutlined-50be4257&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;clockcircleoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:308,&quot;column&quot;:29}}"/>观看至 {h.progress}%</span>
                      <span data-qoder-id="qel-span-c2ace97c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-c2ace97c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:309,&quot;column&quot;:23}}">{h.watchedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Announcements */}
        <section style={{ marginTop: 48 }} data-component="Announcements" data-qoder-id="qel-announcements-3834ce50" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-announcements-3834ce50&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;announcements&quot;,&quot;loc&quot;:{&quot;line&quot;:319,&quot;column&quot;:9}}">
          <div className="section-header" data-qoder-id="qel-section-header-560f8132" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-header-560f8132&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;section-header&quot;,&quot;loc&quot;:{&quot;line&quot;:320,&quot;column&quot;:11}}">
            <h2 className="section-title" data-qoder-id="qel-section-title-50c99077" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-title-50c99077&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;section-title&quot;,&quot;loc&quot;:{&quot;line&quot;:321,&quot;column&quot;:13}}">公告通知</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-qoder-id="qel-div-c4b1e2f4" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c4b1e2f4&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:323,&quot;column&quot;:11}}">
            {announcements.map((a) => (
              <div key={a.id} className="announce-card ant-card" data-qoder-id="qel-announce-card-1f229828" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-announce-card-1f229828&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;announce-card&quot;,&quot;loc&quot;:{&quot;line&quot;:325,&quot;column&quot;:15}}">
                <div style={{ padding: '20px 24px' }} data-qoder-id="qel-div-bab1d336" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-bab1d336&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:326,&quot;column&quot;:17}}">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }} data-qoder-id="qel-div-3daecfd8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-3daecfd8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:327,&quot;column&quot;:19}}">
                    <span className="doc-title" data-qoder-id="qel-doc-title-9f2c570a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-title-9f2c570a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;doc-title&quot;,&quot;loc&quot;:{&quot;line&quot;:328,&quot;column&quot;:21}}">{a.title}</span>
                    {a.isNew && <Tag color="#0071e3" data-qoder-id="qel-tag-942ea8da" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-942ea8da&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:329,&quot;column&quot;:33}}">新</Tag>}
                  </div>
                  <div className="doc-summary" style={{ marginBottom: 4, WebkitLineClamp: 1 }} data-qoder-id="qel-doc-summary-f9380e29" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-summary-f9380e29&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;doc-summary&quot;,&quot;loc&quot;:{&quot;line&quot;:331,&quot;column&quot;:19}}">{a.desc}</div>
                  <div style={{ fontSize: 13, color: 'var(--seed-muted)' }} data-qoder-id="qel-div-41aed624" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-41aed624&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:332,&quot;column&quot;:19}}">
                    <CalendarOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-calendaroutlined-07fd45a7" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-calendaroutlined-07fd45a7&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;HomePage&quot;,&quot;elementRole&quot;:&quot;calendaroutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:333,&quot;column&quot;:21}}"/>{a.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---- Video List ---- */
function VideosPage({ videos, ...qoderProps }) {
  const { navigate } = useNav();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [historyOpen, setHistoryOpen] = useState(false);

  const filtered = videos.filter((v) => {
    const matchCategory = activeCategory === '全部' || v.category === activeCategory;
    const matchQuery = !query || v.title.includes(query) || v.desc.includes(query);
    return matchCategory && matchQuery;
  });

  return (
    <div className={["page-content fade-in", qoderProps?.className].filter(Boolean).join(" ")} data-component="Video List Page" style={qoderProps?.style} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
      <div className="page-header" data-qoder-id="qel-page-header-e578ba98" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-header-e578ba98&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;page-header&quot;,&quot;loc&quot;:{&quot;line&quot;:360,&quot;column&quot;:7}}">
        <h1 className="page-title" data-qoder-id="qel-page-title-9915eb0a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-title-9915eb0a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;page-title&quot;,&quot;loc&quot;:{&quot;line&quot;:361,&quot;column&quot;:9}}">培训视频</h1>
        <p className="page-subtitle" data-qoder-id="qel-page-subtitle-86251bc8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-subtitle-86251bc8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;page-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:362,&quot;column&quot;:9}}">浏览全部培训课程回放，随时随地学习</p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center' }} data-qoder-id="qel-div-dfcd2aea" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-dfcd2aea&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:366,&quot;column&quot;:7}}">
        <div style={{ flex: 1, maxWidth: 480 }} data-qoder-id="qel-div-e0cd2c7d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-e0cd2c7d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:367,&quot;column&quot;:9}}">
          <Input.Search
            placeholder="搜索视频标题或内容"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={(v) => setQuery(v)}
            allowClear
           data-qoder-id="qel-input-search-22f144fb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-search-22f144fb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;input-search&quot;,&quot;loc&quot;:{&quot;line&quot;:368,&quot;column&quot;:11}}"/>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }} data-qoder-id="qel-div-decd2957" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-decd2957&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:378,&quot;column&quot;:7}}">
        {videoCategories.map((cat) => (
          <Tag
            key={cat}
            color={activeCategory === cat ? '#0071e3' : 'default'}
            style={{
              cursor: 'pointer',
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: activeCategory === cat ? 500 : 400,
              background: activeCategory === cat ? '#0071e3' : 'var(--seed-surface)',
              color: activeCategory === cat ? '#ffffff' : 'var(--seed-fg)',
              border: 'none',
              borderRadius: 980,
            }}
            onClick={() => setActiveCategory(cat)}
           data-qoder-id="qel-tag-4f9fdb52" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-4f9fdb52&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:380,&quot;column&quot;:11}}">
            {cat}
          </Tag>
        ))}
      </div>

      {/* History toggle */}
      <div className="history-toggle" data-qoder-id="qel-history-toggle-762620a3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-toggle-762620a3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-toggle&quot;,&quot;loc&quot;:{&quot;line&quot;:401,&quot;column&quot;:7}}">
        <Button
          type="default"
          icon={<ClockCircleOutlined  data-qoder-id="qel-clockcircleoutlined-3ff18547" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-clockcircleoutlined-3ff18547&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;clockcircleoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:404,&quot;column&quot;:17}}"/>}
          onClick={() => setHistoryOpen(true)}
          style={{ borderRadius: 980, borderColor: 'var(--seed-border)', color: 'var(--seed-fg)' }}
         data-qoder-id="qel-button-a6a3063c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-a6a3063c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:402,&quot;column&quot;:9}}">
          观看历史
        </Button>
      </div>

      {/* Video Grid */}
      <div className="video-grid" data-qoder-id="qel-video-grid-44f8d877" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-grid-44f8d877&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;video-grid&quot;,&quot;loc&quot;:{&quot;line&quot;:413,&quot;column&quot;:7}}">
        {filtered.map((video) => (
          <div key={video.id} className="video-card ant-card" onClick={() => navigate('videoDetail', video.id)} data-qoder-id="qel-video-card-77f04306" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-card-77f04306&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;video-card&quot;,&quot;loc&quot;:{&quot;line&quot;:415,&quot;column&quot;:11}}">
            <VideoThumb gradient={video.gradient} duration={video.duration}  data-qoder-id="qel-videothumb-00634991" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-videothumb-00634991&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;videothumb&quot;,&quot;loc&quot;:{&quot;line&quot;:416,&quot;column&quot;:13}}"/>
            <div style={{ padding: 16 }} data-qoder-id="qel-div-c4cf3f00" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c4cf3f00&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:417,&quot;column&quot;:13}}">
              <div className="video-title" data-qoder-id="qel-video-title-ea5b4858" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-title-ea5b4858&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;video-title&quot;,&quot;loc&quot;:{&quot;line&quot;:418,&quot;column&quot;:15}}">{video.title}</div>
              <div style={{ fontSize: 13, color: 'var(--seed-muted)', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} data-qoder-id="qel-div-c6cf4226" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c6cf4226&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:419,&quot;column&quot;:15}}">
                {video.desc}
              </div>
              <div className="video-meta" data-qoder-id="qel-video-meta-b4790d29" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-meta-b4790d29&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;video-meta&quot;,&quot;loc&quot;:{&quot;line&quot;:422,&quot;column&quot;:15}}">
                <Tag color="default" style={{ background: 'var(--seed-surface)', color: 'var(--seed-muted)', margin: 0 }} data-qoder-id="qel-tag-4ca21530" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-4ca21530&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:423,&quot;column&quot;:17}}">{video.category}</Tag>
                <span data-qoder-id="qel-span-fdb7e6c9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-fdb7e6c9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:424,&quot;column&quot;:17}}"><CalendarOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-calendaroutlined-62a3ba56" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-calendaroutlined-62a3ba56&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;calendaroutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:424,&quot;column&quot;:23}}"/>{video.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--seed-muted)' }} data-qoder-id="qel-div-cdcf4d2b" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-cdcf4d2b&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:432,&quot;column&quot;:9}}">
          <SearchOutlined style={{ fontSize: 40, marginBottom: 16, display: 'block', opacity: 0.3 }}  data-qoder-id="qel-searchoutlined-82e5ee68" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-searchoutlined-82e5ee68&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;searchoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:433,&quot;column&quot;:11}}"/>
          <p style={{ fontSize: 15 }} data-qoder-id="qel-p-b89f31c5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-p-b89f31c5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;p&quot;,&quot;loc&quot;:{&quot;line&quot;:434,&quot;column&quot;:11}}">未找到匹配的视频</p>
        </div>
      )}

      {/* Watch History Drawer */}
      <Drawer
        title="观看历史"
        placement="right"
        onClose={() => setHistoryOpen(false)}
        open={historyOpen}
        width={380}
       data-qoder-id="qel-drawer-1872f048" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-drawer-1872f048&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;drawer&quot;,&quot;loc&quot;:{&quot;line&quot;:439,&quot;column&quot;:7}}">
        {watchHistory.map((h) => {
          const video = videos.find((v) => v.id === h.videoId);
          return (
            <div
              key={h.videoId}
              className="history-item"
              style={{ cursor: 'pointer' }}
              onClick={() => { setHistoryOpen(false); navigate('videoDetail', h.videoId); }}
             data-qoder-id="qel-history-item-68cdd5f2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-item-68cdd5f2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-item&quot;,&quot;loc&quot;:{&quot;line&quot;:449,&quot;column&quot;:13}}">
              <div className="history-thumb" style={{ background: video?.gradient || '#eee' }} data-qoder-id="qel-history-thumb-5219e646" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-thumb-5219e646&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-thumb&quot;,&quot;loc&quot;:{&quot;line&quot;:455,&quot;column&quot;:15}}">
                <PlayCircleFilled style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}  data-qoder-id="qel-playcirclefilled-ae7a84e1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-playcirclefilled-ae7a84e1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;playcirclefilled&quot;,&quot;loc&quot;:{&quot;line&quot;:456,&quot;column&quot;:17}}"/>
              </div>
              <div className="history-info" data-qoder-id="qel-history-info-632016f0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-info-632016f0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-info&quot;,&quot;loc&quot;:{&quot;line&quot;:458,&quot;column&quot;:15}}">
                <div className="history-name" data-qoder-id="qel-history-name-0c1173ba" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-name-0c1173ba&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-name&quot;,&quot;loc&quot;:{&quot;line&quot;:459,&quot;column&quot;:17}}">{h.title}</div>
                <div className="history-time" data-qoder-id="qel-history-time-1faa8dd7" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-history-time-1faa8dd7&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;history-time&quot;,&quot;loc&quot;:{&quot;line&quot;:460,&quot;column&quot;:17}}">{h.watchedAt} · 观看至 {h.progress}%</div>
              </div>
              <RightOutlined style={{ color: 'var(--seed-muted)', fontSize: 12 }}  data-qoder-id="qel-rightoutlined-321d9e95" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-rightoutlined-321d9e95&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideosPage&quot;,&quot;elementRole&quot;:&quot;rightoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:462,&quot;column&quot;:15}}"/>
            </div>
          );
        })}
      </Drawer>
    </div>
  );
}

/* ---- Video Detail ---- */
function VideoDetailPage({ videoId, videos, ...qoderProps }) {
  const { navigate } = useNav();
  const video = videos.find((v) => v.id === videoId);
  const [activeChapter, setActiveChapter] = useState(0);

  if (!video) {
    return (
      <div className={["page-content", qoderProps?.className].filter(Boolean).join(" ")} style={{ ...({ textAlign: 'center', paddingTop: 80 }), ...(qoderProps?.style) }} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
        <p style={{ color: 'var(--seed-muted)', fontSize: 15 }} data-qoder-id="qel-p-843ddb7c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-p-843ddb7c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;p&quot;,&quot;loc&quot;:{&quot;line&quot;:480,&quot;column&quot;:9}}">视频未找到</p>
        <Button onClick={() => navigate('videos')} style={{ marginTop: 16 }} data-qoder-id="qel-button-6e2adadf" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-6e2adadf&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:481,&quot;column&quot;:9}}">返回列表</Button>
      </div>
    );
  }

  const related = videos.filter((v) => v.id !== video.id && v.category === video.category).slice(0, 3);

  return (
    <div className="page-content fade-in" data-component="Video Detail Page" data-qoder-id="qel-video-detail-page-eb4f5c90" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-detail-page-eb4f5c90&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-detail-page&quot;,&quot;loc&quot;:{&quot;line&quot;:489,&quot;column&quot;:5}}">
      {/* Back */}
      <div style={{ marginBottom: 20 }} data-qoder-id="qel-div-2ac91fd1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-2ac91fd1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:491,&quot;column&quot;:7}}">
        <Button
          type="text"
          icon={<ArrowLeftOutlined  data-qoder-id="qel-arrowleftoutlined-5c892f83" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-arrowleftoutlined-5c892f83&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;arrowleftoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:494,&quot;column&quot;:17}}"/>}
          onClick={() => navigate('videos')}
          style={{ color: 'var(--seed-muted)', paddingLeft: 0, fontWeight: 500 }}
         data-qoder-id="qel-button-692ad300" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-692ad300&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:492,&quot;column&quot;:9}}">
          返回视频列表
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }} data-qoder-id="qel-div-2dc9248a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-2dc9248a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:502,&quot;column&quot;:7}}">
        {/* Main */}
        <div data-qoder-id="qel-div-2ec9261d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-2ec9261d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:504,&quot;column&quot;:9}}">
          {/* Player */}
          {video.videoUrl && video.videoType === 'embed' ? (
            <div className="video-player" style={{ background: '#000', borderRadius: 16, overflow: 'hidden' }} data-qoder-id="qel-video-player-709a9c3e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-709a9c3e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player&quot;,&quot;loc&quot;:{&quot;line&quot;:507,&quot;column&quot;:13}}">
              <iframe
                src={video.videoUrl}
                style={{ width: '100%', height: '100%', aspectRatio: '16/9', border: 'none' }}
                allowFullScreen
                title={video.title}
               data-qoder-id="qel-iframe-23c8e0e7" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-iframe-23c8e0e7&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;iframe&quot;,&quot;loc&quot;:{&quot;line&quot;:508,&quot;column&quot;:15}}"/>
            </div>
          ) : video.videoUrl && video.videoType === 'direct' ? (
            <div className="video-player" style={{ background: '#000' }} data-qoder-id="qel-video-player-829879fd" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-829879fd&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player&quot;,&quot;loc&quot;:{&quot;line&quot;:516,&quot;column&quot;:13}}">
              <video
                src={video.videoUrl}
                controls
                style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16, display: 'block' }}
                poster=""
               data-qoder-id="qel-video-317fb9cc" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-317fb9cc&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video&quot;,&quot;loc&quot;:{&quot;line&quot;:517,&quot;column&quot;:15}}">
                您的浏览器不支持视频播放
              </video>
            </div>
          ) : (
          <div className="video-player" style={{ background: video.gradient }} data-qoder-id="qel-video-player-809876d7" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-809876d7&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player&quot;,&quot;loc&quot;:{&quot;line&quot;:527,&quot;column&quot;:11}}">
            <div className="video-player-play" data-qoder-id="qel-video-player-play-a36e38ad" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-play-a36e38ad&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player-play&quot;,&quot;loc&quot;:{&quot;line&quot;:528,&quot;column&quot;:13}}">
              <PlayCircleFilled style={{ color: 'var(--seed-primary)', fontSize: 32, marginLeft: 3 }}  data-qoder-id="qel-playcirclefilled-f0a42153" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-playcirclefilled-f0a42153&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;playcirclefilled&quot;,&quot;loc&quot;:{&quot;line&quot;:529,&quot;column&quot;:15}}"/>
            </div>
            <div className="video-player-bar" data-qoder-id="qel-video-player-bar-705403a6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-bar-705403a6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player-bar&quot;,&quot;loc&quot;:{&quot;line&quot;:531,&quot;column&quot;:13}}">
              <div className="video-player-progress" style={{ width: '35%' }}  data-qoder-id="qel-video-player-progress-a0805fd3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-player-progress-a0805fd3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-player-progress&quot;,&quot;loc&quot;:{&quot;line&quot;:532,&quot;column&quot;:15}}"/>
            </div>
          </div>
          )}

          <h1 className="video-detail-title" data-qoder-id="qel-video-detail-title-2ffc0a4f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-detail-title-2ffc0a4f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-detail-title&quot;,&quot;loc&quot;:{&quot;line&quot;:537,&quot;column&quot;:11}}">{video.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }} data-qoder-id="qel-div-a1d096eb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-a1d096eb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:539,&quot;column&quot;:11}}">
            <Tag color="default" style={{ background: 'var(--seed-surface)', color: 'var(--seed-muted)' }} data-qoder-id="qel-tag-9f78066c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-9f78066c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:540,&quot;column&quot;:13}}">{video.category}</Tag>
            <span style={{ fontSize: 14, color: 'var(--seed-muted)' }} data-qoder-id="qel-span-e3c7a76e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-e3c7a76e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:541,&quot;column&quot;:13}}"><ClockCircleOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-clockcircleoutlined-1d811cc9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-clockcircleoutlined-1d811cc9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;clockcircleoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:541,&quot;column&quot;:72}}"/>{video.duration}</span>
            <span style={{ fontSize: 14, color: 'var(--seed-muted)' }} data-qoder-id="qel-span-e1c7a448" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-e1c7a448&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:542,&quot;column&quot;:13}}"><CalendarOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-calendaroutlined-965eccfb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-calendaroutlined-965eccfb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;calendaroutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:542,&quot;column&quot;:72}}"/>{video.date}</span>
          </div>

          <p className="video-detail-desc" data-qoder-id="qel-video-detail-desc-bc76be15" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-video-detail-desc-bc76be15&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;video-detail-desc&quot;,&quot;loc&quot;:{&quot;line&quot;:545,&quot;column&quot;:11}}">{video.desc}</p>

          {/* Chapters */}
          <div style={{ marginTop: 32 }} data-qoder-id="qel-div-b0ce6ff1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-b0ce6ff1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:548,&quot;column&quot;:11}}">
            <h2 className="chapter-title" data-qoder-id="qel-chapter-title-9c8900d0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-title-9c8900d0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-title&quot;,&quot;loc&quot;:{&quot;line&quot;:549,&quot;column&quot;:13}}">内容概览</h2>
            <div className="chapter-list" data-component="Chapter List" data-qoder-id="qel-chapter-list-79a2960a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-list-79a2960a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-list&quot;,&quot;loc&quot;:{&quot;line&quot;:550,&quot;column&quot;:13}}">
              {video.chapters.map((ch, i) => (
                <div
                  key={i}
                  className={`chapter-item ${activeChapter === i ? 'active' : ''}`}
                  onClick={() => setActiveChapter(i)}
                 data-qoder-id="qel-div-abce6812" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-abce6812&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:552,&quot;column&quot;:17}}">
                  <div className="chapter-num" data-qoder-id="qel-chapter-num-a3f09ae2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-num-a3f09ae2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-num&quot;,&quot;loc&quot;:{&quot;line&quot;:557,&quot;column&quot;:19}}">{i + 1}</div>
                  <div className="chapter-info" data-qoder-id="qel-chapter-info-4c0dfe08" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-info-4c0dfe08&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-info&quot;,&quot;loc&quot;:{&quot;line&quot;:558,&quot;column&quot;:19}}">
                    <div className="chapter-name" data-qoder-id="qel-chapter-name-a754fb8c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-name-a754fb8c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-name&quot;,&quot;loc&quot;:{&quot;line&quot;:559,&quot;column&quot;:21}}">{ch.title}</div>
                    <div className="chapter-time" data-qoder-id="qel-chapter-time-15fd9543" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-chapter-time-15fd9543&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;chapter-time&quot;,&quot;loc&quot;:{&quot;line&quot;:560,&quot;column&quot;:21}}">{ch.time}</div>
                  </div>
                  {activeChapter === i && <CheckCircleFilled style={{ color: 'var(--seed-primary)', fontSize: 16 }}  data-qoder-id="qel-checkcirclefilled-a252cf88" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-checkcirclefilled-a252cf88&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;checkcirclefilled&quot;,&quot;loc&quot;:{&quot;line&quot;:562,&quot;column&quot;:43}}"/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — Related */}
        <aside data-qoder-id="qel-aside-1c89720d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-aside-1c89720d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;aside&quot;,&quot;loc&quot;:{&quot;line&quot;:570,&quot;column&quot;:9}}">
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, color: 'var(--seed-fg)', letterSpacing: '-0.01em' }} data-qoder-id="qel-h3-a0bf5538" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-h3-a0bf5538&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;h3&quot;,&quot;loc&quot;:{&quot;line&quot;:571,&quot;column&quot;:11}}">相关视频</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-qoder-id="qel-div-1fd5da73" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-1fd5da73&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:572,&quot;column&quot;:11}}">
            {related.map((v) => (
              <div key={v.id} className="related-card ant-card" onClick={() => navigate('videoDetail', v.id)} data-qoder-id="qel-related-card-35724659" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-related-card-35724659&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;related-card&quot;,&quot;loc&quot;:{&quot;line&quot;:574,&quot;column&quot;:15}}">
                <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }} data-qoder-id="qel-div-2dd5f07d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-2dd5f07d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:575,&quot;column&quot;:17}}">
                  <div style={{ width: 80, height: 48, borderRadius: 8, background: v.gradient, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} data-qoder-id="qel-div-2cd5eeea" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-2cd5eeea&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:576,&quot;column&quot;:19}}">
                    <PlayCircleFilled style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}  data-qoder-id="qel-playcirclefilled-ea92cec0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-playcirclefilled-ea92cec0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;playcirclefilled&quot;,&quot;loc&quot;:{&quot;line&quot;:577,&quot;column&quot;:21}}"/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }} data-qoder-id="qel-div-20d39d6f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-20d39d6f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:579,&quot;column&quot;:19}}">
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--seed-fg)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} data-qoder-id="qel-div-21d39f02" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-21d39f02&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:580,&quot;column&quot;:21}}">{v.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--seed-muted)', marginTop: 4 }} data-qoder-id="qel-div-22d3a095" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-22d3a095&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;VideoDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:581,&quot;column&quot;:21}}">{v.duration} · {v.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---- Document List ---- */
function DocsPage(qoderProps) {
  const { navigate } = useNav();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = docData.filter((d) => {
    const matchCategory = !selectedCategory || d.category === selectedCategory;
    const matchQuery = !query || d.title.includes(query) || d.summary.includes(query);
    return matchCategory && matchQuery;
  });

  return (
    <div className={["page-content fade-in", qoderProps?.className].filter(Boolean).join(" ")} data-component="Document List Page" style={qoderProps?.style} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
      <div className="page-header" data-qoder-id="qel-page-header-a0b8af10" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-header-a0b8af10&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;page-header&quot;,&quot;loc&quot;:{&quot;line&quot;:607,&quot;column&quot;:7}}">
        <h1 className="page-title" data-qoder-id="qel-page-title-a6c65fac" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-title-a6c65fac&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;page-title&quot;,&quot;loc&quot;:{&quot;line&quot;:608,&quot;column&quot;:9}}">答疑文档</h1>
        <p className="page-subtitle" data-qoder-id="qel-page-subtitle-8ee3e614" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-subtitle-8ee3e614&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;page-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:609,&quot;column&quot;:9}}">查阅公司制度、技术规范和培训资料</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }} data-qoder-id="qel-div-fc39cee3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-fc39cee3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:612,&quot;column&quot;:7}}">
        {/* Category Tree */}
        <aside data-component="Document Category Tree" data-qoder-id="qel-document-category-tree-7a8876c1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-document-category-tree-7a8876c1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;document-category-tree&quot;,&quot;loc&quot;:{&quot;line&quot;:614,&quot;column&quot;:9}}">
          <div style={{
            background: 'var(--seed-surface)',
            borderRadius: 14,
            padding: '20px 16px',
            position: 'sticky',
            top: 80,
          }} data-qoder-id="qel-div-723239e0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-723239e0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:615,&quot;column&quot;:11}}">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--seed-fg)', marginBottom: 14, letterSpacing: '0.02em' }} data-qoder-id="qel-h3-0bbd2d89" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-h3-0bbd2d89&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;h3&quot;,&quot;loc&quot;:{&quot;line&quot;:622,&quot;column&quot;:13}}">文档分类</h3>
            <div
              style={{
                fontSize: 14, padding: '7px 12px', cursor: 'pointer', borderRadius: 8, marginBottom: 4,
                background: !selectedCategory ? 'rgba(0,113,227,0.08)' : 'transparent',
                color: !selectedCategory ? 'var(--seed-primary)' : 'var(--seed-fg)',
                fontWeight: !selectedCategory ? 500 : 400,
                transition: 'all 0.15s ease',
              }}
              onClick={() => setSelectedCategory(null)}
             data-qoder-id="qel-div-74323d06" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-74323d06&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:623,&quot;column&quot;:13}}">
              全部文档
            </div>
            <Tree
              treeData={docCategories}
              defaultExpandAll
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelect={(keys) => { setSelectedCategory(keys[0] || null); }}
              blockNode
              style={{ background: 'transparent', fontSize: 14 }}
             data-qoder-id="qel-tree-1fb0c971" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tree-1fb0c971&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;tree&quot;,&quot;loc&quot;:{&quot;line&quot;:635,&quot;column&quot;:13}}"/>
          </div>
        </aside>

        {/* Document List */}
        <div data-qoder-id="qel-div-7632402c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-7632402c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:647,&quot;column&quot;:9}}">
          <div style={{ marginBottom: 20, maxWidth: 480 }} data-qoder-id="qel-div-773241bf" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-773241bf&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:648,&quot;column&quot;:11}}">
            <Input.Search
              placeholder="搜索文档标题或内容"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSearch={(v) => setQuery(v)}
              allowClear
             data-qoder-id="qel-input-search-0bce7bef" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-search-0bce7bef&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;input-search&quot;,&quot;loc&quot;:{&quot;line&quot;:649,&quot;column&quot;:13}}"/>
          </div>

          {filtered.map((doc) => (
            <div key={doc.id} className="doc-card ant-card" onClick={() => navigate('docDetail', doc.id)} data-qoder-id="qel-doc-card-4e2dcff5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-card-4e2dcff5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;doc-card&quot;,&quot;loc&quot;:{&quot;line&quot;:659,&quot;column&quot;:13}}">
              <div style={{ padding: '20px 24px' }} data-qoder-id="qel-div-7a324678" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-7a324678&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:660,&quot;column&quot;:15}}">
                <div className="doc-title" data-qoder-id="qel-doc-title-b23ff685" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-title-b23ff685&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;doc-title&quot;,&quot;loc&quot;:{&quot;line&quot;:661,&quot;column&quot;:17}}">{doc.title}</div>
                <div className="doc-summary" data-qoder-id="qel-doc-summary-f56e7bf1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-summary-f56e7bf1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;doc-summary&quot;,&quot;loc&quot;:{&quot;line&quot;:662,&quot;column&quot;:17}}">{doc.summary}</div>
                <div className="doc-meta" data-qoder-id="qel-doc-meta-83fb38ad" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-meta-83fb38ad&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;doc-meta&quot;,&quot;loc&quot;:{&quot;line&quot;:663,&quot;column&quot;:17}}">
                  <Tag color="default" style={{ background: 'var(--seed-surface)', color: 'var(--seed-muted)' }} data-qoder-id="qel-tag-9d1fba47" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-9d1fba47&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:664,&quot;column&quot;:19}}">{doc.categoryName}</Tag>
                  <span data-qoder-id="qel-span-1997669c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-1997669c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:665,&quot;column&quot;:19}}"><CalendarOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-calendaroutlined-6d5dac85" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-calendaroutlined-6d5dac85&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;calendaroutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:665,&quot;column&quot;:25}}"/>{doc.date}</span>
                  <FileTextOutlined  data-qoder-id="qel-filetextoutlined-e96c8fe0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-filetextoutlined-e96c8fe0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;filetextoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:666,&quot;column&quot;:19}}"/>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--seed-muted)' }} data-qoder-id="qel-div-7a34850f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-7a34850f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:673,&quot;column&quot;:13}}">
              <FileTextOutlined style={{ fontSize: 40, marginBottom: 16, display: 'block', opacity: 0.3 }}  data-qoder-id="qel-filetextoutlined-eb6c9306" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-filetextoutlined-eb6c9306&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;filetextoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:674,&quot;column&quot;:15}}"/>
              <p style={{ fontSize: 15 }} data-qoder-id="qel-p-f503a115" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-p-f503a115&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocsPage&quot;,&quot;elementRole&quot;:&quot;p&quot;,&quot;loc&quot;:{&quot;line&quot;:675,&quot;column&quot;:15}}">未找到匹配的文档</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Document Detail ---- */
function DocDetailPage({ docId, ...qoderProps }) {
  const { navigate } = useNav();
  const doc = docData.find((d) => d.id === docId);

  if (!doc) {
    return (
      <div className={["page-content", qoderProps?.className].filter(Boolean).join(" ")} style={{ ...({ textAlign: 'center', paddingTop: 80 }), ...(qoderProps?.style) }} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
        <p style={{ color: 'var(--seed-muted)', fontSize: 15 }} data-qoder-id="qel-p-51251ce8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-p-51251ce8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;p&quot;,&quot;loc&quot;:{&quot;line&quot;:692,&quot;column&quot;:9}}">文档未找到</p>
        <Button onClick={() => navigate('docs')} style={{ marginTop: 16 }} data-qoder-id="qel-button-7ff3a94f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-7ff3a94f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:693,&quot;column&quot;:9}}">返回列表</Button>
      </div>
    );
  }

  const related = docData.filter((d) => d.id !== doc.id && d.category === doc.category).slice(0, 3);

  return (
    <div className="page-content fade-in" data-component="Document Detail Page" data-qoder-id="qel-document-detail-page-8754a62a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-document-detail-page-8754a62a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;document-detail-page&quot;,&quot;loc&quot;:{&quot;line&quot;:701,&quot;column&quot;:5}}">
      <div style={{ marginBottom: 20 }} data-qoder-id="qel-div-3ddae30d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-3ddae30d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:702,&quot;column&quot;:7}}">
        <Button
          type="text"
          icon={<ArrowLeftOutlined  data-qoder-id="qel-arrowleftoutlined-03eb6d9f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-arrowleftoutlined-03eb6d9f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;arrowleftoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:705,&quot;column&quot;:17}}"/>}
          onClick={() => navigate('docs')}
          style={{ color: 'var(--seed-muted)', paddingLeft: 0, fontWeight: 500 }}
         data-qoder-id="qel-button-7af3a170" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-7af3a170&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:703,&quot;column&quot;:9}}">
          返回文档列表
        </Button>
      </div>

      <Breadcrumb
        style={{ marginBottom: 12 }}
        items={[
          { title: <a onClick={() => navigate('docs')}>答疑文档</a> },
          { title: doc.categoryName },
          { title: doc.title },
        ]}
       data-qoder-id="qel-breadcrumb-1f520354" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-breadcrumb-1f520354&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;breadcrumb&quot;,&quot;loc&quot;:{&quot;line&quot;:713,&quot;column&quot;:7}}"/>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 40 }} data-qoder-id="qel-div-39dadcc1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-39dadcc1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:722,&quot;column&quot;:7}}">
        {/* Content */}
        <article data-qoder-id="qel-article-f1b8efac" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-article-f1b8efac&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;article&quot;,&quot;loc&quot;:{&quot;line&quot;:724,&quot;column&quot;:9}}">
          <h1 className="doc-detail-title" data-qoder-id="qel-doc-detail-title-6105e001" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-detail-title-6105e001&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;doc-detail-title&quot;,&quot;loc&quot;:{&quot;line&quot;:725,&quot;column&quot;:11}}">{doc.title}</h1>
          <div className="doc-detail-meta" data-qoder-id="qel-doc-detail-meta-d365df98" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-detail-meta-d365df98&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;doc-detail-meta&quot;,&quot;loc&quot;:{&quot;line&quot;:726,&quot;column&quot;:11}}">
            <Tag color="default" style={{ background: 'var(--seed-surface)', color: 'var(--seed-muted)' }} data-qoder-id="qel-tag-692ff4be" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-692ff4be&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:727,&quot;column&quot;:13}}">{doc.categoryName}</Tag>
            <span data-qoder-id="qel-span-0e162733" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-0e162733&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:728,&quot;column&quot;:13}}"><CalendarOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-calendaroutlined-cb355114" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-calendaroutlined-cb355114&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;calendaroutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:728,&quot;column&quot;:19}}"/>更新日期：{doc.date}</span>
          </div>

          <div className="doc-content" data-component="Document Content" data-qoder-id="qel-document-content-1b607c97" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-document-content-1b607c97&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;document-content&quot;,&quot;loc&quot;:{&quot;line&quot;:731,&quot;column&quot;:11}}">
            {doc.content.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} style={{ marginBottom: 8 }} data-qoder-id="qel-section-c334fd66" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-c334fd66&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;section&quot;,&quot;loc&quot;:{&quot;line&quot;:733,&quot;column&quot;:15}}">
                <h2 data-qoder-id="qel-h2-12c6598f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-h2-12c6598f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;h2&quot;,&quot;loc&quot;:{&quot;line&quot;:734,&quot;column&quot;:17}}">{section.title}</h2>
                <p data-qoder-id="qel-p-58276684" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-p-58276684&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;p&quot;,&quot;loc&quot;:{&quot;line&quot;:735,&quot;column&quot;:17}}">{section.text}</p>
              </section>
            ))}
          </div>
        </article>

        {/* TOC Sidebar */}
        <aside data-qoder-id="qel-aside-424c91c9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-aside-424c91c9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;aside&quot;,&quot;loc&quot;:{&quot;line&quot;:742,&quot;column&quot;:9}}">
          <div className="doc-toc" data-component="Table of Contents" data-qoder-id="qel-table-of-contents-386e23a6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-table-of-contents-386e23a6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;table-of-contents&quot;,&quot;loc&quot;:{&quot;line&quot;:743,&quot;column&quot;:11}}">
            <div className="doc-toc-title" data-qoder-id="qel-doc-toc-title-fb7afe48" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-doc-toc-title-fb7afe48&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;doc-toc-title&quot;,&quot;loc&quot;:{&quot;line&quot;:744,&quot;column&quot;:13}}">目录导航</div>
            {doc.content.sections.map((section, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className={i === 0 ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(`section-${i}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
               data-qoder-id="qel-a-b15fee06" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-a-b15fee06&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;a&quot;,&quot;loc&quot;:{&quot;line&quot;:746,&quot;column&quot;:15}}">
                {section.title}
              </a>
            ))}
          </div>
        </aside>
      </div>

      {/* Related Documents */}
      {related.length > 0 && (
        <section style={{ marginTop: 56, borderTop: '1px solid var(--seed-border)', paddingTop: 32 }} data-component="Related Documents" data-qoder-id="qel-related-documents-1d659c14" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-related-documents-1d659c14&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;related-documents&quot;,&quot;loc&quot;:{&quot;line&quot;:765,&quot;column&quot;:9}}">
          <h2 className="section-title" data-qoder-id="qel-section-title-b1245a4c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-section-title-b1245a4c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;section-title&quot;,&quot;loc&quot;:{&quot;line&quot;:766,&quot;column&quot;:11}}">相关文档</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }} data-qoder-id="qel-div-03a292d1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-03a292d1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:767,&quot;column&quot;:11}}">
            {related.map((d) => (
              <div key={d.id} className="related-card ant-card" onClick={() => navigate('docDetail', d.id)} data-qoder-id="qel-related-card-acc38541" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-related-card-acc38541&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;related-card&quot;,&quot;loc&quot;:{&quot;line&quot;:769,&quot;column&quot;:15}}">
                <div style={{ padding: '18px 20px' }} data-qoder-id="qel-div-01a28fab" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-01a28fab&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:770,&quot;column&quot;:17}}">
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--seed-fg)', marginBottom: 6, lineHeight: 1.35 }} data-qoder-id="qel-div-00a28e18" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-00a28e18&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:771,&quot;column&quot;:19}}">{d.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--seed-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} data-qoder-id="qel-div-ffa28c85" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-ffa28c85&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:772,&quot;column&quot;:19}}">{d.summary}</div>
                  <div style={{ fontSize: 12, color: 'var(--seed-muted)', marginTop: 10 }} data-qoder-id="qel-div-fea28af2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-fea28af2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;DocDetailPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:773,&quot;column&quot;:19}}">{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   Admin Pages
   ========================================================= */

/* ---- Admin Login ---- */
function AdminLoginPage({ onAdminLogin, onBackToUser, ...qoderProps }) {
  return (
    <div className={["login-page admin-login-page", qoderProps?.className].filter(Boolean).join(" ")} data-component="Admin Login Page" style={qoderProps?.style} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
      <div className="login-card fade-in" style={{ border: '2px solid var(--seed-primary)' }} data-qoder-id="qel-login-card-081c4961" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-card-081c4961&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;login-card&quot;,&quot;loc&quot;:{&quot;line&quot;:792,&quot;column&quot;:7}}">
        <div className="login-logo" data-qoder-id="qel-login-logo-9948c7e9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-logo-9948c7e9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;login-logo&quot;,&quot;loc&quot;:{&quot;line&quot;:793,&quot;column&quot;:9}}">
          <div className="nav-logo-icon" style={{ width: 36, height: 36, background: 'var(--seed-fg)' }} data-qoder-id="qel-nav-logo-icon-a2901360" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-nav-logo-icon-a2901360&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;nav-logo-icon&quot;,&quot;loc&quot;:{&quot;line&quot;:794,&quot;column&quot;:11}}">
            <SettingOutlined style={{ fontSize: 18 }}  data-qoder-id="qel-settingoutlined-62d3ab8d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-settingoutlined-62d3ab8d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;settingoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:795,&quot;column&quot;:13}}"/>
          </div>
          管理后台
        </div>
        <h1 className="login-title" data-qoder-id="qel-login-title-5afaf677" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-title-5afaf677&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;login-title&quot;,&quot;loc&quot;:{&quot;line&quot;:799,&quot;column&quot;:9}}">管理员登录</h1>
        <p className="login-subtitle" data-qoder-id="qel-login-subtitle-41bdb583" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-subtitle-41bdb583&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;login-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:800,&quot;column&quot;:9}}">仅限授权管理人员访问</p>
        <Form
          className="login-form"
          onFinish={(values) => {
            if (values.username === 'admin' && values.password === 'admin123') {
              onAdminLogin();
            } else {
              message.error('管理员账号或密码错误');
            }
          }}
          layout="vertical"
          size="large"
         data-qoder-id="qel-login-form-87fd4438" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-login-form-87fd4438&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;login-form&quot;,&quot;loc&quot;:{&quot;line&quot;:801,&quot;column&quot;:9}}">
          <Form.Item name="username" label={<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--seed-fg)' }} data-qoder-id="qel-span-ce3544e6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-ce3544e6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:813,&quot;column&quot;:45}}">管理员账号</span>} rules={[{ required: true, message: '请输入管理员账号' }]} data-qoder-id="qel-form-item-57b0da94" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-57b0da94&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:813,&quot;column&quot;:11}}">
            <Input prefix={<UserOutlined style={{ color: '#86868b' }} />} placeholder="请输入管理员账号"  data-qoder-id="qel-input-a4153572" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-a4153572&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:814,&quot;column&quot;:13}}"/>
          </Form.Item>
          <Form.Item name="password" label={<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--seed-fg)' }} data-qoder-id="qel-span-5b386174" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-5b386174&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:816,&quot;column&quot;:45}}">管理密码</span>} rules={[{ required: true, message: '请输入管理密码' }]} data-qoder-id="qel-form-item-e0b86e04" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-e0b86e04&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:816,&quot;column&quot;:11}}">
            <Input.Password prefix={<LockOutlined style={{ color: '#86868b' }} />} placeholder="请输入管理密码"  data-qoder-id="qel-input-password-9b7a1094" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-password-9b7a1094&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;input-password&quot;,&quot;loc&quot;:{&quot;line&quot;:817,&quot;column&quot;:13}}"/>
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }} data-qoder-id="qel-form-item-ddb8694b" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-ddb8694b&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:819,&quot;column&quot;:11}}">
            <Button type="primary" htmlType="submit" block icon={<LoginOutlined  data-qoder-id="qel-loginoutlined-93ea64fc" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-loginoutlined-93ea64fc&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;loginoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:820,&quot;column&quot;:66}}"/>} style={{ fontWeight: 500 }} data-qoder-id="qel-button-00f754a1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-00f754a1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:820,&quot;column&quot;:13}}">
              登录管理后台
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }} data-qoder-id="qel-div-a9815c9f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-a9815c9f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:824,&quot;column&quot;:11}}">
            <a href="#" onClick={(e) => { e.preventDefault(); onBackToUser(); }} style={{ fontSize: 14, color: 'var(--seed-muted)', textDecoration: 'none' }} data-qoder-id="qel-a-53c6f392" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-a-53c6f392&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;a&quot;,&quot;loc&quot;:{&quot;line&quot;:825,&quot;column&quot;:13}}">
              <ArrowLeftOutlined style={{ marginRight: 4 }}  data-qoder-id="qel-arrowleftoutlined-5f47bdb5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-arrowleftoutlined-5f47bdb5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminLoginPage&quot;,&quot;elementRole&quot;:&quot;arrowleftoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:826,&quot;column&quot;:15}}"/>返回用户登录
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

/* ---- Admin Dashboard ---- */
function AdminDashboardPage({ videos, onSaveVideo, onDeleteVideo, onTogglePublished, onLogout, ...qoderProps }) {
  const { navigate } = useNav();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingVideo(null);
    form.resetFields();
    form.setFieldsValue({
      category: '合规培训',
      videoType: 'direct',
      gradient: gradientOptions[0].value,
      published: true,
    });
    setModalOpen(true);
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    form.setFieldsValue({
      ...video,
      chapters: video.chapters ? JSON.stringify(video.chapters) : '[]',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      let chapters = [];
      try {
        chapters = typeof values.chapters === 'string' ? JSON.parse(values.chapters) : values.chapters;
      } catch { chapters = []; }

      const videoData = {
        ...values,
        chapters,
        id: editingVideo ? editingVideo.id : Date.now(),
      };
      onSaveVideo(videoData);
      setModalOpen(false);
      form.resetFields();
      message.success(editingVideo ? '视频已更新' : '视频已添加');
    });
  };

  const columns = [
    {
      title: '视频',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} data-qoder-id="qel-div-45827b42" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-45827b42&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:889,&quot;column&quot;:9}}">
          <div style={{ width: 56, height: 32, borderRadius: 6, background: record.gradient, flexShrink: 0 }}  data-qoder-id="qel-div-46827cd5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-46827cd5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:890,&quot;column&quot;:11}}"/>
          <span style={{ fontWeight: 500, fontSize: 14 }} data-qoder-id="qel-span-19ec8678" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-19ec8678&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:891,&quot;column&quot;:11}}">{text}</span>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text) => <Tag data-qoder-id="qel-tag-4086bdb3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-4086bdb3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:900,&quot;column&quot;:25}}">{text}</Tag>,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 110,
    },
    {
      title: '视频源',
      key: 'source',
      width: 120,
      render: (_, record) => {
        if (!record.videoUrl) return <span style={{ color: 'var(--seed-muted)', fontSize: 13 }} data-qoder-id="qel-span-1fec8fea" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-span-1fec8fea&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;span&quot;,&quot;loc&quot;:{&quot;line&quot;:919,&quot;column&quot;:38}}">未设置</span>;
        const label = record.videoType === 'direct' ? '直链' : record.videoType === 'embed' ? '嵌入' : '模拟';
        return <Tag color={record.videoType === 'direct' ? 'blue' : record.videoType === 'embed' ? 'green' : 'default'} data-qoder-id="qel-tag-4686c725" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-tag-4686c725&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;tag&quot;,&quot;loc&quot;:{&quot;line&quot;:921,&quot;column&quot;:16}}">{label}</Tag>;
      },
    },
    {
      title: '上架状态',
      key: 'published',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.published}
          onChange={(checked) => onTogglePublished(record.id, checked)}
          checkedChildren="上架"
          unCheckedChildren="下架"
          size="small"
         data-qoder-id="qel-switch-59e0fad8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-switch-59e0fad8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;switch&quot;,&quot;loc&quot;:{&quot;line&quot;:929,&quot;column&quot;:9}}"/>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4 }} data-qoder-id="qel-div-40827363" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-40827363&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:943,&quot;column&quot;:9}}">
          <Button type="text" size="small" icon={<EditOutlined  data-qoder-id="qel-editoutlined-96433a69" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-editoutlined-96433a69&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;editoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:944,&quot;column&quot;:50}}"/>} onClick={() => handleEdit(record)} style={{ color: 'var(--seed-primary)' }} data-qoder-id="qel-button-75ab6de2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-75ab6de2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:944,&quot;column&quot;:11}}">
            编辑
          </Button>
          <Popconfirm
            title="确定删除此视频？"
            description="删除后将无法恢复"
            onConfirm={() => { onDeleteVideo(record.id); message.success('视频已删除'); }}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
           data-qoder-id="qel-popconfirm-a832f2cf" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-popconfirm-a832f2cf&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;popconfirm&quot;,&quot;loc&quot;:{&quot;line&quot;:947,&quot;column&quot;:11}}">
            <Button type="text" size="small" icon={<DeleteOutlined  data-qoder-id="qel-deleteoutlined-c226c2e5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-deleteoutlined-c226c2e5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;deleteoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:955,&quot;column&quot;:52}}"/>} style={{ color: 'var(--seed-danger)' }} data-qoder-id="qel-button-eeb2e822" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-eeb2e822&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:955,&quot;column&quot;:13}}">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={["page-content fade-in", qoderProps?.className].filter(Boolean).join(" ")} data-component="Admin Dashboard" style={qoderProps?.style} data-qoder-id={qoderProps?.["data-qoder-id"]} data-qoder-source={qoderProps?.["data-qoder-source"]}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} data-qoder-id="qel-div-53894d11" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-53894d11&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:967,&quot;column&quot;:7}}">
        <div data-qoder-id="qel-div-52894b7e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-52894b7e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:968,&quot;column&quot;:9}}">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }} data-qoder-id="qel-div-518949eb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-518949eb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:969,&quot;column&quot;:11}}">
            <SettingOutlined style={{ fontSize: 22, color: 'var(--seed-primary)' }}  data-qoder-id="qel-settingoutlined-52425d74" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-settingoutlined-52425d74&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;settingoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:970,&quot;column&quot;:13}}"/>
            <h1 className="page-title" style={{ margin: 0 }} data-qoder-id="qel-page-title-af736cb4" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-title-af736cb4&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;page-title&quot;,&quot;loc&quot;:{&quot;line&quot;:971,&quot;column&quot;:13}}">视频管理后台</h1>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }} data-qoder-id="qel-page-subtitle-8bb9b320" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-page-subtitle-8bb9b320&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;page-subtitle&quot;,&quot;loc&quot;:{&quot;line&quot;:973,&quot;column&quot;:11}}">管理培训视频内容、上架状态和视频链接</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }} data-qoder-id="qel-div-51870b54" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-51870b54&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:975,&quot;column&quot;:9}}">
          <Button onClick={() => navigate('home')} icon={<ArrowLeftOutlined  data-qoder-id="qel-arrowleftoutlined-983ab73e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-arrowleftoutlined-983ab73e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;arrowleftoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:976,&quot;column&quot;:58}}"/>} data-qoder-id="qel-button-eab0a33f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-eab0a33f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:976,&quot;column&quot;:11}}">
            返回前台
          </Button>
          <Button type="primary" icon={<PlusOutlined  data-qoder-id="qel-plusoutlined-1d3d207c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-plusoutlined-1d3d207c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;plusoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:979,&quot;column&quot;:40}}"/>} onClick={handleAdd} data-qoder-id="qel-button-ecb0a665" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-button-ecb0a665&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;button&quot;,&quot;loc&quot;:{&quot;line&quot;:979,&quot;column&quot;:11}}">
            添加视频
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-row" data-qoder-id="qel-admin-stats-row-57bdfa78" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stats-row-57bdfa78&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stats-row&quot;,&quot;loc&quot;:{&quot;line&quot;:986,&quot;column&quot;:7}}">
        <div className="admin-stat-card" data-qoder-id="qel-admin-stat-card-e57c1788" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-card-e57c1788&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-card&quot;,&quot;loc&quot;:{&quot;line&quot;:987,&quot;column&quot;:9}}">
          <div className="admin-stat-num" data-qoder-id="qel-admin-stat-num-04dda027" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-num-04dda027&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-num&quot;,&quot;loc&quot;:{&quot;line&quot;:988,&quot;column&quot;:11}}">{videos.length}</div>
          <div className="admin-stat-label" data-qoder-id="qel-admin-stat-label-c3e1605c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-label-c3e1605c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-label&quot;,&quot;loc&quot;:{&quot;line&quot;:989,&quot;column&quot;:11}}">总视频数</div>
        </div>
        <div className="admin-stat-card" data-qoder-id="qel-admin-stat-card-e47c15f5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-card-e47c15f5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-card&quot;,&quot;loc&quot;:{&quot;line&quot;:991,&quot;column&quot;:9}}">
          <div className="admin-stat-num" style={{ color: 'var(--seed-success)' }} data-qoder-id="qel-admin-stat-num-fbdb5365" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-num-fbdb5365&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-num&quot;,&quot;loc&quot;:{&quot;line&quot;:992,&quot;column&quot;:11}}">{videos.filter(v => v.published).length}</div>
          <div className="admin-stat-label" data-qoder-id="qel-admin-stat-label-3ce8da9c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-label-3ce8da9c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-label&quot;,&quot;loc&quot;:{&quot;line&quot;:993,&quot;column&quot;:11}}">已上架</div>
        </div>
        <div className="admin-stat-card" data-qoder-id="qel-admin-stat-card-e379d5cb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-card-e379d5cb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-card&quot;,&quot;loc&quot;:{&quot;line&quot;:995,&quot;column&quot;:9}}">
          <div className="admin-stat-num" style={{ color: 'var(--seed-muted)' }} data-qoder-id="qel-admin-stat-num-f8db4eac" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-num-f8db4eac&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-num&quot;,&quot;loc&quot;:{&quot;line&quot;:996,&quot;column&quot;:11}}">{videos.filter(v => !v.published).length}</div>
          <div className="admin-stat-label" data-qoder-id="qel-admin-stat-label-39e8d5e3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-label-39e8d5e3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-label&quot;,&quot;loc&quot;:{&quot;line&quot;:997,&quot;column&quot;:11}}">已下架</div>
        </div>
        <div className="admin-stat-card" data-qoder-id="qel-admin-stat-card-e879ddaa" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-card-e879ddaa&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-card&quot;,&quot;loc&quot;:{&quot;line&quot;:999,&quot;column&quot;:9}}">
          <div className="admin-stat-num" style={{ color: 'var(--seed-primary)' }} data-qoder-id="qel-admin-stat-num-f5db49f3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-num-f5db49f3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-num&quot;,&quot;loc&quot;:{&quot;line&quot;:1000,&quot;column&quot;:11}}">{videos.filter(v => v.videoUrl).length}</div>
          <div className="admin-stat-label" data-qoder-id="qel-admin-stat-label-3ae8d776" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-stat-label-3ae8d776&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-stat-label&quot;,&quot;loc&quot;:{&quot;line&quot;:1001,&quot;column&quot;:11}}">已设置视频源</div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper" data-qoder-id="qel-admin-table-wrapper-e23c3b5c" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admin-table-wrapper-e23c3b5c&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;admin-table-wrapper&quot;,&quot;loc&quot;:{&quot;line&quot;:1006,&quot;column&quot;:7}}">
        <Table
          columns={columns}
          dataSource={videos}
          rowKey="id"
          pagination={false}
          size="middle"
          rowClassName="admin-table-row"
         data-qoder-id="qel-table-3e418a78" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-table-3e418a78&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;table&quot;,&quot;loc&quot;:{&quot;line&quot;:1007,&quot;column&quot;:9}}"/>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingVideo ? '编辑视频' : '添加视频'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        width={640}
        okText={editingVideo ? '保存修改' : '添加视频'}
        cancelText="取消"
        destroyOnClose
       data-qoder-id="qel-modal-a43e1c2e" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-modal-a43e1c2e&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;modal&quot;,&quot;loc&quot;:{&quot;line&quot;:1018,&quot;column&quot;:7}}">
        <Form form={form} layout="vertical" style={{ marginTop: 16 }} data-qoder-id="qel-form-bc37d105" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-bc37d105&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form&quot;,&quot;loc&quot;:{&quot;line&quot;:1028,&quot;column&quot;:9}}">
          <Form.Item name="title" label="视频标题" rules={[{ required: true, message: '请输入视频标题' }]} data-qoder-id="qel-form-item-f4e0c9e5" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-f4e0c9e5&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1029,&quot;column&quot;:11}}">
            <Input placeholder="请输入视频标题"  data-qoder-id="qel-input-49f3010f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-49f3010f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:1030,&quot;column&quot;:13}}"/>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} data-qoder-id="qel-div-c18c38d2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c18c38d2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:1033,&quot;column&quot;:11}}">
            <Form.Item name="category" label="分类" rules={[{ required: true }]} data-qoder-id="qel-form-item-ede0bee0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-ede0bee0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1034,&quot;column&quot;:13}}">
              <Select placeholder="选择分类" data-qoder-id="qel-select-e9740af8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-e9740af8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select&quot;,&quot;loc&quot;:{&quot;line&quot;:1035,&quot;column&quot;:15}}">
                {videoCategories.filter(c => c !== '全部').map(cat => (
                  <Select.Option key={cat} value={cat} data-qoder-id="qel-select-option-b011e7ea" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-option-b011e7ea&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select-option&quot;,&quot;loc&quot;:{&quot;line&quot;:1037,&quot;column&quot;:19}}">{cat}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="duration" label="时长" rules={[{ required: true, message: '例如 45:30' }]} data-qoder-id="qel-form-item-fae0d357" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-fae0d357&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1041,&quot;column&quot;:13}}">
              <Input placeholder="例如 45:30"  data-qoder-id="qel-input-53f310cd" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-53f310cd&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:1042,&quot;column&quot;:15}}"/>
            </Form.Item>
          </div>

          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请输入日期' }]} data-qoder-id="qel-form-item-f8e30ec8" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-f8e30ec8&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1046,&quot;column&quot;:11}}">
            <Input placeholder="例如 2024-03-15"  data-qoder-id="qel-input-cc0e1132" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-cc0e1132&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:1047,&quot;column&quot;:13}}"/>
          </Form.Item>

          <Form.Item name="desc" label="内容描述" rules={[{ required: true, message: '请输入内容描述' }]} data-qoder-id="qel-form-item-fae311ee" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-fae311ee&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1050,&quot;column&quot;:11}}">
            <Input.TextArea rows={3} placeholder="请输入视频内容描述"  data-qoder-id="qel-input-textarea-1d77f3e9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-textarea-1d77f3e9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input-textarea&quot;,&quot;loc&quot;:{&quot;line&quot;:1051,&quot;column&quot;:13}}"/>
          </Form.Item>

          <div style={{ borderTop: '1px solid var(--seed-border)', paddingTop: 16, marginTop: 8 }} data-qoder-id="qel-div-5393da6d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-5393da6d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:1054,&quot;column&quot;:11}}">
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--seed-fg)', marginBottom: 12 }} data-qoder-id="qel-div-5293d8da" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-5293d8da&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:1055,&quot;column&quot;:13}}">
              <VideoCameraOutlined style={{ marginRight: 6 }}  data-qoder-id="qel-videocameraoutlined-b00e6f7f" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-videocameraoutlined-b00e6f7f&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;videocameraoutlined&quot;,&quot;loc&quot;:{&quot;line&quot;:1056,&quot;column&quot;:15}}"/>视频源设置
            </div>

            <Form.Item name="videoType" label="视频类型" data-qoder-id="qel-form-item-ffe319cd" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-ffe319cd&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1059,&quot;column&quot;:13}}">
              <Select data-qoder-id="qel-select-e9673f05" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-e9673f05&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select&quot;,&quot;loc&quot;:{&quot;line&quot;:1060,&quot;column&quot;:15}}">
                <Select.Option value="direct" data-qoder-id="qel-select-option-2a286e47" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-option-2a286e47&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select-option&quot;,&quot;loc&quot;:{&quot;line&quot;:1061,&quot;column&quot;:17}}">在线直链（MP4等）</Select.Option>
                <Select.Option value="embed" data-qoder-id="qel-select-option-272aa825" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-option-272aa825&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select-option&quot;,&quot;loc&quot;:{&quot;line&quot;:1062,&quot;column&quot;:17}}">嵌入链接（iframe）</Select.Option>
                <Select.Option value="mock" data-qoder-id="qel-select-option-262aa692" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-option-262aa692&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select-option&quot;,&quot;loc&quot;:{&quot;line&quot;:1063,&quot;column&quot;:17}}">模拟播放器</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="videoUrl" label="视频链接" extra="支持在线MP4链接、嵌入播放链接，留空则显示模拟播放器" data-qoder-id="qel-form-item-fce553ab" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-fce553ab&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1067,&quot;column&quot;:13}}">
              <Input placeholder="https://example.com/video.mp4 或嵌入链接"  data-qoder-id="qel-input-ca0bcf75" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-ca0bcf75&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input&quot;,&quot;loc&quot;:{&quot;line&quot;:1068,&quot;column&quot;:15}}"/>
            </Form.Item>
          </div>

          <Form.Item name="gradient" label="封面渐变色" data-qoder-id="qel-form-item-02e55d1d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-02e55d1d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1072,&quot;column&quot;:11}}">
            <Select data-qoder-id="qel-select-e864fedb" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-e864fedb&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select&quot;,&quot;loc&quot;:{&quot;line&quot;:1073,&quot;column&quot;:13}}">
              {gradientOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value} data-qoder-id="qel-select-option-212a9eb3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-select-option-212a9eb3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;select-option&quot;,&quot;loc&quot;:{&quot;line&quot;:1075,&quot;column&quot;:17}}">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} data-qoder-id="qel-div-d090cd9d" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-d090cd9d&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:1076,&quot;column&quot;:19}}">
                    <div style={{ width: 24, height: 14, borderRadius: 4, background: opt.value }}  data-qoder-id="qel-div-c190b600" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-div-c190b600&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;div&quot;,&quot;loc&quot;:{&quot;line&quot;:1077,&quot;column&quot;:21}}"/>
                    {opt.label}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="chapters" label="章节（JSON格式）" extra='例如：[{"title":"第一章","time":"00:00"},{"title":"第二章","time":"10:30"}]' data-qoder-id="qel-form-item-f5e548a6" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-f5e548a6&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1085,&quot;column&quot;:11}}">
            <Input.TextArea rows={3} placeholder='[{"title":"第一章","time":"00:00"}]'  data-qoder-id="qel-input-textarea-09238d63" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-input-textarea-09238d63&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;input-textarea&quot;,&quot;loc&quot;:{&quot;line&quot;:1086,&quot;column&quot;:13}}"/>
          </Form.Item>

          <Form.Item name="published" label="上架状态" valuePropName="checked" data-qoder-id="qel-form-item-6666d278" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-form-item-6666d278&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;form-item&quot;,&quot;loc&quot;:{&quot;line&quot;:1089,&quot;column&quot;:11}}">
            <Switch checkedChildren="上架" unCheckedChildren="下架"  data-qoder-id="qel-switch-d94752f0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-switch-d94752f0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;AdminDashboardPage&quot;,&quot;elementRole&quot;:&quot;switch&quot;,&quot;loc&quot;:{&quot;line&quot;:1090,&quot;column&quot;:13}}"/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

/* =========================================================
   App Root
   ========================================================= */

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('张明');
  const [route, setRoute] = useState({ page: 'home', id: null, query: '' });
  const [videos, setVideos] = useState(initialVideoData);
  const [msgApi, msgContextHolder] = message.useMessage();

  const navigate = (page, id = null, query = '') => {
    setRoute({ page, id, query });
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    if (name) setUserName(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('home');
  };

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setUserName('管理员');
    navigate('admin');
  };

  const handleSearch = (query) => {
    navigate('videos', null, query);
  };

  // Video CRUD for admin
  const handleSaveVideo = (videoData) => {
    setVideos(prev => {
      const idx = prev.findIndex(v => v.id === videoData.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = videoData;
        return updated;
      }
      return [...prev, videoData];
    });
  };

  const handleDeleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const handleTogglePublished = (id, published) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, published } : v));
  };

  // Frontend only shows published videos
  const publishedVideos = videos.filter(v => v.published);

  const renderPage = () => {
    switch (route.page) {
      case 'adminLogin':
        return <AdminLoginPage onAdminLogin={handleAdminLogin} onBackToUser={() => navigate('home')}  data-qoder-id="qel-adminloginpage-56b50da2" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-adminloginpage-56b50da2&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;adminloginpage&quot;,&quot;loc&quot;:{&quot;line&quot;:1164,&quot;column&quot;:16}}"/>;
      case 'admin':
        if (!isAdmin) return <AdminLoginPage onAdminLogin={handleAdminLogin} onBackToUser={() => navigate('home')}  data-qoder-id="qel-adminloginpage-51b505c3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-adminloginpage-51b505c3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;adminloginpage&quot;,&quot;loc&quot;:{&quot;line&quot;:1166,&quot;column&quot;:30}}"/>;
        return <AdminDashboardPage videos={videos} onSaveVideo={handleSaveVideo} onDeleteVideo={handleDeleteVideo} onTogglePublished={handleTogglePublished} onLogout={handleLogout}  data-qoder-id="qel-admindashboardpage-cb17779a" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-admindashboardpage-cb17779a&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;admindashboardpage&quot;,&quot;loc&quot;:{&quot;line&quot;:1167,&quot;column&quot;:16}}"/>;
      case 'videos':
        return <VideosPage videos={publishedVideos}  data-qoder-id="qel-videospage-2b8ce2a9" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-videospage-2b8ce2a9&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;videospage&quot;,&quot;loc&quot;:{&quot;line&quot;:1169,&quot;column&quot;:16}}"/>;
      case 'videoDetail':
        return <VideoDetailPage videoId={route.id} videos={publishedVideos}  data-qoder-id="qel-videodetailpage-8037a048" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-videodetailpage-8037a048&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;videodetailpage&quot;,&quot;loc&quot;:{&quot;line&quot;:1171,&quot;column&quot;:16}}"/>;
      case 'docs':
        return <DocsPage  data-qoder-id="qel-docspage-eed592d1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-docspage-eed592d1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;docspage&quot;,&quot;loc&quot;:{&quot;line&quot;:1173,&quot;column&quot;:16}}"/>;
      case 'docDetail':
        return <DocDetailPage docId={route.id}  data-qoder-id="qel-docdetailpage-538871ee" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-docdetailpage-538871ee&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;docdetailpage&quot;,&quot;loc&quot;:{&quot;line&quot;:1175,&quot;column&quot;:16}}"/>;
      default:
        return <HomePage isLoggedIn={isLoggedIn} onLogin={handleLogin} onAdminLink={() => navigate('adminLogin')}  data-qoder-id="qel-homepage-f1ac68f0" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-homepage-f1ac68f0&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;homepage&quot;,&quot;loc&quot;:{&quot;line&quot;:1177,&quot;column&quot;:16}}" style={{ backgroundColor: "rgb(55, 64, 48)", backgroundColor: "rgb(81, 95, 70)" }}/>;
    }
  };

  return (
    <ConfigProvider theme={themeConfig} data-qoder-id="qel-configprovider-d12100b1" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-configprovider-d12100b1&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;configprovider&quot;,&quot;loc&quot;:{&quot;line&quot;:1182,&quot;column&quot;:5}}">
      {msgContextHolder}
      <NavContext.Provider value={{ route, navigate }} data-qoder-id="qel-navcontext-provider-a7ae06c3" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-navcontext-provider-a7ae06c3&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;navcontext-provider&quot;,&quot;loc&quot;:{&quot;line&quot;:1184,&quot;column&quot;:7}}">
        <div data-component="App Root" style={{ minHeight: '100vh', background: 'var(--seed-bg)' }} data-qoder-id="qel-app-root-f9633142" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-app-root-f9633142&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;app-root&quot;,&quot;loc&quot;:{&quot;line&quot;:1185,&quot;column&quot;:9}}">
          {route.page !== 'adminLogin' && (
            <NavBar
              isLoggedIn={isLoggedIn}
              userName={userName}
              onSearch={handleSearch}
              onLogout={handleLogout}
              isAdmin={isAdmin}
              onAdminNavigate={() => navigate('admin')}
             data-qoder-id="qel-navbar-7e548384" data-qoder-source="{&quot;qoderId&quot;:&quot;qel-navbar-7e548384&quot;,&quot;filePath&quot;:&quot;react-vite/src/App.jsx&quot;,&quot;componentName&quot;:&quot;App&quot;,&quot;elementRole&quot;:&quot;navbar&quot;,&quot;loc&quot;:{&quot;line&quot;:1187,&quot;column&quot;:13}}"/>
          )}
          {renderPage()}
        </div>
      </NavContext.Provider>
    </ConfigProvider>
  );
}
