---
name: ctis-java-best-dev
description: CTIS Java 最佳实践（中电智安），基于 ctis-boot 脚手架的二次开发规范
version: v1.0
paths:
  - "**/*.java"
  - "**/pom.xml"
---

# CTIS Java 最佳实践

> 适用：基于 ctis-boot 脚手架的二次开发项目
> 目标：统一代码风格，提升开发效率，降低维护成本

---

## 项目架构概述

### 模块结构

```
ctis-boot (root)
├── ctis-boot-web          # Web层 - Controller、配置、拦截器
├── ctis-boot-business     # 业务层 - Service接口与实现
├── ctis-boot-data         # 数据层 - Entity、Mapper、DbService
├── ctis-boot-common       # 公共模块 - DTO、常量、枚举、注解
└── ctis-boot-core         # 核心框架模块（依赖，不修改）
```

### 依赖流向

```
ctis-boot-web
    ↓ depends on
ctis-boot-business
    ↓ depends on
ctis-boot-data
    ↓
ctis-boot-common
    ↓
ctis-boot-core
```

### 多平台架构

系统支持三种客户端平台，API 路径前缀不同：

| 平台 | 路径前缀 | 说明 |
|------|----------|------|
| BACK | `/api/{context}/system/**` | 后台管理 |
| H5 | `/api/{context}/h5/**` | 移动端网页 |
| MINIAPP | `/api/{context}/miniapp/**` | 微信小程序 |

---

## 命名规范

### 包命名

```
cn.chinatelecom.cq.ctis.boot.{模块}.{分层}

# 示例
cn.chinatelecom.cq.ctis.boot.web.api.system     # Web层
cn.chinatelecom.cq.ctis.boot.business.sys       # 业务层
cn.chinatelecom.cq.ctis.boot.data.model         # 数据层-实体
cn.chinatelecom.cq.ctis.boot.data.service       # 数据层-Service
cn.chinatelecom.cq.ctis.boot.data.mapper        # 数据层-Mapper
cn.chinatelecom.cq.ctis.boot.common.rest.user   # 公共层-用户相关DTO
cn.chinatelecom.cq.ctis.boot.common.enums       # 公共层-枚举
cn.chinatelecom.cq.ctis.boot.common.exception   # 公共层-异常枚举
```

### 类命名

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| Controller | `Sys{模块}Controller` | `SysUserController` |
| Service 接口 | `Sys{模块}Service` | `SysUserService` |
| Service 实现 | `Sys{模块}ServiceImpl` | `SysUserServiceImpl` |
| Entity | `Sys{模块}` | `SysUser` |
| DbService 接口 | `Sys{模块}DbService` | `SysUserDbService` |
| DbService 实现 | `Sys{模块}DbServiceImpl` | `SysUserDbServiceImpl` |
| Mapper | `Sys{模块}Mapper` | `SysUserMapper` |
| Request DTO | `{操作}{模块}Request` | `CreateUserRequest` |
| Response DTO | `{模块}{详情}Response` | `UserResponse`, `UserDetailResponse` |
| 异常枚举 | `System{状态码}ExceptionEnum` | `System400ExceptionEnum` |

---

## Controller 开发规范

### 基本结构

```java
package cn.chinatelecom.cq.ctis.boot.web.api.system;

import cn.chinatelecom.cq.ctis.basic.web.rest.DxPageResponse;
import cn.chinatelecom.cq.ctis.basic.web.rest.DxResponse;
import cn.chinatelecom.cq.ctis.boot.business.sys.SysUserService;
import cn.chinatelecom.cq.ctis.boot.common.constants.ApiConstants;
import cn.chinatelecom.cq.ctis.framework.common.enums.LoginPlatform;
import cn.chinatelecom.cq.ctis.framework.log.aspect.SysLog;
import cn.chinatelecom.cq.ctis.framework.log.type.OperateType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author author.name
 * @date yyyy-MM-dd HH:mm
 */
@Tag(name = "模块管理相关api")
@RestController
@RequestMapping(ApiConstants.API_SYSTEM_PATH + "/module")
@Validated
public class SysModuleController {

    @Autowired
    private SysModuleService sysModuleService;

    // API methods...
}
```

### 注解规范

| 注解 | 用途 | 必填 |
|------|------|------|
| `@Tag` | API 分组名称 | 是 |
| `@Operation` | 接口描述，包含权限码 | 是 |
| `@SysLog` | 操作日志记录 | 是 |
| `@PreAuthorize` | 权限控制 | 是 |
| `@Valid` | 请求参数校验 | 是（POST/PUT） |
| `@ParameterObject` | 分页查询参数 | 是（分页接口） |

### 接口模板

