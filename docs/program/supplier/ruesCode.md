---
title: ruesCode
createTime: 2026/03/03 15:29:13
permalink: /program/supplier/ruesCode/
---

## 数据库

```sql
CREATE TABLE code_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_code VARCHAR(50) UNIQUE NOT NULL COMMENT '编号类型代码，如 SUP, CUST, PO',
    description VARCHAR(255) COMMENT '类型描述',
    prefix VARCHAR(50) NOT NULL COMMENT '编号前缀，如 SUP',
    date_format VARCHAR(20) DEFAULT 'yyMM' COMMENT '日期格式，如 yyMM',
    sequence_length INT DEFAULT 4 COMMENT '流水号长度',
    separator VARCHAR(5) DEFAULT '-' COMMENT '分隔符',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

```sql
CREATE TABLE code_sequences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_type_code VARCHAR(50) NOT NULL COMMENT '关联的规则类型代码',
    prefix_with_date VARCHAR(100) NOT NULL COMMENT '完整的前缀+日期，如 SUP-2603',
    current_value INT NOT NULL DEFAULT 0 COMMENT '当前流水号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_type_prefix (rule_type_code, prefix_with_date),
    FOREIGN KEY (rule_type_code) REFERENCES code_rules(type_code)
);
```

```java
// CodeRule.java
public class CodeRule {
    private Long id;
    private String typeCode; // 如 "SUP"
    private String description;
    private String prefix; // 如 "SUP"
    private String dateFormat; // 如 "yyMM"
    private Integer sequenceLength; // 如 4
    private String separator; // 如 "-"

    // Getters and Setters...
}

// CodeSequence.java
public class CodeSequence {
    private Long id;
    private String ruleTypeCode;
    private String prefixWithDate; // 如 "SUP-2603"
    private Integer currentValue;

    // Getters and Setters...
}
```

```java
// CodeRuleMapper.java
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CodeRuleMapper {
    CodeRule selectByTypeCode(@Param("typeCode") String typeCode);
}

// CodeSequenceMapper.java
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CodeSequenceMapper {

    CodeSequence selectByRuleAndPrefix(@Param("ruleTypeCode") String ruleTypeCode, @Param("prefixWithDate") String prefixWithDate);

    // 使用数据库的原子操作来增加流水号，避免并发问题
    @Update("UPDATE code_sequences SET current_value = current_value + 1 WHERE rule_type_code = #{ruleTypeCode} AND prefix_with_date = #{prefixWithDate}")
    int incrementCurrentValue(@Param("ruleTypeCode") String ruleTypeCode, @Param("prefixWithDate") String prefixWithDate);

    void insertNewSequence(CodeSequence sequence);
}

```

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class UniversalCodeGenerator {

    @Autowired
    private CodeRuleMapper codeRuleMapper;

    @Autowired
    private CodeSequenceMapper codeSequenceMapper;

    /**
     * 根据类型代码生成下一个编号
     * @param typeCode 编号类型，如 "SUP", "CUST", "PO"
     * @return 生成的编号
     */
    @Transactional
    public String generateNextCode(String typeCode) {
        // 1. 获取编号规则
        CodeRule rule = codeRuleMapper.selectByTypeCode(typeCode);
        if (rule == null) {
            throw new IllegalArgumentException("未找到类型为 [" + typeCode + "] 的编号规则");
        }

        // 2. 构建当前日期的前缀
        LocalDate now = LocalDate.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern(rule.getDateFormat()));
        String prefixWithDate = rule.getPrefix() + rule.getSeparator() + dateStr;

        // 3. 获取或创建并初始化流水号记录
        CodeSequence sequence = codeSequenceMapper.selectByRuleAndPrefix(typeCode, prefixWithDate);
        if (sequence == null) {
            // 如果是当月第一次生成，则插入一条新记录
            sequence = new CodeSequence();
            sequence.setRuleTypeCode(typeCode);
            sequence.setPrefixWithDate(prefixWithDate);
            sequence.setCurrentValue(0);
            codeSequenceMapper.insertNewSequence(sequence);
        }

        // 4. 原子性地增加流水号
        int updatedRows = codeSequenceMapper.incrementCurrentValue(typeCode, prefixWithDate);
        if (updatedRows == 0) {
            // 在高并发下，如果 update 失败，说明可能有其他事务刚插入了记录。
            // 此时可以重试或抛出异常。这里简单抛出异常，让上层决定如何处理。
            throw new RuntimeException("更新流水号失败，请重试。");
        }

        // 5. 计算新的流水号并格式化
        int nextValue = sequence.getCurrentValue() + 1; // 因为数据库已经+1了，所以这里的currentValue是旧值，+1才是新值
        String formattedSequence = String.format("%0" + rule.getSequenceLength() + "d", nextValue);

        // 6. 拼接并返回最终编号
        return prefixWithDate + rule.getSeparator() + formattedSequence;
    }
}
```

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ExampleController {

    @Autowired
    private UniversalCodeGenerator codeGenerator;

    @GetMapping("/generate/{type}")
    public String generateCode(@PathVariable String type) {
        // 传入类型代码，即可生成对应编号
        String newCode = codeGenerator.generateNextCode(type.toUpperCase());
        return "Generated Code for " + type + ": " + newCode;
    }

    // --- 在实际业务中 ---
    @PostMapping("/suppliers")
    public String createSupplier(@RequestBody Supplier supplier) {
        String code = codeGenerator.generateNextCode("SUP"); // 生成供应商编号
        supplier.setCode(code);
        // ... 保存到数据库 ...
        return "Supplier created with code: " + code;
    }

    @PostMapping("/customers")
    public String createCustomer(@RequestBody Customer customer) {
        String code = codeGenerator.generateNextCode("CUST"); // 生成客户编号
        customer.setCode(code);
        // ... 保存到数据库 ...
        return "Customer created with code: " + code;
    }
}
```
