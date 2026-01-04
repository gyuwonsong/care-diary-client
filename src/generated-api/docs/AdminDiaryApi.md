# AdminDiaryApi

All URIs are relative to *https://diary-api.snuh-bmilab.ai.kr*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**findAllByUserIdAndDate**](AdminDiaryApi.md#findallbyuseridanddate) | **GET** /v1/admin/diaries | 사용자별 일기 목록 조회 |
| [**findExtractedKeywords**](AdminDiaryApi.md#findextractedkeywords) | **GET** /v1/admin/diaries/{diaryId}/keywords | 일기 추출 키워드 조회 |
| [**findSdoh**](AdminDiaryApi.md#findsdoh) | **GET** /v1/admin/diaries/{diaryId}/sdoh | 일기 SDoH 조회 |
| [**findWelfareServices**](AdminDiaryApi.md#findwelfareservices) | **GET** /v1/admin/diaries/{diaryId}/welfare-services | 일기 복지로 서비스 조회 |



## findAllByUserIdAndDate

> CommonResponseAdminDiaryFindAllResponse findAllByUserIdAndDate(userId, date)

사용자별 일기 목록 조회

특정 사용자가 특정 날짜에 작성한 일기 목록을 조회합니다.

### Example

```ts
import {
  Configuration,
  AdminDiaryApi,
} from '';
import type { FindAllByUserIdAndDateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminDiaryApi(config);

  const body = {
    // string | 사용자 ID
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // Date | 작성일 (yyyy-MM-dd)
    date: 2013-10-20,
  } satisfies FindAllByUserIdAndDateRequest;

  try {
    const data = await api.findAllByUserIdAndDate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` | 사용자 ID | [Defaults to `undefined`] |
| **date** | `Date` | 작성일 (yyyy-MM-dd) | [Defaults to `undefined`] |

### Return type

[**CommonResponseAdminDiaryFindAllResponse**](CommonResponseAdminDiaryFindAllResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 일기 목록 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findExtractedKeywords

> CommonResponseAdminDiaryKeywordResponse findExtractedKeywords(diaryId)

일기 추출 키워드 조회

특정 일기에서 추출된 키워드 정보를 조회합니다.

### Example

```ts
import {
  Configuration,
  AdminDiaryApi,
} from '';
import type { FindExtractedKeywordsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminDiaryApi(config);

  const body = {
    // string | 일기 ID
    diaryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies FindExtractedKeywordsRequest;

  try {
    const data = await api.findExtractedKeywords(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **diaryId** | `string` | 일기 ID | [Defaults to `undefined`] |

### Return type

[**CommonResponseAdminDiaryKeywordResponse**](CommonResponseAdminDiaryKeywordResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 키워드 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |
| **404** | 일기를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findSdoh

> CommonResponseAdminDiarySdohResponse findSdoh(diaryId)

일기 SDoH 조회

특정 일기의 사회적 건강 결정요인(Social Determinants of Health) 정보를 조회합니다.

### Example

```ts
import {
  Configuration,
  AdminDiaryApi,
} from '';
import type { FindSdohRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminDiaryApi(config);

  const body = {
    // string | 일기 ID
    diaryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies FindSdohRequest;

  try {
    const data = await api.findSdoh(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **diaryId** | `string` | 일기 ID | [Defaults to `undefined`] |

### Return type

[**CommonResponseAdminDiarySdohResponse**](CommonResponseAdminDiarySdohResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | SDoH 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |
| **404** | 일기를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findWelfareServices

> CommonResponseAdminDiaryWelfareServiceResponse findWelfareServices(diaryId)

일기 복지로 서비스 조회

특정 일기와 연관된 복지로 서비스 정보를 조회합니다.

### Example

```ts
import {
  Configuration,
  AdminDiaryApi,
} from '';
import type { FindWelfareServicesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminDiaryApi(config);

  const body = {
    // string | 일기 ID
    diaryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies FindWelfareServicesRequest;

  try {
    const data = await api.findWelfareServices(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **diaryId** | `string` | 일기 ID | [Defaults to `undefined`] |

### Return type

[**CommonResponseAdminDiaryWelfareServiceResponse**](CommonResponseAdminDiaryWelfareServiceResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 복지 서비스 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |
| **404** | 일기를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

