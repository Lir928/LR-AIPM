/**
 * 原型文件读取示例脚本
 *
 * 此脚本演示如何使用 chrome-devtools-mcp 工具读取原型文件
 * 并生成对应的 Vue 组件代码
 *
 * 使用方法:
 * 1. 确保 chrome-devtools-mcp 服务已启动
 * 2. 在支持 MCP 的环境中运行此脚本
 * 3. 提供原型 URL 作为参数
 */

// 配置参数
const CONFIG = {
  // 原型 URL (墨刀示例)
  prototypeUrl: 'https://modao.cc/proto/qK6NsVt9lvnncIHnryM/sharing?view_mode=read_only&screen=rbpVAL0VDMwSt5VnP',

  // 腾讯CoDesign原型示例
  // prototypeUrl: 'https://codesign.qq.com/s/649970237319716',
  // password: '6JYU',

  // 输出文件路径
  outputPath: 'src/views/generated-page/index.vue',

  // 页面加载超时时间(毫秒)
  pageLoadTimeout: 15000,

  // 等待元素出现的超时时间(毫秒)
  elementWaitTimeout: 10000
};

/**
 * 主函数: 读取原型并生成代码
 */
async function readPrototypeAndGenerateCode() {
  try {
    console.log('🚀 开始读取原型文件...');
    console.log(`📍 原型URL: ${CONFIG.prototypeUrl}`);

    // 步骤1: 打开原型页面
    console.log('\n📖 步骤1: 打开原型页面...');
    await new_page({ url: CONFIG.prototypeUrl });
    console.log('✅ 页面已打开');

    // 步骤2: 处理密码保护的原型
    if (CONFIG.password) {
      console.log('\n🔐 步骤2: 输入访问密码...');
      await handlePasswordProtectedPrototype(CONFIG.password);
    }

    // 步骤3: 等待页面加载完成
    console.log('\n⏳ 步骤3: 等待页面加载...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ 页面加载完成');

    // 步骤4: 获取页面标题
    console.log('\n📝 步骤4: 提取页面标题...');
    const title = await evaluate_script({
      function: "() => document.title"
    });
    console.log(`✅ 页面标题: ${title}`);

    // 步骤5: 提取页面结构
    console.log('\n🔍 步骤5: 提取页面结构...');
    const pageStructure = await extractPageStructure();
    console.log(`✅ 提取完成:`);
    console.log(`   - 容器数量: ${pageStructure.containers.length}`);
    console.log(`   - 表单元素: ${pageStructure.formElements.length}`);
    console.log(`   - 表格数量: ${pageStructure.tables.length}`);
    console.log(`   - 卡片数量: ${pageStructure.cards.length}`);
    console.log(`   - 文本元素: ${pageStructure.textElements.length}`);

    // 步骤6: 生成Vue代码
    console.log('\n💻 步骤6: 生成Vue代码...');
    const vueCode = generateVueCode(pageStructure, title);
    console.log('✅ Vue代码生成完成');

    // 步骤7: 保存代码到文件
    console.log(`\n💾 步骤7: 保存代码到 ${CONFIG.outputPath}...`);
    await builtin_create_new_file({
      filepath: CONFIG.outputPath,
      contents: vueCode
    });
    console.log('✅ 代码保存成功');

    console.log('\n🎉 所有步骤完成!');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    throw error;
  }
}

/**
 * 处理密码保护的原型
 */
async function handlePasswordProtectedPrototype(password) {
  try {
    // 等待密码输入框出现
    await wait_for({ text: '访问密码', timeout: 10000 });

    // 查找密码输入框
    const passwordInput = await evaluate_script({
      function: "() => document.querySelector('input[type=\"password\"]')"
    });

    if (passwordInput) {
      // 输入密码
      await fill({ uid: passwordInput.uid, value: password });
      console.log('✅ 密码已输入');

      // 按Enter键提交
      await press_key({ key: 'Enter' });
      console.log('✅ 密码已提交');

      // 等待原型加载
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('⚠️ 未找到密码输入框,可能不需要密码');
    }
  } catch (error) {
    console.log('⚠️ 密码处理失败,可能不需要密码:', error.message);
  }
}

/**
 * 提取页面结构
 */
async function extractPageStructure() {
  const structure = await evaluate_script({
    function: `() => {
      // 提取主要容器
      const containers = Array.from(document.querySelectorAll('.container, .section, .module, .page, .screen')).map(el => ({
        id: el.id || el.className,
        tagName: el.tagName,
        textContent: el.textContent.trim().substring(0, 100),
        children: Array.from(el.children).map(child => child.tagName)
      }));

      // 提取表单元素
      const formElements = Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
        type: el.type || el.tagName,
        id: el.id,
        className: el.className,
        placeholder: el.placeholder || '',
        value: el.value || '',
        text: el.textContent?.trim() || ''
      }));

      // 提取表格结构
      const tables = Array.from(document.querySelectorAll('table')).map(table => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
        const rows = Array.from(table.querySelectorAll('tr')).map(tr =>
          Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
        );

        return {
          headers,
          rows: rows.slice(0, 5) // 只取前5行
        };
      });

      // 提取卡片/面板
      const cards = Array.from(document.querySelectorAll('.card, .panel, .box')).map(el => ({
        className: el.className,
        title: el.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim() || '',
        textContent: el.textContent.trim().substring(0, 200)
      }));

      // 提取导航元素
      const navElements = Array.from(document.querySelectorAll('nav, .nav, .navigation, .menu')).map(el => ({
        className: el.className,
        items: Array.from(el.querySelectorAll('a, button, .item')).map(item => ({
          text: item.textContent.trim(),
          href: item.href || ''
        }))
      }));

      // 提取文本元素
      const textElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               el.textContent.trim().length > 0 &&
               el.textContent.trim().length < 100 &&
               el.children.length === 0;
      }).map(el => ({
        text: el.textContent.trim(),
        tag: el.tagName,
        className: el.className
      }));

      return {
        containers,
        formElements,
        tables,
        cards,
        navElements,
        textElements,
        html: document.documentElement.outerHTML.substring(0, 10000) // 只取前10000个字符
      };
    }`
  });

  return structure;
}

