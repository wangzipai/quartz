---
created: "2025-03-31T16:21:00+08:00"
updated: "2025-04-02T14:35:00+08:00"
tags:
  - Everest
link: "false"
share: "true"
---

以 libocpp 库为例

# 依赖定义和链接

- 在 `module-dependencies.cmake` 文件中，通过 `ev_define_dependency` 函数定义了 OCPP 和 OCPP201 模块依赖于 libocpp

```cmake
ev_define_dependency(
    DEPENDENCY_NAME libocpp
    DEPENDENT_MODULES_LIST OCPP OCPP201)
```

- 在 OCPP 和 OCPP201 模块的 CMakeLists.txt 中，使用 `target_link_libraries` 命令链接了 libocpp 相关库:

```cmake
target_link_libraries(${MODULE_NAME}
    PRIVATE
        OpenSSL::SSL
        OpenSSL::Crypto
        everest::ocpp
        everest::ocpp_evse_security
        everest::ocpp_conversions
        everest::external_energy_limits
)
```

# 头文件引用

- OCPP 模块引入了 libocpp 的 v16 版本的头文件:

```cpp
#include <ocpp/common/types.hpp>
#include <ocpp/v16/charge_point.hpp>
#include <ocpp/v16/types.hpp>
#include <ocpp/v2/ocpp_types.hpp>
```

- OCPP201 模块引入了 libocpp 的 v2 版本的头文件:

```cpp
#include <ocpp/v2/charge_point.hpp>
```

# 实例化和使用

- 每个模块创建了一个 ChargePoint 类的实例:
  - OCPP 模块: `std::unique_ptr<ocpp::v16::ChargePoint> charge_point;`
  - OCPP201 模块: `std::unique_ptr<ocpp::v2::ChargePoint> charge_point;`
- 在初始化代码中，注册了回调函数，将 libocpp 的事件和命令与 everest 内部的函数连接起来:

```cpp
this->charge_point->register_pause_charging_callback([this](int32_t connector) {
    // 代码实现
});

this->charge_point->register_resume_charging_callback([this](int32_t connector) {
    // 代码实现
});

// 更多回调注册...
```

# 事件处理

- OCPP 模块监听来自 everest 其他模块的事件，并转发给 libocpp:

```cpp
evse->subscribe_session_event([this, evse_id](types::evse_manager::SessionEvent session_event) {
    // 处理会话事件并调用 ChargePoint 的方法
    this->charge_point->on_transaction_started(...)
    // 更多处理...
});
```

# 类型转换

- 使用 conversion 工具函数在 everest 内部类型和 OCPP 类型之间转换:

```cpp
conversions::to_ocpp_log_status_enum(status.log_status)
conversions::to_everest_upload_logs_request(request)
```

# 状态通知

- 将 OCPP 状态通知转发到系统的其他部分:

```cpp
this->r_system->subscribe_log_status([this](types::system::LogStatus log_status) {
    this->charge_point->on_log_status_notification(...)
});
```

# 总结

总之，everest-core 通过以下方式调用和集成 libocpp:

1. 在构建系统中将 libocpp 定义为依赖并链接
2. 创建 libocpp ChargePoint 类的实例
3. 注册回调函数以处理 OCPP 命令
4. 捕获系统事件并通过调用 ChargePoint 实例的方法通知 libocpp
5. 使用转换函数在 everest 内部数据类型和 OCPP 数据类型之间转换

这种架构实现了清晰的职责分离:

- libocpp 负责 OCPP 协议实现
- everest-core 集成 libocpp 并将其连接到充电站的各个组件和模块
