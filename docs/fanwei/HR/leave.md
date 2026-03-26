---
title: 请假开发

createTime: 2026/03/19 10:09:18
permalink: /fanwei/HR/leave/
---

## 数据操作

::: code-tree title="请假单" height="500px" entry="esb/数据准备/leave.sql"
```sql title="esb/数据准备/leave.sql"
select top 1
    newid() as 'AttendanceLeaveId',
  e.EmployeeId,
       at.AttendanceTypeId as 'AttendanceTypeId',
    [{BeginDate}+] '' as 'BeginDate',
    [{BeginTime}+] ''  as 'BeginTime',
    [{EndDate}+] ''  as 'EndDate',
    [{EndTime}+] '' as 'EndTime',
    'PlanState_003' as 'StateId',
    cast(getdate() as date) as 'ApproveDate',
    u.EmployeeId as 'ApproveEmployeeId',
    u.UserName as 'ApproveEmployeeName',
    null as 'ApproveRemark',
    getdate() as 'ApproveOperationDate',
    u.UserId as 'ApproveUserId',
    null as 'RepealOperationDate',
    null as 'RepealUserId',
    getdate() as 'CreateDate',
    getdate() as 'LastModifiedDate',
    u.UserId as 'CreateBy',
    u.UserId as 'LastModifiedBy',
    1 as 'Flag',
    e.CorporationId ,
    null as 'AssignReason',
    lower(e.EmployeeId) as 'OwnerId',
    null as 'SubmitOperationDate',
    null as 'SubmitUserId',
    null as 'ConfirmOperationDate',
    null as 'ConfirmUserId',
    'OperatorResult_001' as 'ApproveResultId',
    null as 'VirObjectId',
    0 as 'DeductOhter',
    0 as 'PassRest',
    0 as 'AttendanceDayType',
    1 as 'IsCheckAtType',
    0 as 'WholeDay',
    0.00 as 'Hours',
    0 as 'IsUndo',
    0 as 'IsRevoke',
    y.FiscalYearId,
    0 as 'IsEss',
    0 as 'IsEF',
    0 as 'IsRegular',
    0 as 'TotalHours',
    0 as 'CancelHours',
    0 as 'EffectiveHours'
from dbo.Employee e
  left join dbo.[User] u on UserName='2106001'
  left join dbo.FiscalYear y on  y.Year='01' [or y.Year=year({EndDate})]
  left join dbo.AttendanceType at on at.Code='0' [or at.code={typeCode}]
where e.code='1' [or e.Code={code}]
```

