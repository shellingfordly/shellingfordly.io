---
name: nginx相关一些命令
date: 2022-06-07
---

## 服务器命令

- 查看端口信息

```
lsof -i:8080
```

- 查看 nginx 安装地址

```js
ps -ef | grep nginx
// 结果
// root        1348       1  0  2021 ?        00:00:00 nginx: master process /usr/sbin/nginx

// pid 查询
ps -ef | grep {PID}
```

- 根据端口查看对应进程

```js
netstat -tunlp | grep {port}
// 结果
// tcp6       0      0 :::8081                 :::*                    LISTEN      1093557/node
```

- 查看进程 PID 占用端口情况

```js
netstat -nap | grep {PID}

/*
  结果

  tcp6       0      0 :::8081                 :::*                    LISTEN      1093557/node
  tcp6       0      0 10.0.16.16:8081         89.248.165.32:43770     ESTABLISHED 1093557/node
  ...
*/
```

### 连接服务器

```
ssh root@127.0.0.1
```

## ngnix

### 常用命令

- 查看配置文件地址

```py
nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
```

- 重启 nginx

```
nginx -s reload
```

### nginx 配置
