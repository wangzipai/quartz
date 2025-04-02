---
date created: 2025-03-27 10:17
date updated: 2025-04-02 11:41
tags:
  - ocpp201
link: "false"
share: "true"
---

# N诊断

这个功能块描述了OCPP的诊断功能。这个功能可以远程诊断充电站的问题。可以请求充电站上传包含诊断信息的文件(可选地限制在指定的时间间隔内)。

- **N01 - 检索日志信息 (Retrieve Log Information)**
- N02 - 获取监控报告 (Get Monitoring report)
- N03: 设置监控内容
- N04: 设置监控变量（设置阈值上下限）
- N05: 设置监控级别（按照严重性，10个级别）
- N06: 清除监控的设置
- **N07: 警报事件**
- N08: 定期上报监控的事件
- N09: 获取客户信息
- N10: 清除客户信息

## 日志

### N01 - 检索日志信息 (Retrieve Log Information)

这个用例涵盖了从充电站获取日志信息的功能。csms可以请求充电站将包含日志信息的文件上传到给定位置(URL)。此日志文件的格式未指定。充电站上传一个日志文件，并通过向csms发送状态通知来提供有关上传状态的信息。

#### 流程

1. CSMS向充电站发送GetLogRequest。
2. 充电站回复一个GetLogResponse。
3. 充电站发送一个带有状态为Uploading的LogStatusNotificationRequest。
4. CSMS回复一个LogStatusNotificationResponse，确认状态更新请求。
5. 诊断文件上传中。
6. 充电站发送一个带有状态为Uploaded的LogStatusNotificationRequest。
7. CSMS回复一个LogStatusNotificationResponse，确认状态更新请求。

```mermaid
sequenceDiagram
    participant CSMS
    participant ChargingStation (CS)
    CSMS->>CS: GetLogRequest(log.logType, requestId, log.startTime?, log.stopTime?, log.logFile.remoteLocation?, log.transferProtocol?)
    CS->>CS: 准备日志文件 (Prepare Log File)
    alt 上传方式为 Charging Station 发起
        CS->>CSMS: LogStatusNotificationRequest(status=Uploading, requestId)
        CS->>CSMS: HTTP(S) POST (上传日志文件)
        CS->>CSMS: LogStatusNotificationRequest(status=Uploaded, requestId)
    else 上传方式为 CSMS 指定远程位置
        CS->>CSMS: LogStatusNotificationRequest(status=Accepted, requestId)
        CS->>远程服务器: Upload Log File (using transferProtocol)
        CS->>CSMS: LogStatusNotificationRequest(status=Uploaded/UploadFailure, requestId)
    end
    CSMS->>CS: GetLogResponse(status)
```

#### 要求

| ID        | 前置条件                                                           | 需求定义                                                                                                                                                                                                 | 说明                                                                                                                                           |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| N01.FR.01 | 在收到GetLogRequest并且请求的日志信息是否可用时                                 | 充电站应该用包含文件名称和状态 "Accepted" 的 GetLogResponse 做出响应。                                                                                                                                                    |                                                                                                                                              |
| N01.FR.02 | N01.FR.01                                                      | 充电站应开始将单个日志文件上传到指定位置。                                                                                                                                                                                |                                                                                                                                              |
| N01.FR.03 | N01.FR.02<br/>AND<br/>GetLogRequest中包含了logType SecurityLog。    | 充电站应上传安全日志                                                                                                                                                                                           |                                                                                                                                              |
| N01.FR.04 | N01.FR.02<br/>AND<br/>GetLogRequest中包含了logType DiagnosticsLog。 | 充电站应上传诊断日志                                                                                                                                                                                           |                                                                                                                                              |
| N01.FR.05 | 收到GetLogRequest且请求的日志信息不可用。                                    | 充电站应该用状态Rejected来回应。                                                                                                                                                                                 |                                                                                                                                              |
| N01.FR.07 |                                                                | 为了确保一致性，每个用于日志上传的LogStatusNotificationRequest都应包含与启动此日志上传的GetLogRequest相同的requestId。                                                                                                                 |                                                                                                                                              |
| N01.FR.08 | 当开始上传日志文档时                                                     | 充电站将会发送一个LogStatusNotificationRequest。这个请求将通知中央系统日志上传已经开始。                                                                                                                                           |                                                                                                                                              |
| N01.FR.09 | 当日志文档成功上传时                                                     | 充电站将发送一个LogStatusNotificationRequest，指示上传成功。                                                                                                                                                         |                                                                                                                                              |
| N01.FR.10 | 当日志文档上传失败                                                      | 充电站将发送一个LogStatusNotificationRequest，指示上传失败。                                                                                                                                                         | 建议发送的状态信息尽可能准确地描述故障原因                                                                                                                        |
| N01.FR.12 | 当充电站正在组装或上传日志文件，并且接收到一个新的GetLogRequest时                        | 充电站应该取消正在进行中的日志文件上传并响应状态为"AcceptedCanceled"                                                                                                                                                          |                                                                                                                                              |
| N01.FR.13 |                                                                | LogStatusNotificationRequest中的字段requestId是强制的，除非该消息由TriggerMessageRequest触发，且没有日志上传正在进行。                                                                                                             |                                                                                                                                              |
| N01.FR.14 |                                                                | 建议充电站和充电桩管理系统(CSMS)至少支持HTTP(s)作为日志文件上传的传输机制。                                                                                                                                                         | HTTP传输最有可能得到支持，因为它也用于OCPP消息传递。                                                                                                               |
| N01.FR.15 |                                                                | 充电站至少应支持CSMS信任链以保证安全传输                                                                                                                                                                               |                                                                                                                                              |
| N01.FR.16 |                                                                | 建议“充电站”支持操作系统提供的常用ca                                                                                                                                                                                 | CSMS的日志文件存储可以是一个独立于CSMS本身运营的云服务，不属于CSMS的信任链的一部分。                                                                                             |
| N01.FR.17 | 当CSMS需要基本的上传授权时                                                | 建议CSMS要求上传的基本授权密码与用于OCPP连接的密码不同。                                                                                                                                                                     | 这是为了避免如果日志文件存储是不同的系统，泄露OCPP密码给第三方。基本授权可以通过以下方式添加到URL中：<br/><http://username:password@csms.org/logs>                                          |
| N01.FR.18 |                                                                | 强烈建议CSMS接受来自充电站的上传请求，包括PUT和POST请求。                                                                                                                                                                   |                                                                                                                                              |
| N01.FR.19 | 当充电站使用HTTP(s)的POST请求上传日志文件时                                    | 充电站应该至少提供以下属性：<br />==Content-Type==：这个属性指定了上传的文件类型，通常是MIME类型（例如，`application/octet-stream` 表示通用的二进制文件）。这有助于CSMS了解文件的内容类型。 ==Content-Disposition==：这个属性用于指定文件的描述，通常包括文件名和处理方式。文件名指示了上传文件的名称，供CSMS使用。 | 例如：<br />==Content-Type==: application/octet-stream ==Content-Disposition:== form-data; name="uploadedfile"; filename="logfile_20210420.zip" |
| N01.FR.20 | N01.FR.12 AND<br/>充电站取消了上传文件操作                                 | 充电站应发送一个<br/>LogStatusNotificationRequest with status =<br/>AcceptedCanceled。                                                                                                                        | N01.FR.12是“应该”的要求。只在需求执行时发送状态通知。                                                                                                             |

