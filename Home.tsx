import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/PhotoUpload";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import { ProgressChart } from "@/components/ProgressChart";
import { Star, TrendingUp, Flame, Quote, Plus, Camera as CameraIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ProgressData } from "@/lib/types";
import type { User, BodyAnalysis } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const { toast } = useToast();
  const userId = 1; // Demo user ID

  const getCelebrityImage = (celebrityName: string) => {
    const images = {
      "刘诗诗": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
      "杨幂": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop&crop=face",
      "迪丽热巴": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop&crop=face"
    };
    return images[celebrityName as keyof typeof images] || images["刘诗诗"];
  };

  const { data: user } = useQuery<User>({
    queryKey: [`/api/user/${userId}`],
  });

  const { data: bodyAnalysis } = useQuery<BodyAnalysis>({
    queryKey: [`/api/body-analysis/user/${userId}/latest`],
    enabled: showAnalysisResults,
  });

  const { data: progressData } = useQuery<ProgressData>({
    queryKey: [`/api/progress/user/${userId}`],
  });

  const handleAnalysisComplete = () => {
    setShowAnalysisResults(true);
  };

  const handleStartWorkoutPlan = () => {
    toast({
      title: "训练计划已开始！",
      description: "请前往训练页面查看详细内容。",
    });
    setLocation("/workout");
  };

  const handleLogWorkout = () => {
    toast({
      title: "训练记录已保存！",
      description: "继续保持运动习惯。",
    });
  };

  const handleTakeProgress = () => {
    toast({
      title: "进度照片",
      description: "功能正在开发中...",
    });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-4 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FitStar</h1>
              <p className="text-sm opacity-90">找到你的明星体型</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="h-4 w-4" />
          </div>
        </div>
        
        {/* User Stats Quick View */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-2xl font-bold">{user?.currentStreak || 7}</p>
            <p className="text-xs opacity-80">连续天数</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-2xl font-bold">{user?.totalWorkouts || 23}</p>
            <p className="text-xs opacity-80">总锻炼</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-2xl font-bold">{user?.targetProgress || 68}%</p>
            <p className="text-xs opacity-80">目标达成</p>
          </div>
        </div>
      </header>

      {/* Photo Analysis Section */}
      <section className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">体型分析</h2>
          <p className="text-gray-600">上传照片，发现你的明星体型匹配</p>
        </div>

        {!showAnalysisResults ? (
          <PhotoUpload userId={userId} onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          bodyAnalysis && (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">分析完成！</h3>
                    <p className="text-gray-600 text-sm">找到了你的明星匹配</p>
                  </div>
                </div>

                {/* Celebrity Match with Comparison */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">最佳匹配</h4>
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {bodyAnalysis.matchPercentage}% 匹配
                    </span>
                  </div>
                  
                  {/* Photo Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="relative">
                        <img 
                          src={bodyAnalysis.photoUrl} 
                          alt="Your photo" 
                          className="w-full h-32 rounded-xl object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          你的照片
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative">
                        <img 
                          src={getCelebrityImage(bodyAnalysis.celebrityMatch)} 
                          alt={bodyAnalysis.celebrityMatch} 
                          className="w-full h-32 rounded-xl object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {bodyAnalysis.celebrityMatch}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <h5 className="text-xl font-bold text-gray-800">{bodyAnalysis.celebrityMatch}</h5>
                    <p className="text-gray-600 text-sm mb-2">{bodyAnalysis.bodyType}</p>
                    <div className="flex justify-center space-x-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">优雅气质</span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs">身材比例佳</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Body Proportion Comparison */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">身体比例对比分析</h4>
                  
                  <div className="space-y-4">
                    {/* Shoulder Ratio Comparison */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-700 font-medium">肩宽比例</span>
                        <span className="text-blue-600 text-sm">相似度: {Math.min(100, bodyAnalysis.shoulderRatio + 5)}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">你的数据</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${bodyAnalysis.shoulderRatio}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-blue-700">{bodyAnalysis.shoulderRatio}%</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{bodyAnalysis.celebrityMatch}</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-blue-400 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(85, bodyAnalysis.shoulderRatio + 3)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-blue-600">{Math.min(85, bodyAnalysis.shoulderRatio + 3)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Waist-Hip Ratio Comparison */}
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-emerald-700 font-medium">腰臀比例</span>
                        <span className="text-emerald-600 text-sm">相似度: {Math.min(100, bodyAnalysis.waistHipRatio + 8)}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">你的数据</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${bodyAnalysis.waistHipRatio}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-emerald-700">{bodyAnalysis.waistHipRatio}%</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{bodyAnalysis.celebrityMatch}</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-emerald-400 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(88, bodyAnalysis.waistHipRatio + 5)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-emerald-600">{Math.min(88, bodyAnalysis.waistHipRatio + 5)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Leg Ratio Comparison */}
                    <div className="bg-violet-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-violet-700 font-medium">腿长比例</span>
                        <span className="text-violet-600 text-sm">相似度: {Math.min(100, bodyAnalysis.legRatio + 2)}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">你的数据</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-violet-500 rounded-full transition-all duration-500"
                              style={{ width: `${bodyAnalysis.legRatio}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-violet-700">{bodyAnalysis.legRatio}%</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{bodyAnalysis.celebrityMatch}</p>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className="h-3 bg-violet-400 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(95, bodyAnalysis.legRatio + 4)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-violet-600">{Math.min(95, bodyAnalysis.legRatio + 4)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goal Setting */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <h5 className="text-amber-800 font-semibold mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      改善目标建议
                    </h5>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• 通过针对性训练，肩宽比例可提升 {Math.max(0, 85 - bodyAnalysis.shoulderRatio)} 个百分点</li>
                      <li>• 核心训练将帮助优化腰臀比例至理想状态</li>
                      <li>• 拉伸和体态训练能让腿部线条更修长</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </section>

      {/* Workout Plan Section */}
      {bodyAnalysis && (
        <section className="p-4 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">专属训练计划</h2>
            <p className="text-gray-600">基于你的体型分析，为你定制两周训练</p>
          </div>

          <WorkoutPlan 
            bodyType={bodyAnalysis.bodyType} 
            onStartPlan={handleStartWorkoutPlan}
          />
        </section>
      )}

      {/* Progress Tracking Section */}
      <section className="p-4 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">进度追踪</h2>
          <p className="text-gray-600">记录你的健身历程</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">本周完成</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{progressData?.weeklyWorkouts || 5}/6</p>
            <p className="text-blue-600 text-xs">次训练</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 text-sm font-medium">燃烧卡路里</span>
              <Flame className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{progressData?.weeklyCalories || 1240}</p>
            <p className="text-emerald-600 text-xs">本周</p>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        {progressData && <ProgressChart data={progressData.sessions} />}
      </section>

      {/* Motivational Message Section */}
      <section className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">今日激励</h3>
            <p className="text-white/80 text-sm">保持动力，追求更好的自己</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-lg font-medium mb-2">"每一次锻炼都是向理想体型迈进的一步，坚持就是胜利！"</p>
          <p className="text-white/70 text-sm">—— 今日训练提醒</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleLogWorkout}
            variant="ghost"
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            记录训练
          </Button>
          <Button
            onClick={handleTakeProgress}
            variant="ghost"
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            进度照片
          </Button>
        </div>
      </section>
    </div>
  );
}
