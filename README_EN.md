# Multi-Platform Terminal Translation

![Static Badge](https://img.shields.io/badge/npm-6.14.17-blue)
![Static Badge](https://img.shields.io/badge/node->=14.8.0-97CA00)
![Static Badge](https://img.shields.io/badge/licenes-MIT-97CA00)

> A simple terminal translation package that supports multiple translation platforms.  Through terminal commands, you can easily and quickly switch platforms and languages, and perform text translation operations.

## Language

- [简体中文](README.md)
- [English](README_EN.md)


## Install

```
npm install -g mp-tl
```

## Usage

```
Usage: tl [options] [command]

Options:
  -v, --version                     Output the current version
  -h, --help                        display help for command

Commands:
  ls [langs]                        List all the translation platform, Type 'langs' at the end to see what language code can to use
  use <name>                        Change current translation platform
  set-trl [options] <name>  Set the appid and key for the translation platform to access the channel translation api
    -a, --appid <appid>             Set translation platform appid
    -s, --secret-key <secretKey>    Set translation platform secret key
  set-langs [options]               Set source and target languages
    -s, --source <source>           Set source language
    -t, --target <target>           Set target language
  p <query...>                      Translate the text using the 'tl p <query...>' directive
  help [command]                    display help for command
```

## Example
```
$ tl set-trl baidu -a 123456 -s abcdefghijklmnopqrstuvwxyz

  Set the application ID and key of Baidu Translation Platform

$ tl ls

  View the list of translation platforms and the currently selected platform

$ tl use youdao
 
 Use Youdao translation platform for translation

$ tl ls langs
  
 View the currently available source and target language codes

$ tl set-langs -s en -t zh

 Set the translation source language to English and the target language to Chinese
 
$ tl p hello world

 tl p Keep up with the text that needs to be translated
```
## Supported Platforms

- Google Translate
- Baidu Translate
- Youdao Translate
- Tencent Cloud Translate
- Alibaba Cloud Translate
- Volcengine Translate

## Precautions

- The translation plug-in itself does not have the ability to translate text, but instead translates by calling the API provided by the translation platform. Currently supported platforms have free translation quotas, which is completely sufficient for most people.
- Except for Google Translate, all translation platforms need to apply for application ID and key, Please see the specific tutorial: [Translation platform API application tutorial](https://flowus.cn/chiko_translation/share/e0a8678b-314c-4327-885c-b13ea7c5f239?code=B8NQGQ).
- Since this plug-in runs in the terminal and there is no plan to provide a server, Google Translate needs to be used through a proxy. If it still does not work after turning on the proxy, please turn on the Tun mode of the proxy.

## Connect

- QQ 2452559902

## Contribute

Welcome to submit issues and pull requests

## License

MIT


