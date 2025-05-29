import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressChart } from "@/components/ProgressChart";
import { Trophy, Flame, Target, TrendingUp, Star, Lock } from "lucide-react";
import type { ProgressData, User, Achievement } from "@/lib/types";

export default function Progress() {
  const userId = 1; // Demo user ID

  const { data: user } = useQuery<User>({
    queryKey: [`/api/user/${userId}`],
  });

  const { data: progressData } = useQuery<ProgressData>({
    queryKey: [`/api/progress/user/${userId}`],
  });

  const achievements: Achievement[] = [
    {
      id: "streak-7",
      name: "连续7天",
      icon: "fire",
      description: "连续7天完成训练",
      unlocked: true,
      color: "from-amber-400 to-orange-500"
    },
    {
      id: "first-complete",
      name: "首次完成",
      icon: "trophy",
      description: "完成第一次训练",
      unlocked: true,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "perfect-week",
      name: "完美一周",
      icon: "star",
      description: "一周内完成所有训练",
      unlocked: true,
      color: "from-emerald-400 to-emerald-600"
    },
    {
      id: "locked",
      name: "待解锁",
      icon: "lock",
      description: "完成更多训练解锁",
      unlocked: false,
      color: "from-gray-200 to-gray-300"
    }
  ];

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "fire":
        return Flame;
      case "trophy":
        return Trophy;
      case "star":
        return Star;
      case "lock":
        return Lock;
      default:
        return Trophy;
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">进度追踪</h1>
        <p className="text-gray-600">查看你的健身成果和成长历程</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">连续天数</span>
              <Flame className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{user?.currentStreak || 7}</p>
            <p className="text-blue-600 text-xs">保持运动习惯</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 text-sm font-medium">总训练次数</span>
              <Target className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{user?.totalWorkouts || 23}</p>
            <p className="text-emerald-600 text-xs">累计锻炼</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">本周完成</span>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{progressData?.weeklyWorkouts || 5}/6</p>
            <p className="text-purple-600 text-xs">次训练</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-600 text-sm font-medium">燃烧卡路里</span>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-700">{progressData?.weeklyCalories || 1240}</p>
            <p className="text-orange-600 text-xs">本周</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      {progressData && (
        <div className="mb-6">
          <ProgressChart data={progressData.sessions} />
        </div>
      )}

      {/* Target Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>目标进度</span>
            <Badge variant="secondary">{user?.targetProgress || 68}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>理想体型达成度</span>
                <span>{user?.targetProgress || 68}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${user?.targetProgress || 68}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-700">28天</p>
                <p className="text-blue-600">预计达成</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <p className="font-semibold text-emerald-700">85%</p>
                <p className="text-emerald-600">计划完成度</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <p className="font-semibold text-purple-700">A+</p>
                <p className="text-purple-600">健身等级</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>成就徽章</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement) => {
              const Icon = getAchievementIcon(achievement.icon);
              return (
                <div key={achievement.id} className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`h-5 w-5 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
            <p className="text-sm text-gray-700 font-medium mb-1">下一个目标</p>
            <p className="text-xs text-gray-600">连续训练14天解锁"坚持不懈"徽章</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
