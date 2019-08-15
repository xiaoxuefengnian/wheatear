# 添加代码片段 snippets

```bash
# 打开控制面板 
快捷键 command + shift + p

搜索 Preferences: Configure User Snippets

选择 New Global Snippts file...
```

示例

```json
{
	// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and 
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope 
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is 
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: 
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. 
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
	"comment type and default": {
		"scope": "javascript",
		"prefix": "ctd",
		"body": [
			"/**",
			" *",
			" * 类型:",
			" * 默认值:",
			" */",
		],
		"description": "comment type and default in zh-CN"
	}
}
```