---
date created: 2025-04-02 11:40
date updated: 2025-04-02 11:40
tags:
  - ocpp201
link: "false"
share: "true"
---

# B配置

## 介绍

这个功能块描述了所有帮助CSO==配置其充电站==、==将其加入其网络并从这些充电站检索配置信息的功能==。此外，它包括检索有关充电站配置的信息，对配置进行更改等功能。本章还涵盖了重置充电站和迁移到新的==NetworkConnectionProfile==的能力。

### 在被CSMS接受之前的交易

充电站运营商可以选择配置充电站**在被CSMS接受之前接受交易**。希望实现此类行为的各方应该意识到，不确定这些交易是否能够被传递给CSMS。

在重新启动后（例如由于远程重置命令、断电、固件更新、软件错误等），充电站必须再次与CSMS联系，==并应发送BootNotification请求==。如果充电站未能从CSMS接收到BootNotificationResponse，并且没有内置的非易失性实时时钟硬件已经正确设置，则充电站可能没有有效的日期和时间设置，从而难以或甚至不可能后来确定交易的日期和时间。

也可能出现这种情况（例如由于配置错误），CSMS指示状态不是已接受的状态，或者状态保持了很长一段时间，甚至无限期。

**通常建议在充电站从未被CSMS接受之前（使用当前的连接设置、URL等）拒绝所有充电服务，因为用户无法进行身份验证，运行交易可能会与配置过程冲突。**

如果支持此功能，可以通过Configuration Variable: `TxBeforeAcceptedEnabled`来配置此行为。

## 用例

### 启动充电站

#### 冷启动充电站

此用例描述了CSMS如何控制哪些充电站可以连接到它。为了能够控制连接到CSMS的充电站，充电站需要发送`BootNotificationRequest`。此请求包含有关充电站的一些通用信息。

1. 充电站上电。
2. 充电站向CSMS发送`BootNotificationRequest`。
3. CSMS返回`BootNotificationResponse`，状态为==Accepted==。
4. _可选_：充电站为每个**连接器**向CSMS发送`StatusNotificationRequest`，状态为Unavailable。
5. 充电站为==每个连接器==向CSMS发送`StatusNotificationRequest`。如果在（重新）启动之前CSMS将状态设置为Unavailable或Reserved，连接器应返回到该状态；否则，状态应为Available，或者==在恢复进行中的交易时，状态应为Occupied==。
6. 恢复正常运行。
7. 充电站向CSMS发送`HeartbeatRequest`。

![](../../../图片/Cold Boot Charging Station.png)

#### 冷启动充电站 - 待处理

1. 充电站上电。
2. 充电站向CSMS发送`BootNotificationRequest`。
3. CSMS响应`BootNotificationResponse`，状态为==Pending==。
4. CSMS随后能够向充电站发送消息，以更改充电站的配置。
5. 充电站在`BootNotificationResponse`中指示的秒数之后重新发送`BootNotificationRequest`。（来自`BootNotificationResponse`的间隔字段）

![](../../../图片/Cold Boot Charging Station - Pending.png)

#### 冷启动充电站 - 拒绝

1. 充电站上电。
2. 充电站向CSMS发送BootNotificationRequest。
3. CSMS以状态Rejected响应BootNotificationResponse给充电站。
4. 充电站将在BootNotificationResponse中指示的秒数之后重新发送BootNotificationRequest。（来自BootNotificationResponse的间隔字段）

![](../../../图片/Cold Boot Charging Station - Rejected.png)

#### 离线状态下的待机充电站行为

该用例描述了在通信不可用的情况下，充电站被设计为能够独立运行。在这种情况下，充电站被称为离线。

1. CSMS或通信不可用。
2. 充电站独立运行。
3. 连接恢复。
4. 如果离线期超过`OfflineThreshold`配置变量的值，充电站为每个连接器向CSMS发送`StatusNotificationRequest`。否则，它仅为离线期间状态发生变化的连接器发送`StatusNotificationRequest`。
5. 充电站向CSMS发送`HeartbeatRequest`。
6. CSMS响应`HeartbeatResponse`。

![](../../../图片/Offline Behavior Idle Charging Station.png)

### 配置充电站

#### 设置变量

充电站可以有许多可以由CSMS配置/更改的变量。CSMS可以使用这些变量来影响充电站的行为，例如，这个用例描述了CSMS如何请求充电站设置组件的变量值。CSMS可以请求在一个请求中设置多个值。

1. 充电站操作员触发CSMS请求在充电站中设置一个或多个变量。
2. CSMS向充电站发送`SetVariablesRequest`。
3. 充电站响应`SetVariablesResponse`，指示它是否能够执行更改。

![](../../../图片/Set Variables.png)

#### 获取变量

这个用例描述了CSMS如何请求充电站发送一个或多个组件的一个或多个变量的属性值。==无法在一次调用中获取所有变量的所有属性。==

1. 充电站操作员触发CSMS请求获取充电站中的一些变量。
2. CSMS使用包含所请求变量列表的`GetVariablesRequest`请求充电站的一些变量。
3. 充电站以`GetVariablesResponse`响应所请求的变量。
4. CSMS向CSO发送可选的通知。

