---
created: 2025-04-01T11:03:00+08:00
updated: 2025-04-02T14:16:00+08:00
tags:
  - Everest
link: "false"
share: "true"
---

# 基于buildroot 编译工具链交叉编译evest-core

## 编译步骤

#### cmake 交叉编译配置文件cross.cmake

文件中set(TOOLCHAIN_PATH /home/wyq/stm32/buildroot/output/host)需要改成ubuntu中工具链的位置，

cross.cmake文件放在everest-core下

```cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(CMAKE_VERBOSE_MAKEFILE ON)

set(TOOLCHAIN_PATH /home/wyq/stm32/buildroot/output/host)
set(CMAKE_C_COMPILER ${TOOLCHAIN_PATH}/bin/arm-buildroot-linux-gnueabihf-gcc)
set(CMAKE_CXX_COMPILER ${TOOLCHAIN_PATH}/bin/arm-buildroot-linux-gnueabihf-g++)

set(CMAKE_FIND_ROOT_PATH ${TOOLCHAIN_PATH}/arm-buildroot-linux-gnueabihf/sysroot/)

# for libraries and headers in the target directories

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)

set(Python3_NO_SYSTEM_PATHS ON)
set(Python3_EXECUTABLE ${TOOLCHAIN_PATH}/usr/bin/python3.11)
set(Python3_FIND_REGISTRY NEVER)
set(Python3_FIND_STRATEGY "LOCATION")
set(Python3_INCLUDE_DIR ${TOOLCHAIN_PATH}/usr/include/python3.11)
set(Python3_LIBRARIES ${TOOLCHAIN_PATH}/usr/lib/x86_64-linux-gnu/libpython3.10.so.1.0)
set(Python3_LIBRARY_DIRS ${TOOLCHAIN_PATH}/usr/lib/x86_64-linux-gnu)
#set(Python3_RUNTIME_LIBRARY_DIRS ${TOOLCHAIN_PATH}/../target/usr/lib)

set(NODEJS_INCLUDE_DIR ${TOOLCHAIN_PATH}/usr/include/node)
set(Boost_INCLUDE_DIR ${TOOLCHAIN_PATH}/arm-buildroot-linux-gnueabihf/sysroot/usr/include)
set(Boost_LIBRARY_DIR ${TOOLCHAIN_PATH}/arm-buildroot-linux-gnueabihf/sysroot/usr/lib)
set(Boost_NO_SYSTEM_PATHS ON)
#set(Boost_ADDITIONAL_VERSIONS "1.80.0")

```

#### make

```sh
//执行cmake命令

[~/dev/everest/workspace/everest-core/build]$ cmake  -DCMAKE_TOOLCHAIN_FILE=../cross.cmake -D_DEBUG=ON -DCMAKE_BUILD_TYPE=MinSizeRel -DEVEREST_ENABLE_PY_SUPPORT=OFF ..
//然后执行make，12是根据自己ubuntu的cpu核数来，加速编译 
[~/dev/everest/workspace/everest-core/build]$ make -j12 install    
//编译完成会在build下生成dist目录
[~/dev/everest/workspace/everest-core/build]$ ls
CMakeCache.txt              config                   dependencies.cmake             ev-dev-tools_pip_install_local_installed_0.4.3  Makefile
CMakeDoxyfile.in            CPackConfig.cmake        _deps                          everest-core-config.cmake                       modules
CMakeDoxygenDefaults.cmake  CPackSourceConfig.cmake  dist                           generated                                       release.json
CMakeFiles                  CPM_modules              dist_strip                     install_manifest.txt                            run-scripts
cmake_install.cmake         cpm-package-lock.cmake   Doxyfile.doxygen-everest-core  lib 
```

#### 裁剪符号表

由于设备空间问题，需要进一步裁剪文件的符号表，将strip.sh放在everest-core下，文件内容为

