---
title: 系统简介
createTime: 2026/03/03 13:10:30
permalink: /program/supplier/intro/
---
## 系统流程

```flow:preset

st=>start: 开始|past:>http://www.google.com[blank]
z=>end: 结束|future:>http://www.google.com

a=>operation: ERP获取订单|past
b=>operation: 发送订单|past
c=>operation: 供应商接受订单|past
e=>subroutine: 供应商生产订单
f=>subroutine: 供应商打印标签|past
g=>subroutine: 仓库待入库看板|past
h=>operation: 品保检验|past
i=>operation: 仓库入库|past

st->a(right)->b(right)->c->e->f->g->h->i->z
```

## 需要开发内容
::: steps

1. [代码管理系统](./ruesCode.md)
2. 开发邮件系统
3. 开发库存表
4. 开发订单信息
5. 开发供应商信息
6. 开发标签打印页面
7. 开发仓库打印
:::

## 开发遇到问题

### 供应商管理系统数据库设计文档

**版本**：1.0
**数据库类型**：MySQL 8.0 + Redis 7

#### 一、数据库概述

**设计目标**

- **数据一致性**：通过主外键约束、事务机制保证供应商档案、评估记录等核心数据的一致性。
- **高性能查询**：对高频查询字段（如供应商状态、信用代码）建立索引，结合Redis缓存热点数据，确保列表查询响应时间≤2秒。
- **数据安全**：敏感字段（如银行账号、联系人电话）加密存储，操作日志全量记录。

**技术选型**

- **MySQL 8.0**：存储结构化业务数据，支持事务处理与复杂查询。
- **Redis 7**：缓存高频访问数据（供应商列表、配置字典）、会话信息，降低MySQL压力。

#### 二、MySQL物理模型设计

**供应商主表（supplier）**

- **功能描述**：存储供应商基础信息与状态。
- **字段定义**

| 字段名 | 数据类型 | 约束 | 描述 |
| ------ |------ |------ |------ |
| id | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | 主键ID |
| name | VARCHAR(200) | NOT NULL | 企业名称 |
| credit_code | VARCHAR(18) | UNIQUE, NOT NULL | 统一社会信用代码 |
| legal_rep | VARCHAR(50) |  | 法人代表 |
| registered_capital | DECIMAL(12,2) |  | 注册资本（万元） |
| status | TINYINT | DEFAULT 1 | 状态：0-禁用，1-启用，2-审核中，3-黑名单 |
| supplier_type | TINYINT |  | 供应商类型：1-原材料，2-服务，3-设备 |
| create_time | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

- **索引**
- **idx_credit_code**（credit_code）：唯一索引，防止重复录入。
- **idx_status**（status）：普通索引，加速按状态筛选（如“启用”“黑名单”）。
- **idx_type_status**（supplier_type, status）：联合索引，优化分类+状态组合查询。

**供应商资质文件表（supplier_file）**

- **功能描述**：存储供应商上传的资质文件路径与有效期。
- **字段定义**

| 字段名 | 数据类型 | 约束 | 描述 |
| ------ |------ |------ |------ |
| id | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | 主键ID |
| supplier_id | BIGINT UNSIGNED | FOREIGN KEY (supplier.id) | 关联供应商ID |
| file_type | TINYINT | NOT NULL | 文件类型：1-营业执照，2-生产许可证，3-检测报告 |
| file_path | VARCHAR(500) | NOT NULL | 文件存储路径（如/minio/files/xxx.pdf） |
| expire_date | DATE |  | 有效期截止日期 |
| upload_time | DATETIME | DEFAULT CURRENT_TIMESTAMP | 上传时间 |

- **索引**
- **idx_supplier_id**（supplier_id）：普通索引，加速按供应商查询文件。
- **idx_expire_date**（expire_date）：普通索引，用于查询即将过期的文件（如expire_date < DATE_ADD(NOW(), INTERVAL 30 DAY)）。

**供应商绩效评估表（evaluation）**

- **功能描述**：记录供应商每次评估的维度得分与总分。
- **字段定义**