## 设置监视器

### N02 - 获取监控报告 (Get Monitoring report)

这个使用案例描述了CSMS如何请求充电站发送关于每个组件和变量的已配置监控设置的报告。可以选择性地对这个列表进行监控条件（monitoringCriteria）和组件变量（componentVariables）的筛选。

#### 流程

1. CSO触发CSMS向充电站请求监控报告。
2. CSMS向充电站发送获取监控报告的请求。
3. 充电站回复一个获取监控报告的响应。
4. 充电站向CSMS发送一个通知监控报告的请求。
5. CSMS回复一个通知监控报告的响应。
6. 步骤4和步骤5重复，直到所有监控报告数据都被发送完毕。

```mermaid
sequenceDiagram
    participant CSMS
    participant ChargingStation (CS)
    CSMS->>CS: GetMonitoringReportRequest(requestId, monitoringCriteria?)
    CS->>CS: 生成监控报告 (Generate Monitoring Report)
    CS->>CSMS: NotifyMonitoringReportRequest(requestId, reportData[])
    CSMS->>CS: GetMonitoringReportResponse()
```

#### 要求

| ID        | 前置条件                                                                                                      | 需求定义                                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| N02.FR.01 | NOT N02.FR.10 AND<br/>当充电站收到一个支持的监控条件（monitoringCriteria）或没有监控条件的 getMonitoringReportRequest 时。           | 充电站应发送一个getMonitoringReportResponse，并注明已接受。                                                                           |
| N02.FR.02 | 当充电站接收到不支持的监控条件(monitoringCriteria)的getMonitoringReportRequest时                                           | 充电站应发送一个getMonitoringReportResponse，并注明不接受。                                                                           |
| N02.FR.03 | N02.FR.01                                                                                                 | 充电站应通过一个或多个notifyMonitoringReportRequest消息向csms发送所请求的信息。                                                              |
| N02.FR.04 | N02.FR.01 AND<br/>getMonitoringReportRequest 包含一个 requestId                                               | 为这个getMonitoringReportRequest发送的每个notifyMonitoringReportRequest都应该包含相同的requesttid                                     |
| N02.FR.05 | N02.FR.01 AND<br/>monitoringCriteria 和 componentVariables不都是空的                                            | 在一个或多个notifyMonitoringReportRequest消息中报告的监视器集仅限于由monitoringCriteria和componentVariables定义的监视器集。                        |
| N02.FR.06 | N02.FR.01 AND<br/>monitoringCriteria 不是空的 AND<br/>componentVariables 是空的.                                 | 在一个或多个notifyMonitoringReportRequest消息中报告的监视器集仅限于monitoringCriteria定义的监视器集。                                            |
| N02.FR.07 |                                                                                                           | 一个getMonitoringReportRequest消息中组件变量的最大数量由ItemsPerMessageGetReport配置变量                                                 |
| N02.FR.08 | N02.FR.01 AND<br/>monitoringCriteria 不存在 AND<br/>componentVariables 非空.                                   | 在一个或多个notifyMonitoringReportRequest消息中报告的监视器集仅限于componentVariables定义的监视器集。                                            |
| N02.FR.09 |                                                                                                           | NotifyMonitoringReportRequest 中的 seqNo 字段包含的序列号会按报告递增。因此，第一个包含第一个报告部分的 NotifyMonitoringReportRequest 消息的 seqNo 值应为 0。 |
| N02.FR.10 | 当充电站收到一个 GetMonitoringReportRequest，其中的条件组合导致结果集为空时。                                                      | 充电站应使用一个GetMonitoringReportResponse来响应(status = EmptyResultSet)。                                                      |
| N02.FR.11 | N02.FR.01 AND<br/>monitoringCriteria 为空 AND<br/>componentVariables 为空.                                    | 所有现有监视器的集合将在一个或多个notifyMonitoringReportRequest消息中报告。                                                                  |
| N02.FR.12 | 如果monitoringCriteria包含ThresholdMonitoring                                                                 | 所有类型为 UpperThreshold 或 LowerThreshold 的监视器都会被报告。                                                                      |
| N02.FR.13 | 如果monitoringCriteria包含DeltaMonitoring                                                                     | 所有类型为 Delta 的监视器都会被报告。                                                                                                |
| N02.FR.14 | 如果monitoringCriteria包含PeriodicMonitoring                                                                  | 所有类型为 Periodic或 PeriodicClockAligned 的监视器都会被报告。                                                                       |
| N02.FR.15 | 当充电站接收到带有 componentVariable 元素的 GetMonitoringReportRequest 但其中 component.instance 和/或 component.evse 缺失时。 | 充电站应该对 componentVariable 中的每个 instance 和/或 EVSE 进行报告。                                                                 |
| N02.FR.16 | 当充电站收到一个 GetMonitoringReportRequest，其中包含 componentVariable 元素，但 variable 字段缺失时。                           | 充电站应该报告 componentVariable 中组件的每个变量。                                                                                   |
| N02.FR.17 | 当充电站接收到一个包含 variable 但不包含 instance 的 GetMonitoringReportRequest 时。                                        | 充电站应该为 componentVariable 中的每个组件变量报告。                                                                                  |

