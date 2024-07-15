
# Node.js CLI app for webextension locale translation

## Features
- Translates single message at a time for accurate translation
- Preserves placeholders
- Skip messages and ignore words

## Installation and Usage
```bash
npm install -g @waqasibrahim/webext-locale-translator
```

```bash
Usage: webext-translate [options]

Translate Chrome extension and WebExtension locale files using Google Translate API

Options:
  -V, --version               output the version number
  -l, --list                  Lists all supported languages
  -s, --source <source>       Source locale file
  -t, --to <codes>            List of language codes
  -f, --from <code>           Source language code
  -s, --skip <names>          List of message names to ignore
  -i, --ignore-words <words>  List of words to ignore
  -h, --help                  display help for command
```


Let's say we have this source locale file.
```jsonc
// messages.json
{
    "extName": {
        "message": "My awesome extension",
    },
    "extDescription": {
        "message": "Description of my awesome extension",
    },
    "errorMessage": {
        "message": "Error: $details$",
        "description": "Generic error template",
        "placeholders": {
            "details": {
                "content": "$1",
                "example": "Failed to fetch RSS feed."
            }
        }
    }
}
```

#### Example #1
```bash
# Translate our source file to es and fr locales
webext-translate --source messages.json --to es,fr

# Translate source file to all supported locales
webext-translate --source messages.json
```

#### Example #2 - Skip messages names
```bash
# Skip translation for keys extName and extDescription
webext-translate --source messages.json --skip extName,extDescription
```

#### Example #3 - Ignore words
```bash
# Don't translate specific words (case sensitive)
webext-translate --source messages.json --ignore-words chrome,webextension
```
This will ignore all occurrence of the word "chrome" and "webextension".

## Credits
- [google-translate-open-api](https://github.com/hua1995116/google-translate-open-api#readme)