```
#!/bin/bash

# 检查参数数量
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <source_directory> <destination_directory> <strip_path>"
    exit 1
fi

# 获取参数
SOURCE_DIR="$1"
DEST_DIR="$2"
STRIP_PATH="$3"

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory $SOURCE_DIR does not exist."
    exit 1
fi

# 检查strip是否是可执行文件
if [ ! -x "$STRIP_PATH" ]; then
    echo "Error: Specified strip path $STRIP_PATH is not an executable."
    exit 1
fi

# 拷贝目录A到目录B
echo "Copying $SOURCE_DIR to $DEST_DIR..."
cp -a "$SOURCE_DIR" "$DEST_DIR"
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy directory."
    exit 1
fi

# 查找可执行文件和库文件
echo "Stripping executable and library files in $DEST_DIR using $STRIP_PATH..."
find "$DEST_DIR" -type f \( -perm -u+x -o -name "*.so" -o -name "*.a" \) | while read -r file; do
    if file "$file" | grep -q 'ELF'; then
        echo "Stripping: $file"
        "$STRIP_PATH" "$file"
        if [ $? -ne 0 ]; then
            echo "Warning: Failed to strip $file"
        fi
    fi
done

echo "Operation completed."
```

在build目录下，执行脚本`../strip.sh dist ./dist_strip ~~/stm32/buildroot/output/host/arm-buildroot-linux-gnueabihf/bin/strip`，`~~/stm32/buildroot/output/`需要替换为工具链位置，脚本会拷贝一份目标文件到dist_strip,并裁剪

```sh
[~/dev/everest/workspace/everest-core/build]$ ../strip.sh dist ./dist_strip ~/stm32/buildroot/output/host/arm-buildroot-linux-gnueabihf/bin/strip

Copying dist to ./dist_strip...
Stripping executable and library files in ./dist_strip using /home/xsk/stm32/buildroot/output/host/arm-buildroot-linux-gnueabihf/bin/strip...
Stripping: ./dist_strip/bin/yeti_fwupdate
Stripping: ./dist_strip/bin/controller
Stripping: ./dist_strip/bin/curl
Stripping: ./dist_strip/bin/manager
Stripping: ./dist_strip/bin/phyverso_cli
Stripping: ./dist_strip/lib/everest/everestpy/everest/framework/everestpy.cpython-311-x86_64-linux-gnu.so
Stripping: ./dist_strip/libexec/everest/modules/ExampleErrorRaiser/ExampleErrorRaiser
Stripping: ./dist_strip/libexec/everest/modules/TerminalCostAndPriceMessage/TerminalCostAndPriceMessage
Stripping: ./dist_strip/libexec/everest/modules/Auth/Auth
Stripping: ./dist_strip/libexec/everest/modules/DummyTokenProviderManual/DummyTokenProviderManual
Stripping: ./dist_strip/libexec/everest/modules/YetiEvDriver/YetiEvDriver
Stripping: ./dist_strip/libexec/everest/modules/Setup/Setup
Stripping: ./dist_strip/libexec/everest/modules/Store/Store
Stripping: ./dist_strip/libexec/everest/modules/DummyTokenValidator/DummyTokenValidator
Stripping: ./dist_strip/libexec/everest/modules/ExampleErrorSubscriber/ExampleErrorSubscriber
Stripping: ./dist_strip/libexec/everest/modules/PhyVersoBSP/PhyVersoBSP
Stripping: ./dist_strip/libexec/everest/modules/OCPP/OCPP
Stripping: ./dist_strip/libexec/everest/modules/ExampleUser/ExampleUser
Stripping: ./dist_strip/libexec/everest/modules/EvManager/EvManager
Stripping: ./dist_strip/libexec/everest/modules/OCPP201/OCPP201
Stripping: ./dist_strip/libexec/everest/modules/IsoMux/IsoMux
Stripping: ./dist_strip/libexec/everest/modules/Example/Example
Stripping: ./dist_strip/libexec/everest/modules/EvseSecurity/EvseSecurity
Stripping: ./dist_strip/libexec/everest/modules/EnergyManager/EnergyManager
Stripping: ./dist_strip/libexec/everest/modules/SerialCommHub/SerialCommHub
Stripping: ./dist_strip/libexec/everest/modules/EvseManager/EvseManager
Stripping: ./dist_strip/libexec/everest/modules/YetiDriver/YetiDriver
Stripping: ./dist_strip/libexec/everest/modules/DummyTokenProvider/DummyTokenProvider
Stripping: ./dist_strip/libexec/everest/modules/DummyBankSessionTokenProvider/DummyBankSessionTokenProvider
Stripping: ./dist_strip/libexec/everest/modules/API/API
Stripping: ./dist_strip/libexec/everest/modules/OCPPExtensionExample/OCPPExtensionExample
Stripping: ./dist_strip/libexec/everest/modules/ExampleErrorGlobalSubscriber/ExampleErrorGlobalSubscriber
Stripping: ./dist_strip/libexec/everest/modules/PersistentStore/PersistentStore
Stripping: ./dist_strip/libexec/everest/modules/System/System
Stripping: ./dist_strip/libexec/everest/modules/ErrorHistory/ErrorHistory
Stripping: ./dist_strip/libexec/everest/modules/UlChargeControl/UlChargeControl
Stripping: ./dist_strip/libexec/everest/modules/EnergyNode/EnergyNode
Operation completed.
```