| 字段名 | 数据类型 | 约束 | 描述 |
| ------ |------ |------ |------ |
| id | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | 主键ID |
| supplier_id | BIGINT UNSIGNED | FOREIGN KEY (supplier.id) | 关联供应商ID |
| quality_score | DECIMAL(4,2) | DEFAULT 0.00 | 质量分（权重40%） |
| delivery_score | DECIMAL(4,2) | DEFAULT 0.00 | 交付分（权重30%） |
| cost_score | DECIMAL(4,2) | DEFAULT 0.00 | 成本分（权重20%） |
| service_score | DECIMAL(4,2) | DEFAULT 0.00 | 服务分（权重10%） |
| total_score | DECIMAL(4,2) | GENERATED ALWAYS AS ((quality_score*0.4 + delivery_score*0.3 + cost_score*0.2 + service_score*0.1)) STORED | 总分（自动生成） |
| level | CHAR(1) |  | 评级：A/B/C/D |
| evaluator | VARCHAR(50) | NOT NULL | 评分人（用户账号） |
| eval_date | DATE | DEFAULT (CURRENT_DATE) | 评估日期 |

- **索引**
- **idx_supplier_date**（supplier_id, eval_date）：联合索引，优化查询供应商历史评估记录。
- **idx_level_date**（level, eval_date）：联合索引，优化按评级筛选（如“A级供应商”）。

**系统配置字典表（sys_dict）**

- **功能描述**：存储系统通用配置（如供应商类型、文件类型）。
- **字段定义**

| 字段名 | 数据类型 | 约束 | 描述 |
| ------ |------ |------ |------ |
| id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | 主键ID |
| dict_type | VARCHAR(50) | NOT NULL | 字典类型（如supplier_type） |
| dict_label | VARCHAR(100) | NOT NULL | 字典标签（如“原材料”） |
| dict_value | VARCHAR(50) | NOT NULL | 字典值（如“1”） |
| sort_order | INT | DEFAULT 0 | 排序（越小越靠前） |
| status | TINYINT | DEFAULT 1 | 状态：0-禁用，1-启用 |

#### 三、Redis数据结构设计

**供应商列表缓存**

- **Key**：supplier:list:{type}:{status}
- **示例**：supplier:list:1:1（类型为“原材料”，状态为“启用”的供应商列表）
- **Value**：JSON数组，包含供应商ID、名称、评级、状态。
- **过期时间**：30分钟，通过定时任务或数据变更时主动更新。

**供应商详情缓存**

- **Key**：supplier:detail:{id}
- **示例**：supplier:detail:1001
- **Value**：JSON对象，包含基础信息、文件列表（文件类型+路径）、最新评估评级。
- **过期时间**：30分钟，供应商信息更新时主动删除缓存，触发下次查询时回源。

**配置字典缓存**

- **Key**：dict:{type}
- **示例**：dict:supplier_type
- **Value**：JSON数组，包含字典值、标签、排序。
- **过期时间**：永不过期，系统启动时加载，管理员修改字典后主动刷新。

#### 四、数据库非功能性设计

**安全性**

- **字段加密**：银行账号、联系人电话使用AES加密存储，解密逻辑在应用层处理。
- **SQL防注入**：后端使用MyBatis-Plus的预编译语句，禁止拼接SQL。

**性能优化**

- **读写分离**：主库处理写操作（新增、修改），从库处理读操作（列表查询、详情查询）。
- **分页查询**：供应商列表采用“游标分页”（基于ID排序），避免OFFSET过大导致的性能问题。

**数据备份**

- **MySQL**：每日全量备份+每小时增量备份，备份数据存储至异地服务器。
- **Redis**：开启AOF持久化，每小时同步一次RDB快照至备份服务器。

#### 五、数据字典示例

**供应商类型（supplier_type）**

| 字典值 | 字典标签 | 描述 |
| ------ |------ |------ |
| 1 | 原材料 | 提供生产原材料的供应商 |
| 2 | 服务 | 提供物流、咨询等服务的供应商 |
| 3 | 设备 | 提供生产设备、检测设备的供应商 |

**文件类型（file_type）**

| 字典值 | 字典标签 | 描述 |
| ------ |------ |------ |
| 1 | 营业执照 | 企业营业执照扫描件 |
| 2 | 生产许可证 | 行业生产许可证扫描件 |
| 3 | 检测报告 | 产品检测报告扫描件 |
