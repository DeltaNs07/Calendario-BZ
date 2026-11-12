import React from 'react';
import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Info,
  MessageSquare,
  Radio,
  Shield,
  Users,
} from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface InfoSectionProps {
  onEditInfo: () => void;
  onEditLogos: () => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ onEditInfo, onEditLogos }) => {
  const { state, isAdmin } = useClanData();
  const info = state.info;
  const t = state.texts.info;

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
            <Info className="w-4 h-4" />
            <EditableText section="info" field="kicker" label="Kicker Info & Reglas" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            <EditableText section="info" field="title" label="Título Info & Reglas" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="info" field="subtitle" label="Subtítulo Info & Reglas" multiline />
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                onEditLogos();
                playTapSound();
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-200 border border-purple-500/30 font-heading font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4 text-purple-400" />
              Editar Logos
            </button>
            <button
              type="button"
              onClick={() => {
                onEditInfo();
                playTapSound();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-950/40"
            >
              <Edit3 className="w-4 h-4" />
              Editar Info
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Emblem & Channels */}
        <div className="space-y-5">
          <div className="bg-[#10121b] border border-white/10 rounded-2xl p-6">
            <div className="w-20 h-20 rounded-2xl bg-black border border-purple-500/40 p-2 mx-auto mb-4 overflow-hidden shadow-lg">
              <SmartImage
                src={info.logoUrl}
                alt={info.name}
                fallbackText={info.tag}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-center font-heading font-bold text-xl uppercase text-white">
              <EditableValue
                value={info.name}
                target={{ kind: 'clanInfo', field: 'name', label: 'Nombre del Clan' }}
              />
            </h3>
            <div className="text-center text-xs text-purple-400 font-mono-numbers mt-0.5 flex flex-wrap items-center justify-center gap-1">
              <EditableValue
                value={info.tag}
                target={{ kind: 'clanInfo', field: 'tag', label: 'Tag del Clan' }}
              />
              <span>·</span>
              <EditableText section="info" field="foundedPrefix" label="Prefijo Fundación" />
              <EditableValue
                value={info.foundedYear}
                target={{ kind: 'clanInfo', field: 'foundedYear', label: 'Año de Fundación' }}
              />
            </div>
            <p className="text-center text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed">
              <EditableValue
                value={info.motto}
                target={{ kind: 'clanInfo', field: 'motto', label: 'Lema del Clan', multiline: true }}
                prefix="“"
                suffix="”"
              />
            </p>

            <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-400">
                  <EditableText section="info" field="gameLabel" label="Etiqueta Juego" />
                </span>
                <EditableValue
                  value={info.game}
                  target={{ kind: 'clanInfo', field: 'game', label: 'Juego Principal' }}
                  className="font-semibold text-white text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-400">
                  <EditableText section="info" field="serverLabel" label="Etiqueta Servidor" />
                </span>
                <EditableValue
                  value={info.server}
                  target={{ kind: 'clanInfo', field: 'server', label: 'Región / Servidor' }}
                  className="font-semibold text-purple-300 text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-400">
                  <EditableText section="info" field="recruitmentLabel" label="Etiqueta Reclutamiento" />
                </span>
                <EditableText
                  section="info"
                  field={info.recruitmentOpen ? 'statusOpen' : 'statusClosed'}
                  label={info.recruitmentOpen ? 'Texto Reclutamiento Abierto' : 'Texto Reclutamiento Cerrado'}
                  className={`font-bold uppercase ${
                    info.recruitmentOpen ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
            <h4 className="font-heading font-bold text-sm uppercase text-white mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <EditableText section="info" field="channelsTitle" label="Título Canales" />
            </h4>
            <div className="space-y-2.5">
              {info.discordUrl && (
                <a
                  href={info.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex items-center justify-between p-3.5 rounded-xl bg-[#5865F2]/12 border border-[#5865F2]/35 hover:bg-[#5865F2]/22 text-[#9aa3ff] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <EditableText section="info" field="discordLabel" label="Botón Discord" />
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              )}
              {info.whatsappUrl && (
                <a
                  href={info.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                    <Users className="w-4 h-4 shrink-0" />
                    <EditableText section="info" field="whatsappLabel" label="Botón WhatsApp" />
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              )}
              {info.youtubeUrl && (
                <a
                  href={info.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <EditableText section="info" field="youtubeLabel" label="Botón YouTube" />
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              )}
              {info.tiktokUrl && (
                <a
                  href={info.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-zinc-200 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <EditableText section="info" field="tiktokLabel" label="Botón TikTok" />
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Requirements & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#10121b] border border-purple-500/25 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-heading font-bold text-lg uppercase text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <EditableText section="info" field="reqTitle" label="Título Requisitos" />
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-heading font-bold uppercase ${
                  info.recruitmentOpen
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                <EditableText
                  section="info"
                  field={info.recruitmentOpen ? 'reqOpenBadge' : 'reqClosedBadge'}
                  label={info.recruitmentOpen ? 'Etiqueta Cupos Disponibles' : 'Etiqueta Reclutamiento Pausado'}
                />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 mb-4 leading-relaxed">
              <EditableText section="info" field="reqIntro" label="Introducción requisitos" multiline />
            </p>

            <ul className="space-y-2.5">
              {info.recruitmentRequirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <EditableValue
                    value={req}
                    target={{
                      kind: 'requirement',
                      index: idx,
                      label: `Requisito ${idx + 1}`,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-lg uppercase text-white mb-4">
              <EditableText section="info" field="rulesTitle" label="Título Código de Conducta" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {t.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/40 border border-white/10"
                >
                  <div className="font-heading font-bold text-xs sm:text-sm uppercase text-purple-300 mb-1 flex items-center gap-1">
                    <span>0{idx + 1}.</span>
                    <EditableValue
                      value={rule.title}
                      target={{
                        kind: 'rule',
                        index: idx,
                        key: 'title',
                        label: `Título Regla 0${idx + 1}`,
                      }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <EditableValue
                      value={rule.desc}
                      target={{
                        kind: 'rule',
                        index: idx,
                        key: 'desc',
                        label: `Descripción Regla 0${idx + 1}`,
                        multiline: true,
                      }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
