import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Play, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WorkoutItem {
  id: string;
  name: string;
  duration: number;
  calories: number;
  difficulty: string;
  type: string;
  completed: boolean;
}

export default function Workout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = 1; // Demo user ID

  const [workouts] = useState<WorkoutItem[]>([
    {
      id: "pilates-1",
      name: "普拉提核心训练",
      duration: 30,
      calories: 180,
      difficulty: "初级",
      type: "核心训练",
      completed: false
    },
    {
      id: "cardio-1",
      name: "轻度有氧运动",
      duration: 25,
      calories: 200,
      difficulty: "中级",
      type: "有氧运动",
      completed: true
    },
    {
      id: "yoga-1",
      name: "瑜伽拉伸",
      duration: 20,
      calories: 80,
      difficulty: "放松",
      type: "拉伸",
      completed: false
    },
    {
      id: "ballet-1",
      name: "芭蕾塑形训练",
      duration: 35,
      calories: 250,
      difficulty: "中级",
      type: "塑形",
      completed: false
    },
    {
      id: "hiit-1",
      name: "HIIT间歇训练",
      duration: 20,
      calories: 300,
      difficulty: "高强度",
      type: "燃脂",
      completed: false
    }
  ]);

  const logWorkoutMutation = useMutation({
    mutationFn: async (workout: WorkoutItem) => {
      const response = await apiRequest("POST", "/api/workout-session", {
        userId,
        workoutPlanId: 1,
        workoutName: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.calories,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "训练完成！",
        description: "已记录你的训练数据",
      });
    },
  });

  const handleStartWorkout = (workout: WorkoutItem) => {
    if (workout.completed) {
      toast({
        title: "已完成",
        description: "你今天已经完成了这项训练",
      });
      return;
    }

    // Simulate workout completion
    setTimeout(() => {
      logWorkoutMutation.mutate(workout);
    }, 1000);

    toast({
      title: "开始训练",
      description: `正在开始${workout.name}`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级":
        return "bg-green-100 text-green-700";
      case "中级":
        return "bg-yellow-100 text-yellow-700";
      case "高强度":
        return "bg-red-100 text-red-700";
      case "放松":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "核心训练":
        return "bg-purple-100 text-purple-700";
      case "有氧运动":
        return "bg-red-100 text-red-700";
      case "拉伸":
        return "bg-blue-100 text-blue-700";
      case "塑形":
        return "bg-pink-100 text-pink-700";
      case "燃脂":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">今日训练</h1>
        <p className="text-gray-600">选择训练项目开始锻炼</p>
      </div>

      {/* Today's Plan Overview */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-lg">优雅纤细塑形计划 - 第1周</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">训练项目</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">130</p>
              <p className="text-sm text-gray-600">总时长(分钟)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">1010</p>
              <p className="text-sm text-gray-600">预计卡路里</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout List */}
      <div className="space-y-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className={`${workout.completed ? 'bg-gray-50' : 'bg-white'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{workout.name}</h3>
                  <div className="flex space-x-2 mb-2">
                    <Badge className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                    <Badge className={getTypeColor(workout.type)}>
                      {workout.type}
                    </Badge>
                  </div>
                </div>
                {workout.completed && (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {workout.duration}分钟
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1" />
                    {workout.calories}卡路里
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleStartWorkout(workout)}
                disabled={workout.completed || logWorkoutMutation.isPending}
                className={`w-full ${
                  workout.completed 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600'
                } text-white`}
              >
                {workout.completed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    已完成
                  </>
                ) : logWorkoutMutation.isPending ? (
                  "正在记录..."
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    开始训练
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Schedule */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>本周训练安排</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { day: "周一", workout: "普拉提核心训练", completed: true },
              { day: "周二", workout: "轻度有氧运动", completed: true },
              { day: "周三", workout: "普拉提核心训练", completed: false },
              { day: "周四", workout: "轻度有氧运动", completed: false },
              { day: "周五", workout: "普拉提核心训练", completed: false },
              { day: "周六", workout: "轻度有氧运动", completed: false },
              { day: "周日", workout: "瑜伽拉伸", completed: false },
            ].map((item) => (
              <div key={item.day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-12 text-sm font-medium text-gray-600">{item.day}</span>
                  <span className="text-gray-800">{item.workout}</span>
                </div>
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
