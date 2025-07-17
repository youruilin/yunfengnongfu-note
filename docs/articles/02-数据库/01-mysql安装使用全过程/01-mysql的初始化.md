## 1. 安装mysql（生产环境）

直接上代码：

```
# 更新系统包
sudo apt update
sudo apt upgrade

// 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
// 安装完成后，按照输出的提示重启终端，或者手动运行以下命令来加载 nvm：
source ~/.bashrc

nvm --version
nvm install 18  # 安装 Node.js 18.x 版本

// 在 EC2 上安装 MySQL 数据库：
sudo apt install mysql-server

// 启动
sudo systemctl start mysql
// 开机自启
sudo systemctl enable mysql
```

## 2. 初始化

root用户执行`sudo mysql_secure_installation`，进行数据库初始化：

| 步骤               | 作用                    | 推荐操作                |
| ------------------ | ----------------------- | ----------------------- |
| 启用密码验证组件   | 防止设置弱密码          | 是                      |
| root 认证方式      | 默认为 auth_socket 插件 | 本地保留 / 远程改为密码 |
| 删除匿名用户       | 防止无授权访问          | 是                      |
| 禁止 root 远程登录 | 降低被暴力破解风险      | 是                      |
| 删除 test 数据库   | 减少潜在安全风险        | 是                      |
| 重新加载权限表     | 使配置生效              | 是                      |

## 3. 创建用户（以lychee图床为例）

- 接下来，创建数据库表，以及lychee的专属用户：

  ```
  CREATE DATABASE lychee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  
  CREATE USER 'lychee'@'%' IDENTIFIED BY '386898136Di!';
  
  GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON lychee.* TO 'lychee'@'%';
  
  FLUSH PRIVILEGES;
  ```

- 或者，授予lychee用户所有权限：

  ```
  GRANT ALL PRIVILEGES ON lychee.* TO 'lychee'@'%';
  FLUSH PRIVILEGES;
  ```

  它的意思是：

  - **授予用户 `'lychee'`**（用户名是 `lychee`）
  - **从任意主机（`'%'` 表示任何 IP 地址）**
  - **对数据库 `lychee` 下的 `所有表（\*`）`**
  - **赋予 `ALL PRIVILEGES`（所有权限）**

  ⚠️ 注意：`GRANT ALL PRIVILEGES ON 数据库.*` **不会赋予用户全局权限**（比如创建用户、修改全局配置等），它**仅限于指定的数据库（这里是 `lychee`）下的所有表**。

## 4. 允许监听远程链接

- **以 root 权限递归搜索 `/etc/mysql/` 目录下所有文件中包含字符串 `"bind-address"` 的行**。

  ```
  sudo grep -r "bind-address" /etc/mysql/
  ```

  默认得到的输出是：

  ```
  /etc/mysql/mysql.conf.d/mysqld.cnf:bind-address = 127.0.0.1
  ```

  这表示：

  - 在文件 `/etc/mysql/mysql.conf.d/mysqld.cnf` 中找到了包含 `bind-address` 的配置项；
  - 该配置项的值是 `bind-address = 127.0.0.1`。

  它的意思是：

  > MySQL 服务器**只监听本地回环地址（localhost，即 127.0.0.1）上的连接请求**，**不接受来自其他机器（如局域网或互联网）的连接**。

  

  你需要用编辑器打开文件，比如：

  ```
  sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
  ```

  找到 `bind-address` 行，将其改为：

  ```
  bind-address = 0.0.0.0
  ```

  保存并重启 MySQL 服务：；

  ```
  sudo systemctl restart mysql
  ```

  这样，mysql就可以被远程访问了。