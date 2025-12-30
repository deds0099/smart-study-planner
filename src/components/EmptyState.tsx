import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  onAddTopics: () => void;
}

export function EmptyState({ onAddTopics }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center border-dashed border-2 animate-fade-in">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Configure seu Edital
          </h3>
          <p className="text-muted-foreground">
            Adicione as matérias e tópicos do seu concurso para gerar um cronograma de estudos inteligente e personalizado.
          </p>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="gradient-primary text-primary-foreground shadow-glow"
            onClick={onAddTopics}
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Matérias e Tópicos
          </Button>
        </div>

        <div className="pt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-primary">1</p>
            <p className="text-xs text-muted-foreground">Cadastre matérias</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-accent">2</p>
            <p className="text-xs text-muted-foreground">Adicione tópicos</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-success">3</p>
            <p className="text-xs text-muted-foreground">Gere o cronograma</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
