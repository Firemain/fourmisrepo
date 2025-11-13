'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Mail, X, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface InviteStudentsModalProps {
  open: boolean;
  onClose: () => void;
  schoolId: string;
}

interface EmailEntry {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function InviteStudentsModal({ open, onClose, schoolId }: InviteStudentsModalProps) {
  const { showToast, ToastComponent } = useToast();
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour l'ajout manuel
  const [emailEntries, setEmailEntries] = useState<EmailEntry[]>([
    { id: '1', email: '', firstName: '', lastName: '' }
  ]);
  
  // État pour import CSV
  const [csvContent, setCsvContent] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const addEmailEntry = () => {
    setEmailEntries([
      ...emailEntries,
      { id: Date.now().toString(), email: '', firstName: '', lastName: '' }
    ]);
  };

  const removeEmailEntry = (id: string) => {
    if (emailEntries.length === 1) return; // Garder au moins un champ
    setEmailEntries(emailEntries.filter(entry => entry.id !== id));
  };

  const updateEmailEntry = (id: string, field: keyof EmailEntry, value: string) => {
    setEmailEntries(
      emailEntries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const parseCsvContent = (): EmailEntry[] => {
    if (!csvContent) return [];

    const lines = csvContent.split('\n').filter(line => line.trim());
    const entries: EmailEntry[] = [];

    // Ignorer la première ligne si c'est un header
    const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(part => part.trim());
      if (parts[0]) {
        entries.push({
          id: `csv-${i}`,
          email: parts[0],
          firstName: parts[1] || undefined,
          lastName: parts[2] || undefined,
        });
      }
    }

    return entries;
  };

  const handleSendInvitations = async () => {
    setIsLoading(true);

    try {
      // Récupérer les entrées selon l'onglet actif
      const entries = activeTab === 'manual' ? emailEntries : parseCsvContent();

      // Valider les emails
      const validEntries = entries.filter(entry => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return entry.email && emailRegex.test(entry.email);
      });

      if (validEntries.length === 0) {
        showToast('Aucune adresse email valide trouvée', 'error');
        setIsLoading(false);
        return;
      }

      // Envoyer les invitations
      const response = await fetch('/api/school/invite-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          students: validEntries.map(entry => ({
            email: entry.email,
            firstName: entry.firstName,
            lastName: entry.lastName,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'envoi des invitations');
      }

      const result = await response.json();

      showToast(
        `${result.sent} invitation(s) envoyée(s) avec succès !`,
        'success',
        5000
      );

      // Réinitialiser et fermer
      setEmailEntries([{ id: '1', email: '', firstName: '', lastName: '' }]);
      setCsvContent('');
      setCsvFile(null);
      onClose();

      // Recharger la page pour afficher les nouvelles invitations
      window.location.reload();
    } catch (error: any) {
      console.error('Error sending invitations:', error);
      showToast(error.message || 'Erreur lors de l\'envoi des invitations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {ToastComponent}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#18534F]">
              Inviter des étudiants
            </DialogTitle>
            <DialogDescription>
              Envoyez des invitations par email à vos étudiants pour qu'ils rejoignent la plateforme
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'manual' | 'csv')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Mail size={16} />
                Saisie manuelle
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <Upload size={16} />
                Import CSV
              </TabsTrigger>
            </TabsList>

            {/* Onglet Saisie Manuelle */}
            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Ajoutez les emails de vos étudiants</p>
                  <p>Les noms et prénoms sont optionnels mais recommandés pour personnaliser les invitations.</p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {emailEntries.map((entry, index) => (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Étudiant {index + 1}</span>
                      {emailEntries.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmailEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label htmlFor={`email-${entry.id}`} className="text-sm font-medium">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`email-${entry.id}`}
                          type="email"
                          placeholder="etudiant@exemple.fr"
                          value={entry.email}
                          onChange={(e) => updateEmailEntry(entry.id, 'email', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`firstName-${entry.id}`} className="text-sm font-medium">
                            Prénom
                          </Label>
                          <Input
                            id={`firstName-${entry.id}`}
                            placeholder="Jean"
                            value={entry.firstName || ''}
                            onChange={(e) => updateEmailEntry(entry.id, 'firstName', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lastName-${entry.id}`} className="text-sm font-medium">
                            Nom
                          </Label>
                          <Input
                            id={`lastName-${entry.id}`}
                            placeholder="Dupont"
                            value={entry.lastName || ''}
                            onChange={(e) => updateEmailEntry(entry.id, 'lastName', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addEmailEntry}
                className="w-full border-dashed border-[#18534F] text-[#18534F] hover:bg-[#ECF8F6]"
              >
                <Plus size={16} className="mr-2" />
                Ajouter un étudiant
              </Button>
            </TabsContent>

            {/* Onglet Import CSV */}
            <TabsContent value="csv" className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Format CSV attendu</p>
                    <p className="mb-2">Votre fichier CSV doit contenir les colonnes suivantes (avec ou sans en-tête) :</p>
                    <code className="bg-white px-2 py-1 rounded text-xs block">
                      email, prénom, nom
                    </code>
                  </div>
                </div>
                
                <div className="text-xs text-blue-700 mt-2 pl-8">
                  <p><strong>Exemple :</strong></p>
                  <code className="bg-white px-2 py-1 rounded block mt-1">
                    jean.dupont@exemple.fr, Jean, Dupont<br />
                    marie.martin@exemple.fr, Marie, Martin
                  </code>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="csv-upload" className="text-sm font-medium">
                  Fichier CSV
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {csvFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 size={16} />
                      <span>{csvFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {csvContent && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Aperçu ({parseCsvContent().length} étudiant(s))</Label>
                  <Textarea
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                    placeholder="Collez votre contenu CSV ici ou uploadez un fichier"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendInvitations}
              disabled={isLoading}
              className="bg-[#18534F] hover:bg-[#226D68] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail size={16} className="mr-2" />
                  Envoyer les invitations
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
