import { X, Clock, BookOpen, Bell, Moon, Sun, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    blocksPerDay: number;
    blockDuration: number;
    notificationsEnabled: boolean;
    darkMode: boolean;
    subjectsPerDay?: number;
  };
  onSettingsChange: (settings: {
    blocksPerDay: number;
    blockDuration: number;
    notificationsEnabled: boolean;
    darkMode: boolean;
    subjectsPerDay?: number;
  }) => void;
  onRegenerate?: () => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSettingsChange, onRegenerate }: SettingsModalProps) {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8 px-4 flex items-start justify-center">
        <Card
          className="w-full max-w-md bg-card animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Configurações</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Study settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Estudo
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <Label className="text-foreground">Blocos por dia</Label>
                    <p className="text-xs text-muted-foreground">Quantidade de sessões diárias</p>
                  </div>
                </div>
                <Select
                  value={settings.blocksPerDay.toString()}
                  onValueChange={(v) => updateSetting('blocksPerDay', parseInt(v))}
                >
                  <SelectTrigger className="w-20 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-[100]">
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Layers className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <Label className="text-foreground">Matérias por dia</Label>
                    <p className="text-xs text-muted-foreground">Máximo de matérias diferentes</p>
                  </div>
                </div>
                <Select
                  value={(settings.subjectsPerDay || 2).toString()}
                  onValueChange={(v) => updateSetting('subjectsPerDay', parseInt(v))}
                >
                  <SelectTrigger className="w-20 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-[100]">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <Label className="text-foreground">Duração do bloco</Label>
                    <p className="text-xs text-muted-foreground">Tempo de cada sessão (min)</p>
                  </div>
                </div>
                <Select
                  value={settings.blockDuration.toString()}
                  onValueChange={(v) => updateSetting('blockDuration', parseInt(v))}
                >
                  <SelectTrigger className="w-20 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-[100]">
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Notificações
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Bell className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <Label className="text-foreground">Lembretes</Label>
                    <p className="text-xs text-muted-foreground">Receber alertas de revisão</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(v) => updateSetting('notificationsEnabled', v)}
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Aparência
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    {settings.darkMode ? (
                      <Moon className="h-4 w-4 text-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                  <div>
                    <Label className="text-foreground">Modo escuro</Label>
                    <p className="text-xs text-muted-foreground">Tema da interface</p>
                  </div>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(v) => updateSetting('darkMode', v)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              className="w-full gradient-primary"
              onClick={() => {
                if (onRegenerate) onRegenerate();
                onClose();
              }}
            >
              Salvar e Regerar Cronograma
            </Button>
            <Button className="w-full" variant="outline" onClick={onClose}>
              Fechar sem alterar cronograma
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
