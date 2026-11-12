import React from 'react';
import { Pencil } from 'lucide-react';
import { InlineEditTarget, useClanData } from '../context/ClanDataContext';
import { SiteTexts } from '../types/clan';

interface EditableTextProps {
  section: keyof SiteTexts;
  field: string;
  label: string;
  multiline?: boolean;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  prefix?: string;
  suffix?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  section,
  field,
  label,
  multiline = false,
  className = '',
  as: Tag = 'span',
  prefix = '',
  suffix = '',
}) => {
  const { state, isAdmin, isInlineTextEditMode, openQuickTextEdit } = useClanData();
  const sectionObj = state.texts[section] as unknown as Record<string, unknown>;
  const rawValue = typeof sectionObj?.[field] === 'string' ? (sectionObj[field] as string) : '';

  if (!isAdmin || !isInlineTextEditMode) {
    return (
      <Tag className={className}>
        {prefix}
        {rawValue}
        {suffix}
      </Tag>
    );
  }

  return (
    <Tag
      role="button"
      tabIndex={0}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickTextEdit({ kind: 'siteText', section, field, label, multiline });
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openQuickTextEdit({ kind: 'siteText', section, field, label, multiline });
        }
      }}
      title={`Editar texto: ${label}`}
      className={`${className} relative inline-flex items-center gap-1 rounded-md outline-1 outline-dashed outline-purple-400/80 bg-purple-950/35 px-1.5 py-0.5 cursor-pointer hover:bg-purple-900/50 active:scale-[0.99] transition-all`}
    >
      <span>
        {prefix}
        {rawValue}
        {suffix}
      </span>
      <Pencil className="w-3 h-3 text-purple-300 shrink-0" />
    </Tag>
  );
};

interface EditableValueProps {
  value: string;
  target: InlineEditTarget;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export const EditableValue: React.FC<EditableValueProps> = ({
  value,
  target,
  className = '',
  as: Tag = 'span',
  prefix = '',
  suffix = '',
  placeholder = 'Editar...',
}) => {
  const { isAdmin, isInlineTextEditMode, openQuickTextEdit } = useClanData();
  const display = value || placeholder;

  if (!isAdmin || !isInlineTextEditMode) {
    return (
      <Tag className={className}>
        {prefix}
        {value}
        {suffix}
      </Tag>
    );
  }

  return (
    <Tag
      role="button"
      tabIndex={0}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickTextEdit(target);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openQuickTextEdit(target);
        }
      }}
      title={`Editar: ${target.label}`}
      className={`${className} relative inline-flex items-center gap-1 rounded-md outline-1 outline-dashed outline-purple-400/80 bg-purple-950/35 px-1.5 py-0.5 cursor-pointer hover:bg-purple-900/50 active:scale-[0.99] transition-all`}
    >
      <span>
        {prefix}
        {display}
        {suffix}
      </span>
      <Pencil className="w-3 h-3 text-purple-300 shrink-0" />
    </Tag>
  );
};
