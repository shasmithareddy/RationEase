import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock } from "lucide-react";

interface QueueStatsProps {
  waiting: number;
  completed: number;
  total: number;
}

const QueueStats = ({ waiting, completed, total }: QueueStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                காத்திருக்கும் / Waiting
              </p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
                {waiting}
              </p>
            </div>
            <div className="bg-yellow-200 dark:bg-yellow-800 rounded-full p-3">
              <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                முடிந்தவை / Completed
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                {completed}
              </p>
            </div>
            <div className="bg-green-200 dark:bg-green-800 rounded-full p-3">
              <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                மொத்தம் / Total Today
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {total}
              </p>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-700 dark:text-blue-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueStats;
