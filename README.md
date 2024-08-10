# 多平台终端翻译

![Static Badge](https://img.shields.io/badge/npm-6.14.17-blue)
![Static Badge](https://img.shields.io/badge/node->=14.8.0-97CA00)
![Static Badge](https://img.shields.io/badge/licenes-MIT-97CA00)

> 一个简单的终端翻译包，支持多个翻译平台。通过终端命令，可以方便快捷的切换平台、语种，进行文本翻译操作。

## 语言

- [简体中文](README.md)
- [English](README_EN.md)

  
## 安装

```
npm install -g mp-tl
```

## 使用

```
Usage: tl [options] [command]

Options:
  -v, --version                     输出当前版本
  -h, --help                        显示命令的帮助

Commands:
  ls [langs]                        列出所有翻译平台，在末尾输入“langs”以查看可以使用的语言代码
  use <name>                        更改当前的翻译平台
  set-trl [options] <name>          设置翻译平台访问渠道的应用ID和密钥
    -a, --appid <appid>             设置翻译平台应用ID
    -s, --secret-key <secretKey>    设置翻译平台密钥
  set-langs [options]               设置源语言和目标语言
    -s, --source <source>           设置源语言
    -t, --target <target>           设置目标语言
  p <query...>                      使用 'tl p <query...>' 指令翻译文本
  help [command]                    显示命令的帮助
```

## 示例

```
$ tl set-trl baidu -a 123456 -s abcdefghijklmnopqrstuvwxyz

  设置百度翻译平台的应用ID和密钥

$ tl ls

  查看翻译平台列表和当前选中的平台

$ tl use youdao
 
 使用有道翻译平台进行翻译

$ tl ls langs
  
 查看当前可以选择的源语言和目标语言代码
 
$ tl set-langs -s en -t zh

 设置翻译源语言为英语，目标语言为中文
 
$ tl p hello world

 tl p 跟上需要翻译的文本内容
```
## 支持平台

- 谷歌翻译
- 百度翻译
- 有道翻译
- 腾讯云翻译
- 阿里云翻译
- 火山翻译

## 注意事项

- 翻译插件本身并没有翻译文字的能力，而是通过调用翻译平台提供的API进行翻译，目前支持的平台都有免费的翻译额度，对于大部分人来说是完全足够的。
- 除了谷歌翻译，所有翻译平台都需要去申请应用ID和密钥，具体申请教程请看：[翻译平台API申请教程](https://flowus.cn/chiko_translation/share/e0a8678b-314c-4327-885c-b13ea7c5f239?code=B8NQGQ)。
- 由于本插件是终端运行，也并没有提供服务器的打算，所以谷歌翻译需要通过代理才能使用，如果开启代理还不能使用，请开启代理的Tun模式。


## 联系

- QQ 2452559902

## 贡献

欢迎提交 issue 和 pull request

## 许可证

MIT