#### 拷贝文件到板子

通过ssh将dist_strip下的文件拷贝到板子上，include不拷贝，dist_strip对应板子上的/，拷贝的文件会没有执行权限，需要赋权限

## 遇到过的问题（20241225编译未遇到）

#### apt更新cmake版本的办法：

添加签名密钥

```
wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | sudo apt-key add -
```

将存储库添加到您的源列表并进行更新,focal是20.04，1804是bionic

```
稳定版

sudo apt-add-repository 'deb https://apt.kitware.com/ubuntu/ focal main'
sudo apt-get update

候选发布版本
sudo apt-add-repository 'deb https://apt.kitware.com/ubuntu/ focal-rc main'
sudo apt-get update
```

```
sudo apt-get install cmake
```

原文链接：<https://blog.csdn.net/qq_26018075/article/details/104114107>

#### 未找到boost的filesystem和thread

原因：排查目录确实没有这两个库，查看buildroot ->package->boost->config.in,

依赖depends on BR2_TOOLCHAIN_SUPPORTS_ALWAYS_LOCKFREE_ATOMIC_INTS导致menuconfig中无此选项

临时措施：屏蔽config.in中depend 勾选相应库，重新编译

#### 问题 1

```
-- pybind11 v2.11.1 
CMake Warning (dev) at build/_deps/pybind11-src/tools/FindPythonLibsNew.cmake:99 (find_package):
  Policy CMP0148 is not set: The FindPythonInterp and FindPythonLibs modules
  are removed.  Run "cmake --help-policy CMP0148" for policy details.  Use
  the cmake_policy command to set the policy and suppress this warning.

Call Stack (most recent call first):
  build/_deps/pybind11-src/tools/pybind11Tools.cmake:50 (find_package)
  build/_deps/pybind11-src/tools/pybind11Common.cmake:188 (include)
  build/_deps/pybind11-src/CMakeLists.txt:210 (include)
This warning is for project developers.  Use -Wno-dev to suppress it.

-- Found PythonInterp: /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/bin/python3 (Required is at least version "3.26") 
CMake Error at build/_deps/pybind11-src/tools/FindPythonLibsNew.cmake:148 (message):
  Python config failure:


  /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/bin/python3:
  1: Syntax error: word unexpected (expecting ")")

Call Stack (most recent call first):
  build/_deps/pybind11-src/tools/pybind11Tools.cmake:50 (find_package)
  build/_deps/pybind11-src/tools/pybind11Common.cmake:188 (include)
  build/_deps/pybind11-src/CMakeLists.txt:210 (include)
```

在build/_deps/pybind11-src/tools/FindPythonLibsNew.cmake中将_

```
_find_package(PythonInterp ${PythonLibsNew_FIND_VERSION} ${_pythonlibs_required}
 ${_pythonlibs_quiet})
```

改为

```
find_package(Python3 ${PythonLibsNew_FIND_VERSION} ${_pythonlibs_required}
 ${_pythonlibs_quiet})
```

#### 问题 2

```
-- Adding admin-panel
-- Found nodejs version 'v18.19.1' that can provide Node-API version '8' which satifies the requirement of Node-API version '6'
-- Adding node-addon-api
CMake Error at /home/xsk/code/everest_workspace/everest-framework/everestjs/CMakeLists.txt:60 (find_path):
  Could not find NODEJS_INCLUDE_DIR using the following files: node_api.h


-- Configuring incomplete, errors occurred!
```

