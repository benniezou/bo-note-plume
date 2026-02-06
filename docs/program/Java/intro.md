---
title:介绍
createTime:2026/02/0608:10:03
permalink:/program/java/intro/
---
##Java简介
-Java是由SunMicrosystems公司于1995年5月推出的高级程序设计语言。

-Java可运行于多个平台，如Windows,MacOS及其他多种UNIX版本的系统。

-本教程通过简单的实例将让大家更好的了解Java编程语言。

-移动操作系统Android大部分的代码采用Java编程语言编程。
##HelloWorld

```java
publicclassHelloWorld{
publicstaticvoidmain(String[]args){
System.out.println("HelloWorld");
}
}
```

##运行

```shell
javacHelloWorld.java
$javaHelloWorld
HelloWorld
```
##基本语法
编写Java程序时，应注意以下几点：

大小写敏感：Java是大小写敏感的，这就意味着标识符Hello与hello是不同的。
类名：对于所有的类来说，类名的首字母应该大写。如果类名由`若干单词`组成，那么每个单词的首字母应该大写，例如MyFirstJavaClass。
方法名：所有的方法名都应该以小写字母开头。如果方法名含有`若干单词`，则后面的每个单词首字母大写。
源文件名：源文件名必须和类名相同。当保存文件的时候，你应该使用类名作为文件名保存（切记Java是大小写敏感的），文件名的后缀为.java。（如果文件名和类名不相同则会导致编译错误）。
主方法入口：所有的Java程序由publicstaticvoidmain(String[]args)方法开始执行。

##Java标识符
Java所有的组成部分都需要名字。类名、变量名以及方法名都被称为标识符。

关于Java标识符，有以下几点需要注意：

所有的标识符都应该以字母（A-Z或者a-z）,美元符（$）、或者下划线（_）开始
首字符之后可以是字母（A-Z或者a-z）,美元符（$）、下划线（_）或数字的任何字符组合
关键字不能用作标识符
标识符是大小写敏感的
合法标识符举例：age、$salary、_value、__1_value
非法标识符举例：123abc、-salary
Java修饰符
像其他语言一样，Java可以使用修饰符来修饰类中方法和属性。主要有两类修饰符：

访问控制修饰符:default,public,protected,private
非访问控制修饰符:final,abstract,static,synchronized
在后面的章节中我们会深入讨论Java修饰符。

##Java变量
Java中主要有如下几种类型的变量
局部变量
类变量（静态变量）
成员变量（非静态变量）
Java数组
数组是储存在堆上的对象，可以保存多个同类型变量。在后面的章节中，我们将会学到如何声明、构造以及初始化一个数组。

##Java枚举
Java5.0引入了枚举，枚举限制变量只能是预先设定好的值。使用枚举可以减少代码中的bug。

例如，我们为果汁店设计一个程序，它将限制果汁为小杯、中杯、大杯。这就意味着它不允许顾客点除了这三种尺寸外的果汁。

实例
```java

classFreshJuice{
enumFreshJuiceSize{SMALL,MEDIUM,LARGE}
FreshJuiceSizesize;
}

publicclassFreshJuiceTest{
publicstaticvoidmain(String[]args){
FreshJuicejuice=newFreshJuice();
juice.size=FreshJuice.FreshJuiceSize.MEDIUM;
}
}

```
注意：枚举可以单独声明或者声明在类里面。方法、变量、构造函数也可以在枚举中定义。

##Java关键字
下面列出了Java关键字。这些保留字不能用于常量、变量、和任何标识符的名称。

