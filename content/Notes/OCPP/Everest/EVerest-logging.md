---
date: "2025-03-10 15:54"
updated: "2025-03-10T17:26:00+08:00"
tags:
  - Everest
  - ocpp
publish: true
link: 
share: true
---

liblog 是 EVerest 框架的一个 C++ 日志和异常处理库,它基于 Boost.Log 提供了统一的日志基础设施。

# 主要功能

1. 提供了6个日志级别:

- VERBOSE
- DEBUG
- INFO
- WARNING
- ERROR
- CRITICAL

1. 支持配置化的日志格式和过滤
2. 支持彩色日志输出
3. 集成了异常处理机制

看起来并没有实现[日志回放功能](./EVerest-timer.md#日志回放功能)

# 使用方法

1. 首先需要初始化日志系统:

```cpp
// 初始化日志配置
Everest::Logging::init("logging.ini", "your_app_name");
```

2. 使用日志宏记录日志:

```cpp
EVLOG_verbose << "这是一条详细日志";
EVLOG_debug << "这是一条调试日志";
EVLOG_info << "这是一条信息日志";
EVLOG_warning << "这是一条警告日志"; 
EVLOG_error << "这是一条错误日志";
EVLOG_critical << "这是一条严重错误日志";
```

3. 配置文件示例 (logging.ini):

```ini
[Core]
DisableLogging=false
Filter="%Severity% >= DEBG"

[Sinks.Console]
Destination=Console
Format="%TimeStamp% %Process% [%Severity%] %Message%"
```

# 构建方法

```bash
mkdir build && cd build
cmake ..
make install
```

# 主要依赖

- Boost.Log
- CMake 3.11+
- C++17

这个库的优点是:

1. 配置灵活,可以通过 ini 文件配置日志格式和过滤规则
2. 支持彩色输出,提高日志可读性
3. 集成了异常处理,方便调试
4. 使用简单,通过宏提供了统一的接口

完整的示例代码可以参考:

```12:41:liblog/examples/main.cpp
int main(int argc, char* argv[]) {
    po::options_description desc("EVerest::log example");
    desc.add_options()("help,h", "produce help message");
    desc.add_options()("logconf", po::value<std::string>(), "The path to a custom logging.ini");

    po::variables_map vm;
    po::store(po::parse_command_line(argc, argv, desc), vm);
    po::notify(vm);

    if (vm.count("help") != 0) {
        std::cout << desc << "\n";
        return 1;
    }

    // initialize logging as early as possible
    std::string logging_config = "logging.ini";
    if (vm.count("logconf") != 0) {
        logging_config = vm["logconf"].as<std::string>();
    }
    Everest::Logging::init(logging_config, "hello there");

    EVLOG_debug << "logging_config was set to " << logging_config;

    EVLOG_verbose << "This is a VERBOSE message.";
    EVLOG_debug << "This is a DEBUG message.";
    EVLOG_info << "This is a INFO message.";
    EVLOG_warning << "This is a WARNING message.";
    EVLOG_error << "This is a ERROR message.";
    EVLOG_critical << "This is a CRITICAL message.";

```

# 堆栈跟踪

要使用 trace 功能，需要在 CMake 中启用 backtrace 支持：

```sh
cmake .. -DBUILD_BACKTRACE_SUPPORT=ON
```

## 工作原理

### 基本结构

使用了 libbacktrace 库来实现堆栈跟踪功能。关键组件包括：

```cpp
static backtrace_state* bt_state;
static bool tried_to_initialize;
static std::mutex init_mtx;
```

这些是关键的全局变量：
`bt_state`: 存储 backtrace 状态
`tried_to_initialize`: 标记是否尝试过初始化
`init_mtx`: 用于初始化过程的互斥锁

### 数据结构

```cpp
struct StackTrace {
    int frame_count{0};
    std::string info;
};

```

`StackTrace` 结构体用于存储堆栈信息：

- `frame_count`: 记录堆栈帧数量
- `info`: 存储格式化后的堆栈信息字符串

### 帧处理器

```cpp
inline int frame_handler(void* data, uintptr_t pc, const char* filename, int lineno, const char* function) {
    // FIXME(aw): we might have unknown frames everywhere in the call
    //            stack, it probably only make sense to skip the
    //            contigeous set of the top/root frames, that are all
    //            unknown
    // if ((filename == nullptr) && (lineno == 0) && (function == nullptr)) {
    //     return 1; // stop backtracing
    // }
    auto& trace = *static_cast<StackTrace*>(data);

    std::string function_name = "<function unknown>";
    if (function != nullptr) {
        // try to demangle
        int status;
        size_t length;

        auto demangled_function = __cxxabiv1::__cxa_demangle(function, nullptr, &length, &status);
        if (status == 0) {
            // successfully demangled
            function_name = std::string(demangled_function);
        } else {
            function_name = std::string(function);
        }
    }

    trace.info += ("#" + std::to_string(trace.frame_count) + ": ");
    trace.info += (function_name + " at ");
    trace.info += (filename != nullptr) ? filename : "<filename unknown>";
    trace.info += (":" + std::to_string(lineno));

    trace.info += "\n";

    trace.frame_count++;

    return 0; // continue backtracing
}
```

`frame_handler` 函数是核心处理函数，它：

1. 接收每个堆栈帧的信息
2. 尝试对函数名进行 mangle和demangle（转换 C++ 符号名）
3. 格式化堆栈信息
4. 将信息添加到 StackTrace 结构中

### 主要接口

```cpp
std::string trace() {
#ifdef WITH_LIBBACKTRACE
    {
        std::lock_guard<std::mutex> lck(init_mtx);
        if (!tried_to_initialize) {
            // 1 means support threaded
            bt_state = backtrace_create_state(nullptr, 1, nullptr, nullptr);
            tried_to_initialize = true;
        }
    }

    if (bt_state == nullptr) {
        return "Backtrace functionality not available\n";
    }

    StackTrace trace;

    // FIXME (aw): 1 means we're skipping this functions frame, can this
    //             be optimized away by the compiler, so we are going to
    //             miss the first frame?
    backtrace_full(bt_state, 1, frame_handler, nullptr, &trace);

    return trace.info;
#else
    return "Backtrace functionality not built in\n";
#endif
}
```

trace() 函数是主要接口：

1. 首次调用时初始化 backtrace 状态
2. 创建 StackTrace 对象
3. 调用 backtrace_full 获取完整堆栈
4. 返回格式化后的堆栈信息
