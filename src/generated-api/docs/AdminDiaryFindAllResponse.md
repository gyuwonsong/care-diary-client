
# AdminDiaryFindAllResponse

관리자 일기 목록 조회 응답

## Properties

Name | Type
------------ | -------------
`diaries` | [Array&lt;AdminDiaryDto&gt;](AdminDiaryDto.md)

## Example

```typescript
import type { AdminDiaryFindAllResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "diaries": null,
} satisfies AdminDiaryFindAllResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminDiaryFindAllResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