```sql title="esb/数据准备/leaveInfo.sql"

select
    newid() as 'AttendanceLeaveInfoId',
    --请假信息.请假信息ID
    e.EmployeeId as 'EmployeeId',
    --请假信息.员工ID(数据来自Employee表的EmployeeId栏位)
    at.AttendanceTypeId as 'AttendanceTypeId',
    --请假信息.请假类型ID(数据来自AttendanceType表的AttendanceTypeId栏位)
    aer.AttendanceRankId as 'AttendanceRankId',
    --请假信息.班次ID(数据来自AttendanceRank表的AttendanceRankId栏位)
    aer.Date as 'BeginDate',
    --请假信息.开始日期
    [(
        case
            when aer.Date = {BeginDate}
                and {BeginTime}  between min(arr.RestBeginTime)
                     and max(arr.RestEndTime) then {BeginTime}
            else min(arr.RestBeginTime)
            end
        )+]''  as  'BeginTime',
    --请假信息.开始时间
    aer.Date as 'EndDate',
    --请假信息.结束日期
    [(
        case
            when aer.Date = {EndDate}
                and  {EndTime} between min(arr.RestBeginTime)
                     and max(arr.RestEndTime) then {EndTime}
            else max(arr.RestEndTime)
            end
        ) +] '' 'EndTime',
    --请假信息.结束时间
    [sum (
            arr.RestHours - (
                case
                    when aer.Date = {BeginDate}
                        and {BeginTime} between arr.RestBeginTime
                             and arr.RestEndTime then DATEDIFF(
                                                              MINUTE,
                                                              arr.RestBeginTime,
                                                              {BeginTime}
                                                      ) / 60.0
                    else 0
                    end
                ) - (
                case
                    when aer.Date = {EndDate}
                        and {EndTime} between arr.RestBeginTime
                             and arr.RestEndTime then DATEDIFF(
                                                              MINUTE,
                                                              {EndTime},
                                                              arr.RestEndTime
                                                      ) / 60.0
                    else 0
                    end
                )
    ) + ] 0.0 as 'hours',
    --请假信息.请假时数
    '' as 'Remark',
    --请假信息.备注
    null as 'RevokeDate',
    --请假信息.销假日期
    null as 'RevokeEmployeeId',
    --请假信息.销假人ID(数据来自Employee表的EmployeeId栏位)
    null as 'RevokeEmployeeName',
    --请假信息.销假人名称
    null as 'RevokeRemark',
    --请假信息.销假批注
    null as 'RevokeOperationDate',
    --请假信息.销假操作日期
    null as 'RevokeUserId',
    --请假信息.销假操作人ID(数据来自User表的UserId栏位)
    getdate() as 'CreateDate',
    --请假信息.创建日期
    getdate() as 'LastModifiedDate',
    --请假信息.最后修改日期
    u.UserId as 'CreateBy',
    --请假信息.创建者(数据来自User表的UserId栏位)
    u.UserId as 'LastModifiedBy',
    --请假信息.最后修改人(数据来自User表的UserId栏位)
    1 as 'Flag',
    --请假信息.标识符
    null as 'CorporationId',
    --请假信息.公司ID(数据来自Corporation表的CorporationId栏位)
    0 as 'IsRevoke',
    --请假信息.是否销假
    null as 'EmployeeRankId',
    --请假信息.员工班次表Id(数据来自AttendanceEmployeeRank表的AttendanceEmployeeRankId栏位)
    aer.Date as 'Date',
    --请假信息.日期
    y.FiscalYearId as 'FiscalYearId',
    --请假信息.财政年度ID(数据来自FiscalYear表的FiscalYearId栏位)
    'AnnualLeaveUnit_003' as 'AnnualLeaveUnit',
    --请假信息.核算单位(数据来自CodeInfo表的CodeInfoId栏位)
    [sum (
            arr.RestHours - (
                case
                    when aer.Date = {BeginDate}
                        and {BeginTime} between arr.RestBeginTime
                             and arr.RestEndTime then DATEDIFF(MINUTE, arr.RestBeginTime, {BeginTime}) / 60.0
                    else 0
                    end
                ) - (
                case
                    when aer.Date = {EndDate}
                        and {EndTime} between arr.RestBeginTime
                             and arr.RestEndTime then DATEDIFF(MINUTE, {EndTime}, arr.RestEndTime) / 60.0
                    else 0
                    end
                ))
        +]  0.0 as 'OldDays',
    --请假信息.旧日期
    [sum (
            arr.RestHours - (
                case
                    when aer.Date = {BeginDate}
                        and {BeginTime} between arr.RestBeginTime
                             and arr.RestEndTime then DATEDIFF(MINUTE, arr.RestBeginTime, {BeginTime}) / 60.0
                    else 0
                    end
                ) - (
                case
                    when aer.Date = {EndDate}
                        and  {EndTime} between  arr.RestBeginTime
                             and  arr.RestEndTime then DATEDIFF(MINUTE, {EndTime},  arr.RestEndTime )/ 60.0
                    else 0
                    end
                )
    ) / ar.WorkHours +  ] 0.0 'Days',
    --请假信息.日期
    null as 'SpecialSetIdAndHours',
    --请假信息.特殊假ID和时数
    null as 'AjustIdAndHours',
    --请假信息.加班调休计划ID和时数
    null as 'EssRevokeStatus',
    --请假信息.ESS销假状态
    null as 'TOILPlanDetailID',
    --请假信息.AttendanceLeave_Infos_TOILPlanDetailID
    '' as 'AttendanceLeaveId' --主表ID
from
    dbo.Employee e
        left join dbo.FiscalYear y on y.Year = '01'
        or y.Year = year(getdate())
        left join dbo.AttendanceType at on at.Code = '0'
        or at.code = '401'
        left join dbo.AttendanceEmpRank aer on e.EmployeeId = aer.EmployeeId
        left join dbo.AttendanceRank ar on ar.AttendanceRankId = aer.AttendanceRankId
        left join dbo.AttendanceRankRest arr on arr.AttendanceRankId = ar.AttendanceRankId
        left join dbo.[User] u on  u.UserName = '2106001' and UserName is not null
where
    (
        e.Code = '0'
            [   or e.Code = {code}]
        )
    [and aer.Date between {BeginDate}
    and {EndDate}]
  [and arr.RestBeginTime < {EndTime}]
  [and arr.RestEndTime > {BeginTime}]
  and arr.AttendanceRankTypeId = 'AttendanceRankType_001'
group by
    e.EmployeeId,
    aer.Date,
    at.AttendanceTypeId,
    y.FiscalYearId,
    aer.AttendanceRankId,
    u.UserId,
    ar.WorkHours
```

