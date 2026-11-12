import React, { useState } from 'react';
import { AlertCircle, KeyRound, Shield, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { playTapSound } from '../../utils/soundAndEffects';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useClanData();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setError(false);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError(true);
      playTapSound();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative pb-safe"
      >
        <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Acceso de Administración
            </h3>
            <p className="text-xs text-zinc-400">
              Panel exclusivo para el líder y administradores del clan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1.5">
              PIN de Seguridad
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                maxLength={8}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="••••"
                autoFocus
                className="w-full min-h-[48px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-base text-white focus:outline-none font-mono tracking-widest"
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                PIN de seguridad incorrecto. Acceso denegado.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-lg shadow-purple-950/40"
          >
            Verificar & Desbloquear
          </button>
        </form>
      </div>
    </div>
  );
};
