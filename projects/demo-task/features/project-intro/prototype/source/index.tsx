import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Sparkles, Layers, Database, Shield, Cloud, Settings, Zap, Rocket, Brain, ChevronDown, X } from 'lucide-react';
import './style.css';

const ProjectIntro = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "智能原型生成",
      description: "AI 驱动的原型设计，根据需求自动生成高质量界面布局"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "语义化文档",
      description: "自动生成研发文档、PRD 和技术规格说明"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "多主题支持",
      description: "丰富的设计系统主题，一键切换不同视觉风格"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "快速迭代",
      description: "热更新开发体验，即时预览设计效果"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "数据管理",
      description: "内置数据表和状态管理，模拟真实业务场景"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "安全可控",
      description: "本地优先的数据存储，保障项目资产安全"
    }
  ];

  const workflows = [
    {
      id: 0,
      number: "00",
      title: "新增需求或页面流水线",
      desc: "在项目中快速创建新页面和相关文件结构，为需求开发做准备",
      detail: "该流水线用于处理新需求的初始化工作，自动创建页面所需的文件结构，包括组件文件、样式文件和配置文件等。通过标准化的文件结构，确保开发团队能够快速上手新需求，提高开发效率。"
    },
    {
      id: 1,
      number: "01",
      title: "现有资产盘点流水线",
      desc: "扫描历史项目资产，建立项目知识库，为后续开发提供参考",
      detail: "通过扫描项目的历史资产，包括代码、文档、设计文件等，建立完整的项目知识库。这有助于新团队成员快速了解项目结构和历史决策，也为后续的需求开发提供有价值的参考资料。"
    },
    {
      id: 2,
      number: "02",
      title: "Axhub 精细还原流水线",
      desc: "将 Axhub 导出的原型包还原为高保真的 React 原型组件",
      detail: "该流水线专门处理从 Axhub 导出的设计原型，通过智能分析和转换，将设计文件还原为可交互的 React 原型组件。还原过程保持设计细节的准确性，确保最终的原型与设计稿高度一致。"
    },
    {
      id: 3,
      number: "03",
      title: "需求梳理流水线",
      desc: "将模糊的需求描述转化为结构化的产品需求文档",
      detail: "通过 AI 分析和处理，将初步的需求描述转化为结构化、详细的产品需求文档。流水线会识别需求中的关键信息，补充缺失的细节，并按照标准格式组织文档内容，为后续的开发和设计提供清晰的指导。"
    },
    {
      id: 4,
      number: "03.5",
      title: "需求同步流水线",
      desc: "同步更新手动修改的需求文档，重新生成 Axhub Prompt",
      detail: "当需求文档被手动修改后，该流水线会自动同步这些变更，并重新生成 Axhub Prompt。这确保了设计工具能够使用最新的需求信息，保持设计与需求的一致性。"
    },
    {
      id: 5,
      number: "04",
      title: "原型开发流水线",
      desc: "基于 Axhub Prompt 开发高保真的 React 原型组件",
      detail: "使用 Axhub Prompt 作为输入，自动生成高保真的 React 原型组件。流水线会处理组件的结构、样式和交互逻辑，生成可直接使用的原型代码，大大减少手动编码的工作量。"
    },
    {
      id: 6,
      number: "05",
      title: "反向文档同步流水线",
      desc: "从现有代码逆向推导生成或更新文档，确保文档与代码同步",
      detail: "通过分析现有代码，逆向推导出相应的文档内容。这有助于保持文档与代码的同步，特别是在代码频繁变更的情况下，确保文档始终反映最新的实现状态。"
    },
    {
      id: 7,
      number: "06",
      title: "UI 走查打磨流水线",
      desc: "对原型进行 UI/UX 审查和打磨，确保界面符合企业级规范",
      detail: "对生成的原型进行全面的 UI/UX 审查，检查界面是否符合企业级设计规范，包括布局、配色、字体、交互等方面。流水线会自动识别并修复潜在的设计问题，确保最终的原型达到专业的视觉效果。"
    },
    {
      id: 8,
      number: "07",
      title: "测试验证流水线",
      desc: "自动测试功能，确保代码质量，为后续交付做准备",
      detail: "对生成的原型代码进行自动测试，包括功能测试、性能测试和兼容性测试等。测试结果会生成详细的报告，帮助开发团队识别和修复潜在的问题，确保代码质量达到交付标准。"
    }
  ];

  const techStack = [
    { name: "React", version: "18.2.0", color: "#61DAFB" },
    { name: "TypeScript", version: "5.9.3", color: "#3178C6" },
    { name: "Vite", version: "5.0.0", color: "#646CFF" },
    { name: "Ant Design", version: "6.1.2", color: "#1677FF" },
    { name: "Tailwind", version: "4.1.18", color: "#38BDF8" },
    { name: "ECharts", version: "6.0.0", color: "#E53E3E" }
  ];

  const teamMembers = [
    { name: "张明远", position: "产品负责人", initials: "张" },
    { name: "林思雨", position: "设计负责人", initials: "林" },
    { name: "王浩宇", position: "技术负责人", initials: "王" },
    { name: "陈晓文", position: "研发工程师", initials: "陈" }
  ];

  return (
    <div className={`intro-page ${isLoaded ? 'loaded' : ''}`}>
      {/* 导航栏 */}
      <nav className={`nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <span className="brand-text">Axhub Make</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link active">首页</a>
            <a href="#features" className="nav-link">功能</a>
            <a href="#workflows" className="nav-link">流水线</a>
            <a href="#tech" className="nav-link">技术</a>
            <a href="#team" className="nav-link">团队</a>
          </div>
          <button className="nav-cta">
            开始使用
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI 驱动的原型设计工具</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">让原型设计</span>
            <span className="title-line gradient-text">更简单、更智能</span>
          </h1>
          <p className="hero-desc">
            Axhub Make 是一款新一代 AI 辅助原型工具，通过人工智能技术，
            <br />
            帮助团队快速创高质量的交互原型和设计文档
          </p>
          <div className="hero-actions">
            <button className="btn-primary">
              立即体验
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary">
              查看文档
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">设计组件</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">10k+</span>
              <span className="stat-label">用户信赖</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">99%</span>
              <span className="stat-label">满意度</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* 关于项目 */}
      <section className="about">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-tag">关于产品</span>
              <h2 className="section-title">重新定义原型设计体验</h2>
              <p className="about-text">
                在快节奏的产品开发环境中，原型设计往往成为敏捷交付的瓶颈。Axhub Make 通过深度集成 AI 能力，将原型设计从繁琐的手动操作中解放出来，让团队能够更专注于创意和用户体验本身。
              </p>
              <p className="about-text">
                无论是初创团队的快速验证，还是企业级项目的复杂协作，Axhub Make 都能提供恰到好处的支持。我们相信，好的工具应该既强大又易用，让每一次设计决策都充满信心。
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">
                    <Zap size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>效率提升 10x</h4>
                    <p>AI 辅助生成，大幅缩短设计周期</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">
                    <Cloud size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>无缝协作</h4>
                    <p>实时多人编辑，版本自动同步</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mock-nav"></div>
                  <div className="mock-content">
                    <div className="mock-hero"></div>
                    <div className="mock-grid">
                      <div className="mock-box"></div>
                      <div className="mock-box"></div>
                      <div className="mock-box"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="visual-float visual-float-1">
                <Sparkles size={16} />
                <span>AI 生成中</span>
              </div>
              <div className="visual-float visual-float-2">
                <Layers size={16} />
                <span>原型已就绪</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">核心能力</span>
            <h2 className="section-title">强大功能，简约体验</h2>
            <p className="section-desc">
              每一个功能都经过精心打磨，为您的设计工作流带来质的飞跃
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="feature-card-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.description}</p>
                <div className="feature-card-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流水线介绍 */}
      <section id="workflows" className="workflows">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">核心工作流</span>
            <h2 className="section-title">9 大自动化流水线</h2>
            <p className="section-desc">
              从需求分析到原型开发，全流程自动化，提高产研效率
            </p>
          </div>
          <div className="workflows-grid">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="workflow-card"
                onClick={() => {
                  setSelectedWorkflow(workflow.id);
                  setShowWorkflowModal(true);
                }}
              >
                <div className="workflow-icon">
                  <span className="workflow-number">{workflow.number}</span>
                </div>
                <h3 className="workflow-title">{workflow.title}</h3>
                <p className="workflow-desc">
                  {workflow.desc}
                </p>
                <div className="workflow-action">
                  查看详情
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section id="tech" className="tech">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">技术选型</span>
            <h2 className="section-title">现代化技术栈</h2>
            <p className="section-desc">
              采用业界领先的前沿技术，确保工具的性能、可扩展性和开发体验
            </p>
          </div>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div 
                key={index} 
                className="tech-card"
                style={{ '--tech-color': tech.color } as React.CSSProperties}
              >
                <div className="tech-icon" style={{ background: `${tech.color}20`, color: tech.color }}>
                  {tech.name.charAt(0)}
                </div>
                <div className="tech-info">
                  <h4>{tech.name}</h4>
                  <span>v{tech.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 团队 */}
      <section id="team" className="team">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">核心团队</span>
            <h2 className="section-title">专业团队，匠心打造</h2>
            <p className="section-desc">
              我们是一支专注于产品设计和工程技术的团队，致力于打造卓越的工具体验
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <span>{member.initials}</span>
                </div>
                <h4 className="team-name">{member.name}</h4>
                <span className="team-position">{member.position}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-brand">
                <div className="brand-icon">
                  <Sparkles size={20} />
                </div>
                <span className="brand-text">Axhub Make</span>
              </div>
              <p className="footer-desc">
                让原型设计更简单、更智能，助力产品团队提升交付效率
              </p>
              <div className="footer-social">
                <a href="#"><Github size={20} /></a>
                <a href="#"><Twitter size={20} /></a>
                <a href="#"><Linkedin size={20} /></a>
              </div>
            </div>
            <div className="footer-links">
              <h5>快速链接</h5>
              <ul>
                <li><a href="#">产品介绍</a></li>
                <li><a href="#">使用文档</a></li>
                <li><a href="#">更新日志</a></li>
                <li><a href="#">社区交流</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5>资源</h5>
              <ul>
                <li><a href="#">设计资源</a></li>
                <li><a href="#">组件库</a></li>
                <li><a href="#">模板中心</a></li>
                <li><a href="#">视频教程</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h5>联系我们</h5>
              <ul>
                <li><a href="#">contact@axhub.com</a></li>
                <li><a href="#">商务合作</a></li>
                <li><a href="#">加入团队</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Axhub Make. 保留所有权利.</p>
          </div>
        </div>
      </footer>

      {/* 流水线详情弹窗 */}
      {showWorkflowModal && selectedWorkflow !== null && (
        <div className="workflow-modal">
          <div className="modal-overlay" onClick={() => setShowWorkflowModal(false)} />
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowWorkflowModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="workflow-icon">
                <span className="workflow-number">{workflows[selectedWorkflow].number}</span>
              </div>
              <h3 className="modal-title">{workflows[selectedWorkflow].title}</h3>
            </div>
            <div className="modal-body">
              <p className="modal-detail">{workflows[selectedWorkflow].detail}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowWorkflowModal(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectIntro;