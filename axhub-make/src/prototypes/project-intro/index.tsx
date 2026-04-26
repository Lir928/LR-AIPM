import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Workflow, BookOpen, Cpu, FolderTree, Code, FileText, Zap, ChevronDown, X } from 'lucide-react';
import './style.css';

// @name AIPM Workflows 项目介绍页

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

  // 流水线数据 - 按照 README.md 中的分类进行整理
  const mainWorkflows = [
    {
      id: 0,
      number: "00",
      title: "统一页面开发流水线",
      triggerWord: "执行页面开发",
      desc: "总导航页，负责判断材料来源并把'新增''升级''继续迭代'统一到一条主线上",
      detail: "这是所有原型开发工作的统一入口。该流水线会智能识别用户输入材料的类型（新需求、旧页面升级、归档页面恢复），并自动选择最适合的开发路径。对于新用户，它提供了清晰的引导；对于有经验的用户，它提供了快捷的操作方式。"
    },
    {
      id: 1,
      number: "02",
      title: "需求转PRD流水线",
      triggerWord: "执行需求梳理",
      desc: "AI 自动生成 PRD 文档和 Axhub Prompt",
      detail: "这个流水线是整个自动化流程的核心之一。它接收用户输入的需求（可以是一句话、草图、或复杂的材料包），通过 AI 分析，自动生成结构化的产品需求文档(PRD)和对应的 Axhub Prompt。PRD 存储在工作台(axhub-make/src/docs/)和归档区(projects/...)中，为后续的原型生成提供明确的指导。"
    },
    {
      id: 2,
      number: "07",
      title: "项目启动与预览流水线",
      triggerWord: "启动项目预览",
      desc: "启动 Axhub Make 预览环境，实时查看原型效果",
      detail: "该流水线负责启动 Axhub Make 的开发服务器，为用户提供实时预览环境。通过该环境，用户可以即时查看原型页面的变化，无需手动刷新，极大提升了开发效率。服务器运行在本地，确保了数据的安全性和访问速度。"
    },
    {
      id: 3,
      number: "04",
      title: "原型生成与基础增强流水线",
      triggerWord: "执行原型生成",
      desc: "AI 驱动原型生成，包含基础交互与演示逻辑",
      detail: "这是一键生成原型的核心功能。基于 PRD 和 Prompt，该流水线利用 AI 技术自动生成 React 原型组件。生成的原型不仅仅是静态 UI，还包括基础的交互功能、状态管理、表单验证等演示逻辑。用户可以在生成的原型基础上进行进一步定制。"
    },
    {
      id: 4,
      number: "09",
      title: "原型归档与升级流水线",
      triggerWord: "执行归档 或 执行恢复",
      desc: "归档完成的原型或从归档恢复继续开发",
      detail: "项目完成后，该流水线将原型、PRD、迭代记录等完整资料打包归档到 projects/ 目录下，形成单一可信正本。后续需要对该页面进行修改时，可通过恢复功能将其重新导入工作台，继续迭代。这种机制确保了版本管理的清晰性。"
    },
    {
      id: 5,
      number: "10",
      title: "老项目页面还原流水线",
      triggerWord: "执行页面还原",
      desc: "使用 Chrome 扩展导出包精确还原旧页面",
      detail: "专为处理遗留系统而设计。该流水线接收由 Chrome 扩展导出的 HTML/CSS/JS 数据包，通过智能分析和转换，精确还原旧页面的视觉效果和功能。还原后的页面可直接作为新项目的基础，便于升级改造。"
    }
  ];

  const optionalWorkflows = [
    {
      id: 6,
      number: "01",
      title: "现有资产盘点流水线",
      triggerWord: "执行资产盘点",
      desc: "扫描旧系统资产，建立知识库",
      detail: "当需要处理复杂旧系统时，该流水线可以帮助用户系统性地分析和盘点现有的代码、文档、设计资源等资产。它会生成详细的资产清单和关系图谱，为制定升级策略提供依据。适用于大规模系统重构项目。"
    },
    {
      id: 7,
      number: "03",
      title: "需求文档双向同步机制",
      triggerWord: "执行Prompt同步",
      desc: "PRD 修改后自动同步到 Prompt",
      detail: "为了保持 PRD 和 Prompt 的一致性，当用户手动修改了 PRD 文档后，该流水线会自动提取关键信息并更新对应的 Prompt。反之亦然，确保设计工具始终使用最新版本的需求信息，避免因文档不同步导致的偏差。"
    },
    {
      id: 8,
      number: "08",
      title: "原型深度补强流水线",
      triggerWord: "执行原型增强",
      desc: "为原型添加复杂交互、状态机等高级功能",
      detail: "对于需要复杂逻辑的原型（如复杂表单验证、多层次状态切换、动态数据绑定等），该流水线提供了深度补强能力。它可以为已生成的原型添加更丰富的交互功能和更复杂的状态管理机制，满足高级需求。"
    },
    {
      id: 9,
      number: "05",
      title: "交付前代码审查与收口",
      triggerWord: "执行代码审查",
      desc: "形式化审查，确保代码质量",
      detail: "在正式交付前，该流水线会对原型代码进行形式化审查，包括代码规范、性能优化建议、安全检查等。它会生成详细的审查报告，帮助用户发现潜在问题并进行整改，确保交付物的质量。"
    }
  ];

  // 技术栈数据
  const techStack = [
    { name: "React", version: "18.x", icon: "⚛️" },
    { name: "TypeScript", version: "5.x", icon: "📝" },
    { name: "Axhub Make", version: "引擎", icon: "🎨" },
    { name: "Trae IDE", version: "AI驱动", icon: "🤖" },
    { name: "Node.js", version: "20.x", icon: "🟢" },
    { name: "pnpm", version: "9.x", icon: "📦" }
  ];

  // 目录结构
  const directoryStructure = `
aipm-workflows/
├── axhub-make/
│   ├── src/
│   │   ├── prototypes/     # 原型页面
│   │   ├── docs/          # 引擎文档
│   │   ├── components/    # 公共组件
│   │   └── ...
│   └── ...
├── projects/
│   ├── demo-task/         # 示例项目
│   │   ├── features/      # 功能归档
│   │   │   └── [pageId]/
│   │   │       ├── prd/           # PRD文档
│   │   │       ├── prompts/       # Prompt记录
│   │   │       ├── iterations/    # 迭代记录
│   │   │       └── prototype/
│   │   │           └── source/    # 原型源码
│   │   ├── legacy-assets/ # 遗留资产
│   │   └── docs/          # 项目文档
│   └── [projectName]/
├── .workflows/            # 流水线配置
├── .skills/               # AI技能库
└── scripts/               # 开发脚本`;

  return (
    <div className={`intro-page ${isLoaded ? 'loaded' : ''}`}>
      {/* 导航栏 */}
      <nav className={`nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <span className="brand-text">AIPM Workflows</span>
          </div>
          <div className="nav-links">
            <a href="#overview" className="nav-link">概览</a>
            <a href="#workflows" className="nav-link">流水线</a>
            <a href="#getting-started" className="nav-link">上手指南</a>
            <a href="#architecture" className="nav-link">架构</a>
          </div>
          <a href="#getting-started" className="nav-cta">
            开始使用
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section id="overview" className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Workflow size={14} />
            <span>AI 驱动的产研自动化底座</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">AIPM Workflows</span>
            <span className="title-line gradient-text">从需求到原型的全流程自动化</span>
          </h1>
          <p className="hero-desc">
            基于 Trae IDE 和 Axhub Make，构建从一句话需求到高保真原型的完整自动化闭环。
            <br />
            让产研效率提升 10 倍，确保从需求到原型的一致性和质量。
          </p>
          <div className="hero-actions">
            <a href="#getting-started" className="btn-primary">
              查看上手指南
              <ArrowRight size={18} />
            </a>
            <a href="#workflows" className="btn-secondary">
              查看流水线
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* 项目概览 */}
      <section id="overview-section" className="overview">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">项目概览</span>
            <h2 className="section-title">核心机制与架构</h2>
            <p className="section-desc">
              AIPM Workflows 是一个端到端的自动化平台，连接需求与原型
            </p>
          </div>
          <div className="overview-content">
            <div className="overview-text">
              <h3>项目是什么</h3>
              <p>
                AIPM Workflows 是下一代 AI 驱动的产研自动化底座，致力于解决从需求到原型的传统开发瓶颈。
                通过 AI 的强大能力，构建了一个从一句话需求到高保真原型的完整自动化闭环。
              </p>
              
              <h3>核心机制</h3>
              <div className="pipeline-diagram">
                <div className="pipeline-step">
                  <div className="step-icon"><FileText size={20} /></div>
                  <div className="step-text">需求输入</div>
                </div>
                <div className="pipeline-arrow">→</div>
                <div className="pipeline-step">
                  <div className="step-icon"><BookOpen size={20} /></div>
                  <div className="step-text">结构化PRD</div>
                </div>
                <div className="pipeline-arrow">→</div>
                <div className="pipeline-step">
                  <div className="step-icon"><Cpu size={20} /></div>
                  <div className="step-text">Axhub Prompt</div>
                </div>
                <div className="pipeline-arrow">→</div>
                <div className="pipeline-step">
                  <div className="step-icon"><Code size={20} /></div>
                  <div className="step-text">原型生成</div>
                </div>
                <div className="pipeline-arrow">→</div>
                <div className="pipeline-step">
                  <div className="step-icon"><Zap size={20} /></div>
                  <div className="step-text">实时预览</div>
                </div>
              </div>
              
              <h3>All-in-Axhub 架构</h3>
              <p>
                本项目采用 All-in-Axhub 架构，代码最终交付物即为 Axhub 原型页面。
                所有研发技能直接在 Axhub 引擎内施展，实现了需求、设计、开发、交付的无缝整合。
                这种架构简化了开发流程，提升了交付效率。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 流水线体系 */}
      <section id="workflows" className="workflows">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">流水线体系</span>
            <h2 className="section-title">核心自动化流水线</h2>
            <p className="section-desc">
              按主线必经/可选流程分组的完整流水线体系
            </p>
          </div>
          
          <div className="workflow-category">
            <h3 className="category-title">主线必经流水线</h3>
            <div className="workflows-grid">
              {mainWorkflows.map((workflow) => (
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
                  <div className="workflow-trigger">
                    {workflow.triggerWord}
                  </div>
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
          
          <div className="workflow-category">
            <h3 className="category-title">可选流程</h3>
            <div className="workflows-grid">
              {optionalWorkflows.map((workflow) => (
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
                  <div className="workflow-trigger">
                    {workflow.triggerWord}
                  </div>
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
        </div>
      </section>

      {/* 上手指南 */}
      <section id="getting-started" className="getting-started">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">快速上手</span>
            <h2 className="section-title">三种常见使用场景</h2>
            <p className="section-desc">
              根据不同使用场景，选择最合适的操作流程
            </p>
          </div>
          <div className="guides-grid">
            <div className="guide-card">
              <div className="guide-icon">
                <FolderTree size={24} />
              </div>
              <h3>场景A：升级现有页面</h3>
              <ol>
                <li>准备输入材料 (HTML/截图/数据包)</li>
                <li>放到 workbench/_incoming/YYYY-MM-DD/&lt;页面名&gt;/</li>
                <li>执行 <strong>10</strong> (执行页面还原) 或 <strong>02</strong> (执行需求梳理)</li>
                <li>启动预览 (<strong>07</strong>)</li>
                <li>修改原型或执行 <strong>04</strong> (原型生成)</li>
                <li>完成后归档 (<strong>09</strong>)</li>
              </ol>
            </div>
            
            <div className="guide-card">
              <div className="guide-icon">
                <Workflow size={24} />
              </div>
              <h3>场景B：迭代已归档页面</h3>
              <ol>
                <li>执行 <strong>09</strong> 的恢复功能</li>
                <li>修改工作台原型</li>
                <li>PRD更改时执行 <strong>03</strong> (Prompt同步)</li>
                <li>可选：执行 <strong>08</strong> (原型增强)</li>
                <li>完成后再次归档 (<strong>09</strong>)</li>
              </ol>
            </div>
            
            <div className="guide-card">
              <div className="guide-icon">
                <Sparkles size={24} />
              </div>
              <h3>场景C：新增页面</h3>
              <ol>
                <li>执行 <strong>00</strong> (统一页面开发)</li>
                <li>执行 <strong>02</strong> (需求转PRD)</li>
                <li>启动预览 (<strong>07</strong>)</li>
                <li>执行 <strong>04</strong> (原型生成)</li>
                <li>可选：执行 <strong>03</strong> (Prompt同步) 或 <strong>08</strong> (原型增强)</li>
                <li>完成后归档 (<strong>09</strong>)</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 技术架构与目录结构 */}
      <section id="architecture" className="architecture">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">技术架构</span>
            <h2 className="section-title">技术栈与目录结构</h2>
            <p className="section-desc">
              使用现代化技术栈，遵循清晰的目录组织结构
            </p>
          </div>
          <div className="architecture-grid">
            <div className="tech-stack">
              <h3>核心技术栈</h3>
              <div className="tech-list">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-item">
                    <span className="tech-icon">{tech.icon}</span>
                    <div className="tech-info">
                      <h4>{tech.name}</h4>
                      <span className="tech-version">{tech.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="directory-structure">
              <h3>目录结构</h3>
              <pre className="directory-code">{directoryStructure}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="nav-brand">
                <div className="brand-icon">
                  <Sparkles size={20} />
                </div>
                <span className="brand-text">AIPM Workflows</span>
              </div>
              <p className="footer-desc">
                从一句话需求到高保真原型的全流程自动化解决方案
              </p>
            </div>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); window.open('/docs', '_blank'); }}>项目文档</a>
              <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://github.com/Lir928/LR-AIPM', '_blank'); }}>GitHub</a>
              <a href="#">许可证</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 AIPM Workflows. 使用 MIT 许可证.</p>
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
              <div className="workflow-icon-large">
                <span className="workflow-number-large">
                  {selectedWorkflow < 6 ? mainWorkflows[selectedWorkflow].number : optionalWorkflows[selectedWorkflow - 6].number}
                </span>
              </div>
              <h3 className="modal-title">
                {selectedWorkflow < 6 ? mainWorkflows[selectedWorkflow].title : optionalWorkflows[selectedWorkflow - 6].title}
              </h3>
            </div>
            <div className="modal-body">
              <div className="modal-trigger">
                <strong>触发词：</strong>
                {selectedWorkflow < 6 ? mainWorkflows[selectedWorkflow].triggerWord : optionalWorkflows[selectedWorkflow - 6].triggerWord}
              </div>
              <p className="modal-detail">
                {selectedWorkflow < 6 ? mainWorkflows[selectedWorkflow].detail : optionalWorkflows[selectedWorkflow - 6].detail}
              </p>
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