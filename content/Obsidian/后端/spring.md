---
date created: 2024-10-28 18:11
date updated: 2024-10-31 17:04
tags:
  - spring
  - 后端
share: "true"
link: "false"
---

# 概述

## 介绍

Spring框架是企业使用最多的框架，没有之一。Spring是一站式框架，称之为一站式框架的原因是Spring可以整合其他框架。Spring主要用来开发Java应用，Spring 可以被看作是一个大型工厂。

Spring工厂的作用就是==生产和管理 Spring 容器中的Bean==，控制反转Spring IOC和面向切面编程Spring AOP，Spring 致力于Java应用各层的解决方案。

要学习Spring的内容如下：

- IoC：控制反转
- DI：[[../编程模型及方法/依赖注入|依赖注入]]
- Spring AOP：面向切面编程技术，为Spring事务管理打下基础。
- Spring Transaction management：Spring事务管理。
- Spring Web MVC（不包含在本课程内，后面单独学习）：简称Spring MVC框架，用来简化JavaWEB开发，当使用Spring MVC框架后，就不用再编写Servlet了。也就不再需要itcast-tools工具中BaseServlet类了。
- Spring与其他框架整合：因为我们只学习过MyBatis框架，所以当前我们只学习Spring整合MyBatis框架。

## spring优点

Spring优点主要表现会如下4点：
![image.png|450](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241031163127.png)

### 方便解耦

Spring的主要作用就是为代码解耦，降低代码间的耦合度。

Spring 提供了IOC控制反转，由容器管理对象，对象的依赖关系，现在由容器完成。

### AOP 编程的支持

通过 Spring 提供的 AOP功能，方便进行面向切面的编程。

### 支持声明式事务处理

通过配置就可以完成对事务的管理，无需手动编程，让开发人员可以从繁杂的事务管理代码中解脱出来，从而提高开发效率和质量。

### 方便集成各种优秀框架

Spring 不排斥各种优秀的开源框架，相反 Spring 可以降低各种框架的使用难度，Spring 提供了对各种优秀框架，比如：Struts、Hibernate、MyBatis、SpringBoot等的直接支持。

# Spring体系结构

Spring框架至今已集成了20多个模块，这些模块分布在以下模块中：

- 核心容器（Core Container）
- 数据访问/集成（Data Access/Integration）层
- Web层
- AOP（Aspect Oriented Programming）模块
- 植入（Instrumentation）模块
- 消息传输（Messaging）
- 测试（Test）模块

Spring体系结构如下图：

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241029104739.png)

## Spring Core核心容器

Spring的核心容器是其他模块建立的基础，由Spring-core、Spring-beans、Spring-context、Spring-context-support和Spring-expression（String表达式语言）等模块组成。

- Spring-core模块：提供了框架的基本组成部分，包括控制反转（Inversion of Control，IOC）和依赖注入（Dependency Injection，DI）功能。
- Spring-beans模块：提供了BeanFactory，是工厂模式的一个经典实现，==Spring将管理对象称为Bean==。
- Spring-context模块：建立在Core和Beans模块的基础之上，提供一个框架式的对象访问方式，是访问定义和配置的任何对象的媒介。ApplicationContext接口是Context模块的焦点。
- Spring-context-support模块：支持整合第三方库到Spring应用程序上下文，特别是用于高速缓存（EhCache、JCache）和任务调度（CommonJ、Quartz）的支持。Spring-expression模块：提供了强大的表达式语言去支持运行时查询和操作对象图。这是对JSP2.1规范中规定的统一表达式语言（Unified EL）的扩展。该语言支持设置和获取属性值、属性分配、方法调用、访问数组、集合和索引器的内容、逻辑和算术运算、变量命名以及从Spring的IOC容器中以名称检索对象。它还支持列表投影、选择以及常用的列表聚合。

核心容器提供Spring框架的基本功能，spring以bean的方式组织和管理Java应用的各个组件及其关系，spring使用BeanFactory来产生和管理Bean，是工厂模式的实现。

BeanFactory通过控制反转（IOC）模式将应用程序的配置和依赖性（类与类之间的关系）规范 与 实际的应用程序代码分开（尤指业务代码），从而降低了类与类之间的耦合度。

## AOP面向切面编程

Spring-aop模块：提供了一个符合AOP要求的面向切面的编程实现，允许定义方法拦截器和切入点，将代码按照功能进行分离，以便干净地解耦。
Spring-aspects模块：提供了与AspectJ的集成功能，AspectJ是一个功能强大且成熟的AOP框架。
AOP的实现原理为动态代理技术

## Spring Context模块

Spring上下文是一个配置文件，向spring提供上下文信息，spring上下文包括企业服务。

## Spring Web模块

Web层由Spring-web、Spring-webmvc、Spring-websocket和Portlet模块组成。

- Spring-web模块：提供了基本的Web开发集成功能，例如多文件上传功能、使用Servlet监听器初始化一个IOC容器以及Web应用上下文。
- Spring-webmvc模块：也称为Web-Servlet模块，包含用于web应用程序的Spring MVC和REST Web Services实现。Spring MVC框架提供了领域模型代码和Web表单之间的清晰分离，并与Spring Framework的所有其他功能集成。
- Spring-websocket模块：Spring4.0以后新增的模块，它提供了WebSocket和SocketJS的实现。
- Portlet模块：类似于Servlet模块的功能，提供了Portlet环境下的MVC实现。

## Spring [[../编程模型及方法/DAO|DAO]]模块

提供了一个[[../编程语言/Java/JDBC|JDBC]]的抽象层和异常层次结构，消除了烦琐的JDBC编码和数据库厂商特有的错误代码解析， 用于简化JDBC。