```sql title="eb/请假单/remainderLeave.sql"
select
  top 1 ape.Days - sum(al.EffectiveHours) as surplus
from
  dbo.Employee e
    left join dbo.AnnualLeavePlanEmployee ape on e.EmployeeId = ape.EmployeeId
    and exists(
      select
        1
      FROM
        dbo.FiscalYear y
      where
        y.Year = year([${主表.开始日期·1242551751403978756}])
      and ape.FiscalYearId = y.FiscalYearId
    )
    left join dbo.AttendanceLeave al on e.EmployeeId = al.EmployeeId and al.AttendanceTypeId='401'
    and exists(
      select
        1
      from
        dbo.FiscalYear fy
      where
        fy.Year = year([${主表.开始日期·1242551751403978756}])
      and al.FiscalYearId = fy.FiscalYearId
    )
where
  e.Code = [${主表.申请人工号·1242551051156537347}]
  and ape.Flag = 1
group by
  e.EmployeeId,
  al.FiscalYearId,
  ape.Days
```

```sql title="esb/数据准备/sumLeaveHours.sql"
select
sum ([
  datediff(
  MINUTE,
  (
  case
  when cast({beginDate} as datetime) + cast({beginTime} as datetime) between aer.date + arr.RestBeginTime
  and aer.date + arr.RestEndTime then cast({beginDate} as datetime) + cast({beginTime} as datetime)
  else aer.date + arr.RestBeginTime
  end
  ),
  (
  case
  when cast({endDate} as datetime) + cast({endTime} as datetime) between aer.date + arr.RestBeginTime
  and aer.date + arr.RestEndTime then cast({endDate} as datetime) + cast({endTime} as datetime)
  else aer.date + arr.RestEndTime
  end
  )
  )/60.0]
+ 0 )   as leaveHours
from
dbo.Employee e
left join dbo.AttendanceEmpRank aer on e.EmployeeId = aer.EmployeeId
left join dbo.AttendanceRank ar on aer.AttendanceRankId = ar.AttendanceRankId
left join dbo.AttendanceRankRest arr on aer.AttendanceRankId = arr.AttendanceRankId
and arr.AttendanceRankTypeId = 'AttendanceRankType_001' [
where
e.LastWorkDate > {endDate} --确认最后请假日期没有离职
and e.Code = {code} --确定工号
and aer.date + arr.RestBeginTime < CAST({endDate} as datetime) + cast({endTime} as datetime)
and aer.date + arr.RestEndTime > cast({beginDate} as datetime) + cast({beginTime} as datetime) ]
```
:::

## 数据测试代码

::: code-tree title="请假单" height="500px" entry="esb/数据准备/leave.sql"
```sql title="esb/数据准备/leave.sql"
declare @BeginDate varchar(64)
declare @BeginTime varchar(64)
declare @EndDate varchar(64)
declare @EndTime varchar(64)
declare @Code varchar(64)
declare @TypeCode varchar(64)

set @BeginDate = '2026-03-01'
set @BeginTime = '09:00'
set @EndDate ='2026-03-01'
set @EndTime ='15:00'
set @Code ='2106001'
set @typeCode='401'

select top 1
  newid() as 'AttendanceLeaveId',
  e.EmployeeId,
  at.AttendanceTypeId as 'AttendanceTypeId',
  @BeginDate+ '' as 'BeginDate',
  @BeginTime+ ''  as 'BeginTime',
  @EndDate+ ''  as 'EndDate',
  @EndTime+ '' as 'EndTime',
  'PlanState_003' as 'StateId',
  cast(getdate() as date) as 'ApproveDate',
  u.EmployeeId as 'ApproveEmployeeId',
  u.UserName as 'ApproveEmployeeName',
  null as 'ApproveRemark',
  getdate() as 'ApproveOperationDate',
  u.UserId as 'ApproveUserId',
  null as 'RepealOperationDate',
  null as 'RepealUserId',
  getdate() as 'CreateDate',
  getdate() as 'LastModifiedDate',
  u.UserId as 'CreateBy',
  u.UserId as 'LastModifiedBy',
  1 as 'Flag',
  e.CorporationId ,
       null as 'AssignReason',
  lower(e.EmployeeId) as 'OwnerId',
  null as 'SubmitOperationDate',
  null as 'SubmitUserId',
  null as 'ConfirmOperationDate',
  null as 'ConfirmUserId',
  'OperatorResult_001' as 'ApproveResultId',
  null as 'VirObjectId',
  0 as 'DeductOhter',
  0 as 'PassRest',
  0 as 'AttendanceDayType',
  1 as 'IsCheckAtType',
  0 as 'WholeDay',
  0.00 as 'Hours',
  0 as 'IsUndo',
  0 as 'IsRevoke',
  y.FiscalYearId,
       0 as 'IsEss',
  0 as 'IsEF',
  0 as 'IsRegular',
  0 as 'TotalHours',
  0 as 'CancelHours',
  0 as 'EffectiveHours'
from dbo.Employee e
       left join dbo.[User] u on UserName='2106001'
  left join dbo.FiscalYear y on  y.Year='01' or y.Year=year(@EndDate)
  left join dbo.AttendanceType at on at.Code='0' or at.code=@typeCode
where e.code='1' or e.Code=@code
```

