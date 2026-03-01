import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router';

interface RootContext {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

interface SettingsScreenProps {
  onResetToday: () => void;
}

export function SettingsScreen({ onResetToday }: SettingsScreenProps) {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useOutletContext<RootContext>();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500 ease-in-out"
      style={{ background: isDarkMode ? '#1C1917' : '#F5F0E8' }}
    >
      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-0"
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
            style={{ background: isDarkMode ? 'rgba(245, 240, 232, 0.1)' : 'rgba(139, 115, 85, 0.1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke={isDarkMode ? "#F5F0E8" : "#8B7355"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '24px',
              color: isDarkMode ? '#F5F0E8' : '#1C1917',
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
          {/* Appearance section */}
          <SectionLabel label="Appearance" />
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDarkMode ? '#2A2623' : '#FDFAF5',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
            }}
          >
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full p-5 flex items-center justify-between"
            >
              <div>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: isDarkMode ? '#F5F0E8' : '#1C1917',
                    textAlign: 'left',
                  }}
                >
                  Dark Mode
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: isDarkMode ? '#A89880' : '#A89880',
                    marginTop: '2px',
                    textAlign: 'left',
                  }}
                >
                  {isDarkMode ? 'Brighter interface for daylight' : 'Eases eye strain in the dark'}
                </p>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-[#AF875A]' : 'bg-[#E5E0D8]'}`}
              >
                <motion.div
                  animate={{ x: isDarkMode ? 18 : 2 }}
                  className="w-4 h-4 bg-white rounded-full absolute top-1"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </button>
          </div>

          {/* About section */}
          <SectionLabel label="About Tear" />
          <div
            className="rounded-2xl p-5"
            style={{
              background: isDarkMode ? '#2A2623' : '#FDFAF5',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
            }}
          >
            <p
              style={{
                fontFamily: 'Lora, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: isDarkMode ? '#B8AA99' : '#6B5E4F',
                lineHeight: '1.7',
              }}
            >
              Tear is not a timer. It's a commitment system.
              You decide when an hour is earned. No cheating.
              No shortcuts. Just you and your sheet.
            </p>
            <div
              className="mt-4 pt-4 flex items-center gap-2"
              style={{ borderTop: isDarkMode ? '1px solid rgba(245, 240, 232, 0.05)' : '1px solid rgba(139, 115, 85, 0.1)' }}
            >
              <span
                style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '16px',
                  color: isDarkMode ? '#F5F0E8' : '#1C1917',
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
              background: isDarkMode ? '#2A2623' : '#FDFAF5',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
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
                      color: '#E06C75',
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
                  <path d="M6 3L11 8L6 13" stroke="#E06C75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </svg>
              </button>
            ) : (
              <div className="p-5">
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: isDarkMode ? '#B8AA99' : '#6B5E4F',
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
                      background: isDarkMode ? 'rgba(245, 240, 232, 0.05)' : 'rgba(139, 115, 85, 0.1)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: isDarkMode ? '#F5F0E8' : '#6B5E4F',
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
                      background: '#E06C75',
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
