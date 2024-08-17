# Multiplatform terminal translation package

![Static Badge](https://img.shields.io/badge/npm-6.14.17-blue)
![Static Badge](https://img.shields.io/badge/node->=14.8.0-97CA00)
![Static Badge](https://img.shields.io/badge/licenes-MIT-97CA00)

> A simple terminal translation package that supports multiple translation platforms.  Through terminal commands, you can easily and quickly switch platforms and languages, and perform text translation operations.

## Language

- [简体中文](README.md)
- [English](README_EN.md)


## Install

```
npm install -g tlm
```

## Usage

```
Usage: tlm command [options]

Options:
  -v, --version                     Output the current version
  -h, --help                        display help for command

Commands:
  ls [langs]                        List all the translation platform, Type 'langs' at the end to see what language code can to use
  use <name>                        Change current translation platform
  set-trl [options] <name>          Set the appid and key for the translation platform to access the channel translation api
    -a, --appid <appid>             Set translation platform appid
    -s, --secret-key <secretKey>    Set translation platform secret key
  get-trl [options] [name]          Displays the appid and key of the specified platform, or the currently selected platform if not specified
    -s, --show                      Displays the real secret key
  set-langs [options]               Set source and target languages
    -s, --source <source>           Set source language
    -t, --target <target>           Set target language
  p <query...>                      Translate the text using the 'tlm p <query...>' directive
  help [command]                    display help for command
```

## Example
```
$ tlm set-trl baidu -a 123456 -s abcdefghijklmnopqrstuvwxyz

  Set the application ID and key of Baidu Translation Platform

$ tlm get-trl baidu -s 

  View the app ID and key of Baidu Translate platform

$ tlm use youdao
 
  Use Youdao translation platform for translation

$ tlm ls

  View the list of translation platforms and the currently selected platform

$ tlm ls langs
  
 View the currently available source and target language codes

$ tlm set-langs -s en -t zh

 Set the translation source language to English and the target language to Chinese
 
$ tlm p hello world

 tlm p Keep up with the text that needs to be translated
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
- Except for Google Translate, all translation platforms need to apply for application ID and key, Please see the specific tutorial: [Translation platform API application tutorial](https://flowus.cn/chiko_tlm/share/91538d60-cf6e-48a6-b2b3-bc14eed4f066?code=B8NQGQ).
- Since this plug-in runs in the terminal and there is no plan to provide a server, Google Translate needs to be used through a proxy. If it still does not work after turning on the proxy, please turn on the Tun mode of the proxy.

## Connect

- QQ 2452559902

## Contribute

Welcome to submit issues and pull requests

## License

MIT


