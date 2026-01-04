
# AdminDiaryDto

일기 정보

## Properties

Name | Type
------------ | -------------
`diaryId` | string
`uploaderId` | string
`date` | Date
`content` | string
`emotion` | string
`createdAt` | Date
`questionScores` | [Array&lt;RecommendedQuestionUserScoreDto&gt;](RecommendedQuestionUserScoreDto.md)

## Example

```typescript
import type { AdminDiaryDto } from ''

// TODO: Update the object below with actual values
const example = {
  "diaryId": 550e8400-e29b-41d4-a716-446655440000,
  "uploaderId": 550e8400-e29b-41d4-a716-446655440001,
  "date": 2024-12-25,
  "content": 오늘은 날씨가 좋아서 산책을 했다.,
  "emotion": HAPPY,
  "createdAt": null,
  "questionScores": null,
} satisfies AdminDiaryDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminDiaryDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