```java
/**
 * 新增
 */
@PostMapping("/create")
@Operation(summary = "新增XX", description = "权限码sys:module:add")
@SysLog(value = "新增XX", type = OperateType.ADD, platform = LoginPlatform.BACK)
@PreAuthorize("hasAnyAuthority('sys:module:add')")
DxResponse<Void> create(@Valid @RequestBody CreateModuleRequest request) {
    sysModuleService.create(request);
    return new DxResponse<>();
}

/**
 * 分页列表
 */
@GetMapping("/page")
@Operation(summary = "XX列表", description = "权限码sys:module:page")
@SysLog(value = "XX列表", type = OperateType.PAGE, platform = LoginPlatform.BACK)
@PreAuthorize("hasAnyAuthority('sys:module:page')")
DxPageResponse<ModuleResponse> page(@ParameterObject ModuleQueryRequest request) {
    return new DxPageResponse<>(sysModuleService.page(request));
}

/**
 * 修改
 */
@PostMapping("/update")
@Operation(summary = "修改XX", description = "权限码sys:module:edit")
@SysLog(value = "修改XX", type = OperateType.UPDATE, platform = LoginPlatform.BACK)
@PreAuthorize("hasAnyAuthority('sys:module:edit')")
DxResponse<Void> update(@Valid @RequestBody UpdateModuleRequest request) {
    sysModuleService.update(request);
    return new DxResponse<>();
}

/**
 * 删除
 */
@PostMapping("/delete")
@Operation(summary = "批量删除", description = "权限码sys:module:delete")
@SysLog(value = "批量删除", type = OperateType.DELETE, platform = LoginPlatform.BACK)
@PreAuthorize("hasAnyAuthority('sys:module:delete')")
DxResponse<Void> delete(@Valid @RequestBody BatchIdRequest request) {
    sysModuleService.delete(request);
    return new DxResponse<>();
}

/**
 * 详情
 */
@GetMapping("/{id}")
@Operation(summary = "XX详情", description = "权限码sys:module:detail")
@SysLog(value = "XX详情", type = OperateType.INFO, platform = LoginPlatform.BACK)
@PreAuthorize("hasAnyAuthority('sys:module:detail')")
DxResponse<ModuleDetailResponse> detail(@PathVariable Long id) {
    return new DxResponse<>(sysModuleService.detail(id));
}
```

### 返回类型规范

| 场景 | 返回类型 | 示例 |
|------|----------|------|
| 无数据返回 | `DxResponse<Void>` | `return new DxResponse<>();` |
| 单对象返回 | `DxResponse<T>` | `return new DxResponse<>(data);` |
| 分页列表 | `DxPageResponse<T>` | `return new DxPageResponse<>(page);` |

---

## Service 开发规范

### Service 接口

```java
package cn.chinatelecom.cq.ctis.boot.business.sys;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicService;
import cn.chinatelecom.cq.ctis.boot.common.rest.module.*;
import cn.chinatelecom.cq.ctis.boot.data.model.SysModule;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * <p>业务类</p>
 *
 * @author ctis
 * @since yyyy-MM-dd
 */
public interface SysModuleService extends BasicService<SysModule> {

    /**
     * 新增
     */
    void create(CreateModuleRequest request);

    /**
     * 分页查询
     */
    Page<ModuleResponse> page(ModuleQueryRequest request);

    /**
     * 修改
     */
    void update(UpdateModuleRequest request);

    /**
     * 删除
     */
    void delete(BatchIdRequest request);

    /**
     * 详情
     */
    ModuleDetailResponse detail(Long id);
}
```

### Service 实现

```java
package cn.chinatelecom.cq.ctis.boot.business.sys.impl;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicServiceImpl;
import cn.chinatelecom.cq.ctis.basic.web.exception.DxNotFoundException;
import cn.chinatelecom.cq.ctis.boot.business.sys.SysModuleService;
import cn.chinatelecom.cq.ctis.boot.common.exception.System404ExceptionEnum;
import cn.chinatelecom.cq.ctis.boot.common.rest.module.*;
import cn.chinatelecom.cq.ctis.boot.data.model.SysModule;
import cn.chinatelecom.cq.ctis.boot.data.service.SysModuleDbService;
import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * <p>业务实现类</p>
 *
 * @author ctis
 * @since yyyy-MM-dd
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysModuleServiceImpl extends BasicServiceImpl<SysModuleDbService, SysModule>
        implements SysModuleService {

    // 使用 final + @RequiredArgsConstructor 进行依赖注入
    private final SysOtherDbService sysOtherDbService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(CreateModuleRequest request) {
        // 1. 业务校验
        checkBusinessRule(request);

        // 2. 转换实体
        SysModule entity = BeanUtil.copyProperties(request, SysModule.class);

        // 3. 保存
        getBasicDbService().save(entity);

        // 4. 关联操作
        // ...
    }

    @Override
    public Page<ModuleResponse> page(ModuleQueryRequest request) {
        return getBasicDbService().pageWithPermission(request);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UpdateModuleRequest request) {
        // 1. 检查存在性
        SysModule exist = getBasicDbService().getById(request.getId());
        if (Objects.isNull(exist)) {
            throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);
        }

        // 2. 业务校验
        checkBusinessRule(request);

        // 3. 更新
        SysModule entity = BeanUtil.copyProperties(request, SysModule.class);
        getBasicDbService().updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(BatchIdRequest request) {
        // 批量删除
        getBasicDbService().removeByIds(request.getIds());
    }

    @Override
    public ModuleDetailResponse detail(Long id) {
        SysModule entity = getBasicDbService().getById(id);
        if (Objects.isNull(entity)) {
            throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);
        }
        return BeanUtil.copyProperties(entity, ModuleDetailResponse.class);
    }

    // 私有辅助方法
    private void checkBusinessRule(CreateModuleRequest request) {
        // 业务规则校验
    }
}
```

### Service 规范要点

1. **依赖注入**：使用 `@RequiredArgsConstructor` + `final` 字段
2. **写操作事务**：`@Transactional(rollbackFor = Exception.class)`
3. **异常处理**：使用 `Dx*Exception` + `System*ExceptionEnum`
4. **实体转换**：使用 `BeanUtil.copyProperties`
5. **日志记录**：类上加 `@Slf4j`，占位符必须有对应参数

### 日志规范（强制）