临时在cross.cmake 增加设置SET(NODEJS_INCLUDE_DIR /usr/include/node)，发现cmake后make会报错unsafe

```
erestjs.dir/everestjs.cpp.o -c /home/xsk/code/everest_workspace/everest-framework/everestjs/everestjs.cpp
arm-buildroot-linux-gnueabi-g++: ERROR: unsafe header/library path used in cross-compilation: '-I/usr/include/node'
make[2]: *** [_deps/everest-framework-build/everestjs/CMakeFiles/everestjs.dir/build.make:79: _deps/everest-framework-build/everestjs/CMakeFiles/everestjs.dir/everestjs.cpp.o] Error 1
make[2]: Leaving directory '/home/xsk/code/everest_workspace/everest-core/build'
make[1]: *** [CMakeFiles/Makefile2:3666: _deps/everest-framework-build/everestjs/CMakeFiles/everestjs.dir/all] Error 2
make[1]: Leaving directory '/home/xsk/code/everest_workspace/everest-core/build'
make: *** [Makefile:159: all] Error 2
```

还是要在buildroot中安装host-nodejs,由于

```
g --with-intl=system-icu --ninja
/home/xsk/9x60/buildroot-at91/output/build/host-nodejs-16.20.0/configure.py:8: DeprecationWarning: 'pipes' is deprecated and slated for removal in Python 3.13
  import pipes
Traceback (most recent call last):
  File "/home/xsk/9x60/buildroot-at91/output/build/host-nodejs-16.20.0/configure.py", line 14, in <module>
    import bz2
  File "/home/xsk/9x60/buildroot-at91/output/host/lib/python3.11/bz2.py", line 17, in <module>
    from _bz2 import BZ2Compressor, BZ2Decompressor
ModuleNotFoundError: No module named '_bz2'
make[1]: *** [package/pkg-generic.mk:283: /home/xsk/9x60/buildroot-at91/output/build/host-nodejs-16.20.0/.stamp_configured] Error 1
make: *** [Makefile:82: _all] Error 2
```

还是暂时使用x86的nodejs头文件拷贝至交叉编译头文件处

最后buildroot make clean后重新make，发现不再报_bz2的错误，而是报编译进程被杀死。将虚拟机内存从8G增加至12G编译通过。

#### cmake 出现报警交叉编译的依赖库路径被/usr/的目录隐藏，cmake成功后make 出现定义不完全。

cmake 有残留，删除build下的所有文件，重新cmake

#### 报错：找不到Python.h

cmake的Python解释器需要用主机的，库和头文件需要用目标机的

```
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(TOOLCHAIN_PATH /home/xsk/9x60/buildroot-at91/output/host)
set(CMAKE_C_COMPILER ${TOOLCHAIN_PATH}/bin/arm-buildroot-linux-gnueabi-gcc)
set(CMAKE_CXX_COMPILER ${TOOLCHAIN_PATH}/bin/arm-buildroot-linux-gnueabi-g++)
set(CMAKE_FIND_ROOT_PATH /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/)
# for libraries and headers in the target directories
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
#SET(NODEJS_INCLUDE_DIR /usr/include/node)
set(Python3_FIND_REGISTRY NEVER)
SET(Python3_FIND_STRATEGY "LOCATION")
SET(Python3_EXECUTABLE /usr/bin/python3)                                                                                                                                    
SET(Python3_INCLUDE_DIR /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/include/python3.11/)
SET(Python3_LIBRARY /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/lib/python3.11/)
#SET(PYTHON_LIBRARY_DIRS /home/xsk/9x60/buildroot/)
 #set(BOOST_ROOT /home/xsk/9x60/buildroot-at91/output/build/boost-1.78.0)
set(BOOST_INCLUDEDIR /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/include)
set(BOOST_LIBRARYDIR /home/xsk/9x60/buildroot-at91/output/host/arm-buildroot-linux-gnueabi/sysroot/usr/lib)
set(Boost_NO_SYSTEM_PATHS ON)
#set(Boost_ADDITIONAL_VERSIONS "1.78.0")
```

