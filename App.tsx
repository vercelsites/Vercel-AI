import React, { useState, useRef, useEffect } from 'react';
import { Message, Sender, AspectRatio, GeneratedImage } from './types';
import { InputArea } from './components/InputArea';
import { MessageBubble } from './components/MessageBubble';
import { generateContent } from './services/geminiService';

const INITIAL_MESSAGE: Message = {
  id: 'init',
  sender: Sender.AI,
  text: "Olá! Sou a IA da Vercel.\n\nVocê pode:\n1. Descrever uma imagem para eu criar.\n2. Enviar uma imagem e me dizer como alterá-la.\n\nSelecione a proporção desejada e vamos começar!",
  timestamp: Date.now()
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (prompt: string, aspectRatio: AspectRatio, imageFile?: File, variations: number = 1) => {
    const userMsgId = Date.now().toString();
    
    // Create User Message
    const newUserMessage: Message = {
      id: userMsgId,
      sender: Sender.User,
      text: prompt,
      images: imageFile ? [{ url: URL.createObjectURL(imageFile), mimeType: imageFile.type }] : undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      let referenceImageBase64: string | undefined;
      let referenceImageMimeType: string | undefined;

      if (imageFile) {
        referenceImageMimeType = imageFile.type;
        referenceImageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Extract just the base64 part
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      // Handle Variations (parallel requests)
      const promises = [];
      for (let i = 0; i < variations; i++) {
        promises.push(generateContent(prompt, { aspectRatio }, referenceImageBase64, referenceImageMimeType));
      }

      const results = await Promise.all(promises);

      // Aggregate results
      const allImages: GeneratedImage[] = [];
      let combinedText = "";

      results.forEach(res => {
        allImages.push(...res.images);
        if (res.text && !combinedText.includes(res.text)) {
           combinedText += (combinedText ? "\n\n" : "") + res.text;
        }
      });

      // Fallback text
      if (!combinedText && allImages.length > 0) {
        combinedText = `Aqui ${allImages.length > 1 ? 'estão suas imagens' : 'está sua imagem'}.`;
      } else if (!combinedText && allImages.length === 0) {
         combinedText = "Não consegui gerar a imagem. Tente um prompt diferente.";
      }

      const aiMsgId = (Date.now() + 1).toString();
      const newAiMessage: Message = {
        id: aiMsgId,
        sender: Sender.AI,
        text: combinedText,
        images: allImages,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAiMessage]);

    } catch (error) {
      console.error(error);
      const errorMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: errorMsgId,
        sender: Sender.AI,
        text: "Desculpe, encontrei um erro ao processar sua imagem. Por favor, tente novamente.",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (message: Message) => {
      alert("Para regenerar, por favor reenvie o comando. (Funcionalidade de retry rápido em desenvolvimento)");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-zinc-800 p-4 z-30 sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-white text-black p-1.5 rounded-sm flex items-center justify-center">
            {/* Vercel Triangle Logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L20 19H4L12 4Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Vercel IA</h1>
            <p className="text-xs text-zinc-500">Sua IA de Imagens Favorita</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      {/* Added significantly more padding-bottom (pb-48 md:pb-52) to account for the fixed footer */}
      <main className="flex-1 overflow-y-auto p-4 pb-48 md:pb-52 custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onRegenerate={msg.sender === Sender.AI ? () => handleRegenerate(msg) : undefined}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-400 text-sm flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Processando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Footer */}
      {/* Using backdrop-blur and border-t for better visual separation and layering */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-4xl mx-auto p-4">
          <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}