```java
// ✅ 正确：占位符与参数数量匹配
log.info("创建图书成功，ID：{}，ISBN：{}", book.getId(), book.getIsbn());
log.info("批量删除图书成功，数量：{}", request.getIds().size());

// ❌ 错误：占位符没有对应参数（编译可能通过，但运行时报错或日志不完整）
log.info("创建图书成功，ID：{}，ISBN：{}");  // 缺少参数！
log.info("批量删除图书成功，数量：{}");  // 缺少参数！
```

### 导入规范（强制）

```java
// ✅ 正确：所有导入都被使用
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;

// 代码中使用了 StrUtil
if (StrUtil.isNotBlank(request.getName())) { ... }

// ❌ 错误：存在未使用的导入（编译警告）
import cn.hutool.core.util.StrUtil;  // 未使用，应删除
```

---

## Data 层开发规范

### Entity 实体

```java
package cn.chinatelecom.cq.ctis.boot.data.model;

import cn.chinatelecom.cq.ctis.basic.core.entity.BasicOpModel;
import cn.chinatelecom.cq.ctis.basic.mp.crypto.EncryptionTypeHandler;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * <p>XX表</p>
 *
 * @author author
 * @since yyyy-MM-dd
 */
@Getter
@Setter
@ToString
@TableName(value = "sys_module", autoResultMap = true)
@Schema(name = "SysModule", description = "XX表")
public class SysModule extends BasicOpModel {

    private static final long serialVersionUID = 1L;

    @Schema(description = "名称")
    private String name;

    @Schema(description = "敏感字段（自动加密）")
    @TableField(typeHandler = EncryptionTypeHandler.class)
    private String sensitiveField;

    @Schema(description = "状态")
    private Integer status;

    @Schema(description = "排序")
    private Integer sortOrder;
}
```

### Entity 规范要点

| 注解 | 用途 |
|------|------|
| `@Getter/@Setter/@ToString` | Lombok 生成方法 |
| `@TableName(value = "表名", autoResultMap = true)` | 指定表名，启用自动结果映射 |
| `@TableField(typeHandler = EncryptionTypeHandler.class)` | 敏感字段自动加密存储 |
| `@Schema` | API 文档描述 |
| `extends BasicOpModel` | 继承基础字段（id, createdBy, updatedBy, createdTs, lastModifiedTs, isDeleted, version） |

### BasicOpModel 公共字段说明

实体继承 `BasicOpModel`，自动包含以下公共字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | Long | 主键ID |
| `createdBy` | Long | 创建人ID |
| `updatedBy` | Long | 更新人ID |
| `createdTs` | LocalDateTime | 创建时间 |
| `lastModifiedTs` | LocalDateTime | 最后修改时间 |
| `isDeleted` | Integer | 逻辑删除标识（0-未删除，1-已删除） |
| `version` | Integer | 乐观锁版本号 |

**注意**：实体类中不需要声明这些字段，但查询时可使用。排序时请使用 `createdTs` 而不是 `createTime`。

---

### Mapper 规范

```java
package cn.chinatelecom.cq.ctis.boot.data.mapper;

import cn.chinatelecom.cq.ctis.boot.data.model.EntityName;
import  cn.chinatelecom.cq.ctis.basic.core.base.BasicMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>XX Mapper接口</p>
 *
 * @author ctis
 * @since yyyy-MM-dd
 */

public interface EntityNameMapper extends BasicMapper<EntityName> {

    // 自定义SQL方法（如需）

}
```

**要点**：
- 继承 `BasicMapper<T>`
- 复杂 SQL 写在 `resources/mapper/` 下的 XML 文件中

---

### DbService 接口

```java
package cn.chinatelecom.cq.ctis.boot.data.service;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicDbService;
import cn.chinatelecom.cq.ctis.boot.common.rest.module.ModuleResponse;
import cn.chinatelecom.cq.ctis.boot.data.model.SysModule;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;
import java.util.Optional;

/**
 * <p>服务类</p>
 *
 * @author ctis
 * @since yyyy-MM-dd
 */
public interface SysModuleDbService extends BasicDbService<SysModule> {

    /**
     * 分页查询（含数据权限）
     */
    Page<ModuleResponse> pageWithPermission(ModuleQueryRequest request);

    /**
     * 根据ID查询（含数据权限）
     */
    <T> Optional<T> getByIdWithPermission(Long id, Class<T> tClass);

    /**
     * 批量查询（含数据权限）
     */
    List<SysModule> listByIdsWithPermission(List<Long> ids);
}
```

### DbService 实现

```java
package cn.chinatelecom.cq.ctis.boot.data.service.impl;

import cn.chinatelecom.cq.ctis.basic.core.base.BasicDbServiceImpl;
import cn.chinatelecom.cq.ctis.boot.common.annotation.DataPermission;
import cn.chinatelecom.cq.ctis.boot.common.rest.module.ModuleQueryRequest;
import cn.chinatelecom.cq.ctis.boot.common.rest.module.ModuleResponse;
import cn.chinatelecom.cq.ctis.boot.data.mapper.SysModuleMapper;
import cn.chinatelecom.cq.ctis.boot.data.model.SysModule;
import cn.chinatelecom.cq.ctis.boot.data.service.SysModuleDbService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * <p>服务实现类</p>
 *
 * @author ctis
 * @since yyyy-MM-dd
 */
@Service
@RequiredArgsConstructor
public class SysModuleDbServiceImpl extends BasicDbServiceImpl<SysModuleMapper, SysModule>
        implements SysModuleDbService {

    @Override
    @DataPermission
    public Page<ModuleResponse> pageWithPermission(ModuleQueryRequest request) {
        return lambdaJoinWrapper()
                .selectAsClass(SysModule.class, ModuleResponse.class)
                .like(StrUtil.isNotBlank(request.getName()), SysModule::getName, request.getName())
                .orderByDesc(SysModule::getCreatedTs)
                .page(request.toPage(), ModuleResponse.class);
    }

    @Override
    @DataPermission
    public <T> Optional<T> getByIdWithPermission(Long id, Class<T> tClass) {
        return Optional.ofNullable(
            lambdaJoinWrapper()
                .eq(SysModule::getId, id)
                .one(tClass)
        );
    }

    @Override
    @DataPermission
    public List<SysModule> listByIdsWithPermission(List<Long> ids) {
        return lambdaJoinWrapper()
                .in(SysModule::getId, ids)
                .list();
    }
}
```

