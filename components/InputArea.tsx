import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from './Button';
import { AspectRatio } from '../types';

interface InputAreaProps {
  onSend: (prompt: string, aspectRatio: AspectRatio, image?: File, variations?: number) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [variations, setVariations] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setSelectedFile(undefined);
    setPreviewUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!prompt.trim() && !selectedFile) || isLoading) return;
    onSend(prompt, aspectRatio, selectedFile, variations);
    setPrompt('');
    clearFile();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Image Preview Bubble (Floating above input) */}
      {previewUrl && (
        <div className="mb-3 flex items-center gap-3 animate-fade-in-up bg-zinc-900/50 p-2 rounded-lg border border-zinc-800 w-fit">
           <div className="relative h-16 w-16 rounded overflow-hidden border border-zinc-700 group">
            <img src={previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
            <button 
              onClick={clearFile}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                 <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
               </svg>
            </button>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">Imagem de referência</span>
            <span className="text-[10px] text-zinc-400">A IA usará esta imagem como base</span>
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className={`relative bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 transition-all duration-300 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600/50 ${isLoading ? 'opacity-75 grayscale-[0.5]' : ''}`}>
        
        {/* Settings Row (Integrated inside top) */}
        <div className="flex flex-wrap items-center gap-3 px-3 py-2 border-b border-zinc-800/50 bg-zinc-900/50 rounded-t-xl">
             <div className="relative flex items-center gap-2 bg-black/20 rounded px-2 py-1 group hover:bg-black/40 transition-colors">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Formato</span>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer appearance-none hover:text-white transition-colors z-10 pr-4"
                >
                  <option value={AspectRatio.Square} className="bg-zinc-900 text-zinc-100">Quadrado (1:1)</option>
                  <option value={AspectRatio.Landscape} className="bg-zinc-900 text-zinc-100">Paisagem (16:9)</option>
                  <option value={AspectRatio.Portrait} className="bg-zinc-900 text-zinc-100">Retrato (9:16)</option>
                  <option value={AspectRatio.StandardLandscape} className="bg-zinc-900 text-zinc-100">Padrão (4:3)</option>
                  <option value={AspectRatio.StandardPortrait} className="bg-zinc-900 text-zinc-100">Vertical (3:4)</option>
                </select>
                {/* Custom Chevron */}
                <div className="absolute right-2 pointer-events-none text-zinc-500 group-hover:text-zinc-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="w-px h-3 bg-zinc-800"></div>
              
              <div className="relative flex items-center gap-2 bg-black/20 rounded px-2 py-1 group hover:bg-black/40 transition-colors">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Qtde.</span>
                 <select
                    value={variations}
                    onChange={(e) => setVariations(Number(e.target.value))}
                    className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer appearance-none hover:text-white transition-colors z-10 pr-4"
                 >
                   <option value={1} className="bg-zinc-900 text-zinc-100">1 variação</option>
                   <option value={2} className="bg-zinc-900 text-zinc-100">2 variações</option>
                   <option value={3} className="bg-zinc-900 text-zinc-100">3 variações</option>
                 </select>
                 {/* Custom Chevron */}
                 <div className="absolute right-2 pointer-events-none text-zinc-500 group-hover:text-zinc-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
        </div>

        {/* Input Field Area */}
        <div className="flex items-end p-2 gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button 
            variant="icon" 
            onClick={() => fileInputRef.current?.click()}
            title="Carregar imagem"
            className={`shrink-0 transition-all ${previewUrl ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </Button>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={previewUrl ? "Descreva como alterar a imagem..." : "Descreva a imagem que você imagina..."}
            className="flex-1 bg-transparent border-none resize-none text-zinc-100 placeholder-zinc-500 focus:ring-0 py-3 px-2 text-sm leading-relaxed"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '150px' }}
          />

          <Button 
            variant="primary" 
            onClick={handleSend}
            disabled={(!prompt.trim() && !previewUrl) || isLoading}
            className="mb-1 shrink-0 !rounded-lg !px-3 !py-2 !bg-white !text-black hover:!bg-zinc-200 disabled:!opacity-30 disabled:!bg-zinc-800 disabled:!text-zinc-500"
          >
            {isLoading ? (
               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};