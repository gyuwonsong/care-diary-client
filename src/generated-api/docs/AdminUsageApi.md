# AdminUsageApi

All URIs are relative to *https://diary-api.snuh-bmilab.ai.kr*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getUsage**](AdminUsageApi.md#getusage) | **GET** /v1/admin/usage | 사용량 조회 |
| [**getUserUsages**](AdminUsageApi.md#getuserusages) | **GET** /v1/admin/usage/users | 사용자별 사용량 조회 |



## getUsage

> CommonResponseAdminUsageResponse getUsage()

사용량 조회

누적 사용량과 월간 사용량을 조회합니다. 사용자 수, 분석 건 수, 사용료를 포함합니다.

### Example

```ts
import {
  Configuration,
  AdminUsageApi,
} from '';
import type { GetUsageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminUsageApi(config);

  try {
    const data = await api.getUsage();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**CommonResponseAdminUsageResponse**](CommonResponseAdminUsageResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 사용량 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUserUsages

> CommonResponseAdminUserUsageResponse getUserUsages(search)

사용자별 사용량 조회

사용자별 일기 작성 건수와 분석 건수를 조회합니다. 사용자 이름으로 검색할 수 있습니다.

### Example

```ts
import {
  Configuration,
  AdminUsageApi,
} from '';
import type { GetUserUsagesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminUsageApi(config);

  const body = {
    // string | 사용자 이름 검색 (optional)
    search: search_example,
  } satisfies GetUserUsagesRequest;

  try {
    const data = await api.getUserUsages(body);
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
| **search** | `string` | 사용자 이름 검색 | [Optional] [Defaults to `undefined`] |

### Return type

[**CommonResponseAdminUserUsageResponse**](CommonResponseAdminUserUsageResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 사용자별 사용량 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **403** | 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