### 数据权限规范

1. **方法命名**：数据权限方法加 `WithPermission` 后缀
2. **注解使用**：数据权限方法加 `@DataPermission`
3. **查询构建**：使用 `lambdaJoinWrapper()` 构建查询
4. **字段映射**：使用 `selectAsClass` 进行实体到 DTO 的字段映射
5. **关联查询**：使用 `leftJoin` 进行表关联
6. **排序字段**：使用 `createdTs` / `lastModifiedTs`（不是 `createTime` / `updateTime`）

```java
@Override
@DataPermission
public Page<UserResponse> pageWithPermission(UserQueryRequest request, List<Long> orgIds) {
    return lambdaJoinWrapper()
            // 字段映射
            .selectAsClass(SysUser.class, UserResponse.class)
            // 左关联查询
            .leftJoin(SysUserAuth.class, (on, ext) -> {
                on.eq(SysUserAuth::getUserId, SysUser::getId)
                  .eq(SysUserAuth::getAuthType, AuthType.ACCOUNT);
                ext.selectAs(SysUserAuth::getAuth, UserResponse::getUsername);
            })
            // 条件查询
            .eq(StrUtil.isNotBlank(request.getUsername()), SysUserAuth::getAuth, request.getUsername())
            .in(CollectionUtils.isNotEmpty(orgIds), SysUser::getOrgId, orgIds)
            // 排序（使用 createdTs）
            .orderByDesc(SysUser::getCreatedTs)
            // 分页
            .page(request.toPage(), UserResponse.class);
}
```

### 非数据权限查询（lambdaQuery / lambdaUpdate）

对于不需要数据权限的查询或更新操作，使用 `lambdaQuery()` 和 `lambdaUpdate()`：

```java
@Override
public boolean isIsbnExists(String isbn, Long excludeId) {
    Long count = lambdaQuery()
            .eq(Book::getIsbn, isbn)
            .ne(Objects.nonNull(excludeId), Book::getId, excludeId)
            .count();
    return count > 0;
}

@Override
public boolean updateStatus(Long bookId, Integer status) {
    return lambdaUpdate()
            .set(Book::getStatus, status)
            .eq(Book::getId, bookId)
            .update();
}
```

**区别总结**：
- **数据权限查询**：使用 `lambdaJoinWrapper()` + `@DataPermission`
- **普通查询**：使用 `lambdaQuery()`
- **更新操作**：使用 `lambdaUpdate()`

---

## Request/Response 规范

### Request DTO

```java
package cn.chinatelecom.cq.ctis.boot.common.rest.module;

import cn.chinatelecom.cq.ctis.basic.web.crypto.EncryptionDeserializer;
import cn.chinatelecom.cq.ctis.basic.web.crypto.EncryptionSerializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

/**
 * 创建请求
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateModuleRequest {

    @Schema(description = "名称")
    @NotBlank(message = "名称不能为空")
    private String name;

    @Schema(description = "敏感字段（可配置化加密）")
    @JsonDeserialize(using = EncryptionDeserializer.class)
    @JsonSerialize(using = EncryptionSerializer.class)
    private String sensitiveField;

    @Schema(description = "排序")
    @Max(value = 10000, message = "排序最大值为10000")
    private Integer sortOrder = 0;

    @Schema(description = "状态")
    @NotNull(message = "状态不能为空")
    private Integer status;

    @Schema(description = "角色ID列表")
    private List<Long> roleIds;
}
```

### Response DTO

```java
package cn.chinatelecom.cq.ctis.boot.common.rest.module;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 响应对象
 */
@Data
public class ModuleResponse {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "名称")
    private String name;

    @Schema(description = "状态")
    private Integer status;

    @Schema(description = "排序")
    private Integer sortOrder;

    @Schema(description = "创建时间")
    private LocalDateTime createdTs;
}
```

### 分页查询 Request

系统提供两种分页请求基类：

| 场景 | 继承类 | 说明 |
|------|--------|------|
| 简单分页 | `BasePageRequest` | 仅分页参数（index, size），默认按 createdTs 倒序 |
| 动态排序 | `BasePageRequestWithSort` | 支持前端指定排序字段（sortField, asc） |

**导入路径**：
```java
import cn.chinatelecom.cq.ctis.basic.core.entity.BasePageRequest;
import cn.chinatelecom.cq.ctis.basic.core.entity.BasePageRequestWithSort;
```

#### 简单分页示例

```java
import cn.chinatelecom.cq.ctis.basic.core.entity.BasePageRequest;

@Data
public class BookQueryRequest extends BasePageRequest {

    @Schema(description = "图书名称")
    private String name;

    @Schema(description = "作者")
    private String author;

    @Schema(description = "状态")
    private Integer status;
}
```

#### 动态排序分页示例