### 设置监控基础

这个用例描述了CSMS请求充电站激活一组预配置的监控设置，其值由MonitoringBase确定。由充电站制造商定义由"All"、"FactoryDefault"和"HardWiredOnly"激活的监控设置。

#### 流程

1. CSO触发CSMS请求充电站设置监控基础。
2. CSMS向充电站发送SetMonitoringBaseRequest。
3. 充电SetBaseResponse回应。

在收到关于"HardWiredOnly"或"FactoryDefault"的SetMonitoringBaseRequest时，充电站将丢弃以前配置的自定义监控器，并激活与给定MonitoringBase相关的监控设置。
对于MonitoringBase = All，充电站将激活所有预配置的监控器，同时保留以前配置的自定义监控器。这包括在更改现有预配置监控器时创建的自定义监控器。
当"All"和"FactoryDefault"的预配置监控器集合相同时，两者之间的区别在于，使用"FactoryDefault"时，将在还原工厂默认预配置监控器之前删除所有自定义监控器。

#### 要求

| ID        | 前置条件                                                                                              | 需求定义                                                  |
| --------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| N03.FR.01 | 当充电站接受setMonitoringBaseRequest时                                                                   | 充电站将发送一个setmonitoringbaserresponse表示接受                |
| N03.FR.02 | 当充电站接收到一个不支持的monitoringBase的setmonitoringbaserrequest                                             | 充电站将发送一个setmonitoringbaserresponse表示不支持               |
| N03.FR.03 | N03.FR.01 AND<br/>当充电站接收到一个带有所有monitoringBase的setMonitoringBaseRequest                            | 充电站将激活所有**预配置**的监控设置，同时保留所有已安装的自定义监控器（包括更改后的预配置监控器）。  |
| N03.FR.04 | N03.FR.01和当充电站收到监控基础设置请求并且监控基础为FactoryDefault时。                                                   | 然后充电站应删除所有自定义监控设置（包括被覆盖的预配置监控设置），并激活制造商建议的默认监控设置。     |
| N03.FR.05 | N03.FR.01 AND<br/>当充电站收到了一个监控基准设置请求（setMonitoringBaseRequest），监控基准（monitoringBase）为HardWiredOnly时 | 此时，充电站应清除所有自定义监控设置并禁用所有预配置的监控设置，只有与硬件连接的监控设置仍然保持激活状态。 |

### 配置监视器变量

这个用例描述了CSMS如何请求充电站在变量上设置监视触发器。可以为上限或下限阈值、增量更改或定期报告设置多个触发器。

#### 流程

