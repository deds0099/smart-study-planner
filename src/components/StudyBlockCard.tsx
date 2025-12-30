import { Check, Clock, BookOpen, HelpCircle, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudyBlock, StudyType, Subject, Topic } from '@/types/study';
import { cn } from '@/lib/utils';

interface StudyBlockCardProps {
  block: StudyBlock;
  subject: Subject;
  topic: Topic;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  index: number;
}

const typeLabels: Record<StudyType, { label: string; icon: React.ReactNode }> = {
  theory: { label: 'Teoria', icon: <BookOpen className="h-4 w-4" /> },
  questions: { label: 'Questões', icon: <HelpCircle className="h-4 w-4" /> },
  revision: { label: 'Revisão', icon: <RotateCcw className="h-4 w-4" /> },
};

export function StudyBlockCard({ block, subject, topic, onComplete, onSkip, index }: StudyBlockCardProps) {
  const isCompleted = block.status === 'completed';
  const isSkipped = block.status === 'skipped';

  return (
    <Card
      className={cn(
        'p-4 border-l-4 transition-all duration-300 animate-slide-up',
        isCompleted && 'opacity-60 bg-success/5',
        isSkipped && 'opacity-40',
        !isCompleted && !isSkipped && 'hover:shadow-lg hover:-translate-y-1'
      )}
      style={{
        borderLeftColor: subject.color,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
            >
              {subject.name}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              {typeLabels[block.type].icon}
              {typeLabels[block.type].label}
            </Badge>
          </div>

          <h3 className={cn('font-semibold text-foreground mb-1', isCompleted && 'line-through')}>
            {topic.name}
          </h3>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {block.duration} min
            </span>
            <DifficultyBadge difficulty={topic.difficulty} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!isCompleted && !isSkipped && (
            <>
              <Button
                size="sm"
                className="gradient-success text-success-foreground shadow-md hover:shadow-lg transition-shadow"
                onClick={() => onComplete(block.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Concluir
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onSkip(block.id)}>
                Pular
              </Button>
            </>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1 text-success">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Feito!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    easy: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    hard: 'bg-destructive/10 text-destructive',
  };

  const labels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[difficulty as keyof typeof colors])}>
      {labels[difficulty as keyof typeof labels]}
    </span>
  );
}
