import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Star, TrendingUp, Target, Award, Users, Heart } from "lucide-react";
import type { User, BodyAnalysis } from "@/lib/types";

export default function Profile() {
  const userId = 1; // Demo user ID

  const { data: user } = useQuery<User>({
    queryKey: [`/api/user/${userId}`],
  });

  const { data: bodyAnalysis } = useQuery<BodyAnalysis>({
    queryKey: [`/api/body-analysis/user/${userId}/latest`],
  });

  const profileStats = [
    {
      icon: TrendingUp,
      label: "连续天数",
      value: user?.currentStreak || 7,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Target,
      label: "总训练",
      value: user?.totalWorkouts || 23,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Award,
      label: "目标达成",
      value: `${user?.targetProgress || 68}%`,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const menuItems = [
    {
      icon: Star,
      label: "我的体型分析",
      description: "查看详细的身体分析报告",
      badge: bodyAnalysis?.celebrityMatch || "未分析"
    },
    {
      icon: Target,
      label: "健身目标",
      description: "设置和调整你的健身目标",
      badge: "进行中"
    },
    {
      icon: Users,
      label: "分享成果",
      description: "与朋友分享你的健身成果",
      badge: null
    },
    {
      icon: Heart,
      label: "健康数据",
      description: "同步和管理健康数据",
      badge: null
    },
    {
      icon: Settings,
      label: "设置",
      description: "个人偏好和应用设置",
      badge: null
    }
  ];

  return (
    <div className="p-4 pb-20">
      {/* Profile Header */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 border-2 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user?.username || 'Demo User'}</h1>
              <p className="text-white/80 text-sm">{user?.email || 'demo@fitstar.com'}</p>
              {bodyAnalysis && (
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  {bodyAnalysis.bodyType}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {profileStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-white/80">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Body Type Match */}
      {bodyAnalysis && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>当前体型匹配</span>
              <Badge variant="secondary">{bodyAnalysis.matchPercentage}% 匹配</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face" 
                alt={bodyAnalysis.celebrityMatch} 
                className="w-15 h-15 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{bodyAnalysis.celebrityMatch}</h3>
                <p className="text-sm text-gray-600">{bodyAnalysis.bodyType}</p>
                <p className="text-xs text-gray-500 mt-1">
                  分析时间: {new Date(bodyAnalysis.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {item.badge && (
                    <Badge variant="outline" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* App Version */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">FitStar v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">让健身更有趣</p>
      </div>
    </div>
  );
}
