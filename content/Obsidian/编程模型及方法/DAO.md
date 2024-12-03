---
date: 2024-10-31 16:48
updated: 2024-12-03 21:44
tags:
  - 设计模式
share: "true"
link: "false"
---

# 什么是DAO？

**DAO** （Data Access Object数据访问对象）是一个设计模式，用于==处理程序与数据源之间的交互==。数据源可以是数据库、文件系统或其他存储系统。DAO的主要作用是将业务逻辑（你的应用程序的主要功能）与数据访问逻辑（如何存取数据）分开。

# 为什么要使用DAO？

## 分离关注点

将业务逻辑与数据访问逻辑分开，使代码更加清晰和易于维护。你可以专注于实现业务功能，而不必关心如何存取数据。

## 方便更改

如果需要更换数据源（例如，从MySQL换成PostgreSQL），只需修改DAO的实现，不用更改业务逻辑。

## 提高可测试性

使用DAO模式，你可以创建模拟对象来测试业务逻辑，而无需连接真实的数据库。这**使得单元测试更加简单和高效**。

# DAO的组成部分

一个典型的DAO结构通常包括以下几个部分：

## DAO接口

定义数据访问的方法，例如：

```java
public interface UserDAO {
    void create(User user);
    User read(int id);
    void update(User user);
    void delete(int id);
}
```

## DAO实现类

实现上述接口，并包含具体的数据访问逻辑。例如，使用[[../编程语言/Java/JDBC|JDBC]]来连接数据库：

```java
public class UserDAOImpl implements UserDAO {
    @Override
    public void create(User user) {
        // 代码来插入用户到数据库
    }

    @Override
    public User read(int id) {
        // 代码来从数据库读取用户
        return user;
    }

    @Override
    public void update(User user) {
        // 代码来更新用户信息
    }

    @Override
    public void delete(int id) {
        // 代码来删除用户
    }
}
```

## 业务逻辑层

调用DAO接口来执行操作。它不需要知道具体的实现细节：

```java
public class UserService {
    private UserDAO userDAO;

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public void registerUser(User user) {
        userDAO.create(user);
    }
}
```

# 总结

DAO模式的核心思想是通过一个抽象层（DAO接口）与具体实现（DAO实现类）分离数据访问逻辑，使得代码更加模块化和可维护。理解这一模式能更好地构建应用程序，并能在以后的项目中更灵活地处理数据。
