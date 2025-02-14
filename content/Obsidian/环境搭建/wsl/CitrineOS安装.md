---
date: 2025-01-21 09:50
updated: 2025-02-14 14:21
link: "false"
share: "true"
---

# 下载代码

```sh
git clone https://github.com/citrineos/citrineos-core
```

# citrineos-operator-ui

使用npm直接安装时，directus无法使用时安装的，用docker不需要这个步骤，直接访问8055端口。

## rabbitmq-server

### 安装

```sh
sudo apt-get install -y rabbitmq-server
```

### 打开

```sh
sudo systemctl start rabbitmq-server
```

## PostgreSQL

### 安装

还要下载postgis插件。。不提前说，太傻逼了。

```sh
sudo apt-get install postgresql-17
sudo apt install postgis
sudo apt install postgresql-17-postgis-3
```

### 打开

```sh
sudo systemctl enable --now postgresql
```

### 查看状态

```sh
# wyq @ wangyq in ~/citrineos-core/Server on git:main x [10:20:16]
$ sudo systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; preset: disabled)
     Active: active (exited) since Tue 2025-01-21 09:55:35 CST; 25s ago
 Invocation: 7b2162ad244c43e9bad1b180eee3092b
    Process: 17635 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
   Main PID: 17635 (code=exited, status=0/SUCCESS)

Jan 21 09:55:35 wangyq systemd[1]: Starting postgresql.service - PostgreSQL RDBMS...
Jan 21 09:55:35 wangyq systemd[1]: Finished postgresql.service - PostgreSQL RDBMS.
```

### 创建账户

```sh
# wyq @ wangyq in ~/citrineos-core/Server on git:main x [10:42:56] C:1
$ sudo -i -u postgres
┏━(Message from Kali developers)
┃
┃ This is a minimal installation of Kali Linux, you likely
┃ want to install supplementary tools. Learn how:
┃ ⇒ https://www.kali.org/docs/troubleshooting/common-minimum-setup/
┃
┗━(Run: “touch ~/.hushlogin” to hide this message)
postgres@wangyq:~$ psql
psql (17.2 (Debian 17.2-1), server 16.3 (Debian 16.3-1+b1))
Type "help" for help.

postgres=# CREATE USER citrine WITH PASSWORD 'citrine';
CREATE ROLE
postgres=# CREATE DATABASE citrine owner citrine;
CREATE DATABASE
postgres=# GRANT ALL PRIVILEGES ON DATABASE citrine TO citrine;
GRANT
postgres=# \c citrine;
You are now connected to database "citrine" as user "postgres".
citrine=# CREATE EXTENSION postgis;
CREATE EXTENSION
```

# 使用

## citrineos-operator-ui

```sh
# wyq @ wangyq in ~/citrineos/citrineos-core-1.5.0/Server [15:57:06]
$ docker compose up -d
[+] Running 4/4
 ⠿ Container server-ocpp-db-1      Healthy                                                                         7.1s
 ⠿ Container server-amqp-broker-1  Healthy                                                                        11.6s
 ⠿ Container server-directus-1     Healthy                                                                        17.0s
 ⠿ Container server-citrine-1      Started                                                                        17.4s

# wyq @ wangyq in ~/citrineos/citrineos-core-1.5.0/Server [15:57:26]
$ docker compose up -d graphql-engine data-connector-agent
no such service: graphql-engine

# wyq @ wangyq in ~/citrineos/citrineos-core-1.5.0/Server [15:57:41] C:1
$ cd ../citrineos-operator-ui/

# wyq @ wangyq in ~/citrineos/citrineos-core-1.5.0/citrineos-operator-ui on git:main x [15:57:52]
$ docker compose up -d graphql-engine data-connector-agent
[+] Running 2/2
 ⠿ Container citrineos-operator-ui-data-connector-agent-1  Healthy                                                 5.8s
 ⠿ Container citrineos-operator-ui-graphql-engine-1        S...                                                    6.2s

# wyq @ wangyq in ~/citrineos/citrineos-core-1.5.0/citrineos-operator-ui on git:main x [15:58:00]
$ npm run dev

> citrineos-refine@0.1.0 dev
> refine dev

╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                     │
│   — Refine Devtools beta version is out! To install in your project, just run npm run refine devtools init.         │
│   https://s.refine.dev/devtools-beta                                                                                │
│                                                                                                                     │
│   — Hello from Refine team! Hope you enjoy! Join our Discord community to get help and discuss with other users.    │
│   https://discord.gg/refine                                                                                         │
│                                                                                                                     │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

✗ Refine Devtools server (http) failed to start. Port 5001 is already in use.

ℹ You can change the port by setting the REFINE_DEVTOOLS_PORT environment variable.

✗ Refine Devtools server (websocket) failed to start. Port 5001 is already in use.

Port 5173 is in use, trying another one...

  VITE v4.5.5  ready in 372 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose

```

## EVerest

### 拉取代码

```sh
git clone https://github.com/EVerest/everest-demo.git
cd everest-demo
```

### 添加充电桩

```sh
./citrineos/add-charger.sh
```

### 开启模拟

```sh
bash demo-ac.sh -c -1
```

-c：使用citrineos
-1：profile 1

## 查看log

```sh
docker cp everest-ac-demo-manager-1:/tmp/everest_ocpp_logs /mnt/d/
```

## 发送指令

感觉需要二次封装，拜拜不看了