```sql title="esb/数据准备/leaveInfo.sql"

declare @BeginDate varchar(64)
declare @BeginTime varchar(64)
declare @EndDate varchar(64)
declare @EndTime varchar(64)
declare @Code varchar(64)

set @BeginDate = '2026-03-01'
set @BeginTime = '09:00'
set @EndDate ='2026-03-01'
set @EndTime ='15:00'
set @Code ='2106001'

select
  --请假信息.请假信息ID
  newid() as 'AttendanceLeaveInfoId',
    --请假信息.员工ID(数据来自Employee表的EmployeeId栏位)
  e.EmployeeId as 'EmployeeId',
    --请假信息.请假类型ID(数据来自AttendanceType表的AttendanceTypeId栏位)
  at.AttendanceTypeId as 'AttendanceTypeId',
    --请假信息.班次ID(数据来自AttendanceRank表的AttendanceRankId栏位)
  aer.AttendanceRankId as 'AttendanceRankId',
    --请假信息.开始日期
  aer.Date as 'BeginDate',
    --请假信息.开始时间
  (
    case
      when aer.Date = @BeginDate
        and @BeginTime  between min(arr.RestBeginTime)
             and max(arr.RestEndTime) then @BeginTime
      else min(arr.RestBeginTime)
      end
    )+''  as  'BeginTime',
    --请假信息.结束日期
  aer.Date as 'EndDate',
    --请假信息.结束时间
  (case
     when aer.Date = @EndDate
       and  @EndTime between min(arr.RestBeginTime)
            and max(arr.RestEndTime) then @EndTime
     else max(arr.RestEndTime)
    end
    ) + '' 'EndTime',
  --请假信息.请假时数  总时数-开始时间时数-结束时间时数
  sum (arr.RestHours - (
    case
      when aer.Date = @BeginDate
        and @BeginTime between arr.RestBeginTime and arr.RestEndTime then DATEDIFF(MINUTE,arr.RestBeginTime,@BeginTime) / 60.0
      else 0
      end
    ) - (
         case
           when aer.Date = @EndDate
             and @EndTime between arr.RestBeginTime
                  and arr.RestEndTime then DATEDIFF(MINUTE,@EndTime,arr.RestEndTime) / 60.0
           else 0
           end)
  ) +  0.0 as 'hours',
    --请假信息.备注
  '' as 'Remark',
    --请假信息.销假日期
  null as 'RevokeDate',
    --请假信息.销假人ID(数据来自Employee表的EmployeeId栏位)
  null as 'RevokeEmployeeId',
    --请假信息.销假人名称
  null as 'RevokeEmployeeName',
    --请假信息.销假批注
  null as 'RevokeRemark',
    --请假信息.销假操作日期
  null as 'RevokeOperationDate',
    --请假信息.销假操作人ID(数据来自User表的UserId栏位)
  null as 'RevokeUserId',
    --请假信息.创建日期
  getdate() as 'CreateDate',
    --请假信息.最后修改日期
  getdate() as 'LastModifiedDate',
    --请假信息.创建者(数据来自User表的UserId栏位)
  u.UserId as 'CreateBy',
    --请假信息.最后修改人(数据来自User表的UserId栏位)
  u.UserId as 'LastModifiedBy',
    --请假信息.标识符
  1 as 'Flag',
    --请假信息.公司ID(数据来自Corporation表的CorporationId栏位)
  null as 'CorporationId',
    --请假信息.是否销假
  0 as 'IsRevoke',
    --请假信息.员工班次表Id(数据来自AttendanceEmployeeRank表的AttendanceEmployeeRankId栏位)
  null as 'EmployeeRankId',
    --请假信息.日期
  aer.Date as 'Date',
    --请假信息.财政年度ID(数据来自FiscalYear表的FiscalYearId栏位)
  y.FiscalYearId as 'FiscalYearId',
    --请假信息.核算单位(数据来自CodeInfo表的CodeInfoId栏位)
  'AnnualLeaveUnit_003' as 'AnnualLeaveUnit',
    --请假信息.旧日期
  sum (
    arr.RestHours - (
      case
        when aer.Date = @BeginDate
          and @BeginTime between arr.RestBeginTime
               and arr.RestEndTime then DATEDIFF(MINUTE, arr.RestBeginTime, @BeginTime) / 60.0
        else 0
        end
      ) - (
      case
        when aer.Date = @EndDate
          and @EndTime between arr.RestBeginTime
               and arr.RestEndTime then DATEDIFF(MINUTE, @EndTime, arr.RestEndTime) / 60.0
        else 0
        end
      ))
    +  0.0 as 'OldDays',
    --请假信息.日期
  sum (
    arr.RestHours - (
      case
        when aer.Date = @BeginDate
          and @BeginTime between arr.RestBeginTime
               and arr.RestEndTime then DATEDIFF(MINUTE, arr.RestBeginTime, @BeginTime) / 60.0
        else 0
        end
      ) - (
      case
        when aer.Date = @EndDate
          and  @EndTime between  arr.RestBeginTime
               and  arr.RestEndTime then DATEDIFF(MINUTE, @EndTime,  arr.RestEndTime )/ 60.0
        else 0
        end
      )
  ) / ar.WorkHours +   0.0 'Days',
    --请假信息.特殊假ID和时数
  null as 'SpecialSetIdAndHours',
    --请假信息.加班调休计划ID和时数
  null as 'AjustIdAndHours',
    --请假信息.ESS销假状态
  null as 'EssRevokeStatus',
    --请假信息.AttendanceLeave_Infos_TOILPlanDetailID
  null as 'TOILPlanDetailID',
    --主表ID
  '' as 'AttendanceLeaveId'
from
  dbo.Employee e
    left join dbo.FiscalYear y on y.Year = '01'
    or y.Year = year(getdate())
  left join dbo.AttendanceType at on at.Code = '0'
  or at.code = '401'
  left join dbo.AttendanceEmpRank aer on e.EmployeeId = aer.EmployeeId
  left join dbo.AttendanceRank ar on ar.AttendanceRankId = aer.AttendanceRankId
  left join dbo.AttendanceRankRest arr on arr.AttendanceRankId = ar.AttendanceRankId
  left join dbo.[User] u on  u.UserName = '2106001' and UserName is not null
where
    (e.Code = '0' or e.Code = @code)
  and aer.Date between @BeginDate
  and @EndDate
  and arr.RestBeginTime < @EndTime
  and arr.RestEndTime > @BeginTime
  and arr.AttendanceRankTypeId = 'AttendanceRankType_001'
group by
  e.EmployeeId,
  aer.Date,
  at.AttendanceTypeId,
  y.FiscalYearId,
  aer.AttendanceRankId,
  u.UserId,
  ar.WorkHours
```

