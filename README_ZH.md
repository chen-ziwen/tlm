# 终端翻译

![Static Badge](https://img.shields.io/badge/npm-6.13.1-blue)
![Static Badge](https://img.shields.io/badge/node->=13.2.0-97CA00)
![Static Badge](https://img.shields.io/badge/licenes-MIT-97CA00)

> 一个简单的终端翻译工具，支持多个平台。通过指令，可以方便地切换翻译平台，设置翻译语言，进行翻译操作。

## 语言

- [English](README.md)
- [简体中文](README_ZH.md)

## 安装

```
npm install -g terminal-translate
```

## 使用

```
Usage: tl [options] [command]

Options:
  -v, --version                     Output the current version
  -h, --help                        display help for command

Commands:
  ls [langs]                        List all the translation platform. Type 'langs' at the end to see what language code can to use.
  use <name>                        Change current translation platform.
  set-translation [options] <name>  Set the appid and key for the translation platform to access the channel translation api.
    -a, --appid <appid>             Set translation platform appid.
    -s, --secret-key <secretKey>    Set translation platform secret key.
  set-langs [options]               Set source and target languages
    -s, --source <source>           Set source language
    -t, --target <target>           Set target language
  p <query...>                      Translate the text using the 'tl p <query...>' directive
  help [command]                    display help for command
```

## 示例

```
$ tl set-translation baidu -a 123456 -s abcdefghijklmnopqrstuvwxyz

  设置百度翻译平台的应用ID和密钥.

$ tl ls

  查看翻译平台列表和当前选中的平台.

$ tl use youdao
 
 使用有道翻译平台进行翻译.

$ tl ls langs
  
 查看当前可以选择的源语言和目标语言代码.
 
$ tl set-langs -s en -t zh

 设置翻译源语言为英语，目标语言为中文.
 
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

## 申请教程

[来自易翻的教程](https://flowus.cn/share/0d96c879-2dba-4bfc-9d81-4b4f435398e8)

## 注意事项

- 翻译插件本身并没有翻译文字的能力，而是通过调用翻译平台提供的API进行翻译，目前支持的平台都有免费的翻译额度，对于大部分人来说是完全足够的。
- 除了谷歌翻译，所有翻译平台都需要去申请应用ID和密钥。
- 由于本插件是终端运行，也并没有提供服务器的打算，所以谷歌翻译需要通过代理才能使用，如果开启代理还不能使用，请开启代理的Tun模式。

## 联系

- qq: 2452559902

## 贡献

欢迎提交issue和pull request。

## 许可证

MIT