1. 充电站运营商（CSO）触发充电站管理系统（CSMS）以请求充电站设置变量监视设置。
2. CSMS向充电站发送一个SetVariableMonitoringRequest。
3. 充电站以SetVariableMonitoringResponse响应。

所有的==变量监视设置在重新启动后都是持久的==。如果监视的变量仍然存在且仍然可以监视，那么在固件更新后，变量监视设置将保持不变。否则，变量监视设置将被删除。

#### 要求

| ID        | 前置条件                                                                                                               | 需求定义                                                                                                                                      | 说明                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| N04.FR.01 | 充电站接收到一个带有X个SetMonitoringData元素的SetVariableMonitoringRequest                                                       | 充电站应该以SetVariableMonitoringResponse的形式回应，其中包含与SetVariableMonitoringRequest中的SetMonitoringData元素数量相等（X个）的SetMonitoringResult元素。            |                                                                                                                                               |
| N04.FR.02 | N04.FR.01                                                                                                          | SetVariableMonitoringResponse中的每个SetMonitoringResult元素都应包含与SetVariableMonitoringRequest中的SetVariableMonitoringRequest元素相同的组件和变量组合。        |                                                                                                                                               |
| N04.FR.03 | 充电站接收到一个包含未知组件的SetMonitoringData在SetVariableMonitoringRequest中                                                     | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:UnknownComponent。                                                                         |                                                                                                                                               |
| N04.FR.04 | 当充电站收到SetVariableMonitoringRequest并且在SetMonitoringData中给定组件中的变量未知时。                                                | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:UnknownVariable。                                                                          |                                                                                                                                               |
| N04.FR.05 | 当充电站收到SetVariableMonitoringRequest，并且具体变量不支持的MonitorType。                                                          | 充电站应将相应的SetMonitoringResult字段中的attributeStatus设置为：UnsupportedMonitorType。                                                                 |                                                                                                                                               |
| N04.FR.06 | 如果充电站收到的SetVariableMonitoringRequest中，监视类型为UpperThreshold或LowerThreshold，且monitorValue低于或高于给定变量的范围时：               | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:Rejected。                                                                                 | 可以在可选的statusInfo元素中提供更多信息。                                                                                                                    |
| N04.FR.07 | 当充电站接收到与安全要求冲突的SetVariableMonitoringRequest时：                                                                      | 充电站可以将SetMonitoringResult的attributeStatus字段设置为"Rejected"。                                                                                 | 例如，当请求的监控覆盖了工厂设置的安全监控时。                                                                                                                       |
| N04.FR.08 | 当充电站能够设置SetMonitoringData中给定的monitorValue时。                                                                        | 充电站应将相应的SetMonitoringResult中的attributeStatus字段设置为：Accepted。                                                                               | 请参考用例`N07`关于如何处理不同监视器类型的警报事件。                                                                                                                 |
| N04.FR.09 |                                                                                                                    | 一条SetVariableMonitoringRequest消息中的monitoringData的最大大小和数量由ItemsPerMessageSetVariableMonitoring和BytesPerMessageSetVariableMonitoring配置变量决定。 |                                                                                                                                               |
| N04.FR.10 | 当充电站接收到一个SetVariableMonitoringRequest，其中包括一个已经存在相同类型和严重程度的监控器（monitor）但具有不同ID的组件/变量组合时。                            | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:Duplicate。                                                                                | 同一变量上不能有两个具有相同严重程度的相同类型的监视器。例如，当一个组件/变量有一个带有UpperThreshold at value “67”和严重性“4-” 错误”，那么就不会再有错误了 UpperThreshold at value “78”，同样严重“4-Error”定义。 |
| N04.FR.11 | 当充电站接收到没有Id的SetVariableMonitoringRequest时 AND <br />N04.FR.08                                                      | 充电站将生成一个Id并在SetVariableMonitoringResponse中返回。                                                                                             |                                                                                                                                               |
| N04.FR.12 | 当充电站接收到一个SetVariableMonitoringRequest，其中包括一个ID，一个匹配该ID的监控器（monitor）已存在，并且给定的组件/变量组合与现有的变量监控器（VariableMonitor）相对应时。 | 充电站将替换现有的监控器。                                                                                                                             |                                                                                                                                               |
| N04.FR.13 | 当充电站接收到带有Id的SetVariableMonitoringRequest时 AND<br/>不存在与给定Id匹配的监视器。                                                  | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:Rejected。                                                                                 |                                                                                                                                               |
| N04.FR.14 | 当充电站收到一个带有"Delta"类型且值包含负数的SetVariableMonitoringRequest。                                                            | 充电站将对应SetMonitoringResult中的attributeStatus字段设置为:Rejected                                                                                  | 可以在可选的statusInfo元素中提供更多信息。                                                                                                                    |
| N04.FR.15 | N04.FR.12 AND<br/>被替换的变量监视器属于“预配置监视器”。                                                                             | 新的VariableMonitor在被SetMonitoringBaseRequest重置之前，应被分类为“CustomMonitor”。                                                                     |                                                                                                                                               |
| N04.FR.16 | 在充电站收到一个带有ID的SetVariableMonitoringRequest AND<br />存在一个匹配给定ID的监控项，AND<br />给定的组件/变量组合与现有的VariableMonitor不相符时。      | 充电站应回应“Rejected” 而不是替换VariableMonitor。                                                                                                    | 不允许更改变量或监视器的组件。                                                                                                                               |
| N04.FR.17 | 当CSMS发送一个type为Delta的SetVariableMonitoringRequest，而该变量不是数值类型时。                                                      | 建议使用“monitorValue”为“1”。                                                                                                                   | 对于非数字类型，monitorValue是无关的 (例如，任何类型，除了十进制或整数)，因为监视器是由每一个变化触发的变量。                                                                                |
| N04.FR.18 | N04.FR.12 AND<br/>SetVariableMonitoringRequest中的id引用了一个HardWiredMonitor                                            | 充电站应回应“Rejected”<br/>而不是替换VariableMonitor。                                                                                                | 不可能更改硬连接的监视器。                                                                                                                                 |
| N04.FR.19 | 充电站已经重启                                                                                                            | CSMS建议发送一个GetMonitoringReportRequest消息来获取新的监控列表。                                                                                          | 自定义监视器在重新启动或固件更新后是持久的，但id可能已经更改。                                                                                                              |