上述解决方案不对，经过查找，python也需要用交叉编译环境。过程如下

```
python3.11 -m pip install crossenv

export CC='/home/xsk/9x60/buildroot-at91/output/host/usr/bin/arm-linux-gcc'
export CFLAGS='-pthread'
export CXX='/home/xsk/9x60/buildroot-at91/output/host/usr/bin/arm-linux-g++'
export CXXFLAGS='-pthread'

~/code/EVerest1-workspace$python3.11 -m crossenv /home/xsk/9x60/buildroot-at91/output/host/usr/bin/python3.11 ~/my_cross_env
WARNING: CC is a compound command (['/home/xsk/9x60/buildroot-at91/output/host/bin/ccache', '/usr/bin/gcc', '-pthread'])
WARNING: This can cause issues for modules that don't expect it.
WARNING: Consider setting CC='/home/xsk/9x60/buildroot-at91/output/host/bin/ccache' and CFLAGS='/usr/bin/gcc -pthread'
WARNING: CXX is a compound command (['/home/xsk/9x60/buildroot-at91/output/host/bin/ccache', '/usr/bin/g++', '-pthread'])
WARNING: This can cause issues for modules that don't expect it.
WARNING: Consider setting CXX='/home/xsk/9x60/buildroot-at91/output/host/bin/ccache' and CXXFLAGS='/usr/bin/g++ -pthread'
#这里还是会有warning，原因还不明确

source ~/my_cross_env/bin/activate 
#激活交叉编译，按EVerest的要求pip安装
(cross) ~/code/EVerest1-workspace$cd ~/code/ocpp/everest-dev-environment/dependency_manager/
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$python3.11 -m pip install --upgrade pip setuptools wheel
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$python3.11 -m pip install .
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$export CPM_SOURCE_CACHE=$HOME/tmp/.cache/CPM
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$export PATH=$PATH:/home/$(whoami)/tmp/.local/bin
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$edm init --workspace ~/code/EVerest1-workspace/
(cross) ~/code/ocpp/everest-dev-environment/dependency_manager$cd ~/code/EVerest1-workspace/everest-utils/ev-dev-tools/
(cross) ~/code/EVerest1-workspace/everest-utils/ev-dev-tools$python3.11 -m pip install .
Processing /home/xsk/code/EVerest1-workspace/everest-utils/ev-dev-tools
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done
Requirement already satisfied: jinja2 in /home/xsk/my_cross_env/cross/lib/python3.11/site-packages (from ev-dev-tools==0.0.24) (3.1.3)
Collecting jsonschema (from ev-dev-tools==0.0.24)
  Using cached jsonschema-4.21.1-py3-none-any.whl.metadata (7.8 kB)
Collecting stringcase (from ev-dev-tools==0.0.24)
  Using cached stringcase-1.2.0-py3-none-any.whl
Requirement already satisfied: pyyaml in /home/xsk/my_cross_env/cross/lib/python3.11/site-packages (from ev-dev-tools==0.0.24) (6.0.1)
Requirement already satisfied: MarkupSafe>=2.0 in /home/xsk/my_cross_env/cross/lib/python3.11/site-packages (from jinja2->ev-dev-tools==0.0.24) (2.1.5)
Collecting attrs>=22.2.0 (from jsonschema->ev-dev-tools==0.0.24)
  Using cached attrs-23.2.0-py3-none-any.whl.metadata (9.5 kB)
Collecting jsonschema-specifications>=2023.03.6 (from jsonschema->ev-dev-tools==0.0.24)
  Using cached jsonschema_specifications-2023.12.1-py3-none-any.whl.metadata (3.0 kB)
Collecting referencing>=0.28.4 (from jsonschema->ev-dev-tools==0.0.24)
  Using cached referencing-0.33.0-py3-none-any.whl.metadata (2.7 kB)
Collecting rpds-py>=0.7.1 (from jsonschema->ev-dev-tools==0.0.24)
  Using cached rpds_py-0.18.0.tar.gz (25 kB)
  Installing build dependencies ... error
  error: subprocess-exited-with-error
  
  × pip subprocess to install build dependencies did not run successfully.
  │ exit code: 1
  ╰─> [47 lines of output]
      Collecting maturin<2.0,>=1.0
        Using cached maturin-1.4.0.tar.gz (177 kB)
        Installing build dependencies: started
        Installing build dependencies: finished with status 'done'
        Getting requirements to build wheel: started
        Getting requirements to build wheel: finished with status 'done'
        Preparing metadata (pyproject.toml): started
        Preparing metadata (pyproject.toml): finished with status 'done'
      Building wheels for collected packages: maturin
        Building wheel for maturin (pyproject.toml): started
        Building wheel for maturin (pyproject.toml): finished with status 'error'
        error: subprocess-exited-with-error
      
        × Building wheel for maturin (pyproject.toml) did not run successfully.
        │ exit code: 1
        ╰─> [25 lines of output]
            /tmp/pip-build-env-squotajf/overlay/lib/python3.11/site-packages/setuptools/config/_apply_pyprojecttoml.py:83: SetuptoolsWarning: `install_requires` overwritten in `pyproject.toml` (dependencies)
              corresp(dist, value, root_dir)
            running bdist_wheel
            running build
            running build_py
            creating build
            creating build/lib.linux-x86_64-cpython-311
            creating build/lib.linux-x86_64-cpython-311/maturin
            copying maturin/__init__.py -> build/lib.linux-x86_64-cpython-311/maturin
            copying maturin/import_hook.py -> build/lib.linux-x86_64-cpython-311/maturin
            copying maturin/__main__.py -> build/lib.linux-x86_64-cpython-311/maturin
            running egg_info
            creating maturin.egg-info
            writing maturin.egg-info/PKG-INFO
            writing dependency_links to maturin.egg-info/dependency_links.txt
            writing requirements to maturin.egg-info/requires.txt
            writing top-level names to maturin.egg-info/top_level.txt
            writing manifest file 'maturin.egg-info/SOURCES.txt'
            reading manifest file 'maturin.egg-info/SOURCES.txt'
            reading manifest template 'MANIFEST.in'
            warning: no files found matching '*.json' under directory 'src/python_interpreter'
            writing manifest file 'maturin.egg-info/SOURCES.txt'
            running build_ext
            running build_rust
            error: [Errno 2] No such file or directory: 'cargo'
            [end of output]
      
        note: This error originates from a subprocess, and is likely not a problem with pip.
        ERROR: Failed building wheel for maturin
      Failed to build maturin
      ERROR: Could not build wheels for maturin, which is required to install pyproject.toml-based projects
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.
error: subprocess-exited-with-error

× pip subprocess to install build dependencies did not run successfully.
│ exit code: 1
╰─> See above for output.

note: This error originates from a subprocess, and is likely not a problem with pip.
```

