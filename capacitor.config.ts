import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.morrow.lifeos',
  appName: 'Morrow',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#FFF9F2',
  },
};

export default config;
