import { useCallback, useRef } from 'react';

export function useSound() {
    const tearAudio = useRef<HTMLAudioElement | null>(null);
    const clickAudio = useRef<HTMLAudioElement | null>(null);

    // Initialize audio lazily or in useEffect
    const init = useCallback(() => {
        if (!tearAudio.current) {
            tearAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Paper tear sound
            tearAudio.current.volume = 0.4;
        }
        if (!clickAudio.current) {
            clickAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Soft click
            clickAudio.current.volume = 0.2;
        }
    }, []);

    const playTear = useCallback(() => {
        init();
        if (tearAudio.current) {
            tearAudio.current.currentTime = 0;
            tearAudio.current.play().catch(() => { });
        }
    }, [init]);

    const playClick = useCallback(() => {
        init();
        if (clickAudio.current) {
            clickAudio.current.currentTime = 0;
            clickAudio.current.play().catch(() => { });
        }
    }, [init]);

    return { playTear, playClick };
}
