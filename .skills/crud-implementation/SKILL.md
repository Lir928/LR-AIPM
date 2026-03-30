---
name: crud-implementation
description: CRUD功能实现 - 指导从需求分析到代码实现的完整CRUD功能开发流程，涵盖数据库设计、各层代码开发、枚举转换等关键环节
user-invocable: true
allowed-tools: Java,Bash
---

# CRUD功能实现 Skill

> CTIS Cloud 项目 - 指导从需求分析到代码实现的完整 CRUD 功能开发流程

## 功能说明

此 Skill 为 AI 提供实现完整 CRUD 功能的标准化开发指导能力，帮助开发者从需求分析到代码实现的全过程，涵盖数据库设计、各层代码开发、枚举转换等关键环节，适用于以下开发场景：

1. **新功能模块开发**：从零开始实现新的业务模块
2. **CRUD 功能实现**：实现标准的增删改查功能
3. **枚举类型转换**：将字符串/数字字段转换为枚举类型
4. **业务规则实现**：实现唯一性校验、状态管理等业务规则
5. **权限控制集成**：集成权限控制和操作日志记录

**重要说明**：
- 严格遵循 CTIS Cloud 5 层架构规范（Web → Business → Data → Mapper → DB）
- 使用 MyBatis-Plus 进行数据访问
- 使用 MapStruct 进行 DTO 转换（禁止使用 BeanUtils）
- 使用统一响应模型（DxResponse/DxPageResponse）
- 使用 Dx 系列异常类进行异常处理
- 使用 @SysLog 注解记录操作日志
- 使用 @PreAuthorize 注解进行权限控制

## 核心规范

### 1. 架构分层规范

| 层级 | 职责 | 核心组件 | 注意事项 |
|-----|------|---------|---------|
| Web 层 | 接口暴露、参数验证 | Controller | 只做参数验证和调用 Service，禁止业务逻辑 |
| Business 层 | 业务逻辑、事务管理 | Service 接口和实现 | 处理业务规则、事务管理、异常处理 |
| Data 层 | 数据访问封装 | DbService 接口和实现 | 封装所有数据库操作，禁止业务逻辑 |
| Mapper 层 | SQL 映射 | Mapper 接口 | 使用 MyBatis-Plus，复杂 SQL 使用 XML |
| DB 层 | 数据存储 | 数据库表、索引 | 使用 Liquibase 管理变更 |

### 2. 命名规范

| 类型 | 命名规则 | 示例 |
|-----|---------|------|
| 表名 | `{业务前缀}_{实体名}` | `basic_component`、`sys_user` |
| 实体类 | `{业务概念}` | `BasicComponent`、`SysUser` |
| Mapper 接口 | `{实体}Mapper` | `BasicComponentMapper`、`SysUserMapper` |
| DbService 接口 | `{实体}DbService` | `BasicComponentDbService`、`SysUserDbService` |
| DbService 实现 | `{实体}DbServiceImpl` | `BasicComponentDbServiceImpl`、`SysUserDbServiceImpl` |
| Service 接口 | `{实体}Service` | `BasicComponentService`、`SysUserService` |
| Service 实现 | `{实体}ServiceImpl` | `BasicComponentServiceImpl`、`SysUserServiceImpl` |
| Controller | `{实体}Controller` | `BasicComponentController`、`SysUserController` |
| 请求 DTO | `{实体}{操作}Request` | `BasicComponentSaveRequest`、`BasicComponentUpdateRequest` |
| 响应 DTO | `{实体}Response` | `BasicComponentResponse`、`SysUserResponse` |
| API 路径 | `/api/{模块}/{实体}` | `/api/cloud/system/basic-component` |
| 权限编码 | `{模块}:{实体}:{操作}` | `sys:basicComponent:list` |

### 3. 代码组织结构

```
模块目录结构：
├── api/                    # 接口定义（可选）
├── business/               # 业务实现
│   ├── service/           # Service 接口和实现
│   └── mapstruct/         # DTO 转换器
├── common/                # 公共组件
│   └── rest/             # 请求响应 DTO
├── data/                  # 数据访问
│   ├── mapper/           # Mapper 接口
│   ├── model/            # 实体类
│   └── service/          # DbService 接口和实现
└── web/                   # Web 层
    └── controller/        # Controller 接口
```

## 工作流程

### 步骤 1：需求分析和设计

**任务清单：**
- [ ] 阅读设计文档，理解业务需求
- [ ] 确定数据模型和字段定义
- [ ] 设计 API 接口规范
- [ ] 确定业务规则和校验逻辑
- [ ] 确定权限控制要求

