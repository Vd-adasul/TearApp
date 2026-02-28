import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface SettingsScreenProps {
  motivationPhoto: string | null;
  onPhotoChange: (photo: string | null) => void;
  onResetToday: () => void;
}

export function SettingsScreen({ motivationPhoto, onPhotoChange, onResetToday }: SettingsScreenProps) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onPhotoChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F5F0E8' }}
    >
      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto w-full px-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-14 pb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full"
            style={{ background: 'rgba(139, 115, 85, 0.1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '24px',
              color: '#1C1917',
              fontWeight: 400,
            }}
          >
            Settings
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 pb-24"
        >
          {/* Memory Photo section */}
          <SectionLabel label="Memory Anchor" />
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#FDFAF5',
              boxShadow: '0 2px 12px rgba(28, 25, 23, 0.07)',
            }}
          >
            {motivationPhoto ? (
              <div>
                {/* Photo preview */}
                <div
                  className="relative h-40 overflow-hidden"
                  style={{
                    backgroundImage: `url(${motivationPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(28,25,23,0.4))' }}
                  />
                  <button
                    onClick={() => onPhotoChange(null)}
                    className="absolute top-3 right-3 px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(28, 25, 23, 0.6)',
                      color: '#F5F0E8',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                    }}
                  >
                    Remove
                  </button>
                  <p
                    className="absolute bottom-3 left-4"
                    style={{
                      fontFamily: 'Lora, serif',
                      fontStyle: 'italic',
                      fontSize: '13px',
                      color: 'rgba(245,240,232,0.8)',
                    }}
                  >
                    Your why, faintly in the background.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full p-6 flex flex-col items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(139, 115, 85, 0.1)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: '#1C1917',
                    }}
                  >
                    Add a memory photo
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: '#A89880',
                      marginTop: '2px',
                    }}
                  >
                    Appears faintly behind your sheet
                  </p>
                </div>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* About section */}
          <SectionLabel label="About Tear" />
          <div
            className="rounded-2xl p-5"
            style={{
              background: '#FDFAF5',
              boxShadow: '0 2px 12px rgba(28, 25, 23, 0.07)',
            }}
          >
            <p
              style={{
                fontFamily: 'Lora, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#6B5E4F',
                lineHeight: '1.7',
              }}
            >
              Tear is not a timer. It's a commitment system.
              You decide when an hour is earned. No cheating.
              No shortcuts. Just you and your sheet.
            </p>
            <div
              className="mt-4 pt-4 flex items-center gap-2"
              style={{ borderTop: '1px solid rgba(139, 115, 85, 0.1)' }}
            >
              <span
                style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '16px',
                  color: '#1C1917',
                  letterSpacing: '-0.02em',
                }}
              >
                tear
              </span>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: '#A89880',
                }}
              >
                — Hour Tracking Method
              </span>
            </div>
          </div>

          {/* Danger zone */}
          <SectionLabel label="Session" />
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#FDFAF5',
              boxShadow: '0 2px 12px rgba(28, 25, 23, 0.07)',
            }}
          >
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full p-5 flex items-center justify-between"
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: '#8B3A3A',
                      textAlign: 'left',
                    }}
                  >
                    Reset today's sheet
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: '#A89880',
                      marginTop: '2px',
                      textAlign: 'left',
                    }}
                  >
                    Archives current sheet and starts fresh
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="#8B3A3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </svg>
              </button>
            ) : (
              <div className="p-5">
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#6B5E4F',
                    marginBottom: '12px',
                  }}
                >
                  This will archive today's sheet and let you start over. Sure?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl"
                    style={{
                      background: 'rgba(139, 115, 85, 0.1)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#6B5E4F',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onResetToday();
                      setShowResetConfirm(false);
                      navigate('/');
                    }}
                    className="flex-1 py-2 rounded-xl"
                    style={{
                      background: '#8B3A3A',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#F5F0E8',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        color: 'rgba(107, 94, 79, 0.45)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        paddingLeft: '4px',
      }}
    >
      {label}
    </p>
  );
}
