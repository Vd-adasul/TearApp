import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.tearapp.app',
    appName: 'Tear App',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    backgroundColor: '#F5F0E8',
    plugins: {
        SplashScreen: {
            launchShowDuration: 0, // We use our own React splash screen
            backgroundColor: "#F5F0E8",
        },
    },
};

export default config;