**输出产物：**
- 功能需求清单
- 数据模型设计
- API 接口列表
- 业务规则说明

### 步骤 2：数据库设计

**任务清单：**
- [ ] 设计数据库表结构
- [ ] 确定字段类型和约束
- [ ] 设计索引（唯一索引、普通索引）
- [ ] 编写 Liquibase 变更脚本

**Liquibase 脚本模板：**

```yaml
databaseChangeLog:
- changeSet:
    id: {timestamp}-1
    author: {author} (generated)
    changes:
    - createTable:
        columns:
        - column:
            constraints:
              nullable: false
              primaryKey: true
            name: id
            remarks: 主键ID
            type: BIGINT
        - column:
            name: {field_name}
            remarks: {field_comment}
            type: {field_type}
        # ... 更多字段
        remarks: {table_comment}
        tableName: {table_name}
- changeSet:
    id: {timestamp}-2
    author: {author} (generated)
    changes:
    - createIndex:
        columns:
        - column:
            name: {column_name}
        indexName: idx_{table_name}_{column_name}
        tableName: {table_name}
        unique: true/false
```

**关键点：**
- 表名使用蛇形命名法（snake_case）
- 添加唯一索引确保业务唯一性
- 添加普通索引优化查询性能
- 使用 `timestamp` 作为 changeSet ID 前缀

### 步骤 3：数据层实现（Data Layer）

#### 3.1 创建实体类

```java
package cn.chinatelecom.cq.ctis.{module}.data.model;

import cn.chinatelecom.cq.ctis.basic.core.entity.BasicOpModel;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@TableName("{table_name}")
@Schema(name = "{EntityName}", description = "{table_comment}")
public class {EntityName} extends BasicOpModel {

    private static final long serialVersionUID = 1L;

    @Schema(description = "{field_comment}")
    private {field_type} {field_name};

    // ... 更多字段
}
```

**关键点：**
- 继承 `BasicOpModel` 获得标准审计字段
- 使用枚举类型替代字符串（如适用）
- 添加 `@Schema` 注解用于 API 文档生成

#### 3.2 创建 Mapper 接口

```java
package cn.chinatelecom.cq.ctis.{module}.data.mapper;

import cn.chinatelecom.cq.ctis.basic.mp.mapper.BasicMapper;
import cn.chinatelecom.cq.ctis.{module}.data.model.{EntityName};
import org.apache.ibatis.annotations.Mapper;

/**
 * {table_comment} Mapper 接口
 *
 * @author {author}
 * @since {date}
 */
@Mapper
public interface {EntityName}Mapper extends BasicMapper<{EntityName}> {

}
```

#### 3.3 创建 DbService 接口

```java
package cn.chinatelecom.cq.ctis.{module}.data.service;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicDbService;
import cn.chinatelecom.cq.ctis.{module}.common.rest.{EntityName}QueryRequest;
import cn.chinatelecom.cq.ctis.{module}.common.rest.{EntityName}Response;
import cn.chinatelecom.cq.ctis.{module}.data.model.{EntityName};
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * {table_comment} 数据服务接口
 *
 * @author {author}
 * @since {date}
 */
public interface {EntityName}DbService extends BasicDbService<{EntityName}> {

    /**
     * 分页查询{table_comment}
     *
     * @param request 查询请求
     * @return 分页结果
     */
    Page<{EntityName}Response> page({EntityName}QueryRequest request);

    /**
     * 检查{unique_field}是否存在
     *
     * @param {unique_field} {unique_field_comment}
     * @return 是否存在
     */
    Boolean exist{UniqueField}({field_type} {unique_field});
}
```

#### 3.4 创建 DbService 实现类

```java
package cn.chinatelecom.cq.ctis.{module}.data.service.impl;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicDbServiceImpl;
import cn.chinatelecom.cq.ctis.{module}.common.rest.{EntityName}QueryRequest;
import cn.chinatelecom.cq.ctis.{module}.common.rest.{EntityName}Response;
import cn.chinatelecom.cq.ctis.{module}.data.mapper.{EntityName}Mapper;
import cn.chinatelecom.cq.ctis.{module}.data.model.{EntityName};
import cn.chinatelecom.cq.ctis.{module}.data.service.{EntityName}DbService;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

@Service
public class {EntityName}DbServiceImpl extends BasicDbServiceImpl<{EntityName}Mapper, {EntityName}>
        implements {EntityName}DbService {

    @Override
    public Page<{EntityName}Response> page({EntityName}QueryRequest request) {
        return lambdaJoinWrapper()
                .like(StrUtil.isNotBlank(request.getKeyword()), {EntityName}::{getFieldName}, request.getKeyword())
                .or()
                .like(StrUtil.isNotBlank(request.getKeyword()), {EntityName}::{getFieldName}, request.getKeyword())
                .eq(request.get{EnumField}() != null, {EntityName}::get{EnumField}, request.get{EnumField}())
                .orderByDesc({EntityName}::getCreatedTs)
                .page(request.toPage(), {EntityName}Response.class);
    }

    @Override
    public Boolean exist{UniqueField}({field_type} {unique_field}) {
        return this.getOneOpt(lambdaJoinWrapper()
                .eq({EntityName}::get{UniqueField}, {unique_field})).isPresent();
    }
}
```

