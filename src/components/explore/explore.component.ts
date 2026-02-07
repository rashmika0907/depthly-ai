
import React, { useState, useContext, useRef, useEffect } from 'react';
import htm from 'htm';
import { LanguageContext } from '../../services/language.service.ts';
import { HistoryContext } from '../../services/history.service.ts';
import { generateExplanationStream } from '../../services/gemini.service.ts';
import { MarkdownRenderer } from '../../pipes/markdown.pipe.ts';

const html = htm.bind(React.createElement);

const depthLevels = ['Kids', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function Explore() {
  const { translate, currentLanguage } = useContext(LanguageContext);
  const { addHistoryItem } = useContext(HistoryContext);

  const [topic, setTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState('copyToClipboard');
  
  const abortControllerRef = useRef(null);
  
  const startGeneration = async (level) => {
    if (!topic || isGenerating) return;

    setIsGenerating(true);
    setSelectedLevel(level);
    setGeneratedContent('');
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const stream = generateExplanationStream({
        topic,
        level,
        language: currentLanguage,
        signal: abortControllerRef.current.signal,
      }, addHistoryItem);

      for await (const chunk of stream) {
        setGeneratedContent(current => current + chunk);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('An error occurred while generating the explanation.');
        console.error(err);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent).then(() => {
        setCopyButtonText('copied');
        setTimeout(() => setCopyButtonText('copyToClipboard'), 2000);
      });
    }
  };

  return html`
    <div class="w-full max-w-4xl flex flex-col items-center">
      <div class="w-full glass-card p-6 md:p-8 mb-8">
        <div class="relative">
          <input type="text" value=${topic} onChange=${e => setTopic(e.target.value)}
                 placeholder=${translate('askAnything')} disabled=${isGenerating}
                 class="w-full text-lg bg-stone-900/50 border-2 border-stone-700 rounded-lg pl-6 pr-12 py-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 disabled:opacity-50" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div class="mt-6">
          <h3 class="text-stone-400 font-semibold mb-3">${translate('level')}</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            ${depthLevels.map(level => html`
              <button key=${level} onClick=${() => startGeneration(level)} disabled=${!topic || isGenerating}
                      class=${`p-3 text-center font-medium rounded-lg transition-all duration-300 border-2 disabled:cursor-not-allowed disabled:opacity-50 ${isGenerating && selectedLevel === level ? 'bg-rose-600 border-rose-500 text-white animate-pulse' : 'bg-stone-800/60 border-stone-700 hover:border-rose-500 hover:text-rose-400'}`}>
                ${translate(level.toLowerCase())}
              </button>
            `)}
          </div>
        </div>
      </div>
      
      ${(isGenerating || generatedContent) && html`
        <div class="w-full glass-card p-6 md:p-8 relative">
          <div class="absolute top-4 right-4 flex space-x-2">
            ${isGenerating && html`
              <button onClick=${stopGeneration} class="bg-yellow-600/80 hover:bg-yellow-500/80 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                <span>${translate('stopGenerating')}</span>
              </button>
            `}
            ${!isGenerating && generatedContent && html`
              <button onClick=${copyToClipboard} class="bg-stone-700/80 hover:bg-stone-600/80 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h4a1 1 0 100-2H5z" /></svg>
                <span>${translate(copyButtonText)}</span>
              </button>
            `}
          </div>
          <div class=${`prose prose-invert max-w-none prose-p:text-stone-300 prose-headings:text-white prose-strong:text-stone-100 prose-code:text-rose-400 prose-blockquote:border-l-rose-500 prose-a:text-orange-400 ${isGenerating ? 'typing-cursor' : ''}`}>
            <${MarkdownRenderer} markdown=${generatedContent} />
          </div>
          ${!generatedContent && isGenerating && html`<p class="text-stone-400 animate-pulse">${translate('generating')}</p>`}
        </div>
      `}
    </div>
  `;
}