![](../../../图片/Get Variables.png)

#### 获取基础报告

这个用例描述了CSMS请求充电站发送一个预定义报告的过程，该报告在ReportBase中定义。结果将异步返回，可能会在一个或多个NotifyReportRequest消息中返回。

1. 充电站操作员触发CSMS请求从充电站请求报告。
2. CSMS使用`GetBaseReportRequest`请求充电站的报告。
3. 充电站使用`GetBaseReportResponse`响应请求。
4. 充电站异步通过一个或多个`NotifyReportRequest`消息发送报告结果。
5. CSMS对每个`NotifyReportRequest`响应使用`NotifyReportResponse`。

![](../../../图片/Get Base Report.png)

#### 获取自定义报告

这个用例描述了CSMS如何请求充电站发送一个==包含所有==组件和变量报告的请求，==限定为匹配ComponentCriteria和/或ComponentVariables列表的变量==。结果将以一个或多个NotifyReportRequest消息的形式异步返回。

1. 充电站操作员触发CSMS请求从充电站请求报告。
2. CSMS使用`GetReportRequest`请求充电站报告。
3. 充电站使用`GetReportResponse`响应请求。
4. 充电站通过一个或多个`NotifyReportRequest`消息异步发送结果。
5. CSMS使用`NotifyReportResponse`响应。

![](../../../图片/get custom report.png)

#### 设置新的网络连接配置文件

在这个用例中，充电站管理系统（CSMS）更新充电站的连接详细信息，例如为准备迁移到新的CSMS。完成此用例后，已更新了充电站与CSMS之间的连接数据。

1. CSMS发送一个包含更新连接配置文件的`SetNetworkProfileRequest` PDU。
2. 充电站接收PDU，验证内容并存储新数据。
3. 充电站通过发送一个带有"Accepted"状态的`SetNetworkProfileResponse` PDU作出响应。

![](../../../图片/Set Network Connection Profile.png)

#### 迁移到新的CSMS

这个用例描述了如何通过更改NetworkConfigurationPriority中NetworkConnectionProfiles的顺序，来指示充电站连接到一个新的CSMS。

1. CSMS 1通过`SetVariablesRequest`设置了NetworkConfigurationPriority配置变量的新值，使得CSMS 2的NetworkConnectionProfile成为列表中的第一个，而现有的与CSMS 1的连接变为列表中的第二个。
2. 充电站以"Accepted"状态回应`SetVariablesResponse`。
3. CSMS 1指示充电站==在空闲时执行重置==（Reset OnIdle）。
4. 充电站==重新启动==，并通过新的主要NetworkConnectionProfile连接到CSMS 2。

![](../../../图片/Migrate to new ConnectionProfile.png)

### 重置充电站

#### 重置-没有正在进行的事务

这个用例描述了CSMS如何通过发送`ResetRequest`来请求充电站重置自身或EVSE（如果ResetRequest包含可选参数evseId，则仅请求特定EVSE的重置）。这可能是因为充电站未能正常运行而需要的情况。

1. CSO请求CSMS重置充电站或EVSE。
2. CSMS发送`ResetRequest`，请求充电站重置自身或EVSE。
3. CSMS请求执行OnIdle或Immediate重置。
4. 充电站以`ResetResponse`响应，指示充电站是否能够重置自身或EVSE。
5. CSMS向CSO发送可选的通知。
6. 仅当未提供evseId时，重置后，充电站将按照用例[B01](冷启动)继续执行。

![](../../../图片/Reset Without Transaction.png)

#### 重置-存在正在进行的充电事务

这个用例描述了CSMS如何通过发送`ResetRequest`来请求充电站重置自身或EVSE（如果ResetRequest包含可选参数evseId，则只请求特定EVSE的重置）。这可能是因为充电站未能正常运行。CSMS有两种可能性，==一种是让充电站自行结束所有交易并重新启动==，==另一种是等待所有正在进行的交易正常结束==（由EV用户结束）然后再重新启动。

1. CSO请求CSMS重置充电站或EVSE。
2. CSMS发送`ResetRequest`请求充电站自行重置或EVSE。

3a. 在收到OnIdle重置请求后，充电站响应`ResetResponse`（Scheduled），表示充电站将尝试在所有正在进行的交易结束后重置自身或EVSE。==充电站继续充电并将所有可用的EVSE（或仅在请求中提供evseId的情况下）设置为不可用状态==，等待所有交易完成并发送所有`TransactionEventRequest`（eventType = Ended）消息。
3b. 在收到Immediate重置请求后，充电站响应`ResetResponse`（Accepted），表示充电站将尝试自行重置自身或EVSE。充电站尝试终止正在进行的交易（或仅终止请求中提供evseId的EVSE上正在进行的交易），并发送`TransactionEventRequest`（eventType = Ended）消息。
4. 仅在没有提供evseId的情况下，充电站重新启动并返回到刚刚启动的状态，适用于B01 - 冷启动充电站。

![](../../../图片/Reset With Ongoing Transaction.png)