**关键点：**
- **DbService 层使用 Wrapper**：DbService 层可以使用 `lambdaJoinWrapper()`、`lambdaUpdate()` 等 Wrapper 方法构建查询条件
- 枚举类型使用 `!= null` 判断，字符串类型使用 `StrUtil.isNotBlank()`
- 使用 `page()` 方法自动处理分页和类型转换
- **封装原则**：所有数据库操作（包括复杂查询）都应该在 DbService 层封装，BusinessService 层通过调用 DbService 方法完成数据访问

### 步骤 4：公共层实现（Common Layer）

#### 4.1 创建 Request DTOs

**查询请求：**

```java
package cn.chinatelecom.cq.ctis.{module}.common.rest;

import cn.chinatelecom.cq.ctis.basic.core.entity.BasePageRequest;
import cn.chinatelecom.cq.ctis.framework.common.enums.{EnumName};
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class {EntityName}QueryRequest extends BasePageRequest {

    @Schema(description = "搜索关键字")
    private String keyword;

    @Schema(description = "{enum_field_comment}")
    private {EnumName} {enum_field};
}
```

**保存请求：**

```java
package cn.chinatelecom.cq.ctis.{module}.common.rest;

import cn.chinatelecom.cq.ctis.framework.common.enums.{EnumName};
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class {EntityName}SaveRequest {

    @Schema(description = "{field_comment}", required = true)
    @NotBlank(message = "{field_comment}必填")
    @Size(max = 100, message = "{field_comment}最长为100个字符")
    private String {field_name};

    @Schema(description = "{enum_field_comment}", required = true)
    @NotNull(message = "{enum_field_comment}必填")
    private {EnumName} {enum_field};

    // ... 更多字段
}
```

**更新请求：**

```java
package cn.chinatelecom.cq.ctis.{module}.common.rest;

import cn.chinatelecom.cq.ctis.framework.common.enums.{EnumName};
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class {EntityName}UpdateRequest {

    @Schema(description = "主键ID", required = true)
    @NotNull(message = "ID必填")
    private Long id;

    @Schema(description = "{field_comment}")
    @Size(max = 100, message = "{field_comment}最长为100个字符")
    private String {field_name};

    @Schema(description = "{enum_field_comment}")
    private {EnumName} {enum_field};

    // ... 更多字段
}
```

**关键点：**
- 使用 `@JsonIgnoreProperties(ignoreUnknown = true)` 忽略未知字段
- 枚举类型使用 `@NotNull` 验证，字符串类型使用 `@NotBlank`
- 添加 `@Pattern` 正则验证确保编码格式正确
- **DTO 字段类型规范**：
  - 对于状态、类型、优先级等固定取值的字段，**必须使用枚举类型**而非 String
  - 枚举类型在 `ctis-cloud-core-common` 模块的 `framework.common.enums` 包中定义
  - DTO 中的枚举字段会自动进行 JSON 序列化/反序列化

**DTO 枚举使用示例**：
```java
// ❌ 错误：使用 String 类型
@Data
public class NoticeTodoResponse {
    private String status;        // "unread" / "read"
    private String priority;      // "low" / "medium" / "high"
    private String pinStatus;     // "pinned" / "unpinned"
}

// ✅ 正确：使用枚举类型
@Data
public class NoticeTodoResponse {
    private TodoStatus status;        // TodoStatus.UNREAD / TodoStatus.READ
    private TodoPriority priority;    // TodoPriority.LOW / TodoPriority.MEDIUM / TodoPriority.HIGH
    private TodoPinStatus pinStatus;  // TodoPinStatus.PINNED / TodoPinStatus.UNPINNED
}
```

#### 4.2 创建 Response DTO

```java
package cn.chinatelecom.cq.ctis.{module}.common.rest;

import cn.chinatelecom.cq.ctis.framework.common.enums.{EnumName};
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class {EntityName}Response {

    @Schema(description = "主键ID")
    private Long id;

    @Schema(description = "{field_comment}")
    private String {field_name};

    @Schema(description = "{enum_field_comment}")
    private {EnumName} {enum_field};

    @Schema(description = "创建时间")
    private LocalDateTime createdTs;

    @Schema(description = "更新时间")
    private LocalDateTime lastModifiedTs;

    // ... 更多字段
}
```