/**
 * 生成Vue代码
 */
function generateVueCode(pageStructure, title) {
  const pageTitle = title || '生成的页面';

  // 生成表单元素
  const formElementsHtml = pageStructure.formElements.map(el => {
    if (el.type === 'input' || el.tagName === 'INPUT') {
      return `        <a-input v-model:value="formData.${el.id || 'field'}" placeholder="${el.placeholder || '请输入'}" />`;
    } else if (el.type === 'select' || el.tagName === 'SELECT') {
      return `        <a-select v-model:value="formData.${el.id || 'field'}" placeholder="${el.placeholder || '请选择'}">
          <a-select-option value="option1">选项1</a-select-option>
          <a-select-option value="option2">选项2</a-select-option>
        </a-select>`;
    } else if (el.type === 'textarea' || el.tagName === 'TEXTAREA') {
      return `        <a-textarea v-model:value="formData.${el.id || 'field'}" placeholder="${el.placeholder || '请输入'}" :rows="4" />`;
    } else if (el.type === 'button' || el.tagName === 'BUTTON') {
      return `        <a-button type="primary" @click="handleSubmit">${el.text || '提交'}</a-button>`;
    }
    return '';
  }).filter(Boolean).join('\n');

  // 生成表格
  const tablesHtml = pageStructure.tables.map((table, index) => {
    const columns = table.headers.map((header, i) =>
      `      { title: '${header}', dataIndex: 'col${i}', key: 'col${i}' }`
    ).join(',\n');

    return `    <a-table
      :columns="table${index}Columns"
      :data-source="table${index}Data"
      row-key="id"
    />`;
  }).join('\n');

  // 生成卡片
  const cardsHtml = pageStructure.cards.map(card =>
    `    <a-card title="${card.title || '卡片'}">
      <p>${card.textContent.substring(0, 100)}...</p>
    </a-card>`
  ).join('\n');

  return `<template>
  <div class="generated-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>${pageTitle}</h1>
    </div>

    <!-- 搜索筛选区 -->
    <a-card class="search-section">
      <a-form :model="searchForm" layout="inline">
        <a-form-item label="关键词">
          <a-input v-model:value="searchForm.keyword" placeholder="请输入关键词" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 表单区域 -->
    ${pageStructure.formElements.length > 0 ? `
    <a-card class="form-section" title="表单">
      <a-form :model="formData" layout="vertical">
${formElementsHtml}
      </a-form>
    </a-card>
    ` : ''}

    <!-- 卡片区域 -->
    ${pageStructure.cards.length > 0 ? `
    <a-row :gutter="[16, 16]" class="cards-section">
${cardsHtml}
    </a-row>
    ` : ''}

    <!-- 表格区域 -->
    ${pageStructure.tables.length > 0 ? `
    <a-card class="table-section" title="数据列表">
${tablesHtml}
    </a-card>
    ` : ''}
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Row,
  Col
} from 'ant-design-vue';

// 搜索表单
const searchForm = reactive({
  keyword: ''
});

// 表单数据
const formData = reactive({
  field1: '',
  field2: ''
});

${pageStructure.tables.map((table, index) => `
// 表格${index + 1}列定义
const table${index}Columns = [
${table.headers.map((header, i) => `  { title: '${header}', dataIndex: 'col${i}', key: 'col${i}' }`).join(',\n')}
];

// 表格${index + 1}数据
const table${index}Data = ref([
  ${table.rows.map((row, i) => `{
    id: ${i + 1},
    ${row.map((cell, j) => `col${j}: '${cell}'`).join(',\n    ')}
  }`).join(',\n  ')}
]);
`).join('\n')}

// 处理搜索
function handleSearch() {
  console.log('搜索条件:', searchForm);
  // 实现搜索逻辑
}

// 处理重置
function handleReset() {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = '';
  });
}

// 处理提交
function handleSubmit() {
  console.log('表单数据:', formData);
  // 实现提交逻辑
}
</script>

<style scoped>
.generated-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.search-section,
.form-section,
.table-section {
  margin-bottom: 20px;
}

.cards-section {
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .generated-page {
    padding: 10px;
  }

  .page-header h1 {
    font-size: 20px;
  }
}
</style>
`;
}

/**
 * 导出函数供外部调用
 */
module.exports = {
  readPrototypeAndGenerateCode,
  extractPageStructure,
  generateVueCode,
  handlePasswordProtectedPrototype
};

// 如果直接运行此脚本
if (require.main === module) {
  readPrototypeAndGenerateCode()
    .then(() => {
      console.log('\n✨ 脚本执行完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 脚本执行失败:', error);
      process.exit(1);
    });
}
