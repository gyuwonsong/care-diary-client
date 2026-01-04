
# AdminUserUsageResponse

사용자별 사용량 조회 응답

## Properties

Name | Type
------------ | -------------
`users` | [Array&lt;UserUsageDto&gt;](UserUsageDto.md)

## Example

```typescript
import type { AdminUserUsageResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "users": null,
} satisfies AdminUserUsageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminUserUsageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