### 步骤 5：业务层实现（Business Layer）

#### 5.1 创建 Service 接口

```java
package cn.chinatelecom.cq.ctis.{module}.business.{package};

import cn.chinatelecom.cq.ctis.basic.core.base.BasicService;
import cn.chinatelecom.cq.ctis.{module}.common.rest.*;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * {table_comment} 业务服务接口
 *
 * @author {author}
 * @since {date}
 */
public interface {EntityName}Service extends BasicService {

    /**
     * 分页查询{table_comment}
     *
     * @param request 查询请求
     * @return 分页结果
     */
    Page<{EntityName}Response> page({EntityName}QueryRequest request);

    /**
     * 查询{table_comment}详情
     *
     * @param id 主键ID
     * @return 详情
     */
    {EntityName}Response detail(Long id);

    /**
     * 保存{table_comment}
     *
     * @param request 保存请求
     * @return 主键ID
     */
    Long save({EntityName}SaveRequest request);

    /**
     * 更新{table_comment}
     *
     * @param request 更新请求
     */
    void update({EntityName}UpdateRequest request);

    /**
     * 删除{table_comment}
     *
     * @param id 主键ID
     */
    void delete(Long id);
}
```

#### 5.2 创建 Service 实现类

```java
package cn.chinatelecom.cq.ctis.{module}.business.{package}.impl;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicServiceImpl;
import cn.chinatelecom.cq.ctis.basic.web.exception.DxConflictException;
import cn.chinatelecom.cq.ctis.basic.web.exception.DxNotFoundException;
import cn.chinatelecom.cq.ctis.{module}.business.{package}.{EntityName}Service;
import cn.chinatelecom.cq.ctis.{module}.common.exception.{Module}404ExceptionEnum;
import cn.chinatelecom.cq.ctis.{module}.common.exception.{Module}409ExceptionEnum;
import cn.chinatelecom.cq.ctis.{module}.common.rest.*;
import cn.chinatelecom.cq.ctis.{module}.data.model.{EntityName};
import cn.chinatelecom.cq.ctis.{module}.data.service.{EntityName}DbService;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class {EntityName}ServiceImpl extends BasicServiceImpl<{EntityName}DbService, {EntityName}>
        implements {EntityName}Service {

    private final {EntityName}DbService {entityName}DbService;

    @Override
    public Page<{EntityName}Response> page({EntityName}QueryRequest request) {
        return {entityName}DbService.page(request);
    }

    @Override
    public {EntityName}Response detail(Long id) {
        {EntityName} entity = Optional.ofNullable(getById(id))
                .orElseThrow(() -> new DxNotFoundException({Module}404ExceptionEnum.NOT_FOUND_NO_DATA));

        {EntityName}Response response = new {EntityName}Response();
        BeanUtils.copyProperties(entity, response);
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long save({EntityName}SaveRequest request) {
        // 校验唯一性
        if ({entityName}DbService.exist{UniqueField}(request.get{UniqueField}())) {
            throw new DxConflictException({Module}409ExceptionEnum.CONFLICT_{UNIQUE_FIELD});
        }

        {EntityName} entity = new {EntityName}();
        BeanUtils.copyProperties(request, entity);
        {entityName}DbService.save(entity);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update({EntityName}UpdateRequest request) {
        {EntityName} entity = Optional.ofNullable(getById(request.getId()))
                .orElseThrow(() -> new DxNotFoundException({Module}404ExceptionEnum.NOT_FOUND_NO_DATA));

        // 如果修改了唯一字段，需要校验唯一性
        if (!Objects.equals(entity.get{UniqueField}(), request.get{UniqueField}())
                && {entityName}DbService.exist{UniqueField}(request.get{UniqueField}())) {
            throw new DxConflictException({Module}409ExceptionEnum.CONFLICT_{UNIQUE_FIELD});
        }

        // 更新非空字段
        if (StrUtil.isNotBlank(request.get{FieldName}())) {
            entity.set{FieldName}(request.get{FieldName}());
        }
        if (request.get{EnumField}() != null) {
            entity.set{EnumField}(request.get{EnumField}());
        }

        {entityName}DbService.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        {EntityName} entity = Optional.ofNullable(getById(id))
                .orElseThrow(() -> new DxNotFoundException({Module}404ExceptionEnum.NOT_FOUND_NO_DATA));

        // 业务规则校验
        if (entity.get{StatusField}() != {EnumName}.{DRAFT_STATUS}) {
            throw new DxConflictException({Module}409ExceptionEnum.CONFLICT_{STATUS_FIELD});
        }

        {entityName}DbService.removeById(id);
    }
}
```

