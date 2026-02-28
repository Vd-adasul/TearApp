import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyQuote } from '../data/quotes';

interface QuoteDisplayProps {
  quoteIndex: number;
}

export function QuoteDisplay({ quoteIndex }: QuoteDisplayProps) {
  const quote = getDailyQuote(quoteIndex);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={quoteIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="text-center px-6 pb-4"
        style={{
          fontFamily: 'Lora, serif',
          fontStyle: 'italic',
          fontSize: '13px',
          color: 'rgba(107, 94, 79, 0.55)',
          lineHeight: '1.7',
          letterSpacing: '0.01em',
        }}
      >
        "{quote}"
      </motion.p>
    </AnimatePresence>
  );
}