```sql title="eb/请假单/remainderLeave.sql"
declare @BeginDate varchar(64)
declare @BeginTime varchar(64)
declare @EndDate varchar(64)
declare @EndTime varchar(64)
declare @Code varchar(64)
declare @TypeCode varchar(64)

set @BeginDate = '2026-03-01'
set @BeginTime = '09:00'
set @EndDate ='2026-03-01'
set @EndTime ='15:00'
set @Code ='2106001'
set @typeCode='401'

select
  top 1 ape.Days - sum(al.EffectiveHours) as surplus
from
  dbo.Employee e
    left join dbo.AnnualLeavePlanEmployee ape on e.EmployeeId = ape.EmployeeId
    and exists(
      select
        1
      FROM
        dbo.FiscalYear y
      where
        y.Year = year(@BeginDate)
        and ape.FiscalYearId = y.FiscalYearId
    )
    left join dbo.AttendanceLeave al on e.EmployeeId = al.EmployeeId
    and exists(
      select
        1
      from
        dbo.FiscalYear fy
      where
        fy.Year = year(@BeginDate)
        and al.FiscalYearId = fy.FiscalYearId
    )
where
  e.Code = @code
  and ape.Flag = 1
group by
  e.EmployeeId,
  al.FiscalYearId,
  ape.Days
```