**关键点：**
- **禁止使用 Wrapper**：BusinessService 层禁止使用 `lambdaQuery`、`lambdaUpdate`、`lambdaJoinWrapper` 等 Wrapper 方法
- **调用 DbService 方法**：所有数据库操作通过调用 DbService 层的方法完成
- 使用 `@Transactional` 确保事务一致性
- 使用 `Optional` 处理可能为 null 的结果
- 使用枚举比较替代字符串比较
- 更新方法支持部分字段更新
- **异常处理规范**：
  - 禁止使用 Java 标准异常（如 `IllegalArgumentException`、`NullPointerException`）
  - 必须使用 Dx 系列异常类（`DxBadRequestException`、`DxNotFoundException`、`DxConflictException` 等）
  - 在对应模块的异常枚举中定义业务异常常量
  - 异常消息统一在异常枚举中定义，不要在代码中硬编码

**Wrapper 使用规范示例**：
```java
// ❌ 错误：BusinessService 层直接使用 Wrapper
@Service
public class AppCenterAppServiceImpl {
    public Page<AppCenterAppResponse> page(Long userId, AppCenterAppQueryRequest request) {
        // 错误：在 Business 层直接使用 lambdaJoinWrapper
        List<Long> appIds = appCenterAppGroupDbService.lambdaJoinWrapper()
                .eq(AppCenterAppGroup::getGroupId, request.getGroupId())
                .list()
                .stream()
                .map(AppCenterAppGroup::getAppId)
                .collect(Collectors.toList());
        // ...
    }
}

// ✅ 正确：在 DbService 层封装 Wrapper 方法
// DbService 接口
public interface AppCenterAppGroupDbService extends BasicDbService<AppCenterAppGroup> {
    List<Long> getAppIdsByGroupId(Long groupId);
}

// DbService 实现
@Service
public class AppCenterAppGroupDbServiceImpl extends BasicDbServiceImpl<...> {
    @Override
    public List<Long> getAppIdsByGroupId(Long groupId) {
        // 正确：在 DbService 层使用 Wrapper
        return lambdaJoinWrapper()
                .eq(AppCenterAppGroup::getGroupId, groupId)
                .list()
                .stream()
                .map(AppCenterAppGroup::getAppId)
                .toList();
    }
}

// BusinessService 实现
@Service
public class AppCenterAppServiceImpl {
    public Page<AppCenterAppResponse> page(Long userId, AppCenterAppQueryRequest request) {
        // 正确：调用 DbService 方法
        List<Long> appIds = appCenterAppGroupDbService.getAppIdsByGroupId(request.getGroupId());
        // ...
    }
}
```

**异常处理示例**：
```java
// ❌ 错误：使用 Java 标准异常
if (request.getAction() == null) {
    throw new IllegalArgumentException("操作类型不能为空");
}

// ✅ 正确：使用 Dx 系列异常
if (request.getAction() == null) {
    throw new DxBadRequestException(System400ExceptionEnum.BAD_REQUEST_INVALID_PIN_ACTION);
}

// ❌ 错误：使用不存在的 Dx400Exception
throw new Dx400Exception(System400ExceptionEnum.BAD_REQUEST_INVALID_PIN_ACTION);

// ❌ 错误：硬编码异常消息
throw new DxNotFoundException("待办事项不存在");

// ✅ 正确：使用异常枚举
throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_TODO);
```

### 步骤 6：Web 层实现（Web Layer）

#### 6.1 创建 Controller

