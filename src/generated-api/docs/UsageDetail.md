
# UsageDetail

사용량 상세

## Properties

Name | Type
------------ | -------------
`userCount` | number
`analysisCount` | number
`usageFee` | number

## Example

```typescript
import type { UsageDetail } from ''

// TODO: Update the object below with actual values
const example = {
  "userCount": 150,
  "analysisCount": 1234,
  "usageFee": 50000.0,
} satisfies UsageDetail

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsageDetail
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


