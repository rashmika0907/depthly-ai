
import React, { createContext, useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);
export const LanguageContext = createContext(null);

const translations = {
    en: {
        'explore': 'Explore', 'history': 'History', 'logout': 'Logout', 'topic': 'Topic', 'askAnything': 'Ask about anything...', 
        'level': 'Select Depth', 'kids': 'Kids', 'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Advanced', 'expert': 'Expert',
        'generating': 'Generating...', 'stopGenerating': 'Stop Generating', 'copyToClipboard': 'Copy to Clipboard', 'copied': 'Copied!',
        'clearHistory': 'Clear History', 'login': 'Login', 'signup': 'Sign Up', 'email': 'Email', 'password': 'Password', 'name': 'Name',
        'noHistory': 'Your history is empty. Start exploring to see your generated explanations here!', 'loginPrompt': "Don't have an account?", 'signupPrompt': "Already have an account?",
    },
    es: {
        'explore': 'Explorar', 'history': 'Historial', 'logout': 'Cerrar Sesión', 'topic': 'Tema', 'askAnything': 'Pregunta sobre cualquier cosa...',
        'level': 'Seleccionar Profundidad', 'kids': 'Niños', 'beginner': 'Principiante', 'intermediate': 'Intermedio', 'advanced': 'Avanzado', 'expert': 'Experto',
        'generating': 'Generando...', 'stopGenerating': 'Detener Generación', 'copyToClipboard': 'Copiar al Portapapeles', 'copied': '¡Copiado!',
        'clearHistory': 'Limpiar Historial', 'login': 'Iniciar Sesión', 'signup': 'Registrarse', 'email': 'Correo Electrónico', 'password': 'Contraseña', 'name': 'Nombre',
        'noHistory': 'Tu historial está vacío. ¡Empieza a explorar para ver tus explicaciones generadas aquí!', 'loginPrompt': '¿No tienes una cuenta?', 'signupPrompt': '¿Ya tienes una cuenta?',
    },
    fr: { 'explore': 'Explorer', 'history': 'Historique', 'logout': 'Déconnexion' },
    de: { 'explore': 'Erkunden', 'history': 'Verlauf', 'logout': 'Ausloggen' },
    ja: { 'explore': '探る', 'history': '履歴', 'logout': 'ログアウト' },
    zh: { 'explore': '探索', 'history': '历史', 'logout': '登出' },
};

export function LanguageProvider({ children }) {
    const langKey = 'depthly_lang';
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const languages = [
        { code: 'en', name: 'English' }, { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }, { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' },
    ];

    useEffect(() => {
        const storedLang = localStorage.getItem(langKey);
        if (storedLang && languages.some(l => l.code === storedLang)) {
            setCurrentLanguage(storedLang);
        }
    }, []);

    const setLanguage = (lang) => {
        setCurrentLanguage(lang);
        localStorage.setItem(langKey, lang);
    };

    const translate = (key) => {
        const langTranslations = translations[currentLanguage] || translations['en'];
        return langTranslations[key] || key;
    };

    const value = { currentLanguage, setLanguage, translate, languages };

    return html`<${LanguageContext.Provider} value=${value}>${children}<//>`;
}