```java
package cn.chinatelecom.cq.ctis.{module}.web.api.{package};

import cn.chinatelecom.cq.ctis.basic.web.model.Result;
import cn.chinatelecom.cq.ctis.basic.web.operate.OperateType;
import cn.chinatelecom.cq.ctis.basic.web.operate.annotation.OperateLog;
import cn.chinatelecom.cq.ctis.{module}.business.{package}.{EntityName}Service;
import cn.chinatelecom.cq.ctis.{module}.common.rest.*;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * {table_comment} Controller
 *
 * @author {author}
 * @since {date}
 */
@Tag(name = "{table_comment}", description = "{table_comment}接口")
@RestController
@RequestMapping("/api/{module}/{entity}")
@RequiredArgsConstructor
@Validated
public class {EntityName}Controller {

    private final {EntityName}Service {entityName}Service;

    @Operation(summary = "分页查询{table_comment}")
    //@PreAuthorize("hasAuthority('{permission}:list')")
    @GetMapping("/list")
    public Result<Page<{EntityName}Response>> list(@Validated {EntityName}QueryRequest request) {
        return Result.success({entityName}Service.page(request));
    }

    @Operation(summary = "查询{table_comment}详情")
    //@PreAuthorize("hasAuthority('{permission}:query')")
    @GetMapping("/{id}")
    public Result<{EntityName}Response> detail(@PathVariable Long id) {
        return Result.success({entityName}Service.detail(id));
    }

    @Operation(summary = "保存{table_comment}")
    //@PreAuthorize("hasAuthority('{permission}:add')")
    @PostMapping("/save")
    @OperateLog(operateType = OperateType.ADD, operateDesc = "保存{table_comment}")
    public Result<Long> save(@Validated @RequestBody {EntityName}SaveRequest request) {
        return Result.success({entityName}Service.save(request));
    }

    @Operation(summary = "更新{table_comment}")
    //@PreAuthorize("hasAuthority('{permission}:edit')")
    @PostMapping("/update")
    @OperateLog(operateType = OperateType.EDIT, operateDesc = "更新{table_comment}")
    public Result<Void> update(@Validated @RequestBody {EntityName}UpdateRequest request) {
        {entityName}Service.update(request);
        return Result.success();
    }

    @Operation(summary = "删除{table_comment}")
    //@PreAuthorize("hasAuthority('{permission}:remove')")
    @DeleteMapping("/{id}")
    @OperateLog(operateType = OperateType.DELETE, operateDesc = "删除{table_comment}")
    public Result<Void> delete(@PathVariable Long id) {
        {entityName}Service.delete(id);
        return Result.success();
    }
}
```

**关键点：**
- 使用 `@PreAuthorize` 进行权限控制
- 使用 `@OperateLog` 记录操作日志
- 使用 `@Validated` 进行参数校验
- 使用 `@Operation` 添加 API 文档说明
- 使用 `OperateType.ADD` 而非 `OperateType.INSERT`

### 步骤 7：枚举转换（可选）

如果需要将字符串/数字字段转换为枚举，参考 [字段转枚举重构技能](./string-to-enum-refactoring.md)：

1. 创建枚举类（实现 `IEnum<T>` 接口）
2. 更新实体类字段类型
3. 更新 Request/Response DTOs
4. 更新 DbService 查询条件
5. 更新 Business Service 业务逻辑
6. 编译验证

### 步骤 8：编译验证

```bash
# 1. 编译 ctis-cloud-core 模块（包含新枚举类）
cd ctis-cloud-core
mvn clean install -DskipTests

# 2. 编译业务模块
cd ../{module}
mvn compile

# 3. 运行测试（可选）
mvn test
```

## API 接口规范

### 接口列表

| 方法 | 路径 | 描述 | 权限 |
|-----|------|------|------|
| GET | /api/{module}/{entity}/list | 分页查询 | {permission}:list |
| GET | /api/{module}/{entity}/{id} | 查询详情 | {permission}:query |
| POST | /api/{module}/{entity}/save | 保存 | {permission}:add |
| POST | /api/{module}/{entity}/update | 更新 | {permission}:edit |
| DELETE | /api/{module}/{entity}/{id} | 删除 | {permission}:remove |

## 注意事项

### 1. 架构规范遵守
⚠️ **重要提醒**：
- 严格遵循 Web → Business → Data → Mapper → DB 五层架构
- Controller 层只做参数验证和调用 Service
- BusinessService 层处理业务逻辑和事务管理
- DbService 层封装所有数据库操作
- **禁止 BusinessService 层直接使用 Wrapper**：BusinessService 层禁止使用 `lambdaQuery`、`lambdaUpdate`、`lambdaJoinWrapper` 等 Wrapper 方法，所有数据库操作必须封装在 DbService 层
- 禁止跨层调用和循环依赖
- DTO 转换使用 MapStruct，禁止使用 BeanUtils

### 2. 安全规范遵守
🔒 **安全要求**：
- 接口必须添加权限注解 `@PreAuthorize`
- 删除操作必须记录审计日志
- 敏感字段需要加密处理

### 3. 异常处理规范
📋 **异常规范**：
- 使用 Dx 系列异常类，不要抛出 RuntimeException
- 在对应模块的异常枚举中定义业务异常
- Controller 层不要手动 try-catch，交给全局异常处理器
- **禁止使用 Java 标准异常**：如 `IllegalArgumentException`、`NullPointerException` 等
- **异常类型选择**：
  - `DxBadRequestException` - 请求参数错误（400）
  - `DxUnauthorizedException` - 未授权（401）
  - `DxForbiddenException` - 禁止访问（403）
  - `DxNotFoundException` - 资源不存在（404）
  - `DxConflictException` - 业务冲突（409）
  - `DxTooManyRequestException` - 请求过多（429）
  - `DxInternalException` - 服务器内部错误（500）
  - `DxServiceException` - 服务异常（通用）

