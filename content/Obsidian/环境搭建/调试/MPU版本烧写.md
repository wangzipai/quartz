---
date: 2024-11-25 16:10
share: "true"
link: "false"
updated: 2024-12-03 21:46
---

# 方法一、仅使用于烧写过版本板子，新板子不适用

uboot下tftp烧写 (以太网接eth2) ,需要PC有tftp服务器

启机进uboot 看到Autoboot in 3 seconds字样狂按ctrl +c

```sh
Boot over spi-nand0!
STM32MP> <INTERRUPT>
STM32MP> <INTERRUPT>
STM32MP> <INTERRUPT>
STM32MP>
STM32MP>
STM32MP>
STM32MP>
STM32MP> setenv ipaddr 192.168.137.109
STM32MP>ping 192.168.137.53
```

如果提示没有网口，需要设置下

```sh
setenv ethaddr 10:e7:7a:e1:a2:96
```

ping通提示alive就开始烧写

```sh
STM32MP> tftpboot 0xd0000000 192.168.137.53:rootfs.ubi
Using eth1@5800a000 device
TFTP from server 192.168.137.53; our IP address is 192.168.137.109
Filename 'rootfs.ubi'.
Load address: 0xd0000000
Loading: #################################################  107 MiB
        2.5 MiB/s
done
Bytes transferred = 112197632 (6b00000 hex)
​
STM32MP> mtd erase UBI
Erasing 0x00000000 ... 0x1eefffff (1980 eraseblock(s))
Skipping bad block at 0x02900000
Skipping bad block at 0x05680000
Skipping bad block at 0x08400000
Skipping bad block at 0x0b180000
Skipping bad block at 0x0df00000
Skipping bad block at 0x10c80000
Skipping bad block at 0x13a00000
Skipping bad block at 0x16780000
Skipping bad block at 0x19500000
Skipping bad block at 0x1c280000
STM32MP> mtd write UBI 0xd0000000 0X0 0x6b00000             ##0X6b00000是包的大小 tftpboot命令结束会提示hex大小
Writing 112197632 byte(s) (27392 page(s)) at offset 0x00000000
STM32MP> reset
```

# 方法二、适用于任何板子

1. 需要接飞线接USB，~~让硬件帮忙飞下~~，改版后直接接烧写小板。![image.png|375](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161324.png)

2. 去stm32官网下载安装STM32CubeProgrammer
   <https://www.st.com/en/development-tools/stm32cubeprog.html#get-software>

3. usb接入电脑，新板子要接串口，3个boot脚短接
   ![|300](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161548.png)

打开软件 ，port 选择加入的USB, connect
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161624.png)
![image.png|400](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161646.png)
选择对应版本下的tsv文件
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161704.png)
![image.png|700](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241125161730.png)
**旧版子烧写完重启就行了**

**仅新板子烧写需要，不是新板子不要进行下面的操作，**

```sh
# 升级完成后打开串口按ctrl +c
STM32MP> <INTERRUPT>
STM32MP> fuse prog -y 0 9 20400000
Programming bank 0 word 0x00000009 to 0x20400000...
STM32MP> reset
resetting ...
```