```sql title="esb/数据准备/sumLeaveHours.sql"
declare @BeginDate varchar(64)
declare @BeginTime varchar(64)
declare @EndDate varchar(64)
declare @EndTime varchar(64)
declare @Code varchar(64)
declare @TypeCode varchar(64)

set @BeginDate = '2026-03-01'
set @BeginTime = '09:00'
set @EndDate ='2026-03-01'
set @EndTime ='15:00'
set @Code ='2106001'
set @typeCode='401'

select
  sum (
    datediff(
      MINUTE,
      (
        case
          when cast(@beginDate as datetime) + cast(@beginTime as datetime) between aer.date + arr.RestBeginTime
            and aer.date + arr.RestEndTime then cast(@beginDate as datetime) + cast(@beginTime as datetime)
          else aer.date + arr.RestBeginTime
          end
        ),
      (
        case
          when cast(@endDate as datetime) + cast(@endTime as datetime) between aer.date + arr.RestBeginTime
            and aer.date + arr.RestEndTime then cast(@endDate as datetime) + cast(@endTime as datetime)
          else aer.date + arr.RestEndTime
          end
        )
    )/60.0
      + 0 )   as leaveHours
from
  dbo.Employee e
    left join dbo.AttendanceEmpRank aer on e.EmployeeId = aer.EmployeeId
    left join dbo.AttendanceRank ar on aer.AttendanceRankId = ar.AttendanceRankId
    left join dbo.AttendanceRankRest arr on aer.AttendanceRankId = arr.AttendanceRankId
    and arr.AttendanceRankTypeId = 'AttendanceRankType_001'
where
  e.LastWorkDate > @endDate --确认最后请假日期没有离职
  and e.Code = @code --确定工号
  and aer.date + arr.RestBeginTime < CAST(@endDate as datetime) + cast(@endTime as datetime)
  and aer.date + arr.RestEndTime > cast(@beginDate as datetime) + cast(@beginTime as datetime)
```
:::

## 计算时长方案
- 必要考虑因素
  1. 区单在上下午。
  2. 区间在上下午。
  3. 跨日期如何查询

- 以下方案：
  1. 转换为日期+时间  将开始时间班次和结束时间班次替换再结算时间算出小时数相加
  2. 方案还需要再增加

## 主表查询 新增方案

::: caution 重要事情说三次
- 关键难点：
  1. 必须把时间都进行转换（`泛微传过来的数据不支持时间的识别`）。
  2. ==关于用户== `ApproveEmployeeId` `CreateBy` `LastModifiedBy` 此表为用户的ID 非员工的ID
  3. ==审核人姓名== `ApproveEmployeeName` 是员工的CnName
  4. ==状态ID==`StateId` [+StateId] 选择`PlanState_003`
  5. ==审核结果信息==`ApproveResultId`[+ApproveResultId]  选择

[+StateId]:
  1. `PlanState_001` 制订中
  2. `PlanState_002` 待审核
  3. `PlanState_003` 已审核
  4. `PlanState_004` 已归档。

[+ApproveResultId]:
  1. `OperatorResult_001` 同意
  2. `OperatorResult_002` 不同意

:::

:::details  主表字段说明