**异常使用示例**：
```java
// ❌ 错误：使用 Java 标准异常
throw new IllegalArgumentException("无效的操作类型: " + request.getAction());

// ✅ 正确：使用 Dx 系列异常
throw new DxBadRequestException(System400ExceptionEnum.BAD_REQUEST_INVALID_PIN_ACTION);

// ❌ 错误：使用不存在的 Dx400Exception
throw new Dx400Exception(System400ExceptionEnum.BAD_REQUEST_INVALID_PIN_ACTION);

// ✅ 正确：使用 DxBadRequestException
throw new DxBadRequestException(System400ExceptionEnum.BAD_REQUEST_INVALID_PIN_ACTION);
```

### 4. 日志记录规范
📝 **日志规范**：
- 重要业务操作必须添加 `@OperateLog` 注解
- 日志内容要清晰描述操作行为
- 敏感信息在日志中要脱敏处理

## 常见问题

### Q1: 如何处理枚举类型的参数验证？
**A**: 枚举类型使用 `@NotNull` 验证，而非 `@NotBlank`。Spring MVC 会自动将请求参数转换为枚举类型。

### Q2: 如何实现部分字段更新？
**A**: 在 Service 层判断请求字段是否为 null，仅更新非 null 字段。

### Q3: 如何确保字段的唯一性？
**A**: 在数据库层面创建唯一索引，在业务层面保存和更新时进行唯一性校验。

### Q4: 如何处理删除权限控制？
**A**: 在 Service 层检查实体状态，仅允许删除符合业务规则的实体。

### Q5: 如何使用 MapStruct 进行 DTO 转换？
**A**: 创建 Mapper 接口并使用 `@Mapper` 注解，定义转换方法，避免使用 BeanUtils。

### Q6: DTO 中应该使用枚举还是 String？
**A**: 对于状态、类型、优先级等固定取值的字段，**必须使用枚举类型**。枚举类型在 `ctis-cloud-core-common` 模块的 `framework.common.enums` 包中定义。使用枚举可以：
- 提供类型安全
- 避免拼写错误
- 便于 IDE 自动补全
- 统一管理所有可能的取值

### Q7: Business 层的异常处理应该遵循什么规范？
**A**: Business 层的异常处理必须遵循以下规范：
- **禁止使用 Java 标准异常**：如 `IllegalArgumentException`、`NullPointerException`、`IllegalStateException` 等
- **必须使用 Dx 系列异常类**：
  - `DxBadRequestException` - 请求参数错误（400）
  - `DxUnauthorizedException` - 未授权（401）
  - `DxForbiddenException` - 禁止访问（403）
  - `DxNotFoundException` - 资源不存在（404）
  - `DxConflictException` - 业务冲突（409）
  - `DxTooManyRequestException` - 请求过多（429）
  - `DxInternalException` - 服务器内部错误（500）
  - `DxServiceException` - 服务异常（通用）
- **在异常枚举中定义异常常量**：在对应模块的 `System400ExceptionEnum`、`System404ExceptionEnum`、`System409ExceptionEnum` 等枚举类中定义
- **不要硬编码异常消息**：异常消息统一在异常枚举中定义
- **注意**：项目中不存在 `Dx400Exception`、`Dx500Exception` 等异常类，请使用正确的异常类名

### Q8: Business 层可以使用 Wrapper 吗？
**A**: **不可以**。BusinessService 层禁止使用 `lambdaQuery`、`lambdaUpdate`、`lambdaJoinWrapper` 等 Wrapper 方法。所有数据库操作必须封装在 DbService 层，BusinessService 层通过调用 DbService 方法完成数据访问。这是架构分层的重要原则，确保：
- **职责清晰**：DbService 层负责数据访问，BusinessService 层负责业务逻辑
- **代码复用**：DbService 方法可以被多个 BusinessService 复用
- **易于测试**：数据访问逻辑和业务逻辑分离，便于单元测试
- **维护性**：数据库操作集中管理，便于优化和重构

## 最佳实践

### 1. 代码组织结构
```
模块目录结构：
├── api/                    # 接口定义
├── business/               # 业务实现
│   ├── service/           # Service 接口和实现
│   └── mapstruct/         # DTO 转换器
├── common/                # 公共组件
│   └── rest/             # 请求响应 DTO
├── data/                  # 数据访问
│   ├── mapper/           # Mapper 接口
│   ├── model/            # 实体类
│   └── service/          # DbService 接口和实现
└── web/                   # Web 层
    └── controller/        # Controller 接口
```

