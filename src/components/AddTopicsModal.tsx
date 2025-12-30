import { useState } from 'react';
import { X, Plus, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject, Topic, Difficulty } from '@/types/study';
import { cn } from '@/lib/utils';

interface AddTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  studyDays: number[];
  onStudyDaysChange: (days: number[]) => void;
  onAddSubject: (subject: Omit<Subject, 'id' | 'topics'>) => void;
  onAddTopic: (subjectId: string, topic: Omit<Topic, 'id' | 'subjectId' | 'completed'>) => void;
  onRemoveTopic: (subjectId: string, topicId: string) => void;
  onRemoveSubject: (subjectId: string) => void;
  onGenerateSchedule: () => void;
}

const subjectColors = [
  'hsl(217 91% 50%)',
  'hsl(24 95% 53%)',
  'hsl(142 76% 36%)',
  'hsl(262 83% 58%)',
  'hsl(346 77% 50%)',
  'hsl(199 89% 48%)',
];

const weekDays = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda', short: 'Seg' },
  { id: 2, name: 'Terça', short: 'Ter' },
  { id: 3, name: 'Quarta', short: 'Qua' },
  { id: 4, name: 'Quinta', short: 'Qui' },
  { id: 5, name: 'Sexta', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
];

export function AddTopicsModal({
  isOpen,
  onClose,
  subjects,
  studyDays,
  onStudyDaysChange,
  onAddSubject,
  onAddTopic,
  onRemoveTopic,
  onRemoveSubject,
  onGenerateSchedule,
}: AddTopicsModalProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectWeight, setNewSubjectWeight] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<Difficulty>('medium');
  const [activeTab, setActiveTab] = useState<'days' | 'subjects' | 'topics'>('days');

  if (!isOpen) return null;

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const colorIndex = subjects.length % subjectColors.length;
    onAddSubject({
      name: newSubjectName.trim(),
      color: subjectColors[colorIndex],
      weight: parseInt(newSubjectWeight) || 10,
    });
    setNewSubjectName('');
    setNewSubjectWeight('10');
  };

  const handleAddTopic = () => {
    if (!selectedSubject || !newTopicName.trim()) return;
    onAddTopic(selectedSubject, {
      name: newTopicName.trim(),
      difficulty: newTopicDifficulty,
    });
    setNewTopicName('');
  };

  const toggleDay = (dayId: number) => {
    if (studyDays.includes(dayId)) {
      onStudyDaysChange(studyDays.filter((d) => d !== dayId));
    } else {
      onStudyDaysChange([...studyDays, dayId].sort((a, b) => a - b));
    }
  };

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8 px-4 flex items-start justify-center">
        <Card
          className="w-full max-w-2xl bg-card animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Configurar Edital</h2>
                <p className="text-sm text-muted-foreground">
                  {subjects.length} matérias • {totalTopics} tópicos • {studyDays.length} dias/semana
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === 'days'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActiveTab('days')}
            >
              1. Dias de Estudo
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === 'subjects'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActiveTab('subjects')}
            >
              2. Matérias
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === 'topics'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActiveTab('topics')}
            >
              3. Tópicos
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'days' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Quais dias você pode estudar?</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione os dias da semana disponíveis para criar seu cronograma
                  </p>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const isSelected = studyDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={cn(
                          'flex flex-col items-center p-3 rounded-xl transition-all duration-200',
                          isSelected
                            ? 'gradient-primary text-primary-foreground shadow-glow'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground'
                        )}
                      >
                        <span className="text-xs font-medium">{day.short}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dias selecionados:</span>
                    <span className="font-semibold text-foreground">{studyDays.length} dias/semana</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tempo estimado de estudo:</span>
                    <span className="font-semibold text-foreground">{studyDays.length * 2}h-{studyDays.length * 3}h/semana</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onStudyDaysChange([1, 2, 3, 4, 5])}
                  >
                    Seg a Sex
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onStudyDaysChange([0, 1, 2, 3, 4, 5, 6])}
                  >
                    Todos os dias
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onStudyDaysChange([1, 3, 5])}
                  >
                    Alternados
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'subjects' && (
              <>
                {/* Add Subject Form */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Adicionar Matéria</Label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Ex: Português, Matemática..."
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        placeholder="Peso"
                        value={newSubjectWeight}
                        onChange={(e) => setNewSubjectWeight(e.target.value)}
                        min="1"
                        max="100"
                      />
                    </div>
                    <Button onClick={handleAddSubject} className="gradient-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O peso define a importância da matéria (mais questões = peso maior)
                  </p>
                </div>

                {/* Subjects List */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Suas Matérias</Label>
                  {subjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma matéria cadastrada</p>
                      <p className="text-sm">Comece adicionando as matérias do seu edital</p>
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border-l-4"
                        style={{ borderLeftColor: subject.color }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <div>
                            <p className="font-medium text-foreground">{subject.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Peso: {subject.weight} • {subject.topics.length} tópicos
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => onRemoveSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === 'topics' && (
              <>
                {/* Add Topic Form */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Adicionar Tópico</Label>
                  
                  <div className="grid gap-3">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Selecione a matéria" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border z-[100]">
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: subject.color }}
                              />
                              {subject.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-3">
                      <Input
                        className="flex-1"
                        placeholder="Nome do tópico"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                      />
                      <Select value={newTopicDifficulty} onValueChange={(v) => setNewTopicDifficulty(v as Difficulty)}>
                        <SelectTrigger className="w-32 bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-[100]">
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddTopic} className="gradient-primary text-primary-foreground">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Topics by Subject */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Tópicos por Matéria</Label>
                  
                  {subjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Adicione matérias primeiro</p>
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="font-medium text-foreground">{subject.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({subject.topics.length} tópicos)
                          </span>
                        </div>
                        
                        {subject.topics.length === 0 ? (
                          <p className="text-sm text-muted-foreground pl-5">
                            Nenhum tópico cadastrado
                          </p>
                        ) : (
                          <div className="pl-5 space-y-1">
                            {subject.topics.map((topic) => (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-foreground">{topic.name}</span>
                                  <DifficultyBadge difficulty={topic.difficulty} />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => onRemoveTopic(subject.id, topic.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {totalTopics > 0 && studyDays.length > 0
                  ? `${totalTopics} tópicos em ${studyDays.length} dias/semana`
                  : 'Configure os dias e adicione tópicos'}
              </p>
              <Button
                className="gradient-primary text-primary-foreground shadow-glow"
                disabled={totalTopics === 0 || studyDays.length === 0}
                onClick={onGenerateSchedule}
              >
                Gerar Cronograma Inteligente
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = {
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