### 设置监视器级别

可能希望限制监控事件的报告，仅对那些严重性编号低于或等于某个严重性的监视器进行报告。例如，当由于某种原因需要限制充电站和CSMS之间的数据流量时，CSMS可以使用SetMonitoringLevelRequest消息来控制充电站通知它哪些事件。

#### 流程

1. 充电站操作员触发CSMS以请求充电站通过设置严重级别限制来限制监控事件的报告。
2. CSMS向充电站发送SetMonitoringLevelRequest。
3. 充电站响应并发送SetMonitoringLevelResponse。

#### 要求

| ID        | 前置条件                                      | 需求定义                                                       |
| --------- | ----------------------------------------- | ---------------------------------------------------------- |
| N05.FR.01 | 当充电站接受setMonitoringLevelRequest时          | 充电站应发送一个带有Accepted的setMonitoringLevelResponse              |
| N05.FR.02 | 当充电站接收到setMonitoringLevelRequest的严重性超出范围时 | 充电站应发送一个带有Rejected的setMonitoringLevelResponse              |
| N05.FR.03 | N05.FR.01                                 | 充电站应通过NotifyEventRequest将监控事件的报告限制为仅包括严重级别低于或等于给定严重级别的监控器。 |

### N06 - 清除/移除监控 (Clear / Remove Monitoring)

可以通过发送带有监视设置id的ClearVariableMonitoringRequest来清除(删除)监视设置。

#### 流程

1. CSO触发CSMS请求清除/移除充电站中的一个或多个变量。
2. CSMS向充电站发送ClearVariableMonitoringRequest。
3. 充电站响应ClearVariableMonitoringResponse。

```mermaid
sequenceDiagram
    participant CSMS
    participant ChargingStation (CS)
    CSMS->>CS: ClearVariableMonitoringRequest(monitoringIdentifier[])
    CS->>CS: 清除监控 (Clear Monitoring)
    CS->>CSMS: ClearVariableMonitoringResponse(clearMonitoringResult[])
```

#### 要求

| ID        | 前置条件                                                                                          | 需求定义                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| N06.FR.01 | 当充电站接受了一个ClearVariableMonitoringRequest                                                       | 充电站应发送一个带有Accepted的ClearVariableMonitoringResponse                                                                                     |
| N06.FR.02 | 充电站接收到一个带有不存在id的ClearVariableMonitoringRequest                                                | 充电站应发送一个带有NotFound的ClearVariableMonitoringResponse                                                                                     |
| N06.FR.03 | 当充电站接收到一个无法清除的id的ClearVariableMonitoringRequest（例如因为它是硬编码的）时。                                 | 充电站应发送一个带有Rejected的ClearVariableMonitoringResponse                                                                                     |
| N06.FR.04 |                                                                                               | CSMS不应在ClearVariableMonitoringRequest中放置比通过ItemsPerMessageClearVariableMonitoring和BytesPerMessageClearVariableMonitoring由充电站报告的更多id元素。 |
| N06.FR.05 |                                                                                               | 对于ClearVariableMonitoringRequest中的每个id，充电站应该在发送给CSMS的ClearVariableMonitoringResponse中添加一个clearMonitoringResult元素。                      |
| N06.FR.06 | 充电站收到一个带有的id元素比ItemsPerMessageClearVariableMonitoring允许的要多的ClearVariableMonitoringRequest。    | 充电站可能会响应一个CALLERROR (OccurenceConstraintViolation)                                                                                     |
| N06.FR.07 | 充电站收到一个ClearVariableMonitoringRequest，其中包含的字节数超过了BytesPerMessageClearVariableMonitoring允许的长度。 | 充电站可能会响应一个CALLERROR (FormatViolation)                                                                                                  |

## 监视器事件

### N07 - 告警事件 (Alert Event)

告警事件通常由充电桩在检测到异常情况时主动发送。

