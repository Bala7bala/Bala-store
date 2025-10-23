
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Settings {
    upiId: string;
    qrCode: string;
}

interface SettingsContextType {
    settings: Settings;
    saveSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
    upiId: '',
    qrCode: '',
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const savedSettings = localStorage.getItem('storeSettings');
            return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    });

    const saveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
        localStorage.setItem('storeSettings', JSON.stringify(newSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, saveSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