```java
import cn.chinatelecom.cq.ctis.basic.core.entity.BasePageRequestWithSort;

@Data
public class UserQueryRequest extends BasePageRequestWithSort {

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "组织ID")
    private Long orgId;

    // 前端可传 sortField=username, asc=false 实现按用户名倒序
}
```

#### 使用方式

```java
// 简单分页 - 默认按 createdTs 倒序
@Override
public Page<BookResponse> pageWithPermission(BookQueryRequest request) {
    return lambdaJoinWrapper()
            .selectAsClass(Book.class, BookResponse.class)
            .like(StrUtil.isNotBlank(request.getName()), Book::getName, request.getName())
            .orderByDesc(Book::getCreatedTs)  // 手动指定排序
            .page(request.toPage(), BookResponse.class);
}

// 动态排序 - 支持前端指定排序字段
@Override
public Page<UserResponse> pageWithPermission(UserQueryRequest request) {
    return lambdaJoinWrapperWithSort(request)  // 使用带排序的 wrapper
            .selectAsClass(SysUser.class, UserResponse.class)
            .like(StrUtil.isNotBlank(request.getUsername()), SysUser::getUsername, request.getUsername())
            .page(request.toPage(), UserResponse.class);
}
```

**注意事项**：
- `sortField` 必须是实体类的属性名（如 `createdTs`），不是数据库字段名（如 `created_ts`）
- 使用 `lambdaJoinWrapperWithSort` 会自动校验排序字段的合法性，防止 SQL 注入

### 校验注解

#### 标准校验注解

| 注解 | 用途 |
|------|------|
| `@NotBlank` | 字符串非空 |
| `@NotNull` | 对象非空 |
| `@NotEmpty` | 集合/数组非空 |
| `@Size(min, max)` | 长度范围 |
| `@Max` / `@Min` | 数值范围 |
| `@Pattern(regexp)` | 正则匹配 |
| `@Email` | 邮箱格式 |
| `@Length(min, max)` | 字符串长度范围 |
| `@Range(min, max)` | 数值范围（同 `@Min`/`@Max`） |
| `@Past` / `@Future` | 日期必须在过去/将来 |
| `@AssertTrue` / `@AssertFalse` | 布尔值必须为 true/false |

#### 自定义校验注解

| 注解 | 用途 | 示例 |
|------|------|------|
| `@Xss` | 检查 XSS 攻击字符 | `@Xss private String content;` |
| `@Allow(values)` | 值必须在指定范围内 | `@Allow(values = {"0", "1"}) private String status;` |
| `@NotAllow(values)` | 值不能在指定范围内 | `@NotAllow(values = {"admin", "root"}) private String username;` |

#### 使用示例

```java
@Data
public class CreateUserRequest {

    @NotBlank(message = "用户名不能为空")
    @Length(max = 50, message = "用户名长度不能超过50")
    @Xss(message = "用户名包含非法字符")
    @NotAllow(values = {"admin", "root", "system"}, message = "用户名不能使用系统保留字")
    private String username;

    @NotBlank(message = "状态不能为空")
    @Allow(values = {"0", "1"}, message = "状态只能是 0-禁用 或 1-启用")
    private String status;

    @Email(message = "邮箱格式不正确")
    @Length(max = 100, message = "邮箱长度不能超过100")
    private String email;

    @Min(value = 0, message = "排序不能小于0")
    @Max(value = 9999, message = "排序不能超过9999")
    private Integer sortOrder;
}
```

### 加密字段处理

```java
@Schema(description = "手机号（可配置化加密）")
@JsonDeserialize(using = EncryptionDeserializer.class)  // 接收时解密
@JsonSerialize(using = EncryptionSerializer.class)      // 返回时加密
@Pattern(regexp = RegexPool.MOBILE, message = "请填写正确的手机号")
private String phone;
```

---

## 异常处理规范

### 异常类型与枚举对应

| HTTP 状态 | 异常类 | 枚举接口 | 枚举命名 |
|-----------|--------|----------|----------|
| 400 | `DxBadRequestException` | `Dx400ExceptionEnumInterface` | `System400ExceptionEnum` |
| 401 | `DxUnauthorizedException` | `Dx401ExceptionEnumInterface` | `System401ExceptionEnum` |
| 403 | `DxForbiddenException` | `Dx403ExceptionEnumInterface` | `System403ExceptionEnum` |
| 404 | `DxNotFoundException` | `Dx404ExceptionEnumInterface` | `System404ExceptionEnum` |
| 409 | `DxConflictException` | `Dx409ExceptionEnumInterface` | `System409ExceptionEnum` |

### 异常枚举定义

```java
package cn.chinatelecom.cq.ctis.boot.common.exception;

import cn.chinatelecom.cq.ctis.basic.core.type.CommonAppType;
import cn.chinatelecom.cq.ctis.basic.web.exception.Dx400ExceptionEnumInterface;

/**
 * 400异常参数定义
 */
public enum System400ExceptionEnum implements Dx400ExceptionEnumInterface {

    BAD_REQUEST_INVALID(100, "非法的参数"),
    BAD_REQUEST_MISSING_FIELD(101, "必填字段缺失"),
    // ...
    ;

    private int code;
    private String message;

    System400ExceptionEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public int getAppType() {
        return CommonAppType.DX_DEFAULT.getAppNo();
    }
}
```

### 异常抛出

```java
// 参数错误
throw new DxBadRequestException(System404ExceptionEnum.BAD_REQUEST_INVALID);

// 未找到数据
throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);

// 无权限
throw new DxForbiddenException(System403ExceptionEnum.FORBIDDEN_NO_AUTH);

// 数据冲突
throw new DxConflictException(System409ExceptionEnum.CONFLICT_EXISTS);
```

