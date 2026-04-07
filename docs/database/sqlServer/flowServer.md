---
title: 流程服务器
createTime: 2026/04/07 08:47:36
permalink: /database/sqlServer/flowServer/
---

## 查询采购单

```sql
select top 50 *
from AgentFlow.[dbo].[ART01561634794776025_Ins] a
    left join AgentFlow.[dbo].[ART01561634794776025ITEM8] b on a.insid = b.insid
where a.item112 = 'GC_AM200-25-08-6822-D'
order by ITEM109 desc
```

### 更新价格和税率
item
```sql
update AgentFlow.[dbo].[ART01561634794776025_Ins]
set item100 = 8211.51,
    item104 = 8211.51,
    ITEM195 = 'T0013',
    ITEM217 = 8211.51,
    ITEM110 = 13
WHERE item112 = 'GC_AM200-25-08-6822-D'
update AgentFlow.[dbo].[ART01561634794776025ITEM8]
SET ITEM3 = 8211.51,
    ITEM5 = 8211.51
WHERE InsID = 'Ans000001651023'
```

## 查询加班

```sql
select top 10 * from
  from
    [192.168.2.34].AgentFlow.dbo.ART01791641258598813ITEM38 A
    left join [192.168.2.34].AgentFlow.dbo.ART01791641258598813_Ins B
```
