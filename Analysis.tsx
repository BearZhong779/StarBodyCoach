import { useState } from "react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { BodyAnalysis } from "@/lib/types";

export default function Analysis() {
  const [refreshKey, setRefreshKey] = useState(0);
  const userId = 1; // Demo user ID

  const { data: analyses } = useQuery<BodyAnalysis[]>({
    queryKey: [`/api/body-analysis/user/${userId}`, refreshKey],
  });

  const handleAnalysisComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">体型分析</h1>
        <p className="text-gray-600">通过AI分析找到你的明星体型匹配</p>
      </div>

      <div className="mb-6">
        <PhotoUpload userId={userId} onAnalysisComplete={handleAnalysisComplete} />
      </div>

      {/* Analysis History */}
      {analyses && analyses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">分析历史</h2>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{analysis.celebrityMatch}</span>
                    <Badge variant="secondary">{analysis.matchPercentage}% 匹配</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face" 
                      alt={analysis.celebrityMatch} 
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{analysis.bodyType}</h3>
                      <p className="text-sm text-gray-600">
                        分析时间: {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-700">{analysis.shoulderRatio}%</p>
                      <p className="text-blue-600">肩宽比例</p>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <p className="font-semibold text-emerald-700">{analysis.waistHipRatio}%</p>
                      <p className="text-emerald-600">腰臀比</p>
                    </div>
                    <div className="text-center p-2 bg-violet-50 rounded-lg">
                      <p className="font-semibold text-violet-700">{analysis.legRatio}%</p>
                      <p className="text-violet-600">腿长比例</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