---

## 加密处理规范

### 加密算法用途

| 用途 | 算法 | 配置路径 |
|------|------|----------|
| 登录密码加密 | SM2 | `ctis.crypto.asymmetric-crypto-properties` |
| HTTP 传输加密 | SM4 | `ctis.crypto.http` |
| 数据库存储加密 | SM4 | `ctis.crypto.db` |
| 数据脱敏 | SM2 | `ctis.crypto.desensitized` |
| 密码哈希 | SM3 | 系统默认 |

### 实体字段加密

```java
@Schema(description = "真实姓名")
@TableField(typeHandler = EncryptionTypeHandler.class)
private String realname;
```

### DTO 字段加密

```java
@Schema(description = "手机号（可配置化加密）")
@JsonDeserialize(using = EncryptionDeserializer.class)
@JsonSerialize(using = EncryptionSerializer.class)
private String phone;
```

---

## 常用代码模板

### 1. 完整 Controller

```java
@Tag(name = "订单管理相关api")
@RestController
@RequestMapping(ApiConstants.API_SYSTEM_PATH + "/order")
@Validated
public class SysOrderController {

    @Autowired
    private SysOrderService sysOrderService;

    @PostMapping("/create")
    @Operation(summary = "新增订单", description = "权限码sys:order:add")
    @SysLog(value = "新增订单", type = OperateType.ADD, platform = LoginPlatform.BACK)
    @PreAuthorize("hasAnyAuthority('sys:order:add')")
    DxResponse<Void> create(@Valid @RequestBody CreateOrderRequest request) {
        sysOrderService.create(request);
        return new DxResponse<>();
    }

    @GetMapping("/page")
    @Operation(summary = "订单列表", description = "权限码sys:order:page")
    @SysLog(value = "订单列表", type = OperateType.PAGE, platform = LoginPlatform.BACK)
    @PreAuthorize("hasAnyAuthority('sys:order:page')")
    DxPageResponse<OrderResponse> page(@ParameterObject OrderQueryRequest request) {
        return new DxPageResponse<>(sysOrderService.page(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "订单详情", description = "权限码sys:order:detail")
    @SysLog(value = "订单详情", type = OperateType.INFO, platform = LoginPlatform.BACK)
    @PreAuthorize("hasAnyAuthority('sys:order:detail')")
    DxResponse<OrderDetailResponse> detail(@PathVariable Long id) {
        return new DxResponse<>(sysOrderService.detail(id));
    }

    @PostMapping("/update")
    @Operation(summary = "修改订单", description = "权限码sys:order:edit")
    @SysLog(value = "修改订单", type = OperateType.UPDATE, platform = LoginPlatform.BACK)
    @PreAuthorize("hasAnyAuthority('sys:order:edit')")
    DxResponse<Void> update(@Valid @RequestBody UpdateOrderRequest request) {
        sysOrderService.update(request);
        return new DxResponse<>();
    }

    @PostMapping("/delete")
    @Operation(summary = "批量删除", description = "权限码sys:order:delete")
    @SysLog(value = "批量删除", type = OperateType.DELETE, platform = LoginPlatform.BACK)
    @PreAuthorize("hasAnyAuthority('sys:order:delete')")
    DxResponse<Void> delete(@Valid @RequestBody BatchIdRequest request) {
        sysOrderService.delete(request);
        return new DxResponse<>();
    }
}
```

