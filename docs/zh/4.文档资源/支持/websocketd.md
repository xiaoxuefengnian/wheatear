# websocketd

## WebSocket 服务器

[官网](http://websocketd.com)

[阮一峰 websocket](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

后台脚本不限语言，标准输入（stdin）就是 WebSocket 的输入，标准输出（stdout）就是 WebSocket 的输出。

## 示例

To get started, we'll create a WebSocket endpoint that will accept connections, then send back messages, counting to 10 with 1 second pause between each one, before disconnecting.

To show how simple it is, let's do it in Bash!

__count.sh__:

```sh
#!/bin/bash
for ((COUNT = 1; COUNT <= 10; COUNT++)); do
  echo $COUNT
  sleep 1
done
```

Before turning it into a WebSocket server, let's test it from the command line. The beauty of `websocketd` is that servers work equally well in the command line, or in shell scripts, as they do in the server - with no modifications required.

```sh
$ chmod +x count.sh
$ ./count.sh
1
2
3
4
5
6
7
8
9
10
```

Now let's turn it into a WebSocket server:

```sh
$ websocketd --port=8080 ./count.sh
```

Finally, let's create a web-page that to test it.

__count.html__:

```html
<!DOCTYPE html>
<pre id="log"></pre>
<script>
  // helper function: log message to screen
  function log(msg) {
    document.getElementById('log').textContent += msg + '\n';
  }

  // setup websocket with callbacks
  var ws = new WebSocket('ws://localhost:8080/');
  ws.onopen = function() {
    log('CONNECT');
  };
  ws.onclose = function() {
    log('DISCONNECT');
  };
  ws.onmessage = function(event) {
    log('MESSAGE: ' + event.data);
  };
</script>
```
Open this page in your web-browser. It will even work if you open it directly
from disk using a `file://` URL.