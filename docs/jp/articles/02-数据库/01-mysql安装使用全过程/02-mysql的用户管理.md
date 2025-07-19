## 1. sql通用语法

全称 Structured Query Language，结构化查询语言。操作关系型数据库的编程语言，定义了一套操作关系型数据库统一标准 。

1）. SQL语句可以单行或多行书写，以分号结尾；

2）. SQL语句可以使用空格/缩进来增强语句的可读性；

3）. MySQL数据库的SQL语句不区分大小写，关键字建议使用大写；

4）. 注释：

- 单行注释：-- 注释内容 或 # 注释内容
- 多行注释：/* 注释内容 */

## 2. sql分类

| 类别 | 名称         | 关键语句                        | 作用             |
| ---- | ------------ | ------------------------------- | ---------------- |
| DDL  | 数据定义语言 | CREATE、ALTER、DROP、TRUNCATE   | 定义和管理表结构 |
| DML  | 数据操作语言 | INSERT、UPDATE、DELETE          | 操作数据内容     |
| DQL  | 数据查询语言 | SELECT                          | 查询数据         |
| DCL  | 数据控制语言 | GRANT、REVOKE、COMMIT、ROLLBACK | 权限与事务控制   |

### 2.1 DDL

Data Definition Language，数据定义语言，用来定义数据库对象(数据库，表，字段) 。

#### 2.1.1 数据库操作

```
# 查询所有数据库
show databases;

# 查询当前数据库 
slect database();

#创建数据库
create database [if not exits] lychee [dedault charset 字符集] [collate 排序规则];

CREATE DATABASE lychee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