NotifyEventRequest会报告由于触发事件而导致的每个组件/变量。只包括负责触发事件的VariableMonitoring设置。

#### 流程

1. 如果超过阈值或增量值，充电站将向csms发送一个NotifyEventRequest。
2. csms使用NotifyEventResponse响应。

N07.FR.04要求将严重性小于或等于OfflineMonitoringEventQueuingSeverity的事件在充电站离线时排队，然后在恢复联机后发送。这意味着严重性大于OfflineMonitoringEventQueuingSeverity的事件将不会发送到CSMS。结果是，充电站恢复在线后，事件链可能会中断。

例如，当离线时发生了一个超过阈值的变量监视事件，但未发送。一旦恢复联机，某个时候将报告具有变量清除设置为true的监视事件，但CSMS甚至不知道已超过阈值。CSMS必须能够处理这种情况。

这个问题可以通过遵守规范的同时，通过将那些超过OfflineMonitoringEventQueuingSeverity的监视器的评估推迟到充电站重新联机时，来防止。结果是，当充电站重新联机时，CSMS将获得适用于当前情况的监视事件，并且完全了解监视器的状态。只有在离线期间触发并清除的监视事件将对CSMS保持不可见。

```mermaid
sequenceDiagram
    participant ChargingStation (CS)
    participant CSMS
    CS->>CS: 检测到告警事件 (Alert Event Detected)
    CS->>CSMS: NotifyEventRequest(eventData[])
    CSMS->>CS: NotifyEventResponse()
```

#### 要求

| ID        | 前置条件                                                                                                                                                                        | 需求定义                                                                             | 说明                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------- |
| N07.FR.02 | 当监控值在设置的UpperThreshold或LowerThreshold                                                                                                                                       | 充电站应发送一个带有属性cleared为true的NotifyEventRequest，包含事件数据。                              |                            |
| N07.FR.03 | 当CSMS收到一个notifyEventRequest                                                                                                                                                 | CSMS应发送一个空的NotifyEventResponse来响应                                                |                            |
| N07.FR.04 | 当监视器被触发 AND<br />监视器的严重程度等于或低于配置变量OfflineMonitoringEventQueuingSeverity中设置的严重程度 AND<br />充电站处于离线状态时。                                                                        | 充电站应将此NotifyEventRequest排队，并在重新联机时将其传送。                                          |                            |
| N07.FR.05 | 当监视器被触发AND<br />其他事件引起该事件时                                                                                                                                                  | 充电站可以在NotifyEventRequest消息的eventData元素的cause字段中包含另一个事件的eventId。                  |                            |
| N07.FR.06 | 当监视器被触发                                                                                                                                                                     | NotifyEventRequest中的eventData元素必须包含引发事件的Component、Variable和variableMonitoringId。 |                            |
| N07.FR.07 | 当监视器被触发                                                                                                                                                                     | Charging Station应将首个发送的NotifyEventRequest的seqNo设置为0，以指示这个事件。                     |                            |
| N07.FR.10 | 当监视器被触发 AND<br/>在只写变量上设置了variableMonitoring设置                                                                                                                               | NotifyEventRequest的actualField应该为空。                                              |                            |
| N07.FR.11 | 修改设置的上限阈值（UpperThreshold）或下限阈值（LowerThreshold）的VariableMonitor时。                                                                                                            | 充电站应检查新的阈值是否清除了旧的阈值或者新的阈值是否被监控数值超过。                                              |                            |
| N07.FR.12 | 移除设置的UpperThreshold或LowerThreshold VariableMonitor时AND<br />超过了阈值                                                                                                           | 充电站不应发送一个带有 `cleared` 属性为 `true` 的 `NotifyEventRequest`。                         |                            |
| N07.FR.13 |                                                                                                                                                                             | VariableMonitoring需要在重启期间被存储。                                                    |                            |
| N07.FR.14 | 如果一个变量监视设置的类型为 `UpperThreshold` 或 `LowerThreshold` 已被触发，并且在发生重启后，监视的值回到了配置的阈值内，那么充电站不应发送一个带有 `cleared` 属性为 `true` 的 `NotifyEventRequest`。                                   | 充电站应发送一个 `NotifyEventRequest`，其中 `eventData` 属性的 `cleared` 设置为 `true`。           |                            |
| N07.FR.15 | 充电站应发送一个 `NotifyEventRequest`，其中 `eventData` 属性的 `severity` 等于或高于 CSMS 在 `SetMonitoringLevelRequest` 中设置的监控严重性级别。                                                           | 充电站不应发送由触发的监控器的 `NotifyEventRequest`。                                            |                            |
| N07.FR.16 | 当存在类型为 UpperThreshold 的监视器，并且变量的实际值（`Actual` 属性类型）超过 `monitorValue` 时。                                                                                                      | 充电站应发送一个 `NotifyEventRequest`，其中触发了触发Alerting的监视器。                               | 超过阈值时发送通知，而不是在阈值上发送通知      |
| N07.FR.17 | 充电站应发送一个 `NotifyEventRequest`，其中触发了触发警报的监视器。                                                                                                                                | 充电站应发送一个带有触发警报的 `NotifyEventRequest`，其中触发了Alerting监视器。                           | 当下降到阈值以下时发送通知，而不是在阈值上发送通知。 |
| N07.FR.18 | 当特定组件/变量组合上存在 Delta 监控器，且该变量具有数值类型，且该变量的实际值（属性类型为“Actual”）自上次发送事件通知以来发生的变化超过了监控器值（`monitorValue`）的正负范围，或者自上次设置监控器以来发生的变化超过了该范围时，充电站应触发一个 `NotifyEventRequest`。              | 充电站应发送一个 `NotifyEventRequest`，其中触发了 Delta 监控器的监控器，并在触发事件中标明触发类型为 Delta。          |                            |
| N07.FR.19 | 如果监控器具有 Delta 类型，并且变量不是数字类型（例如布尔、字符串或枚举），并且变量的实际值（属性类型为 Actual）在设置监控器或上次发送事件通知以来发生了更改（无论 monitorValue 的值如何），则充电站应发送一个 `NotifyEventRequest`，触发 Delta 监控器的事件，而事件触发类型应为 Delta。 | 充电站应发送一个 `NotifyEventRequest`，其中触发了 Delta 监控器的监控器，并在触发事件中标明触发类型为 Delta。          |                            |

