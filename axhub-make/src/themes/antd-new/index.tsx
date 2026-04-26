/**
 * @name Ant Design System
 *
 * 基于 Ant Design 官方规范的设计系统演示
 * 参考：https://ant.design/docs/spec/values-cn
 */

import './style.css';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ConfigProvider } from 'antd';
import { ThemeShell, NavGroup, NavItem, MarkdownViewer } from '../../common/ThemeShell';
import tokens from './designToken.json';

const Colors = lazy(() => import('./foundations/Colors').then(m => ({ default: m.Colors })));
const TypographySection = lazy(() => import('./foundations/Typography').then(m => ({ default: m.TypographySection })));
const Spacing = lazy(() => import('./foundations/Spacing').then(m => ({ default: m.Spacing })));
const IconsSection = lazy(() => import('./foundations/Icons').then(m => ({ default: m.IconsSection })));
const Shadows = lazy(() => import('./foundations/Shadows').then(m => ({ default: m.Shadows })));
const Radius = lazy(() => import('./foundations/Radius').then(m => ({ default: m.Radius })));
const ButtonSection = lazy(() => import('./components/Button').then(m => ({ default: m.ButtonSection })));
const InputSection = lazy(() => import('./components/Input').then(m => ({ default: m.InputSection })));
const CardSection = lazy(() => import('./components/Card').then(m => ({ default: m.CardSection })));
const LoginTemplate = lazy(() => import('./templates/LoginTemplate').then(m => ({ default: m.LoginTemplate })));
const DashboardTemplate = lazy(() => import('./templates/DashboardTemplate').then(m => ({ default: m.DashboardTemplate })));

const LoadingFallback = () => (
  <div className="text-center py-12" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>加载中...</div>
);

// Navigation Groups
const NAV_GROUPS: NavGroup[] = [
  { id: 'docs', title: '说明', order: 1 },
  { id: 'foundation', title: '基础要素', order: 2 },
  { id: 'components', title: '组件', order: 3 },
  { id: 'templates', title: '模板', order: 4 },
];

// Navigation Items
const NAV_ITEMS: NavItem[] = [
  { id: 'design-spec', label: '设计规范 Design Spec', groupId: 'docs' },

  { id: 'colors', label: '色彩 Colors', groupId: 'foundation' },
  { id: 'typography', label: '排版 Typography', groupId: 'foundation' },
  { id: 'spacing', label: '间距 Spacing', groupId: 'foundation' },
  { id: 'icons', label: '图标 Icons', groupId: 'foundation' },
  { id: 'shadows', label: '阴影 Shadows', groupId: 'foundation' },
  { id: 'radius', label: '圆角 Radius', groupId: 'foundation' },

  { id: 'buttons', label: '按钮 Button', groupId: 'components' },
  { id: 'inputs', label: '输入框 Input', groupId: 'components' },
  { id: 'cards', label: '卡片 Card', groupId: 'components' },

  { id: 'login', label: '登录页 Login', groupId: 'templates' },
  { id: 'dashboard', label: '仪表盘 Dashboard', groupId: 'templates' },
];

// ============ Component ============

const Component: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design-spec');
  const [designSpec, setDesignSpec] = useState<string>('');

  const baseTokens = tokens as Record<string, any>;

  useEffect(() => {
    fetch(new URL('./DESIGN-SPEC.md', import.meta.url).href)
      .then(res => res.text())
      .then(text => setDesignSpec(text))
      .catch(err => console.error('Failed to load Design Spec:', err));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'design-spec':
        return designSpec ? <MarkdownViewer content={designSpec} /> : (
          <LoadingFallback />
        );

      case 'colors':
        return <Suspense fallback={<LoadingFallback />}><Colors tokens={baseTokens} /></Suspense>;

      case 'typography':
        return <Suspense fallback={<LoadingFallback />}><TypographySection tokens={baseTokens} /></Suspense>;

      case 'spacing':
        return <Suspense fallback={<LoadingFallback />}><Spacing tokens={baseTokens} /></Suspense>;

      case 'icons':
        return <Suspense fallback={<LoadingFallback />}><IconsSection tokens={baseTokens} /></Suspense>;

      case 'shadows':
        return <Suspense fallback={<LoadingFallback />}><Shadows tokens={baseTokens} /></Suspense>;

      case 'radius':
        return <Suspense fallback={<LoadingFallback />}><Radius tokens={baseTokens} /></Suspense>;

      case 'buttons':
        return <Suspense fallback={<LoadingFallback />}><ButtonSection tokens={baseTokens} /></Suspense>;

      case 'inputs':
        return <Suspense fallback={<LoadingFallback />}><InputSection tokens={baseTokens} /></Suspense>;

      case 'cards':
        return <Suspense fallback={<LoadingFallback />}><CardSection tokens={baseTokens} /></Suspense>;

      case 'login':
        return <Suspense fallback={<LoadingFallback />}><LoginTemplate /></Suspense>;

      case 'dashboard':
        return <Suspense fallback={<LoadingFallback />}><DashboardTemplate /></Suspense>;

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6" style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
              <span className="text-2xl font-mono">;</span>
            </div>
            <h2 className="mt-0 text-xl font-semibold mb-2" style={{ color: 'rgba(0, 0, 0, 0.88)' }}>施工中 Work in Progress</h2>
            <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              <span className="font-medium" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{activeTab}</span> 模块正在开发中...
            </p>
          </div>
        );
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: baseTokens.colorPrimary || '#1677ff',
          borderRadius: typeof baseTokens.borderRadius === 'number' ? baseTokens.borderRadius : 6,
          fontSize: typeof baseTokens.fontSize === 'number' ? baseTokens.fontSize : 14,
        },
      }}
    >
      <ThemeShell
        brand={{
          name: 'Ant Design',
          subtitle: 'Design System',
          logoBgColor: '#1677ff',
          logoTextColor: '#ffffff',
        }}
        groups={NAV_GROUPS}
        items={NAV_ITEMS}
        activeId={activeTab}
        onNavigate={setActiveTab}
        sidebar={{
          defaultOpen: true,
          collapsible: true,
          width: 256,
        }}
        className="antd-new-theme"
      >
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </ThemeShell>
    </ConfigProvider>
  );
};

export default Component;