### 2. 命名规范
- 类名：首字母大写的驼峰命名
- 方法名：动词开头的驼峰命名
- 变量名：首字母小写的驼峰命名
- 常量名：大写蛇形命名
- 包名：全部小写，用点分隔

### 3. 注释规范
```java
/**
 * 类注释说明
 *
 * @author 作者名
 * @since 版本号
 */
public class ExampleClass {

    /**
     * 方法注释说明
     *
     * @param param 参数说明
     * @return 返回值说明
     * @throws Exception 异常说明
     */
    public ReturnType methodName(ParameterType param) {
        // 方法实现
    }
}
```

### 4. 事务管理
- 写操作（save、update、delete）添加 `@Transactional`
- 读操作（query、detail）无需事务

## 相关技能

### 配合使用的技能
- **database-entity-creation-standard** - 数据库实体创建标准
- **string-to-enum-refactoring** - 字段转枚举重构技能
- **liquibase** - Liquibase 脚本生成
- **request-entity-standard** - 请求实体标准
- **parameter-validation-guide** - 参数验证开发指导
- **api-doc-standard-guide** - API 文档标准化
- **global-exception-handler-guide** - 全局异常处理
- **sys-log-record-guide** - 系统日志记录

### 标准开发流程
```
1. 需求分析（确定模块和字段）
   ↓
2. 数据库设计（Liquibase 脚本）
   ↓
3. 数据层实现（Entity、Mapper、DbService）
   ↓
4. 公共层实现（Request/Response DTOs）
   ↓
5. 业务层实现（Service 接口和实现）
   ↓
6. Web 层实现（Controller）
   ↓
7. 枚举转换（可选）
   ↓
8. 编译验证
```

## 代码审查检查清单

在完成 CRUD 功能开发后，请使用以下检查清单进行代码审查：

### DTO 层检查
- [ ] 所有状态、类型、优先级等固定取值字段是否使用了枚举类型而非 String
- [ ] 枚举类型是否在 `ctis-cloud-core-common` 模块的 `framework.common.enums` 包中定义
- [ ] Request DTO 是否添加了 `@JsonIgnoreProperties(ignoreUnknown = true)`
- [ ] 枚举字段是否使用 `@NotNull` 验证，字符串字段是否使用 `@NotBlank` 验证
- [ ] 是否添加了 `@Schema` 注解用于 API 文档生成

### Business 层检查
- [ ] 是否禁止使用 Java 标准异常（如 `IllegalArgumentException`、`NullPointerException`）
- [ ] 是否使用 Dx 系列异常类（`DxBadRequestException`、`DxNotFoundException`、`DxConflictException` 等）
- [ ] 是否使用了正确的异常类名（注意：不存在 `Dx400Exception`、`Dx500Exception`，应使用 `DxBadRequestException`、`DxInternalException`）
- [ ] 异常常量是否在对应模块的异常枚举中定义
- [ ] 异常消息是否统一在异常枚举中定义，没有硬编码
- [ ] 写操作（save、update、delete）是否添加了 `@Transactional` 注解
- [ ] 是否使用 `Optional` 处理可能为 null 的结果
- [ ] 枚举比较是否使用枚举类型而非字符串比较
- [ ] **是否禁止使用 Wrapper**：BusinessService 层禁止使用 `lambdaQuery`、`lambdaUpdate`、`lambdaJoinWrapper` 等 Wrapper 方法
- [ ] **是否调用 DbService 方法**：所有数据库操作是否通过调用 DbService 层的方法完成

### 其他检查
- [ ] Controller 层是否添加了 `@PreAuthorize` 权限注解
- [ ] 重要操作是否添加了 `@OperateLog` 日志注解
- [ ] 是否遵循了 Web → Business → Data → Mapper → DB 五层架构
- [ ] 是否编译通过

## 相关文档
- **架构设计规范**：`skills/architecture/architecture.md`
- **API 文档规范**：`skills/api-doc-standard-guide/SKILL.md`
- **异常处理规范**：`skills/global-exception-handler-guide/SKILL.md`
- **日志记录规范**：`skills/sys-log-record-guide/SKILL.md`
- **数据库加密规范**：`skills/db-encryption/SKILL.md`
- **传输加密规范**：`skills/http-encryption/SKILL.md`
- **数据脱敏规范**：`skills/data-desensitization/SKILL.md`
- **密码加密规范**：`skills/password-encryption/SKILL.md`