:::table
|             字段名称             |    字段说明     |   字段类型   |                 备注                 |
|:----------------------------:|:-----------:|:--------:|:----------------------------------:|
| AttendanceLeaveId {.danger}  |   请假信息ID    |   Guid   |                                    |
|     EmployeeId {.danger}     |    员工ID     |   Guid   |       Employee表的EmployeeId栏位       |
|  AttendanceTypeId {.danger}  |   请假类型ID    |  String  | AttendanceType表的AttendanceTypeId栏位 |
|     BeginDate {.danger}      |    开始日期     | DateTime |                                    |
|     BeginTime  {.danger}     |    开始时间     |  String  |                                    |
|      EndDate  {.danger}      |    结束日期     | DateTime |                                    |
|      EndTime  {.danger}      |    结束时间     |  String  |                                    |
|            Remark            |     备注      |   Text   |                                    |
|      StateId {.danger}       |    状态ID     |  String  |       CodeInfo表的CodeInfoId栏位       |
|           CauseId            |   变更原因ID    |  String  |       CodeInfo表的CodeInfoId栏位       |
|      FoundOperationDate      |   制订操作日期    | DateTime |                                    |
|         FoundUserId          |   制订操作人ID   |   Guid   |           User表的UserId栏位           |
|         ApproveDate          |    审核日期     | DateTime |                                    |
|      ApproveEmployeeId       |    审核人ID    |   Guid   |       Employee表的EmployeeId栏位       |
|     ApproveEmployeeName      |    审核人名称    |  String  |                                    |
|        ApproveRemark         |    审核批注     |   Text   |                                    |
|     ApproveOperationDate     |   审核操作日期    | DateTime |                                    |
|        ApproveUserId         |   审核操作人ID   |   Guid   |           User表的UserId栏位           |
|     RepealOperationDate      |   撤销操作日期    | DateTime |                                    |
|         RepealUserId         |   撤销操作人ID   |   Guid   |           User表的UserId栏位           |
|   CreateDate     {.danger}   |  请假资料.创建日期  | DateTime |                                    |
| LastModifiedDate   {.danger} | 请假资料.最后修改日期 | DateTime |                                    |
|    CreateBy     {.danger}    |  请假资料.创建者   |   Guid   |           User表的UserId栏位           |
| LastModifiedBy    {.danger}  | 请假资料.最后修改者  |   Guid   |           User表的UserId栏位           |
|      Flag    {.danger}       |  请假资料.是否有效  | Boolean  |                                    |
|        CorporationId         |  请假资料.公司ID  |   Guid   |    Corporation表的CorporationId栏位    |
|         AssignReason         |  请假资料.分配原因  |  String  |                                    |
|    OwnerId     {.danger}     | 请假资料.所有者ID  |  String  |           User表的UserId栏位           |
|     SubmitOperationDate      |   提交操作日期    | DateTime |                                    |
|         SubmitUserId         |    提交操作人    |   Guid   |           User表的UserId栏位           |
|     ConfirmOperationDate     |   归档操作日期    | DateTime |                                    |
|        ConfirmUserId         |    归档操作人    |   Guid   |          User表的UserId栏位)           |
|       ApproveResultId        |   审核结果ID    |  String  |      CodeInfo表的CodeInfoId栏位)       |
|         VirObjectId          |  虚拟实体辅助字段   |  String  |                                    |
|         DeductOhter          | 是否扣除班次以外时间  | Boolean  |             休息、就餐时间默认是             |
|           PassRest           |   是否跳过休息日   | Boolean  |                                    |
|      AttendanceDayType       |    请假类型     |  Int32   |                                    |
|        IsCheckAtType         | 是否检查节假日假勤类型 | Boolean  |                                    |
|           WholeDay           |   是否全天请假    | Boolean  |                                    |
|            Hours             |    请假时数     | Decimal  |                                    |
|            IsUndo            |    是否撤消     | Boolean  |                                    |
|           IsRevoke           |  明细是否有销假记录  | Boolean  |                                    |
|   FiscalYearId  {.danger}    |   财政年度ID    |   Guid   |      FiscalYear表的FiscalYearId      |
|       DeputyEmployeeId       |    代理人ID    |   Guid   |        Employee表的EmployeeId        |
|            IsEss             |   是否ESS相关   | Boolean  |                                    |
|             IsEF             |   是否EF相关    | Boolean  |                                    |
|          IsRegular           |   请规律时间段假   | Boolean  |                                    |
|         ESS_SheetNo          |    ESS单号    |  String  |                                    |
|    TotalHours  {.danger}     |    请假总时数    | Decimal  |                                    |
|         CancelHours          |    销假时数     | Decimal  |                                    |
|        EffectiveHours        |   有效请假时数    | Decimal  |                                    |
|          IsFromEss           |  IsFromEss  | Boolean  |                                    |
|           EssType            |   EssType   |  String  |                                    |
|            EssNo             |    EssNo    |  String  |                                    |
:::

## 子表查询 新增方案
