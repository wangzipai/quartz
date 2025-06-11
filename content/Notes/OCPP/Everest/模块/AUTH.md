---
created: 2025-03-24T16:50:00+08:00
updated: 2025-03-24T16:54:00+08:00
tags:
  - Everest
link: false
share: true
---

# Auth模块架构图

```mermaid
classDiagram
    class Auth {
        +p_main: authImplBase*
        +p_reservation: reservationImplBase*
        +r_token_provider: vector~auth_token_providerIntf*~
        +r_token_validator: vector~auth_token_validatorIntf*~
        +r_evse_manager: vector~evse_managerIntf*~
        +r_kvs: vector~kvsIntf*~
        +auth_handler: AuthHandler*
        +init()
        +ready()
        +set_connection_timeout(int)
        +set_master_pass_group_id(string)
    }
    
    class AuthHandler {
        -selection_algorithm: SelectionAlgorithm
        -connection_timeout: int
        -master_pass_group_id: optional~string~
        -prioritize_authorization_over_stopping_transaction: bool
        -ignore_faults: bool
        -reservation_handler: ReservationHandler
        -evses: map~int, EVSEContext*~
        -plug_in_queue: list~int~
        -tokens_in_process: set~string~
        +on_token(ProvidedIdToken): TokenHandlingResult
        +handle_reservation(Reservation): ReservationResult
        +handle_cancel_reservation(int): pair~bool, optional~int32_t~~
        +handle_session_event(int, SessionEvent)
        +handle_permanent_fault_cleared(int, int32_t)
        +handle_permanent_fault_raised(int, int32_t)
    }
    
    class ReservationHandler {
        -evses: map~int, EVSEContext*~
        -evse_reservations: map~uint32_t, Reservation~
        -global_reservations: vector~Reservation~
        -reservation_id_to_reservation_timeout_timer_map: map~int, SteadyTimer*~
        +make_reservation(optional~uint32_t~, Reservation): ReservationResult
        +cancel_reservation(int, bool, ReservationEndReason): pair~bool, optional~uint32_t~~
        +is_evse_reserved(uint32_t): bool
        +is_charging_possible(uint32_t): bool
        +on_connector_state_changed(ConnectorState, uint32_t, uint32_t)
        +matches_reserved_identifier(string, optional~uint32_t~, optional~string~): optional~int32_t~
    }
    
    class EVSEContext {
        +evse_id: int32_t
        +evse_index: int32_t
        +transaction_active: bool
        +identifier: optional~Identifier~
        +connectors: vector~Connector~
        +timeout_timer: SteadyTimer
        +plugged_in: bool
        +plug_in_timeout: bool
        +is_available(): bool
        +is_unavailable(): bool
    }
    
    class Connector {
        +id: int
        +transaction_active: bool
        +state_machine: ConnectorStateMachine
        +type: ConnectorTypeEnum
        +submit_event(ConnectorEvent)
        +is_unavailable(): bool
        +get_state(): ConnectorState
    }
    
    class ConnectorStateMachine {
        -state: ConnectorState
        +handle_event(ConnectorEvent): bool
        +get_state(): ConnectorState
    }
    
    class Identifier {
        +id_token: IdToken
        +type: AuthorizationType
        +authorization_status: optional~AuthorizationStatus~
        +expiry_time: optional~string~
        +parent_id_token: optional~IdToken~
    }
    
    %% 枚举
    class ConnectorState {
        <<enumeration>>
        AVAILABLE
        UNAVAILABLE
        FAULTED
        OCCUPIED
        UNAVAILABLE_FAULTED
        FAULTED_OCCUPIED
    }
    
    class ConnectorEvent {
        <<enumeration>>
        ENABLE
        DISABLE
        ERROR_CLEARED
        FAULTED
        TRANSACTION_STARTED
        SESSION_FINISHED
    }
    
    class TokenHandlingResult {
        <<enumeration>>
        ACCEPTED
        ALREADY_IN_PROCESS
        REJECTED
        USED_TO_STOP_TRANSACTION
        TIMEOUT
        NO_CONNECTOR_AVAILABLE
    }
    
    %% 接口
    class auth_interface {
        <<interface>>
        +set_connection_timeout(int)
        +set_master_pass_group_id(string)
    }
    
    class reservation_interface {
        <<interface>>
        +handle_reservation(Reservation): ReservationResult
        +handle_reservation_exists(string, optional~int~, optional~string~): ReservationCheckStatus
        +handle_cancel_reservation(int32_t): pair~bool, optional~int32_t~~
    }
    
    class auth_token_provider_interface {
        <<interface>>
        +provided_token: ProvidedIdToken
    }
    
    class auth_token_validator_interface {
        <<interface>>
        +validate_token(ProvidedIdToken): ValidationResult
    }
    
    class evse_manager_interface {
        <<interface>>
        +get_evse(): Evse
        +authorize_response(ProvidedIdToken, ValidationResult)
        +withdraw_authorization()
        +reserve(int32_t): bool
        +cancel_reservation()
        +stop_transaction(StopTransactionRequest): bool
        +session_event: SessionEvent
    }
    
    %% 关系
    Auth --> AuthHandler
    Auth ..> auth_interface : implements
    Auth ..> reservation_interface : implements
    Auth ..> auth_token_provider_interface : requires
    Auth ..> auth_token_validator_interface : requires
    Auth ..> evse_manager_interface : requires
    
    AuthHandler --> ReservationHandler
    AuthHandler --> EVSEContext : manages
    
    EVSEContext --> Connector : contains
    EVSEContext --> Identifier : optional
    
    Connector --> ConnectorStateMachine
    ConnectorStateMachine --> ConnectorState
    ConnectorStateMachine --> ConnectorEvent : handles
    
    AuthHandler --> TokenHandlingResult
```

