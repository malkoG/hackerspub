| 語法              | 說明                                                                                                              | 範例                                                     |
|-------------------|-------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| `"` 關鍵詞 `"`     | 查找引號內的字串，包括空格。<br>不區分大小寫。<br>（在引號內使用引號需轉義：`\"`）                                            | `"Hackers' Pub"`                                          |
| `from:` 使用者名稱  | 查找指定使用者發佈的內容。                                                                                            | `from:hongminhee`<br>`from:hongminhee@hollo.social`       |
| `lang:` ISO 639-1 | 查找使用指定語言編寫的內容。                                                                                          | `lang:zh`                                                 |
| `#` 標籤          | 查找帶有指定標籤的內容。<br>不區分大小寫。                                                                             | `#HackersPub`                                             |
| 條件 ` ` 條件      | 查找同時滿足空格兩側條件的內容（邏輯與）。                                                                             | `"Hackers' Pub" lang:zh`                                  |
| 條件 `OR` 條件     | 查找滿足 OR 運算符兩側任一條件的內容（邏輯或）。                                                                       | `#HackersPub OR "Hackers' Pub" lang:zh`                   |
| `(` 條件 `)`      | 優先組合括號內的運算符。                                                                                              | `(#HackersPub OR "Hackers' Pub" OR "Hackers Pub") lang:zh` |
