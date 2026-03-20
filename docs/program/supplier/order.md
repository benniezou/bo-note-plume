---
title: order
createTime: 2026/03/03 14:01:48
permalink: /program/supplier/order/
---

## 订单内容

- 数据库字段`订单号`、`发起人`、`确认人`、`审核单号`、`订单时间`、`预计到货时间`、`依据工令`、`发起时间`、`审核时间`。
- 明细数据`料号`、`规格型号`、`数量`、`单位`、`备注`。

```sql
-- 1. 创建主表：供应商表 (suppliers)
CREATE TABLE suppliers (
    supplier_id bigint  PRIMARY KEY COMMENT '供应商唯一ID',
    supplier_code VARCHAR(50) UNIQUE NOT NULL COMMENT '供应商编码',
    company_name VARCHAR(255) NOT NULL COMMENT '公司全称',
    short_name VARCHAR(100) COMMENT '公司简称',
    legal_representative VARCHAR(100) COMMENT '法定代表人',
    registration_address VARCHAR(255) COMMENT '注册地址',
    business_address VARCHAR(255) COMMENT '实际经营地址',
    contact_person_name VARCHAR(100) COMMENT '主要联系人姓名',
    contact_person_position VARCHAR(100) COMMENT '主要联系人职位',
    phone VARCHAR(20) COMMENT '固定电话',
    mobile_phone VARCHAR(20) COMMENT '主要联系人手机',
    email VARCHAR(255) COMMENT '主要联系人邮箱',
    website VARCHAR(255) COMMENT '公司官网',
    business_license_number VARCHAR(50) UNIQUE COMMENT '统一社会信用代码',
    tax_identification_number VARCHAR(50) COMMENT '纳税人识别号',
    registration_date DATE COMMENT '成立日期',
    bank_name VARCHAR(255) COMMENT '开户银行',
    bank_account_name VARCHAR(255) COMMENT '银行账户名',
    bank_account_number VARCHAR(50) COMMENT '银行账号',
    main_product_category TEXT COMMENT '主要供应产品类别',
    certifications JSON COMMENT '认证信息(JSON格式)',
    quality_level_rating ENUM('A', 'B', 'C', 'D') COMMENT '质量等级',
    cooperation_status  DEFAULT 'p' COMMENT '合作状态',
    credit_limit DECIMAL(15, 2) DEFAULT 0.00 COMMENT '信用额度',
    payment_terms VARCHAR(100) COMMENT '付款条件',
    delivery_terms VARCHAR(100) COMMENT '交货条款',
    description TEXT COMMENT '公司简介与备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 2. 创建辅助表：供应商联系人表 (supplier_contacts)
CREATE TABLE supplier_contacts (
    contacts_id bigint  PRIMARY KEY COMMENT '联系人ID',
    supplier_id bigint NOT NULL COMMENT '关联的供应商ID',
    name VARCHAR(100) NOT NULL COMMENT '联系人姓名',
    position VARCHAR(100) COMMENT '联系人职位',
    department VARCHAR(100) COMMENT '所属部门',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(255) COMMENT '联系人邮箱',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    INDEX idx_supplier_id (supplier_id) -- 为外键创建索引，提高查询效率
);

-- 3. 创建辅助表：供应商产品目录表 (supplier_products)
CREATE TABLE supplier_products (
    products_id bigint  PRIMARY KEY COMMENT '产品ID',
    supplier_id bigint NOT NULL COMMENT '关联的供应商ID',
    product_code VARCHAR(50) COMMENT '产品编码',
    product_name VARCHAR(255) COMMENT '产品名称',
    specification TEXT COMMENT '规格型号',
    unit_price DECIMAL(10, 2) COMMENT '单价',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币单位',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    INDEX idx_supplier_id (supplier_id), -- 为外键创建索引
    INDEX idx_product_code (product_code) -- 为产品编码创建索引
);
```
