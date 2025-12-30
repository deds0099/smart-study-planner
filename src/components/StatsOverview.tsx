import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: 'primary' | 'accent' | 'success';
}

function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const bgColors = {
    primary: 'bg-primary/10',
    accent: 'bg-accent/10',
    success: 'bg-success/10',
  };

  const iconColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
  };

  return (
    <Card className="p-4 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${bgColors[color]}`}>
          <div className={iconColors[color]}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
      </div>
    </Card>
  );
}

interface StatsOverviewProps {
  blocksCompleted: number;
  totalBlocks: number;
  hoursToday: number;
  streak: number;
}

export function StatsOverview({ blocksCompleted, totalBlocks, hoursToday, streak }: StatsOverviewProps) {
  const percentage = totalBlocks > 0 ? Math.round((blocksCompleted / totalBlocks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Target className="h-5 w-5" />}
        label="Hoje"
        value={`${blocksCompleted}/${totalBlocks}`}
        subtext={`${percentage}% concluído`}
        color="primary"
      />
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        label="Tempo estudado"
        value={`${hoursToday}h`}
        subtext="Meta: 3h diárias"
        color="accent"
      />
      <StatCard
        icon={<BookOpen className="h-5 w-5" />}
        label="Tópicos estudados"
        value="12"
        subtext="Esta semana"
        color="success"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Sequência"
        value={`${streak} dias`}
        subtext="Continue assim! 🔥"
        color="primary"
      />
    </div>
  );
}
