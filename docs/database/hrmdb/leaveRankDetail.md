---
title: leaveRankDetail
password: Biner!859220..
passwordHint: 请输入密码
createTime: 2026/03/06 08:58:21
permalink: /database/hrmdb/leaverd/
---

## 查询年休假剩余时间

## 查询请假时间内排班信息
- 查询基本部门信息
- 查询 AttendanceRankId 排班总表
- 查询排班类型时间关系
- 计算当天最早时间
- 计算当天最晚时间
- 计算开始天数小时
- 计算结束天小时

```sql
declare @beginDate datetime;
declare @endDate datetime;
declare @code varchar(30);
set @code ='2106001'
-- 上下午
--set @beginDate='2026-03-06 11:00:00.000'
--set @endDate='2026-03-06 16:00:00.000'
-- 跨日期
set @beginDate='2026-03-06 11:00:00.000'
set @endDate='2026-03-07 16:00:00.000'
-- 跨年度
--set @beginDate='2025-12-20 11:00:00.000'
--set @endDate='2026-03-06 16:00:00.000'

select e.Code,d1.Name,e.CnName,d.Name,
       min(case
             when @beginDate between aer.Date + ar.RestBeginTime and aer.Date+ar.RestEndTime then @beginDate
             else aer.Date+ar.RestBeginTime
         end) as 'beginDate',
  max (case
         when @endDate between aer.Date + ar.RestBeginTime and aer.Date+ar.RestEndTime then @endDate
         else aer.Date+ar.RestEndTime
    end) as 'endDate',
  sum((case
         when @beginDate between aer.Date + ar.RestBeginTime and aer.Date+ar.RestEndTime then datediff(hour,@beginDate, (aer.Date + ar.RestEndTime))
         when @endDate between aer.Date + ar.RestBeginTime and aer.Date+ar.RestEndTime then datediff(hour,(aer.Date + ar.RestBeginTime),@endDate)
         else RestHours
    end))
from dbo.employee e
       left join dbo.Department d on e.DepartmentId=d.DepartmentId
       left join dbo.Department d1 on d.DirectDeptId=d1.DepartmentId
       left join dbo.AttendanceEmpRank aer on e.EmployeeId=aer.EmployeeId
       left join dbo.AttendanceRankRest ar on aer.AttendanceRankId=ar.AttendanceRankId
       left join dbo.CodeInfo c on ar.AttendanceRankTypeId=c.CodeInfoId
where e.Code= @code
  and (aer.Date + ar.RestEndTime >= @beginDate)
  and (@endDate >= aer.Date + ar.RestBeginTime)
  and ar.AttendanceRankTypeId = 'AttendanceRankType_001'
group by e.Code,d1.Name,e.CnName,d.Name,aer.Date

```
