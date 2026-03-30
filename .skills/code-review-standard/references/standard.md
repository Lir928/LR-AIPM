# 代码审查规范

## 概述

本规范定义了 CTIS Cloud 项目的代码审查标准,包括代码审查清单、审查流程规范、常见问题检查点、审查反馈规范等,确保代码质量和团队协作效率。

## 代码审查清单

### 1. 功能性检查

- [ ] 代码实现了需求文档中的所有功能
- [ ] 代码逻辑正确,没有明显的 bug
- [ ] 边界条件处理正确
- [ ] 异常情况处理完善
- [ ] 业务逻辑符合需求

### 2. 代码质量检查

- [ ] 代码命名符合规范
- [ ] 代码结构清晰,易于理解
- [ ] 代码复杂度合理
- [ ] 没有重复代码
- [ ] 代码可读性好

### 3. 性能检查

- [ ] 数据库查询使用了索引
- [ ] 避免了 N+1 查询
- [ ] 使用了缓存优化
- [ ] 没有性能瓶颈
- [ ] 资源使用合理

### 4. 安全性检查

- [ ] 输入参数进行了校验
- [ ] SQL 注入防护
- [ ] XSS 攻击防护
- [ ] 敏感信息已加密
- [ ] 权限控制正确

### 5. 测试检查

- [ ] 单元测试覆盖率达标
- [ ] 测试用例完整
- [ ] 测试代码质量高
- [ ] 集成测试通过
- [ ] 测试用例有意义

### 6. 文档检查

- [ ] API 文档完整
- [ ] 代码注释充分
- [ ] README 文档更新
- [ ] 变更日志更新
- [ ] 技术文档完整

## 审查流程规范

### 1. 提交审查

#### Pull Request 标题规范

```
{类型}: {简短描述}
```

类型说明:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

示例:
```
feat: 新增用户导入导出功能
fix: 修复用户删除时级联删除失败的问题
docs: 更新 API 文档
```

#### Pull Request 描述模板

```markdown
## 变更说明
简要描述本次变更的内容和目的

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试情况
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试通过

## 影响范围
列出本次变更影响的模块和功能

## 相关 Issue
关联相关的 Issue 编号

## 截图/演示
如果有 UI 变更,提供截图或演示链接

## 检查清单
- [ ] 代码符合项目规范
- [ ] 代码已通过静态检查
- [ ] 测试覆盖率达标
- [ ] 文档已更新
```

### 2. 审查流程

#### 审查步骤

1. **自我审查**
   - 提交前进行自我审查
   - 确保代码符合规范
   - 运行测试确保通过

2. **同行审查**
   - 至少 1 名同行进行审查
   - 审查者提出修改意见
   - 作者根据意见修改代码

3. **技术负责人审查**
   - 重要变更需要技术负责人审查
   - 确保架构设计合理
   - 确保技术选型正确

4. **审查通过**
   - 所有审查意见已解决
   - 代码合并到目标分支

#### 审查时间要求

| 变更类型 | 审查响应时间 | 审查完成时间 |
|---------|------------|------------|
| 紧急修复 | 2 小时内 | 4 小时内 |
| 普通功能 | 1 个工作日内 | 2 个工作日内 |
| 重构优化 | 2 个工作日内 | 5 个工作日内 |

### 3. 审查反馈

#### 反馈原则

1. **建设性**: 提供建设性的改进建议
2. **具体化**: 指出具体的问题和位置
3. **友好性**: 使用友好的语言和态度
4. **及时性**: 及时给出审查反馈

#### 反馈示例

**✅ 好的反馈**:
```
建议: 在第 45 行,建议使用 `Optional` 来处理可能为 null 的情况,避免 NPE。

原因: 使用 `Optional` 可以更清晰地表达可能为 null 的值,提高代码可读性。

示例:
```java
Optional.ofNullable(user)
    .map(SysUser::getEmail)
    .orElse("default@example.com");
```
```

**❌ 不好的反馈**:
```
这里代码写得不好,改一下。
```

#### 反馈分类