## Spring ORM模块

Spring插入了若干个[[../编程模型及方法/ORM|ORM]]框架，提供了ORM对象的关系工具，其中包括Hibernate，JDO和IBatisSQL Map等，所有这些都遵从Spring的通用事务和DAO异常层次结构

## Spring MVC模块

Sping [[../编程模型及方法/MVC|MVC]]框架是一个全功能的构建Web应用程序的MVC实现。

SpringMVC框架提供清晰的角色划分：控制器、验证器、命令对象、表单对象和模型对象、分发器、处理器映射和视图解析器，Spring支持多种视图技术。

Spring MVC 的工作流程：
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241031164254.png)
（1） 客户端发送请求，请求到达 DispatcherServlet 主控制器。
（2） DispatcherServlet 控制器调用 HandlerMapping 处理。
（3） HandlerMapping 负责维护请求和 Controller 组件对应关系。 HandlerMapping 根据请求调用对应的 Controller 组件处理。
（4） 执行 Controller 组件的业务处理，需要访问数据库，可以调用 DAO 等组件。
（5）Controller 业务方法处理完毕后，会返回一个 ModelAndView 对象。该组件封装了模型数据和视图标识。
（6）Servlet 主控制器调用 ViewResolver 组件，根据 ModelAndView 信息处理。定位视图资源，生成视图响应信息。
（7）控制器将响应信息给用户输出。

# 原理

## IoC

Spring IoC是Inversion of Control的缩写，多数书籍翻译成“控制反转”，它是Spring框架的核心。

Spring IOC用于==管理Java对象之间的依赖关系==，==将对象的创建、组装、管理交给框架来完成==，而不是由开发者手动完成。Spring提出了对象工厂的概念，由Spring工厂来管理对象的生命周期。所谓对象生命周期指的是==从对象的创建一直到对象的销毁都由Spring来管理==。我们无需再自己new对象，而是从Spring工厂中获取需要的对象。甚至**对象的依赖也由工厂来注入，无需手动注入依赖**。

IOC不是一种技术，只是一种思想，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。

传统应用程序都是由我们在类内部主动创建依赖对象，从而导致**类与类之间高耦合**，难于测试，有了IoC容器后，把创建和查找依赖对象的控制权交给了容器，如下图所示：
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241030173304.png)
上图引入了IOC容器，使得A、B、C、D这4个对象没有了耦合关系，齿轮之间的传动全部依靠“第三方”了，全部对象的控制权全部上缴给“第三方”IOC容器。

所以，IOC借助于“第三方”实现具有依赖关系的对象之间的解耦，使程序更优良。

Spring IOC的实现原理，如下图所示：
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241030175510.png)
IOC容器和对象的创建过程如下：

- 定义Bean：在配置文件或者类上使用注解定义Bean，例如@Component、@Service等。
- 实例化Bean：当应用程序需要使用Bean时，Spring容器会检查是否已经实例化该Bean，如果没有，则根据配置信息实例化该Bean。
- 组装Bean：Spring容器会检查该Bean是否有依赖关系，如果有，则将依赖的其他Bean注入到该Bean中。
- 提供Bean：Spring容器将实例化的Bean提供给应用程序使用。

## Spring依赖注入原理

[[../编程模型及方法/依赖注入|依赖注入]]（Dependency Injection，DI）是Spring框架的一个核心特性，它通过配置或者注解的方式，将一个对象依赖的其他对象注入进来。

如下图所示：
![image.png|500](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241030175939.png)
通过上图可以看出：依赖注入是实现控制反转（Inversion of Control，IoC）的一种具体实现方式。

在Spring中，实现依赖注入通常有三种方式：

1. 构造函数注入（Constructor Injection）：通过==对象的构造函数==来注入依赖对象。

2. 属性注入（Property Injection）：通过==对象的Setter方法==来注入依赖对象。

3. 接口注入（Interface Injection）：通过对象实现的接口来注入依赖对象。

## Spring AOP原理

Spring AOP （Aspect Orient Programming）,直译过来就是 ==面向切面编程==，AOP 是一种编程思想，是面向对象编程的一种补充。

面向切面编程，实现==在不修改源代码的情况下给程序动态统一添加额外功能的一种技术==，如下图所示：
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241030181027.png)
Spring AOP 实现 AOP 采用的是[[./动态代理|动态代理]]的方式，**通过代理对象实现对目标对象的方法进行拦截，从而达到切面的效果**。

在 Spring AOP 中，代理对象主要有两种类型：

JDK 动态代理：基于接口的代理实现，通过实现 JDK 的 InvocationHandler 接口来定义拦截器，并使用 Proxy 类生成代理对象。

CGLIB动态代理：基于类的代理实现，通过继承目标对象来实现代理，不需要目标对象实现任何接口。

Spring AOP的应用场景，例如：日志记录、性能监控、事务管理、权限验证等。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241031162631.png)

## spring事务原理

Spring事务管理有两种方式：**编程式事务管理**、**声明式事务管理**。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241031162720.png)
在 Spring 中，**声明式事务是通过 AOP 技术实现的**，当 Spring 容器加载时，它会为每个带有 @Transactional 注解的方法创建一个动态代理对象。

如下所示:

```java
@Transaction
public void insert(String userName){
    this.jdbcTemplate.update("insert into t_user (name) values (?)", userName);
}
```

Spring事务的本质其实就是Spring AOP和数据库事务，Spring 将数据库的事务操作提取为==切面==，通过AOP在方法执行前后增加数据库事务操作。
