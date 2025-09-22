"use client";

import { useState } from "react";
import { UsageStatistics } from "@/components/profile/usage-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import ProfileSettings from "@/components/profile/profile-settings";

type UserType = "user" | "admin";

export interface UserData {
  name: string;
  email: string;
  organization: string;
  userType: UserType;
  joinDate: string;
  lastLogin: string;
}

const dummyUser: UserData = {
  name: "홍길동",
  email: "hong@test.com",
  organization: "서울대",
  userType: "user",
  joinDate: "2025-09-01",
  lastLogin: "2025-09-18",
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData>(dummyUser);

  return (
    <div className="min-h-screen bg-background w-full overflow-auto">
      <div className="container mx-auto lg:p-12 md:p-8 sm:p-6">
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {user.name}
                </h1>
                <Badge variant="outline" className="rounded-sm">
                  {user.userType === "admin" ? "관리자" : "사용자"}
                </Badge>
              </div>
              <p className="text-base text-foreground/70 mt-1">
                {user.organization}
              </p>
            </div>
          </div>

          <Tabs defaultValue="settings" className="space-y-8">
            <TabsList className="bg-muted w-full">
              <TabsTrigger value="settings" className="flex-1">
                계정 설정
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex-1">
                사용량 통계
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <ProfileSettings userData={user} onUserDataChange={setUser} />
            </TabsContent>

            <TabsContent value="usage">
              <UsageStatistics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