|               类别               |         关键字          |            说明             |                 类别                 |          关键字           |             说明             |
|:------------------------------:|:--------------------:|:-------------------------:|:----------------------------------:|:----------------------:|:--------------------------:|
|  访问控制{rowspan=4}{.important}   |  private{.warning}   |       私有的{.success}       | 类、方法和变量修饰符{rowspan=13}{.important} |        abstract        |            声明抽象            |
|                                | protected{.warning}  |      受保护的{.success}       |                                    |    class{.warning}     |        类{.success}         |
|                                |   public{.warning}   |       公共的{.success}       |                                    |   extends{.warning}    |      扩充、继承{.success}       |
|                                |  default{.warning}   |       默认{.success}        |                                    |    final{.warning}     |    最终值、不可改变的{.success}     |
| 程序控制语句{rowspan=11}{.important} |   break{.warning}    |      跳出循环{.success}       |                                    |  implements{.warning}  |      实现（接口）{.success}      |
|                                |    case{.warning}    | 定义一个值以供switch选择{.success} |                                    |  interface{.warning}   |        接口{.success}        |
|                                |  continue{.warning}  |       继续{.success}        |                                    |    native{.warning}    | 本地、原生方法（非Java实现）{.success} |
|                                |     do{.warning}     |       运行{.success}        |                                    |     new{.warning}      |        创建{.success}        |
|                                |    else{.warning}    |       否则{.success}        |                                    |    static{.warning}    |        静态{.success}        |
|                                |    for{.warning}     |       循环{.success}        |                                    |   strictfp{.warning}   |    严格浮点、精准浮点{.success}     |
|                                |     if{.warning}     |       如果{.success}        |                                    | synchronized{.warning} |      线程、同步{.success}       |
|                                | instanceof{.warning} |       实例{.success}        |                                    |  transient{.warning}   |        短暂{.success}        |
|                                |   return{.warning}   |       返回{.success}        |                                    |   volatile{.warning}   |        易失{.success}        |
|                                |   switch{.warning}   |     根据值选择执行{.success}     |    错误处理{rowspan=6}{.important}     |    assert{.warning}    |    断言表达式是否为真{.success}     |
|                                |   while{.warning}    |       循环{.success}        |                                    |    catch{.warning}     |       捕捉异常{.success}       |
|  基本类型{rowspan=8}{.important}   |  boolean{.warning}   |       布尔型{.success}       |                                    |   finally{.warning}    |     有没有异常都执行{.success}     |
|                                |    byte{.warning}    |       字节型{.success}       |                                    |    throw{.warning}     |     抛出一个异常对象{.success}     |
|                                |    char{.warning}    |       字符型{.success}       |                                    |    throws{.warning}    |   声明一个异常可能被抛出{.success}    |
|                                |   double{.warning}   |      双精度浮点{.success}      |                                    |     try{.warning}      |       捕获异常{.success}       |
|                                |   float{.warning}    |      单精度浮点{.success}      |     包相关{rowspan=2}{.important}     |    import{.warning}    |        引入{.success}        |
|                                |    int{.warning}     |       整型{.success}        |                                    |   package{.warning}    |        包{.success}         |
|                                |    long{.warning}    |       长整型{.success}       |    变量引用{rowspan=3}{.important}     |    super{.warning}     |      父类、超类{.success}       |
|                                |   short{.warning}    |       短整型{.success}       |                                    |     this{.warning}     |        本类{.success}        |
|  保留关键字{rowspan=2}{.important}  |    goto{.warning}    |   是关键字，但不能使用{.success}    |                                    |     void{.warning}     |       无返回值{.success}       |
|                                |   const{.warning}    |   是关键字，但不能使用{.success}    |                                    |                        |                            |

注意：Java的null不是关键字，类似于true和false，它是一个字面常量，不允许作为标识符使用。

##Java注释
类似于C/C++、Java也支持单行以及多行注释。

注释中的字符将被Java编译器忽略。

```java
publicclassHelloWorld{
/*这是第一个Java程序
*它将输出HelloWorld
*这是一个多行注释的示例
*/
publicstaticvoidmain(String[]args){
//这是单行注释的示例
/*这个也是单行注释的示例*/
System.out.println("HelloWorld");
}
}
```
:::note
更多内容可以参考：Java注释。
:::

##Java空行
空白行或者有注释的行，Java编译器都会忽略掉。

##继承
在Java中，一个类可以由其他类派生。如果你要创建一个类，而且已经存在一个类具有你所需要的属性或方法，那么你可以将新创建的类继承该类。

利用继承的方法，可以重用已存在类的方法和属性，而不用重写这些代码。被继承的类称为超类（superclass），派生类称为子类（subclass）。

##接口
在Java中，接口可理解为对象间相互通信的协议。接口在继承中扮演着很重要的角色。

接口只定义派生要用到的方法，但是方法的具体实现完全取决于派生类。