### 2. 完整 Service 实现

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class SysOrderServiceImpl extends BasicServiceImpl<SysOrderDbService, SysOrder>
        implements SysOrderService {

    private final SysCustomerDbService sysCustomerDbService;
    private final SysProductDbService sysProductDbService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(CreateOrderRequest request) {
        // 校验客户
        SysCustomer customer = sysCustomerDbService.getById(request.getCustomerId());
        if (Objects.isNull(customer)) {
            throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);
        }

        // 校验产品
        SysProduct product = sysProductDbService.getById(request.getProductId());
        if (Objects.isNull(product)) {
            throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);
        }

        // 创建订单
        SysOrder order = BeanUtil.copyProperties(request, SysOrder.class);
        order.setOrderNo(generateOrderNo());
        order.setStatus(OrderStatus.PENDING);
        getBasicDbService().save(order);

        log.info("创建订单成功，订单号：{}，客户ID：{}", order.getOrderNo(), request.getCustomerId());
    }

    @Override
    public Page<OrderResponse> page(OrderQueryRequest request) {
        return getBasicDbService().pageWithPermission(request);
    }

    @Override
    public OrderDetailResponse detail(Long id) {
        SysOrder order = getBasicDbService().getByIdWithPermission(id, SysOrder.class)
                .orElseThrow(() -> new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA));

        OrderDetailResponse response = BeanUtil.copyProperties(order, OrderDetailResponse.class);
        // 补充关联数据
        // ...
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UpdateOrderRequest request) {
        SysOrder exist = getBasicDbService().getById(request.getId());
        if (Objects.isNull(exist)) {
            throw new DxNotFoundException(System404ExceptionEnum.NOT_FOUND_NO_DATA);
        }

        if (!OrderStatus.PENDING.equals(exist.getStatus())) {
            throw new DxBadRequestException(System400ExceptionEnum.BAD_REQUEST_INVALID);
        }

        SysOrder order = BeanUtil.copyProperties(request, SysOrder.class);
        getBasicDbService().updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(BatchIdRequest request) {
        getBasicDbService().removeByIds(request.getIds());
    }

    private String generateOrderNo() {
        return "ORD" + DateUtil.format(new Date(), "yyyyMMddHHmmss") + RandomUtil.randomNumbers(4);
    }
}
```

### 3. 关联查询示例

```java
@Override
@DataPermission
public Page<OrderResponse> pageWithPermission(OrderQueryRequest request) {
    return lambdaJoinWrapper()
            // 主表字段映射
            .selectAsClass(SysOrder.class, OrderResponse.class)
            // 关联客户表
            .leftJoin(SysCustomer.class, (on, ext) -> {
                on.eq(SysCustomer::getId, SysOrder::getCustomerId);
                ext.selectAs(SysCustomer::getName, OrderResponse::getCustomerName);
            })
            // 关联产品表
            .leftJoin(SysProduct.class, (on, ext) -> {
                on.eq(SysProduct::getId, SysOrder::getProductId);
                ext.selectAs(SysProduct::getName, OrderResponse::getProductName)
                   .selectAs(SysProduct::getPrice, OrderResponse::getProductPrice);
            })
            // 查询条件
            .eq(Objects.nonNull(request.getStatus()), SysOrder::getStatus, request.getStatus())
            .like(StrUtil.isNotBlank(request.getOrderNo()), SysOrder::getOrderNo, request.getOrderNo())
            .ge(Objects.nonNull(request.getStartDate()), SysOrder::getCreateTime, request.getStartDate())
            .le(Objects.nonNull(request.getEndDate()), SysOrder::getCreateTime, request.getEndDate())
            // 排序（使用 createdTs）
            .orderByDesc(SysOrder::getCreatedTs)
            // 分页
            .page(request.toPage(), OrderResponse.class);
}
```

---

## 编译检查清单

生成代码后，必须检查以下项目确保编译通过：

### 1. 包声明检查
- [ ] 所有 Java 文件必须有 `package` 声明
- [ ] 包路径与文件实际路径一致

### 2. 导入检查
- [ ] 没有未使用的导入（IDE 会显示灰色）
- [ ] 所有使用的类都有正确的导入
- [ ] 静态导入正确使用

### 3. 日志占位符检查
- [ ] `log.info("{}", param)` 格式正确
- [ ] 占位符 `{}` 数量与参数数量一致
- [ ] 没有缺少参数的日志语句

### 4. 泛型检查
- [ ] `DxResponse<Void>`、`DxPageResponse<T>` 泛型正确
- [ ] Service 和 DbService 的泛型参数正确

### 5. 注解检查
- [ ] 所有注解都有对应的导入
- [ ] 注解参数值正确（如权限码字符串）

### 6. 异常枚举检查
- [ ] 新增的异常枚举代码已添加到对应文件
- [ ] 枚举值格式正确（注意分号和逗号）

### 7. 继承和实现检查
- [ ] Entity 正确继承 `BasicOpModel`
- [ ] Mapper 正确继承 `BasicMapper<T>` 
- [ ] Service 正确继承 `BasicService<T>`
- [ ] ServiceImpl 正确继承 `BasicServiceImpl<DbService, T>`
- [ ] DbService 正确继承 `BasicDbService<T>`
- [ ] DbServiceImpl 正确继承 `BasicDbServiceImpl<Mapper, T>`

### 8. Lombok 检查
- [ ] DTO 使用 `@Data` 注解
- [ ] Entity 使用 `@Getter/@Setter/@ToString`
- [ ] ServiceImpl 使用 `@RequiredArgsConstructor` 时字段为 `final`

### 9. Data 层特定检查
- [ ] 排序字段使用 `createdTs` / `lastModifiedTs`（不是 `createTime` / `updateTime`）
- [ ] 数据权限方法使用 `lambdaJoinWrapper()` + `@DataPermission`
- [ ] 普通查询使用 `lambdaQuery()`，更新使用 `lambdaUpdate()`
- [ ] 数据权限方法以 `WithPermission` 后缀命名

---

## 代码生成后验证

生成代码后，执行以下命令验证代码正确性：

### 编译命令

```bash
# 1. 编译整个项目
mvn clean compile

# 2. 只编译特定模块（推荐用于快速验证）
mvn clean compile -pl ctis-boot-data
mvn clean compile -pl ctis-boot-business
mvn clean compile -pl ctis-boot-web

# 3. 编译并运行测试
mvn clean test

# 4. 打包验证（跳过测试）
mvn clean package -DskipTests

# 5. 检查依赖冲突
mvn dependency:tree
```

### 验证清单

- [ ] 执行 `mvn clean compile` 无错误
- [ ] 无未使用的 import 警告
- [ ] 无泛型类型不匹配错误
- [ ] 无找不到符号错误（缺少依赖）

### 常见问题排查

**问题1：找不到符号 `BasicMapper`**
- 原因：缺少 `ctis-boot-core` 模块依赖
- 解决：检查 `ctis-boot-data/pom.xml` 是否正确依赖 `ctis-boot-core`

**问题2：找不到符号 `DxResponse`**
- 原因：缺少 `ctis-boot-core-common` 依赖
- 解决：检查 pom.xml 依赖是否完整

**问题3：找不到符号 `OperateType`**
- 原因：缺少 `ctis-boot-core-log` 依赖
- 解决：添加对应模块依赖

---

## Liquibase 数据库规范

### 文件位置

所有 changelog 文件存放在：
```
ctis-boot-core/ctis-boot-core-liquibase/src/main/resources/db/changelog/
```

### 文件命名规范

- 格式：`v版本号-描述.yaml`
- 示例：`v2.1.0-book.yaml`、`v2.1.1-add-user-column.yaml`

### 主文件配置

在 `all-logs.yaml` 中包含子文件：
```yaml
databaseChangeLog:
  - include:
      file: db/changelog/all-logs/v2.1.0-book.yaml
  - include:
      file: db/changelog/all-logs/v2.1.1-add-user-column.yaml
