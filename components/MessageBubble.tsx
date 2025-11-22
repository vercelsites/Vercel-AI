import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { Button } from './Button';

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRegenerate }) => {
  const isUser = message.sender === Sender.User;

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${message.id}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Sender Name */}
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 px-1">
          {isUser ? 'Você' : 'Vercel IA'}
        </span>

        {/* Bubble Content */}
        <div 
          className={`
            p-4 rounded-lg shadow-sm overflow-hidden border
            ${isUser 
              ? 'bg-white text-black border-white rounded-br-none' 
              : 'bg-zinc-900 text-zinc-100 border-zinc-800 rounded-bl-none'
            }
          `}
        >
          {/* Text Content */}
          {message.text && (
            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {message.text}
            </p>
          )}

          {/* Images Grid */}
          {message.images && message.images.length > 0 && (
            <div className={`mt-3 grid gap-3 ${message.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {message.images.map((img, idx) => (
                <div key={idx} className="group relative rounded overflow-hidden bg-black aspect-square border border-zinc-800">
                  <img 
                    src={img.url} 
                    alt={`Generated result ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Button 
                      variant="secondary"
                      className="!p-2 !rounded-full bg-white text-black hover:bg-zinc-200 border-none"
                      onClick={() => handleDownload(img.url, idx)}
                      title="Baixar Imagem HD"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </Button>
                    <Button
                       variant="secondary"
                       className="!p-2 !rounded-full bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600"
                       onClick={() => window.open(img.url, '_blank')}
                       title="Abrir em nova aba"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {message.isError && (
            <div className="flex items-center gap-2 text-red-400 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-sm">Ocorreu um erro.</span>
            </div>
          )}
        </div>

        {/* Footer Actions (AI only) */}
        {!isUser && !message.isError && onRegenerate && (
          <div className="mt-2 flex gap-2">
            <Button variant="ghost" onClick={onRegenerate} className="text-xs text-zinc-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Regenerar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};