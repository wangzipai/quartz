---
date created: 2024-10-10 10:28
date updated: 2024-10-31 17:05
tags:
  - 架构
share: "true"
link: "false"
updated: 2024-12-19 20:13
---

MVVM 模式作为一种先进的架构模式，为我们提供了一种==将数据、业务逻辑和用户界面分离==的解决方案。它强调数据驱动，通过双向数据绑定简化了界面与数据的交互，使得开发者能够更专注于业务逻辑的实现。本文旨在解析 MVVM 模式的原理和应用，帮助读者更好地理解其核心概念，掌握其在实际项目中的使用方法。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241010103108.png)

# 什么是 MVVM 模式

MVVM 是 Model-View-ViewModel 的简写，即模型 - 视图 - 视图模型。它是 [[/content/Notes/编程模型及方法/MVC|MVC]]（Model-View-Controller）架构的一种改进版，有助于将应用程序的业务和表示逻辑与用户界面（UI）清晰分离。
在 MVVM 模式中，应用程序的 UI 以及基础表示和业务逻辑被分成三个独立的类：

- **视图（View）**：用于封装 UI 和 UI 逻辑。
- **视图模型（ViewModel）**：用于封装表示逻辑和状态，并作为连接视图（View）和模型（Model）的桥梁。ViewModel 可以取出 Model 的数据，同时处理 View 中需要展示内容而涉及的业务逻辑。
- **模型（Model）**：用于封装应用的业务逻辑和数据。

MVVM 模式的核心思想是==数据 - 视图分离==，即数据不会影响视图。这主要得益于 MVVM 采用的**双向数据绑定机制**，**当 View 中数据变化时，这种变化会自动反映到 ViewModel 上，反之，当 Model 中数据变化时，这种变化也会自动展示在 View 上**。这种机制使得开发人员和 UI 设计人员在开发应用各自的部分时可以更轻松地进行协作，并显著提高代码重用机会。

# MVVM 代码示例

Vue.js是一个基于MVVM 模式的 JavaScript 框架，它非常适用于构建用户界面和单页应用程序。下面是一个简单的 Vue.js 示例，展示了 MVVM 模式的核心概念。

```html
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <title>Vue MVVM Example</title>  
    <script src="https://cdn.jsdelivr.net/npm/vue@2.7.10/dist/vue.js"></script>  
</head>  
<body>  
  
<div id="app">  
    <!-- 视图（View） -->  
    <input v-model="message" placeholder="Enter some text...">  
    <p>Message: {{ message }}</p>  
</div>  
  
<script>  
    // 视图模型（ViewModel）  
    var app = new Vue({  
        el: '#app',  
        data: {  
            // 模型（Model）  
            message: ''  
        }  
    });  
</script>  
  
</body>  
</html>
```

在这个例子中：

- **视图（View）**：HTML 中的 `<input>` 元素和 `<p>` 元素是视图部分，它们负责显示数据和接收用户输入。
- **视图模型（ViewModel）**：Vue 实例 `app` 是视图模型。它连接了模型和视图，并定义了如何更新视图当模型数据变化时。
- **模型（Model）**：`data` 对象中的 `message` 属性是模型部分，它保存了用户的输入数据。

`v-model` 是一个 Vue指令，它实现了双向数据绑定。这意味着当用户在输入框中输入文本时，
`message` 的值会自动更新，并且 `<p>` 元素中的文本也会相应地更新。同样，如果你直接修改 `message` 的值（例如，在 Vue 的开发者工具中），输入框和 `<p>` 元素也会同步更新。

这个例子展示了 MVVM 模式的核心：视图和模型之间的解耦，以及视图模型如何作为它们之间的桥梁。通过使用 Vue.js，开发者可以更加高效地构建用户界面，同时保持代码的清晰和可维护性。

# MVVM 与传统 MVC 的区别

MVVM 模式与 [[/content/Notes/编程模型及方法/MVC|MVC]]（Model-View-Controller）模式相比，存在以下主要区别：

## 通信方向

- **MVVM**：各部分之间的通信是双向的。视图（View）和视图模型（ViewModel）之间的数据绑定是双向的，当模型（Model）的属性变化时，视图会自动更新；反之，当视图中的输入发生变化时，模型的数据也会自动更新。
- **MVC**：通信是单向的。用户请求通常从视图（View）传递到控制器（Controller），然后控制器与模型（Model）交互，并将结果发送回视图。控制器充当了中间人，负责处理用户输入和更新模型，然后通知视图进行更新。

## 组件数量与角色

- **MVVM**：包含三个主要组件：视图（View）、视图模型（ViewModel）和模型（Model）。其中，视图模型充当了连接视图和模型的桥梁，并处理大部分业务逻辑。
- **MVC**：同样包含三个主要组件：模型（Model）、视图（View）和控制器（Controller）。控制器负责处理用户输入、与模型交互，并更新视图。

## 关注点分离

- **MVVM**：由于双向数据绑定的存在，开发者可以更专注于业务逻辑的实现，而无需过多关注视图和模型之间的同步问题。
- **MVC**：虽然也旨在实现关注点分离，但开发者通常需要手动处理视图和模型之间的同步，这可能会增加开发的复杂性。