| 分类 | 说明 | 示例 |
|------|------|------|
| **必须修改** | 严重问题,必须修改 | SQL 注入漏洞 |
| **建议修改** | 改进建议,建议修改 | 性能优化建议 |
| **可选修改** | 可选改进,可以不修改 | 代码风格建议 |
| **疑问** | 对代码有疑问 | 为什么这样实现? |

## 常见问题检查点

### 1. 命名规范

#### 类命名

```java
// ✅ 正确
public class UserServiceImpl implements UserService { }

public class SysUser { }

// ❌ 错误
public class userserviceimpl implements UserService { }

public class sysuser { }
```

#### 方法命名

```java
// ✅ 正确
public SysUser getUserById(Long userId) { }

public void createUser(SysUser user) { }

// ❌ 错误
public SysUser get(Long userId) { }

public void add(SysUser user) { }
```

#### 变量命名

```java
// ✅ 正确
private Long userId;

private String userName;

// ❌ 错误
private Long uid;

private String name;
```

### 2. 代码结构

#### 方法长度

```java
// ✅ 正确: 方法长度不超过 50 行
public SysUser getUserById(Long userId) {
    // 业务逻辑
}

// ❌ 错误: 方法过长
public SysUser getUserById(Long userId) {
    // 100+ 行代码
}
```

#### 类长度

```java
// ✅ 正确: 类长度不超过 500 行
public class UserServiceImpl implements UserService {
    // 业务逻辑
}

// ❌ 错误: 类过长
public class UserServiceImpl implements UserService {
    // 1000+ 行代码
}
```

#### 嵌套层次

```java
// ✅ 正确: 嵌套层次不超过 3 层
if (condition1) {
    if (condition2) {
        // 业务逻辑
    }
}

// ❌ 错误: 嵌套层次过深
if (condition1) {
    if (condition2) {
        if (condition3) {
            if (condition4) {
                // 业务逻辑
            }
        }
    }
}
```

### 3. 异常处理

#### 异常捕获

```java
// ✅ 正确: 捕获具体异常
try {
    // 业务逻辑
} catch (BusinessException e) {
    log.error("业务异常: {}", e.getMessage(), e);
    throw e;
}

// ❌ 错误: 捕获过于宽泛
try {
    // 业务逻辑
} catch (Exception e) {
    log.error("异常: {}", e.getMessage());
}
```

#### 异常处理

```java
// ✅ 正确: 异常处理完善
try {
    // 业务逻辑
} catch (BusinessException e) {
    log.error("业务异常: {}", e.getMessage(), e);
    throw e;
} catch (SystemException e) {
    log.error("系统异常: {}", e.getMessage(), e);
    throw new SystemException("系统繁忙,请稍后重试", e);
}

// ❌ 错误: 异常吞没
try {
    // 业务逻辑
} catch (Exception e) {
    log.error("异常: {}", e.getMessage());
}
```

### 4. 资源管理

#### 资源关闭

```java
// ✅ 正确: 使用 try-with-resources
try (InputStream is = new FileInputStream(file)) {
    // 处理文件
} catch (IOException e) {
    throw new SystemException("文件读取失败", e);
}

// ❌ 错误: 资源未关闭
InputStream is = new FileInputStream(file);
// 处理文件
is.close();
```

### 5. 并发安全

#### 线程安全

```java
// ✅ 正确: 使用线程安全集合
private final ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();

// ❌ 错误: 使用非线程安全集合
private final HashMap<String, Object> cache = new HashMap<>();
```

#### 同步控制

```java
// ✅ 正确: 使用 synchronized
public synchronized void updateUser(SysUser user) {
    // 业务逻辑
}

// ❌ 错误: 缺少同步控制
public void updateUser(SysUser user) {
    // 业务逻辑
}
```

### 6. 数据库操作

#### SQL 注入防护

```java
// ✅ 正确: 使用参数化查询
@Select("SELECT * FROM sys_user WHERE username = #{username}")
SysUser getUserByUsername(String username);

// ❌ 错误: 字符串拼接
@Select("SELECT * FROM sys_user WHERE username = '" + username + "'")
SysUser getUserByUsername(String username);
```

#### 事务管理

```java
// ✅ 正确: 使用 @Transactional
@Transactional
public void createUser(SysUser user) {
    // 业务逻辑
}

// ❌ 错误: 缺少事务管理
public void createUser(SysUser user) {
    // 业务逻辑
}
```