在主机上安装rust和cargo

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

然后在交叉编译环境中

```
(cross) ~/code/EVerest1-workspace/everest-utils/ev-dev-tools$ export CC_arm_unknown_linux_gnueabi=/home/xsk/9x60/buildroot-at91/output/host/bin/arm-buildroot-linux-gnueabi-gcc
(cross) ~/code/EVerest1-workspace/everest-utils/ev-dev-tools$export CARGO_TARGET_ARM_UNKNOWN_LINUX_GNUEABI_LINKER=/home/xsk/9x60/buildroot-at91/output/host/bin/arm-buildroot-linux-gnueabi-gcc
(cross) ~/code/EVerest1-workspace/everest-utils/ev-dev-tools$rustup target add arm-unknown-linux-gnueabi
info: downloading component 'rust-std' for 'arm-unknown-linux-gnueabi'
info: installing component 'rust-std' for 'arm-unknown-linux-gnueabi'
 20.6 MiB /  20.6 MiB (100 %)  20.2 MiB/s in  1s ETA:  0s
```

上面python crossenv的方法越折腾越麻烦。暂时先更改flags.make文件，增加include的目录，运行起来再看。

```
/home/xsk/code/everest_workspace/everest-core/build/_deps/everest-framework-build/everestpy/src/everest/CMakeFiles/everestpy.dir/flags.make
```