### N08 - 周期性事件 (Periodic Event)

周期性事件是充电桩根据配置定期发送的。

NotifyEventRequest 报告了每个触发了 VariableMonitoring 设置的组件/变量。只包括负责触发事件的 VariableMonitoring 设置。

#### 流程

1. 如果超过了周期值，充电站将向csms发送一个带有周期性触发器的NotifyEventRequest。
2. csms使用NotifyEventResponse响应。

```mermaid
sequenceDiagram
    participant ChargingStation (CS)
    participant CSMS
    loop 周期性事件触发 (Periodic Event Trigger)
        CS->>CS: 生成周期性事件数据 (Generate Periodic Event Data)
        CS->>CSMS: NotifyEventRequest(eventData[])
        CSMS->>CS: NotifyEventResponse()
    end
```

#### 要求

| ID        | 前置条件                                                                                                                                                                          | 需求定义                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| N08.FR.02 | 当CSMS收到一个NotifyEventRequest                                                                                                                                                   | csms应该响应一个空的NotifyEventResponse。            |
| N08.FR.03 | N08.FR.06 OR N08.FR.07 AND<br/>监控的监视器的严重性数字等于或低于配置变量 OfflineMonitoringEventQueueingSeverity 中设置的严重性数字。 AND<br/>充电站离线                                                          | 充电站应将此 NotifyEventRequest 放入队列，并在重新联机时将其传送。 |
| N08.FR.04 | N08.FR.06 OR N08.FR.07 AND<br/>此 NotifyEventRequest 是第一个或唯一的报告部分。                                                                                                             | 充电站将seqNo设置为0。                              |
| N08.FR.05 | N08.FR.06 OR N08.FR.07 AND<br/>当触发事件的variableMonitoring设置类型为Periodic或PeriodicClockAligned时                                                                                    | 充电站应将触发器设置为周期性。                             |
| N08.FR.06 | 当存在一个类型为 Periodic 的监控器在一个 Component/Variable 组合上，并且从设置或触发此监控器开始已经过去了 monitorValue 中指定的秒数时                                                                                     | 充电站应向被触发的监视器发送带有触发器周期的NotifyEventRequest。   |
| N08.FR.07 | 当存在一个类型为 PeriodicClockAligned 的监控器在一个 Component/Variable 组合上，并且从设置此监控器之后的最近时钟对齐间隔开始已经过去了 monitorValue 中指定的秒数时，触发事件通知。例如，当 monitorValue 为 900 时，将在每小时的 0、15、30 和 45 分钟时触发事件通知。 | 充电站应向被触发的监视器发送带有触发器周期的NotifyEventRequest。   |

## 客户信息

### 获取客户信息

CSMS向充电站发送消息以检索原始客户信息，例如，以符合当地隐私法。充电站通过发送一个或多个报告通知csms。

流程。

#### 流程

1. CSMS向带有与客户相关信息的引用（idToken、customerCertificate或customerIdentifier）的Charging Station发送一个带有report标志设置为true的CustomerInformationRequest。
2. Charging Station以CustomerInformationResponse做出响应，指示是否发送该信息。
3. Charging Station向CSMS发送一个或多个NotifyCustomerInformationRequest消息。
4. CSMS以一个或多个NotifyCustomerInformationResponse消息对Charging Station做出响应。

#### 要求

