# electron 隐藏菜单栏

全屏时隐藏菜单栏

方案一

在生成 [BrowserWindow](https://www.electronjs.org/docs/api/browser-window#class-browserwindow) 的配置里设置

```javascript
// 自动隐藏菜单栏
autoHideMenuBar: true;
```

该方案会在用户按下 alt 时会显示菜单栏

方案二

```javascript
win.setMenu(null);
```

该方案会导致无法使用 [本地快捷键](https://www.electronjs.org/docs/tutorial/keyboard-shortcuts#本地快捷键)，需要使用其他方式来实现快捷键，如 [在浏览器窗口内的快捷方式](https://www.electronjs.org/docs/tutorial/keyboard-shortcuts#在浏览器窗口内的快捷方式)。

方案三

在生成 [BrowserWindow](https://www.electronjs.org/docs/api/browser-window#class-browserwindow) 的配置里设置 [无边框窗口](https://www.electronjs.org/docs/api/frameless-window#无边框窗口)

```
frame: false,
```

该方案会将标题栏和窗口控制按钮全部隐藏，生成一个只含有网页内容的窗口
