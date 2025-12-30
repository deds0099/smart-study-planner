import { X, Calendar, Clock, BookOpen, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudyBlock, Subject } from '@/types/study';
import { cn } from '@/lib/utils';

interface DayScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    blocks: StudyBlock[];
    subjects: Subject[];
    onComplete: (id: string) => void;
    onSkip: (id: string) => void;
}

export function DayScheduleModal({
    isOpen,
    onClose,
    date,
    blocks,
    subjects,
    onComplete,
    onSkip,
}: DayScheduleModalProps) {
    if (!isOpen) return null;

    const dayBlocks = blocks.filter((block) => {
        const blockDate = new Date(block.scheduledFor);
        return blockDate.toDateString() === date.toDateString();
    });

    const completedBlocks = dayBlocks.filter((b) => b.status === 'completed').length;
    const totalDuration = dayBlocks.reduce((acc, b) => acc + b.duration, 0);
    const completedDuration = dayBlocks
        .filter((b) => b.status === 'completed')
        .reduce((acc, b) => acc + b.duration, 0);

    const getBlockTypeIcon = (type: string) => {
        switch (type) {
            case 'theory':
                return <BookOpen className="h-4 w-4" />;
            case 'questions':
                return <HelpCircle className="h-4 w-4" />;
            case 'revision':
                return <RotateCcw className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getBlockTypeLabel = (type: string) => {
        switch (type) {
            case 'theory':
                return 'Teoria';
            case 'questions':
                return 'Questões';
            case 'revision':
                return 'Revisão';
            default:
                return type;
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground capitalize">{formatDate(date)}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {dayBlocks.length} blocos • {Math.round(totalDuration / 60 * 10) / 10}h de estudo
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progresso do dia</span>
                                <span className="font-bold text-primary">
                                    {completedBlocks}/{dayBlocks.length} blocos ({Math.round((completedBlocks / dayBlocks.length) * 100) || 0}%)
                                </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full gradient-primary transition-all duration-500"
                                    style={{ width: `${(completedBlocks / dayBlocks.length) * 100 || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {dayBlocks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">Nenhum bloco agendado</p>
                                <p className="text-sm">Este dia não tem blocos de estudo programados</p>
                            </div>
                        ) : (
                            dayBlocks.map((block, index) => {
                                const subject = subjects.find((s) => s.id === block.subjectId);
                                const topic = subject?.topics.find((t) => t.id === block.topicId);
                                const isCompleted = block.status === 'completed';
                                const isSkipped = block.status === 'skipped';

                                return (
                                    <Card
                                        key={block.id}
                                        className={cn(
                                            'p-4 transition-all duration-200',
                                            isCompleted && 'bg-success/5 border-success/20',
                                            isSkipped && 'bg-muted/50 opacity-60'
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        Bloco {index + 1}
                                                    </span>
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: subject?.color || '#888' }}
                                                    />
                                                    <span className="text-sm font-medium text-foreground">
                                                        {subject?.name || 'Matéria desconhecida'}
                                                    </span>
                                                </div>

                                                <h3 className={cn(
                                                    'font-semibold text-foreground mb-2',
                                                    (isCompleted || isSkipped) && 'line-through opacity-70'
                                                )}>
                                                    {topic?.name || 'Tópico desconhecido'}
                                                </h3>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        {getBlockTypeIcon(block.type)}
                                                        <span>{getBlockTypeLabel(block.type)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{block.duration} min</span>
                                                    </div>
                                                </div>

                                                {isCompleted && block.completedAt && (
                                                    <p className="text-xs text-success mt-2">
                                                        ✓ Concluído em {new Date(block.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                                {isSkipped && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        ⊘ Bloco pulado
                                                    </p>
                                                )}
                                            </div>

                                            {!isCompleted && !isSkipped && (
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onSkip(block.id)}
                                                    >
                                                        Pular
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="gradient-primary text-primary-foreground"
                                                        onClick={() => onComplete(block.id)}
                                                    >
                                                        Concluir
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-secondary/30">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                {completedBlocks < dayBlocks.length ? (
                                    <span>
                                        Faltam <span className="font-semibold text-foreground">{dayBlocks.length - completedBlocks}</span> blocos
                                    </span>
                                ) : dayBlocks.length > 0 ? (
                                    <span className="text-success font-semibold">🎉 Dia completo!</span>
                                ) : (
                                    <span>Dia de descanso</span>
                                )}
                            </div>
                            <Button variant="outline" onClick={onClose}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