# Auth模块架构分析

Auth模块是Everest Core项目中负责认证处理和预约管理的核心模块。它管理**电动汽车充电过程中的认证、授权和预约功能**。

## 核心组件结构

### Auth类

- 作为模块入口点，实现了authImplBase和reservationImplBase接口
- 包含AuthHandler实例，负责处理具体的认证逻辑
- 在初始化时建立与其他模块的连接（token_provider、token_validator、evse_manager）

### AuthHandler类

- 负责处理认证、授权和处理会话事件
- 管理EVSEContext对象集合，表示充电桩的状态
- 包含ReservationHandler处理预约相关功能

### Connector和ConnectorStateMachine

- Connector: 表示物理连接器，包含状态机
- ConnectorStateMachine: 实现连接器的状态转换逻辑

### ReservationHandler

- 处理预约的创建、取消和状态管理
- 支持特定EVSE的预约和全局预约

## 主要对象和状态

### EVSE与Connector状态

- EVSE（充电桩）包含多个Connector（连接器）
- ConnectorState表示连接器的状态：
  - AVAILABLE: 可用
  - UNAVAILABLE: 不可用
  - FAULTED: 故障
  - OCCUPIED: 被占用
  - UNAVAILABLE_FAULTED: 不可用且故障
  - FAULTED_OCCUPIED: 故障且被占用

### 认证对象

- ProvidedIdToken: 由auth_token_provider提供的标识令牌
- ValidationResult: 验证结果
- Identifier: 验证后的标识信息

### 预约对象

- Reservation: 表示一个预约请求
- ReservationResult: 预约请求结果

## 工作流程

### 认证流程

```mermaid
sequenceDiagram
    participant TP as TokenProvider
    participant Auth
    participant AH as AuthHandler
    participant TV as TokenValidator
    participant EM as EvseManager
    
    TP->>Auth: provided_token
    Auth->>AH: on_token(provided_token)
    AH->>TV: validate_token(provided_token)
    TV-->>AH: ValidationResult
    
    alt token valid
        AH->>EM: authorize_response(provided_token, validation_result)
        EM-->>Auth: session_event(Authorized)
    else token invalid
        AH->>Auth: publish_token_validation_status(Rejected)
    end
```

### 预约处理流程

```mermaid
sequenceDiagram
    participant Client
    participant Auth
    participant RH as ReservationHandler
    participant EM as EvseManager
    
    Client->>Auth: handle_reservation(reservation)
    Auth->>RH: make_reservation(evse_id, reservation)
    
    alt reservation possible
        RH->>EM: call_reserved(reservation_id, evse_id)
        RH-->>Auth: ReservationResult(Accepted)
    else reservation not possible
        RH-->>Auth: ReservationResult(Rejected)
    end
```

### 状态管理

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE
    AVAILABLE --> UNAVAILABLE: DISABLE
    AVAILABLE --> FAULTED: FAULTED
    AVAILABLE --> OCCUPIED: TRANSACTION_STARTED
    
    UNAVAILABLE --> AVAILABLE: ENABLE
    UNAVAILABLE --> UNAVAILABLE_FAULTED: FAULTED
    
    FAULTED --> AVAILABLE: ERROR_CLEARED
    FAULTED --> FAULTED_OCCUPIED: TRANSACTION_STARTED
    
    OCCUPIED --> AVAILABLE: SESSION_FINISHED
    
    UNAVAILABLE_FAULTED --> UNAVAILABLE: ERROR_CLEARED
    UNAVAILABLE_FAULTED --> FAULTED: ENABLE
    
    FAULTED_OCCUPIED --> FAULTED: SESSION_FINISHED
    FAULTED_OCCUPIED --> OCCUPIED: ERROR_CLEARED
```

## 关键代码分析

### 令牌处理

```cpp
TokenHandlingResult AuthHandler::on_token(const ProvidedIdToken& provided_token) {
    // 加锁以确保线程安全
    std::unique_lock<std::mutex> lk(this->event_mutex);
    
    // 处理令牌
    return this->handle_token(provided_token, lk);
}
```

### 会话事件处理

```cpp
void AuthHandler::handle_session_event(const int evse_id, const SessionEvent& session_event) {
    // 处理充电过程中的会话事件
    // 如SessionStarted, TransactionStarted, ChargingStarted等
}
```

### 状态转换

```cpp
bool ConnectorStateMachine::handle_event(ConnectorEvent event) {
    // 根据事件和当前状态转换到新状态
    // 例如: AVAILABLE → OCCUPIED (当TRANSACTION_STARTED事件发生)
}
```

## 配置选项

Auth模块支持多种配置选项：

1. **selection_algorithm**: 选择算法，决定如何为令牌选择连接器
   - FindFirst: 选择第一个可用连接器
   - PlugEvents: 基于插入事件选择连接器

2. **connection_timeout**: 连接超时（秒）

3. **master_pass_group_id**: 主通行证组ID，拥有这个ID的令牌可以停止任何交易

4. **prioritize_authorization_over_stopping_transaction**: 授权优先级配置

5. **ignore_connector_faults**: 是否忽略连接器故障

# 总结

Auth模块是Everest Core项目中负责认证、授权和预约的关键模块，实现了充电站身份验证和预约系统的核心功能。它使用状态机管理连接器状态，通过回调机制与其他模块交互，并支持多种认证和预约策略。

该模块的设计体现了面向对象和事件驱动的编程范式，通过清晰的接口定义、状态管理和回调机制，实现了充电认证系统的复杂需求。
