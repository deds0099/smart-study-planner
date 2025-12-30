import { X, Check, ChevronLeft, BookOpen, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Subject, StudyBlock } from '@/types/study';
import { cn } from '@/lib/utils';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  blocks: StudyBlock[];
  onMarkTopicComplete: (subjectId: string, topicId: string) => void;
}

export function SubjectDetailModal({
  isOpen,
  onClose,
  subject,
  blocks,
  onMarkTopicComplete,
}: SubjectDetailModalProps) {
  if (!isOpen || !subject) return null;

  const completedTopics = subject.topics.filter((t) => t.completed);
  const pendingTopics = subject.topics.filter((t) => !t.completed);
  const percentage = Math.round((completedTopics.length / subject.topics.length) * 100) || 0;

  const getTopicBlocks = (topicId: string) => {
    return blocks.filter((b) => b.topicId === topicId);
  };

  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="h-3 w-3" />;
      case 'questions':
        return <HelpCircle className="h-3 w-3" />;
      case 'revision':
        return <RotateCcw className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8 px-4 flex items-start justify-center">
        <Card
          className="w-full max-w-2xl bg-card animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <h2 className="text-xl font-bold text-foreground">{subject.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedTopics.length} de {subject.topics.length} tópicos concluídos
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso geral</span>
                <span className="font-bold" style={{ color: subject.color }}>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Pending Topics */}
            {pendingTopics.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Tópicos Pendentes ({pendingTopics.length})
                </h3>
                <div className="space-y-2">
                  {pendingTopics.map((topic) => {
                    const topicBlocks = getTopicBlocks(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{topic.name}</span>
                            <DifficultyBadge difficulty={topic.difficulty} />
                          </div>
                          {topicBlocks.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {topicBlocks.map((block) => (
                                <span
                                  key={block.id}
                                  className={cn(
                                    'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                                    block.status === 'completed'
                                      ? 'bg-success/10 text-success'
                                      : block.status === 'pending'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  {getBlockTypeIcon(block.type)}
                                  {block.duration}min
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-4"
                          onClick={() => onMarkTopicComplete(subject.id, topic.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Concluir
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Topics */}
            {completedTopics.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Tópicos Concluídos ({completedTopics.length})
                </h3>
                <div className="space-y-2">
                  {completedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground line-through opacity-70">
                            {topic.name}
                          </span>
                          {topic.lastStudied && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Estudado em {new Date(topic.lastStudied).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                      <DifficultyBadge difficulty={topic.difficulty} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {subject.topics.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum tópico cadastrado</p>
                <p className="text-sm">Adicione tópicos para esta matéria no editor de edital</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {pendingTopics.length > 0 ? (
                  <span>
                    Faltam <span className="font-semibold text-foreground">{pendingTopics.length}</span> tópicos para fechar esta matéria
                  </span>
                ) : (
                  <span className="text-success font-semibold">🎉 Matéria concluída!</span>
                )}
              </div>
              <Button variant="outline" onClick={onClose}>
                Voltar ao cronograma
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config: Record<string, { label: string; className: string }> = {
    easy: { label: 'Fácil', className: 'bg-success/10 text-success' },
    medium: { label: 'Médio', className: 'bg-warning/10 text-warning' },
    hard: { label: 'Difícil', className: 'bg-destructive/10 text-destructive' },
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', config[difficulty].className)}>
      {config[difficulty].label}
    </span>
  );
}
