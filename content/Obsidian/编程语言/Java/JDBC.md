---
date created: 2024-10-31 16:55
date updated: 2024-10-31 16:57
tags:
  - java
  - 数据库
share: "true"
link: "false"
---

**JDBC**（Java Database Connectivity）是Java语言中的一套API，用于与各种数据库进行交互。它提供了一种标准的方法来连接、查询、更新和管理数据库中的数据。以下是一些关于JDBC的基本概念和功能：

### 主要功能

1. **连接数据库**：JDBC允许Java应用程序与数据库建立连接。通过提供数据库的URL、用户名和密码，可以连接到特定的数据库实例。

2. **执行SQL语句**：一旦建立连接，JDBC可以执行SQL查询（例如`SELECT`）、插入（`INSERT`）、更新（`UPDATE`）和删除（`DELETE`）等操作。

3. **处理结果**：执行SQL语句后，JDBC会返回结果集（ResultSet），你可以通过它读取查询结果。

4. **事务管理**：JDBC支持事务操作，可以通过commit和rollback来管理数据库的状态。

### JDBC的组成部分

1. **JDBC驱动**：驱动是连接特定数据库的实现，负责处理与数据库的实际交互。根据不同的数据库类型，有不同的JDBC驱动（例如，MySQL、PostgreSQL、Oracle等）。驱动通常有四种类型：
   - **类型 1**：JDBC-ODBC桥接驱动（不推荐使用）
   - **类型 2**：本地API驱动
   - **类型 3**：网络协议驱动
   - **类型 4**：纯Java驱动（推荐使用，通常是最常用的）

2. **Connection**：表示与数据库的连接，可以用来创建Statement对象。

3. **Statement**：用于执行SQL语句的对象，有几种不同的类型：
   - `Statement`：用于执行简单的SQL语句。
   - `PreparedStatement`：用于执行预编译的SQL语句，更高效且可防止SQL注入。
   - `CallableStatement`：用于执行存储过程。

4. **ResultSet**：表示查询结果的数据集，允许遍历结果集中的记录。

### 基本使用示例

下面是一个简单的JDBC示例，展示如何连接到数据库并执行查询：

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JdbcExample {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/your_database";
        String user = "your_username";
        String password = "your_password";

        try {
            // 1. 加载驱动
            Class.forName("com.mysql.cj.jdbc.Driver");

            // 2. 建立连接
            Connection connection = DriverManager.getConnection(url, user, password);

            // 3. 创建Statement
            Statement statement = connection.createStatement();

            // 4. 执行查询
            String sql = "SELECT * FROM users";
            ResultSet resultSet = statement.executeQuery(sql);

            // 5. 处理结果
            while (resultSet.next()) {
                System.out.println("User ID: " + resultSet.getInt("id"));
                System.out.println("Username: " + resultSet.getString("username"));
            }

            // 6. 关闭连接
            resultSet.close();
            statement.close();
            connection.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 总结

JDBC是Java程序与数据库交互的重要工具，它提供了统一的接口来处理不同数据库的操作，使得Java开发者能够轻松地执行数据库相关的任务。
