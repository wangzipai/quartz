---
date: 2025-03-13 15:13
updated: 2025-03-14 14:25
tags:
  - Everest
link: "false"
share: "true"
---

manager程序的主要源码位于everest-framework/src/manager.cpp，是EVerest框架的核心组件，它担任着整个系统的"管理员"角色，==负责协调和控制各个模块的运行==。

```mermaid
graph LR
    A[run-sil-ocpp.sh脚本执行] -->|传递配置参数| B[manager程序启动]
    B -->|main函数| C[解析命令行参数]
    C -->|boot函数| D[创建ManagerSettings]
    D[创建ManagerSettings] --> Z[..]
```

```mermaid
graph LR
    D[创建ManagerSettings] -->|构造函数| E[创建ManagerConfig]
    E -->|parse配置| F[加载YAML配置]
    F[加载YAML配置] --> Z[..]
```

```mermaid
graph LR
    F[加载YAML配置] -->|load_yaml| G[解析模块清单]
    G -->|load_and_validate_manifest| H[验证接口和类型]
    H -->|start_modules| I[启动各个模块]
    I --> Z[..]
```

```mermaid
graph LR
    I[启动各个模块] -->|fork/exec| J[创建子进程]
    J -->|waitpid| K[监控模块状态]
    K -->|信号处理| L[处理异常情况]
    L -->|循环| K
```

具体功能包括：

1. 配置加载与验证：
   - **加载YAML配置文件**(如config-sil-ocpp.yaml)
   - 验证**配置文件的有效性**
   - 解析配置内容，准备模块启动
2. 模块管理：
   - 根据配置**启动所需的所有模块**
   - 监控模块的运行状态
   - 处理模块异常退出的情况
   - 支持模块的重启
3. 通信协调：
   - 设置MQTT通信环境
   - 发布系统配置、类型定义、接口定义等信息
   - 建立模块间的通信通道
4. 系统管理：
   - 权限控制和安全管理
   - 处理系统信号
   - 提供状态更新和日志记录

# 程序入口和参数解析

当执行run-sil-ocpp.sh脚本时，会启动manager程序并传递配置文件路径。程序从main函数开始：

```cpp
// manager.cpp:860
int main(int argc, char* argv[]) {
    po::options_description desc("EVerest manager");
    desc.add_options()("help,h", "produce help message");
    // ...
    desc.add_options()("config", po::value<std::string>(),
                       "Full path to a config file.");
    // ...
    
    po::variables_map vm;
    try {
        po::store(po::parse_command_line(argc, argv, desc), vm);
        po::notify(vm);
        
        // ...
        
        return boot(vm); // 主要启动逻辑在boot函数中
    } catch (const std::exception& e) {
        EVLOG_error << "Main manager process exits because of caught exception:\n" << e.what();
        return EXIT_FAILURE;
    }
}
```

# 配置加载过程

boot函数负责创建ManagerSettings和ManagerConfig对象，加载和验证配置：

```cpp
// manager.cpp 中的boot函数片段
int boot(const po::variables_map& vm) {
    // ...
    
    const auto start_time = std::chrono::system_clock::now();
    std::unique_ptr<ManagerConfig> config;
    try {
        config = std::make_unique<ManagerConfig>(ms); // 创建配置对象
    } catch (EverestInternalError& e) {
        EVLOG_error << fmt::format("Failed to load and validate config!\n{}", 
                                  boost::diagnostic_information(e, true));
        return EXIT_FAILURE;
    }
    const auto end_time = std::chrono::system_clock::now();
    EVLOG_info << "Config loading completed in "
               << std::chrono::duration_cast<std::chrono::milliseconds>(end_time - start_time).count() << "ms";
    
    // ...
}
```
