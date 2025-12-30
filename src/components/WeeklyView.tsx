import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StudyBlock, Subject } from '@/types/study';
import { cn } from '@/lib/utils';
import { DayScheduleModal } from './DayScheduleModal';

interface WeeklyViewProps {
  blocks: StudyBlock[];
  subjects: Subject[];
  studyDays: number[];
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
}

interface DayData {
  name: string;
  shortName: string;
  date: Date;
  blocks: StudyBlock[];
  completed: number;
  isToday: boolean;
  isStudyDay: boolean;
}

export function WeeklyView({ blocks, subjects, studyDays, onComplete, onSkip }: WeeklyViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Gerar dados da semana atual
  const getWeekDays = (): DayData[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const weekDayNames = [
      { name: 'Segunda', short: 'Seg' },
      { name: 'Terça', short: 'Ter' },
      { name: 'Quarta', short: 'Qua' },
      { name: 'Quinta', short: 'Qui' },
      { name: 'Sexta', short: 'Sex' },
      { name: 'Sábado', short: 'Sáb' },
      { name: 'Domingo', short: 'Dom' },
    ];

    return weekDayNames.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      const dayOfWeek = date.getDay();
      const isStudyDay = studyDays.includes(dayOfWeek);

      const dayBlocks = blocks.filter((block) => {
        const blockDate = new Date(block.scheduledFor);
        return blockDate.toDateString() === date.toDateString();
      });

      const completedBlocks = dayBlocks.filter((b) => b.status === 'completed').length;

      return {
        name: day.name,
        shortName: day.short,
        date,
        blocks: dayBlocks,
        completed: completedBlocks,
        isToday: date.toDateString() === today.toDateString(),
        isStudyDay,
      };
    });
  };

  const weekDays = getWeekDays();
  const totalBlocks = weekDays.reduce((acc, day) => acc + day.blocks.length, 0);
  const totalCompleted = weekDays.reduce((acc, day) => acc + day.completed, 0);
  const weekProgress = totalBlocks > 0 ? Math.round((totalCompleted / totalBlocks) * 100) : 0;

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Esta Semana</h2>
          <span className="text-sm text-muted-foreground">
            {totalCompleted}/{totalBlocks} blocos
          </span>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const percentage = day.blocks.length > 0 ? (day.completed / day.blocks.length) * 100 : 0;
              const isComplete = percentage === 100 && day.blocks.length > 0;
              const isRest = !day.isStudyDay || day.blocks.length === 0;

              return (
                <div
                  key={day.shortName}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-secondary/50',
                    day.isToday && 'ring-2 ring-primary ring-offset-2',
                    isComplete && 'bg-success/10',
                    isRest && 'bg-muted/50'
                  )}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <span
                    className={cn(
                      'text-xs font-medium mb-2',
                      day.isToday ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {day.shortName}
                  </span>

                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                      isRest && 'bg-muted text-muted-foreground',
                      isComplete && 'gradient-success text-success-foreground',
                      !isRest && !isComplete && percentage > 0 && 'bg-primary/20 text-primary',
                      !isRest && !isComplete && percentage === 0 && 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {isRest ? '😴' : isComplete ? '✓' : `${day.completed}`}
                  </div>

                  {!isRest && (
                    <span className="text-xs text-muted-foreground mt-1">
                      /{day.blocks.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso semanal</span>
              <span className="font-semibold text-foreground">
                {totalCompleted}/{totalBlocks} blocos ({weekProgress}%)
              </span>
            </div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${weekProgress}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      <DayScheduleModal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        date={selectedDay || new Date()}
        blocks={blocks}
        subjects={subjects}
        onComplete={onComplete}
        onSkip={onSkip}
      />
    </>
  );
}