| ID        | 前置条件                                                                     | 需求定义                                                                                             | 说明                                                          |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| N09.FR.01 | 当CSMS想要从充电站检索客户信息时。                                                      | CustomerInformationRequest中的报告标志(report flag)应设置为true。                                           |                                                             |
| N09.FR.02 | 当充电站收到CustomerInformationRequest并且处于可以处理此请求的状态时。                         | 充电站应响应一个CustomerInformationResponse消息，状态为Accepted。                                               |                                                             |
| N09.FR.03 | 充电站处于无法处理此请求的状态时                                                         | 收到客户信息请求后充电站应响应一个带有Rejected状态的CustomerInformationResponse                                        |                                                             |
| N09.FR.04 |                                                                          | CSMS应在CustomerInformationRequest中包含对客户的引用，通过在其中包括idToken、customerCertificate或customerIdentifier。 |                                                             |
| N09.FR.05 | N09.FR.02 AND<br/>当充电站存储了与由客户标识符引用的客户相关的信息时。                             | 充电站应通过一个或多个 `NotifyCustomerInformationRequest` 消息将请求的信息发送给 CSMS。                                 |                                                             |
| N09.FR.06 | N09.FR.02 AND<br/>充电站没有存储客户标识符所引用的客户的信息。                                 | 充电站应当送一个NotifyCustomerInformationRequest消息发送给csms，指示未找到数据。                                       |                                                             |
| N09.FR.07 | 当接收到 `CustomerInformationRequest`，其中 `report` 和 `clear` 标志都设置为 `false` 时 | 建议以状态为“Rejected”的CustomerInformationResponse消息进行响应。                                              |                                                             |
| N09.FR.08 | 当根据customerCertificate请求用户信息时。                                           | CSMS应使用用于安装证书的哈希算法。                                                                              | 当安装新固件时，建议首先使用GetInstalledCertificateIds请求获取证书，以确保所使用的哈希算法。 |

### 清除客户信息

CSMS向充电站发送消息以清除（和检索）原始客户信息，例如以符合当地的隐私法律规定。充电站通过发送一个或多个报告来通知CSMS

#### 流程

1. CSMS向带有引用的客户（idToken、customerCertificate或customerIdentifier）的充电站发送CustomerInformationRequest，并将clear标志设置为true。
2. 充电站以CustomerInformationResponse响应，指示是否发送。
3. 如果report标志设置为true，充电站向CSMS发送一个或多个NotifyCustomerInformationRequest消息。
4. CSMS响应一个或多个NotifyCustomerInformationResponse消息给充电站。

| ID        | 前置条件                                                                                                                       | 需求定义                                                                                                      | 说明                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| N10.FR.01 | 当充电站接收到CustomerInformationRequest，并且充电站处于可以处理此请求的状态时。                                                                      | 充电站应响应一个CustomerInformationResponse消息，状态为Accepted。                                                        |                                                                   |
| N10.FR.02 | 当由客户标识符引用的客户存在于充电站的本地授权列表中。                                                                                                | CSMS应更新本地授权使用SendLocalListRequest的列表(参见D01 -发送本地授权列表)                                                     | 为了防止与本地授权列表版本相关的问题。                                               |
| N10.FR.03 | N10.FR.01 AND<br/>当接收到 clear 标志设置为 true 且 report 标志设置为 true 的 CustomerInformationRequest 时。 AND<br/>充电站存储有关与客户标识符相关的客户的信息。 | 充电站应该从充电站中删除与客户标识符相关的客户的所有相关数据，除了本地列表中的数据。然后，充电站应通过一个或多个NotifyCustomerInformationRequest消息将已清除的信息发送到CSMS。 | 为了防止与LocalList版本相关的问题，只有CSMS可以更改LocalList的内容。                     |
| N10.FR.04 | N10.FR.01 AND<br/>收到带有clear标志设置为true和report标志设置为true的CustomerInformationRequest。 AND<br/>充电站没有关于所指的客户的信息存储。                | 充电站将发送一条NotifyCustomerInformationRequest消息给CSMS，指示未找到任何数据。                                                |                                                                   |
| N10.FR.05 | 如果充电站处于无法处理此请求的状态时，将不响应CustomerInformationRequest。                                                                         | 充电站应响应一个带有Rejected状态的CustomerInformationResponse                                                          |                                                                   |
| N10.FR.06 | N10.FR.01 AND<br/>当充电站收到`CustomerInformationRequest`，并且`clear`标志设置为`true`，`report`标志设置为`false`时                            | 充电站应从充电站中删除与由顾客标识符引用的顾客相关的所有数据，但除了本地列表之外。充电站应发送一个`NotifyCustomerInformationRequest`消息到CSMS，以指示数据已被清除。     | 为了防止与LocalList版本相关的问题，只有CSMS可以更改LocalList的内容。                     |
| N10.FR.07 | 如果收到 `CustomerInformationRequest`，而且报告标志和清除标志都设置为 false                                                                    | 建议使用状态为 Rejected 的 `CustomerInformationResponse` 消息进行回应。                                                  |                                                                   |
| N10.FR.08 |                                                                                                                            | CSMS应在CustomerInformationRequest中包括与客户相关的引用，可以使用idToken、customerCertificate或customerIdentifier中的任何一个。     |                                                                   |
| N10.FR.09 | 根据customerCertificate清除用户信息时。                                                                                              | CSMS应使用安装证书时使用的哈希算法。                                                                                      | 当安装新固件时，建议CSMS首先使用"GetInstalledCertificateIds"请求来获取证书，以确保使用的哈希算法。 |
