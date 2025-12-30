import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Subject } from '@/types/study';
import { cn } from '@/lib/utils';

interface SubjectProgressProps {
  subjects: Subject[];
  onSubjectClick: (id: string) => void;
}

export function SubjectProgress({ subjects, onSubjectClick }: SubjectProgressProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Progresso por Matéria</h2>

      <div className="space-y-3">
        {subjects.map((subject, index) => {
          const completedTopics = subject.topics.filter((t) => t.completed).length;
          const totalTopics = subject.topics.length;
          const percentage = Math.round((completedTopics / totalTopics) * 100);

          return (
            <Card
              key={subject.id}
              className={cn(
                'p-4 cursor-pointer transition-all duration-300 hover:shadow-lg animate-slide-up',
                'border-l-4'
              )}
              style={{
                borderLeftColor: subject.color,
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => onSubjectClick(subject.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedTopics} de {totalTopics} tópicos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: subject.color }}>
                    {percentage}%
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName="transition-all duration-500"
                style={
                  {
                    '--tw-progress-fill': subject.color,
                  } as React.CSSProperties
                }
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
