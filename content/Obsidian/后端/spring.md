---
date created: 2024-10-28 18:11
date updated: 2024-10-29 17:46
tags:
  - spring
  - 后端
share: "true"
---

# 概述

## 介绍

Spring框架是企业使用最多的框架，没有之一。Spring是一站式框架，称之为一站式框架的原因是Spring可以整合其他框架。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241029104739.png)

要学习Spring的内容如下：

- IoC：控制反转
- DI：[[../编程模型及方法/依赖注入|依赖注入]]
- Spring AOP：面向切面编程技术，为Spring事务管理打下基础。
- Spring Transaction management：Spring事务管理。
- Spring Web MVC（不包含在本课程内，后面单独学习）：简称Spring MVC框架，用来简化JavaWEB开发，当使用Spring MVC框架后，就不用再编写Servlet了。也就不再需要itcast-tools工具中BaseServlet类了。
- Spring与其他框架整合：因为我们只学习过MyBatis框架，所以当前我们只学习Spring整合MyBatis框架。

# 原理

## IoC

Spring IoC是Inversion of Control的缩写，多数书籍翻译成“控制反转”，它是Spring框架的核心。

Spring IOC用于==管理Java对象之间的依赖关系==，==将对象的创建、组装、管理交给框架来完成==，而不是由开发者手动完成。

IOC不是一种技术，只是一种思想，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。

传统应用程序都是由我们在类内部主动创建依赖对象，从而导致**类与类之间高耦合**，难于测试，有了IoC容器后，把创建和查找依赖对象的控制权交给了容器，如下图所示：

Spring IoC的核心如下：

- 工厂负责对象生命周期的管理；（spring管理创建与销毁）
- 对象的依赖由工厂完成注入。（spring维护对象间关系）

Spring提出了对象工厂的概念，由Spring工厂来管理对象的生命周期。所谓对象生命周期指的是==从对象的创建一直到对象的销毁都由Spring来管理==。我们无需再自己new对象，而是从Spring工厂中获取需要的对象。甚至**对象的依赖也由工厂来注入，无需手动注入依赖**。

Spring工厂是ApplicationContext接口，通常我们使用的是AnnotationConfigApplicationContext类。其中Spring工厂内部是通过Map类型来维护的。

| Key                                     | value         |
| --------------------------------------- | ------------- |
| “userDao1”                              | UserDao实例     |
| “userService1”                          | UserService实例 |
| ...                                     | ...           |
| 当我们需要获取工厂中的实例时，只需要调用工厂的getBean(“id”)即可。 |               |
| ```java                                 |               |
| @Test	public void test3() {             |               |

```java

@Test	public void test3() { 
	AnnotationConfigApplicationContext context = ...		
	UserDao userDao = (UserDao) context.getBean("userDao1");
}
```

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241028181943.png)
