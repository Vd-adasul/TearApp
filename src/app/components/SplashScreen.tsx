import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F5F0E8] dark:bg-[#1C1917]"
                    style={{ transition: 'background-color 0.5s ease' }}
                >
                    {/* Animated Background Gradients */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#AF875A] to-transparent blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [0, -90, 0],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#8B6340] to-transparent blur-3xl"
                        />
                    </div>

                    <div className="relative z-10 text-center px-8">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                            className="text-2xl md:text-3xl font-serif italic text-[#3D2B1F] dark:text-[#F5F0E8]"
                            style={{ fontFamily: 'Lora, serif', letterSpacing: '-0.02em' }}
                        >
                            "what do you wanna be
                        </motion.h2>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                            className="text-2xl md:text-3xl font-serif italic text-[#3D2B1F] dark:text-[#F5F0E8] mt-2"
                            style={{ fontFamily: 'Lora, serif', letterSpacing: '-0.02em' }}
                        >
                            when you grow up?"
                        </motion.h2>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                            className="h-[1px] w-24 bg-[#AF875A] mx-auto mt-8 opacity-50"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