### 7. 日志记录

#### 日志级别

```java
// ✅ 正确: 使用合适的日志级别
log.info("用户登录成功, userId: {}", userId);
log.error("系统异常: {}", e.getMessage(), e);

// ❌ 错误: 日志级别使用不当
log.debug("用户登录成功, userId: {}", userId);
log.info("系统异常: {}", e.getMessage());
```

#### 敏感信息

```java
// ✅ 正确: 敏感信息脱敏
log.info("用户登录成功, phone: {}", LogMaskUtil.maskPhone(user.getPhone()));

// ❌ 错误: 敏感信息未脱敏
log.info("用户登录成功, phone: {}", user.getPhone());
```

### 8. 测试覆盖

#### 单元测试

```java
// ✅ 正确: 有单元测试
@Test
void shouldReturnUserWhenUserIdExistsGivenValidUserId() {
    // 测试逻辑
}

// ❌ 错误: 缺少单元测试
public SysUser getUserById(Long userId) {
    // 业务逻辑
}
```

#### 测试覆盖率

```java
// ✅ 正确: 测试覆盖率达标
// 核心业务逻辑覆盖率 >= 80%

// ❌ 错误: 测试覆盖率不足
// 核心业务逻辑覆盖率 < 50%
```

## 审查工具

### 1. 静态代码分析

#### SonarQube

```bash
# 运行 SonarQube 扫描
mvn sonar:sonar \
  -Dsonar.host.url=http://sonar-server:9000 \
  -Dsonar.login=your_token
```

#### Checkstyle

```bash
# 运行 Checkstyle
mvn checkstyle:check
```

#### SpotBugs

```bash
# 运行 SpotBugs
mvn spotbugs:check
```

### 2. 代码格式化

#### Google Java Format

```bash
# 格式化代码
mvn com.coveo:fmt-maven-plugin:format
```

#### Prettier

```bash
# 格式化代码
npx prettier --write "**/*.java"
```

### 3. Git Hooks

#### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# 运行测试
mvn test

# 运行静态检查
mvn checkstyle:check

# 运行格式化
mvn com.coveo:fmt-maven-plugin:format
```

## 审查最佳实践

### 1. 小步提交

- 每个 PR 只包含一个功能或修复
- PR 大小适中,不超过 500 行代码
- 避免大而全的 PR

### 2. 及时审查

- 提交 PR 后及时通知审查者
- 审查者及时给出反馈
- 避免长时间不审查

### 3. 充分沟通

- 对有疑问的地方及时沟通
- 解释设计思路和实现方式
- 讨论不同的实现方案

### 4. 持续改进

- 定期总结审查经验
- 更新审查清单
- 改进审查流程

## 审查代码审查清单

- [ ] 功能性检查通过
- [ ] 代码质量检查通过
- [ ] 性能检查通过
- [ ] 安全性检查通过
- [ ] 测试检查通过
- [ ] 文档检查通过
- [ ] 命名规范符合要求
- [ ] 代码结构合理
- [ ] 异常处理完善
- [ ] 资源管理正确
- [ ] 并发安全
- [ ] 数据库操作安全
- [ ] 日志记录规范
- [ ] 测试覆盖达标

## 常见问题

### 1. 审查意见过多

**问题**: 审查者提出过多修改意见

**解决方案**:
- 区分必须修改和建议修改
- 优先处理必须修改的问题
- 建议修改可以后续优化

### 2. 审查时间过长

**问题**: PR 长时间未审查

**解决方案**:
- 及时通知审查者
- 设置审查时间要求
- 使用自动化工具辅助审查

### 3. 审查意见冲突

**问题**: 不同审查者意见冲突

**解决方案**:
- 讨论不同的实现方案
- 技术负责人最终决策
- 记录决策原因

### 4. 审查质量不高

**问题**: 审查者只是简单通过

**解决方案**:
- 建立审查质量标准
- 定期培训审查者
- 使用审查清单

## 参考资料

- [Google Code Review Guide](https://google.github.io/eng-practices/review/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Checkstyle Documentation](https://checkstyle.sourceforge.io/)
- [SpotBugs Documentation](https://spotbugs.github.io/)