## 应用场景

- **MVVM**：通常用于前端开发，特别是构建复杂的单页应用程序（SPA）。Vue.js、Angular 和 React 等前端框架都是基于 MVVM 模式的。
- **MVC**：最初主要用于服务器端 Web 开发，后来也广泛应用于客户端 Web 开发。MVC 框架如 ASP.NET MVC、Ruby on Rails 等，在处理服务器端的业务逻辑和数据库交互方面非常有效。

总的来说，MVVM 和 MVC 都是设计模式的变体，用于组织和分离应用程序的不同部分。MVVM 通过双向数据绑定简化了视图和模型之间的同步问题，使得开发者能够更专注于业务逻辑的实现，而 MVC 则要求开发者手动处理这些同步问题。因此，在选择使用哪种模式时，应根据项目的具体需求和团队的偏好来决定。

# 为什么会出现MVVM

1:最初是MVC:MVC是一种架构模式，M表示Model，V表示视图View，C表示控制器Controller
就是 模型—视图—控制器，也就是说一个标准的Web 应用程式是由这三部分组成的

2:在HTML5 还未火起来的那些年，MVC 作为Web 应用的最佳实践是OK 的.

3:这是因为 Web 应用的View 层相对来说比较简单，前端所需要的数据在后端基本上都可以处理好

4:View 层主要是做一下展示，那时候提倡的是 Controller 来处理复杂的业务逻辑，所以View 层相对来说比较轻量，就是所谓的瘦客户端思想。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219144242.png)
1、 开发者在代码中大量调用相同的 DOM API，处理繁琐 ，操作冗余，使得代码难以维护。
2、大量的DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。
3、 当 Model 频繁发生变化，开发者需要主动更新到View ；当用户的操作导致 Model 发生变化，开发者同样需要将变化的数据同步到Model 中，这样的工作不仅繁琐，而且很难维护复杂多变的数据状态。

MVVM 的出现完美的解决了上面的几个问题：

1：MVVM 由 Model、View、ViewModel 三部分构成，Model 层代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑；View 代表UI 组件，它负责将数据模型转化成UI 展现出来，ViewModel 是一个同步View 和 Model的对象。
2：在MVVM架构下，View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互，Model 和 ViewModel 之间的交互是双向的， 因此View 数
据的变化会同步到Model中，而Model 数据的变化也会立即反应到View 上。
3：ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者**只需关注业务逻辑，不需要手动操作DOM**， 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

# Vue.js 与 MVVM 的关系

Vue.js 可以说是 MVVM 架构的最佳实践，VUE 并没有完全遵循 MVVM，专注于 MVVM 中的 ViewModel，不仅做到了数据双向绑定，而且也是一款相对比较轻量级的 JS 库，API 简洁，很容易上手。

Vue.js 是采用 Object.defineProperty 的 getter 和 setter，并结合发布者订阅者观察者模式来实现数据绑定的。
当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219145206.png)
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219145325.png)

## MVVM 框架的三大要素

- 响应式： `vue` 如何监听到 `data` 的每个属性变化？
- 模板引擎： `vue` 的模板如何被解析，指令如何处理？
- 渲染： `vue` 的模板如何被渲染成 `html` ？以及渲染过程

#### vue 中如何实现响应式

##### 什么是响应式

响应式
修改 data 属性之后，vue 立刻监听到 data 属性被代理到 vm 上
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200242.png)

#### vue 中如何解析模板

##### 模板是什么

- 本质：字符串
- 有逻辑，如 v-if v-for 等
- 与 html 格式很像，但有很大区别
- **最终还要转换为 html 来显示**

**模板最终必须转换成 JS 代码，因为**

- 有逻辑（ v-if v-for ），必须用 JS 才能实现
- 转换为 html 渲染页面，必须用 JS 才能实现
- 因此，模板最重要转换成一个 JS 函数（ `render` 函数）

##### render 函数

- 模板中所有信息都包含在了 render 函数中
- this 即 vm
- price 即 this.price 即 vm.price ，即 data 中的 price
- `_c` 即 `this._c` 即 `vm._c`

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200829.png)
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200908.png)
![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200845.png)

##### render 函数与 vdom

- `vm._c` 其实就相当于 snabbdom 中的 h 函数
- render 函数执行之后，返回的是 vnode

![image.png](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200950.png)
![](https://raw.githubusercontent.com/wangzipai/my_ob_pic/main/20241219200950.png)

- `updateComponent` 中实现了 `vdom` 的 `patch`
- 页面首次渲染执行 `updateComponent`
- data 中每次修改属性，执行 `updateComponent`

### vue 的整个实现流程

- 第一步：解析模板成 `render` 函数
- 第二步：响应式开始监听
- 第三步：首次渲染，显示页面，且绑定依赖
- 第四步： `data` 属性变化，触发 `rerender`

todo

### 为何要监听 `get` ，直接监听 `set` 不行吗？

- data 中有很多属性，有些被用到，有些可能不被用到
- 被用到的会走到 get ，不被用到的不会走到 get
- 未走到 get 中的属性， set 的时候我们也无需关心
- 避免不必要的重复渲染
