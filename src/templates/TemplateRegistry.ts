import { ITemplate } from '@/types';
import { SidebarNavyTemplate } from './SidebarNavyTemplate';
import { MinimalCleanTemplate } from './MinimalCleanTemplate';
import { ModernSplitTemplate } from './ModernSplitTemplate';
import { ExecutiveClassicTemplate } from './ExecutiveClassicTemplate';
import { TechMinimalistTemplate } from './TechMinimalistTemplate';

export const TEMPLATE_REGISTRY: ITemplate[] = [
  {
    identifier: 'sidebar-navy',
    templateName: 'Bleu Marine Classique',
    description: 'Modèle officiel à deux colonnes avec barre latérale bleu marine et ligne temporelle élégante.',
    thumbnailGradient: 'from-[#0b2545] to-[#1a4473]',
    accentColors: ['#0b2545', '#1e3a8a', '#065f46', '#701a75', '#334155'],
    component: SidebarNavyTemplate,
  },
  {
    identifier: 'minimal-clean',
    templateName: 'Minimaliste Noir & Blanc',
    description: 'Mise en page épurée sur une seule colonne avec typographie moderne et séparateurs fins.',
    thumbnailGradient: 'from-gray-900 to-gray-700',
    accentColors: ['#111827', '#2563eb', '#059669', '#dc2626', '#4b5563'],
    component: MinimalCleanTemplate,
  },
  {
    identifier: 'modern-split',
    templateName: 'Moderne Bandeau & Cartes',
    description: 'En-tête supérieur proéminent avec colonnes asymétriques et puces stylisées.',
    thumbnailGradient: 'from-blue-600 to-indigo-700',
    accentColors: ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#0f172a'],
    component: ModernSplitTemplate,
  },
  {
    identifier: 'executive-classic',
    templateName: 'Exécutif Traditionnel',
    description: 'Style sobre avec typographie sérif adapté aux postes de direction, académiques et juridiques.',
    thumbnailGradient: 'from-slate-800 to-stone-900',
    accentColors: ['#1e293b', '#44403c', '#78350f', '#14532d', '#581c87'],
    component: ExecutiveClassicTemplate,
  },
  {
    identifier: 'tech-minimalist',
    templateName: 'Ingénieur & Tech Minimaliste',
    description: 'Optimisé pour les développeurs et profils techniques avec police monospace et badges de code.',
    thumbnailGradient: 'from-slate-900 to-emerald-950',
    accentColors: ['#0f172a', '#064e3b', '#1e1b4b', '#701a75', '#3b0764'],
    component: TechMinimalistTemplate,
  },
];

export function getTemplateById(templateId: string): ITemplate {
  const found = TEMPLATE_REGISTRY.find((t) => t.identifier === templateId);
  return found || TEMPLATE_REGISTRY[0];
}
