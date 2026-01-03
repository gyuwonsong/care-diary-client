import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  AnxietyResponse,
  DepressionResponse,
  AngerResponse,
} from "@/lib/types";
import {
  angerQuestions,
  anxietyQuestions,
  depressionQuestions,
} from "@/lib/constants";

// TODO: 설문 문항 및 항목 BE 요청
export default async function SurveyDetailPage({
  params,
}: {
  params: Promise<{ userId: string; session: string }>;
}) {
  const { userId, session } = await params;

  const user = {
    id: userId,
    name: "김철수",
    birthDate: "1965-03-15",
    disease: "파킨슨병",
  };

  const anxietyResponse: AnxietyResponse = {
    q1: 2,
    q2: 3,
    q3: 1,
    q4: 2,
    q5: 3,
    q6: 2,
    q7: 3,
    q8: 2,
    q9: 1,
    q10: 2,
    q11: 3,
    q12: 2,
    q13: 1,
    q14: 2,
  };

  const depressionResponse: DepressionResponse = {
    q1: 3,
    q2: 2,
    q3: 3,
    q4: 2,
    q5: 3,
    q6: 2,
    q7: 3,
    q8: 2,
    q9: 3,
    q10: 2,
    q11: 3,
    q12: 2,
    q13: 3,
    q14: 2,
    q15: 3,
    q16: 2,
    q17: 3,
    q18: 2,
    q19: 3,
    q20: 2,
  };

  const angerResponse: AngerResponse = {
    q1: 1,
    q2: 2,
    q3: 1,
    q4: 2,
    q5: 1,
    q6: 2,
    q7: 1,
    q8: 2,
    q9: 1,
    q10: 2,
    q11: 1,
    q12: 2,
    q13: 1,
    q14: 2,
    q15: 1,
    q16: 2,
    q17: 1,
    q18: 2,
    q19: 1,
    q20: 2,
    q21: 1,
    q22: 2,
    q23: 1,
    q24: 2,
  };

  const getScaleLabel = (score: number) => {
    if (score === 1) return "전혀 없음";
    if (score === 2) return "가끔";
    if (score === 3) return "중간";
    return "심함";
  };

  const calculateTotalScore = (
    responses: AnxietyResponse | DepressionResponse | AngerResponse,
  ) => {
    return Object.values(responses).reduce((sum, score) => sum + score, 0);
  };

  const anxietyTotal = calculateTotalScore(anxietyResponse);
  const depressionTotal = calculateTotalScore(depressionResponse);
  const angerTotal = calculateTotalScore(angerResponse);

  return (
    <div>
      <div className="min-h-screen bg-muted">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
            <Link href="/admin/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{session}회차 설문 결과 확인</h1>
          </div>
        </header>

        <main className="container max-w-5xl py-8 pb-10 mx-auto">
          <div className="mb-6 p-4 rounded-sm border border-border bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">사용자 ID:</span>
                <span className="ml-2 font-medium">{user.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">이름:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">생년월일:</span>
                <span className="ml-2 font-medium">{user.birthDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">질병:</span>
                <span className="ml-2 font-medium">{user.disease}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  불안 설문 (총점: {anxietyTotal}점)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden border border-border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-20">
                          번호
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-left">
                          문항
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-32">
                          응답
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {anxietyQuestions.map((question, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border-b border-border p-3 text-sm text-center">
                            {index + 1}
                          </td>
                          <td className="border-b border-border p-3 text-sm">
                            {question}
                          </td>
                          <td className="border-b border-border p-3 text-sm text-center font-medium">
                            {getScaleLabel(
                              anxietyResponse[
                                `q${index + 1}` as keyof AnxietyResponse
                              ],
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  우울 설문 (총점: {depressionTotal}점)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden border border-border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-20">
                          번호
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-left">
                          문항
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-32">
                          응답
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {depressionQuestions.map((question, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border-b border-border p-3 text-sm text-center">
                            {index + 1}
                          </td>
                          <td className="border-b border-border p-3 text-sm">
                            {question}
                          </td>
                          <td className="border-b border-border p-3 text-sm text-center font-medium">
                            {getScaleLabel(
                              depressionResponse[
                                `q${index + 1}` as keyof DepressionResponse
                              ],
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  분노 설문 (총점: {angerTotal}점)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden border border-border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-20">
                          번호
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-left">
                          문항
                        </th>
                        <th className="border-b border-border p-3 text-sm font-medium text-center w-32">
                          응답
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {angerQuestions.map((question, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border-b border-border p-3 text-sm text-center">
                            {index + 1}
                          </td>
                          <td className="border-b border-border p-3 text-sm">
                            {question}
                          </td>
                          <td className="border-b border-border p-3 text-sm text-center font-medium">
                            {getScaleLabel(
                              angerResponse[
                                `q${index + 1}` as keyof AngerResponse
                              ],
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
