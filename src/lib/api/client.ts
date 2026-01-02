import { Configuration } from "@/generated-api/runtime";
import { UserApi, ScaleQuestionApi, HomeApi, DiaryApi } from "@/generated-api";
import { fetchWithSonner } from "@/lib/api/fetch-with-sonner";
import { getOAuthSession } from "@/lib/auth-storage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function createConfig() {
  return new Configuration({
    basePath: API_BASE,
    fetchApi: fetchWithSonner,
    accessToken: async () => {
      const { token } = getOAuthSession();
      return token ?? "";
    },
  });
}

export const userApi = new UserApi(createConfig());
export const scaleQuestionApi = new ScaleQuestionApi(createConfig());
export const homeApi = new HomeApi(createConfig());
export const diaryApi = new DiaryApi(createConfig());