```

### Changelog 模板

#### 创建表

```yaml
databaseChangeLog:
  - changeSet:
      id: 202402061001-1
      author: author.name
      changes:
        - createTable:
            tableName: book
            columns:
              - column:
                  name: id
                  type: bigint
                  autoIncrement: true
                  constraints:
                    primaryKey: true
                    nullable: false
              - column:
                  name: isbn
                  type: varchar(50)
                  constraints:
                    nullable: false
                    unique: true
              - column:
                  name: name
                  type: varchar(200)
                  constraints:
                    nullable: false
              - column:
                  name: status
                  type: int
                  defaultValue: 1
              - column:
                  name: created_ts
                  type: timestamp
                  defaultValueComputed: CURRENT_TIMESTAMP
              - column:
                  name: last_modified_ts
                  type: timestamp
                  defaultValueComputed: CURRENT_TIMESTAMP
```

#### 添加列

```yaml
databaseChangeLog:
  - changeSet:
      id: 202402061002-1
      author: author.name
      changes:
        - addColumn:
            tableName: book
            columns:
              - column:
                  name: description
                  type: text
              - column:
                  name: cover_url
                  type: varchar(500)
```

#### 创建索引

```yaml
databaseChangeLog:
  - changeSet:
      id: 202402061003-1
      author: author.name
      changes:
        - createIndex:
            tableName: book
            indexName: idx_book_name
            columns:
              - column:
                  name: name
```

#### 插入初始数据

```yaml
databaseChangeLog:
  - changeSet:
      id: 202402061004-1
      author: author.name
      changes:
        - insert:
            tableName: book
            columns:
              - column:
                  name: isbn
                  value: "978-7-111-12345-6"
              - column:
                  name: name
                  value: "示例图书"
              - column:
                  name: status
                  value: 1
```

### 规范要点

1. **changeSet id 格式**：`yyyyMMddHHmm-序号`
2. **author**：填写开发者姓名或工号
3. **表名字段名**：使用下划线命名（如 `created_ts`）
4. **必须字段**：每个表必须包含基础字段（id, created_by, updated_by, created_ts, last_modified_ts, is_deleted, version）
5. **禁止修改**：已执行的 changeSet 不可修改，如需变更应新建 changeSet

---

## 代码生成器配置

### 配置位置

`ctis-boot-web/src/test/java/cn/chinatelecom/cq/ctis/boot/CodeGeneratorTest.java`

### 配置说明

```java
package cn.chinatelecom.cq.ctis.boot;

import cn.chinatelecom.cq.ctis.basic.generator.CodeGenerator;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.SystemPropsUtil;

import java.util.List;

public class CodeGeneratorTest {
    public static void main(String[] args) {
        String projectDir = SystemPropsUtil.get("user.dir");

        // 可选：删除旧代码
        // FileUtil.del(projectDir + "/ctis-boot-data/src/main/java/cn/chinatelecom/cq/ctis/boot/data/model");

        CodeGenerator.builder()
            .author("author.name")          // 作者名，会生成在类注释中
            .includeTables(List.of())       // 指定生成表，空数组则生成全部
            .excludeTables(List.of(         // 排除系统表
                "databasechangelog",
                "databasechangeloglock",
                "qrtz_*"                    // 定时任务相关表
            ))
            // 生成路径配置（为空则不生成对应文件）
            .entityPath(projectDir + "/ctis-boot-data/src/main/java/cn/chinatelecom/cq/ctis/boot/data/model")
            .mapperPath(projectDir + "/ctis-boot-data/src/main/java/cn/chinatelecom/cq/ctis/boot/data/mapper")
            .dbServicePath(projectDir + "/ctis-boot-data/src/main/java/cn/chinatelecom/cq/ctis/boot/data/service")
            .businessServicePath(projectDir + "/ctis-boot-business/src/main/java/cn/chinatelecom/cq/ctis/boot/business/sys")
            .xmlPath(projectDir + "/ctis-boot-data/src/main/resources/mapper")
            .fileOverride(false)            // 文件已存在时是否覆盖
            .build()
            .execute("数据库IP", "用户名", "密码");
    }
}
```

### 生成文件说明

| 类型 | 生成位置 | 说明 |
|------|----------|------|
| Entity | `ctis-boot-data/.../model/` | 实体类，继承 BasicOpModel |
| Mapper | `ctis-boot-data/.../mapper/` | Mapper 接口，继承 BasicMapper |
| XML | `ctis-boot-data/.../mapper/` | Mapper XML 文件 |
| DbService | `ctis-boot-data/.../service/` | 数据层 Service |
| DbServiceImpl | `ctis-boot-data/.../service/impl/` | 数据层 Service 实现 |
| Service | `ctis-boot-business/.../business/sys/` | 业务层 Service（仅生成空方法） |
| ServiceImpl | `ctis-boot-business/.../business/sys/impl/` | 业务层实现（仅生成空方法） |

### 使用建议

1. **先生成 Data 层**：验证 Data 层代码正确性
2. **再生成 Business 层**：根据业务需求完善 Service 逻辑
3. **手动编写 Controller**：代码生成器不生成 Controller，需按规范手动编写
4. **首次生成后验证**：执行 `mvn clean compile` 确保无编译错误

---

## 规则溯源

当回复明确受到本规则约束时，在回复末尾声明：

```
> 📋 本回复遵循：`ctis-java-best-dev` - [具体章节]
```
