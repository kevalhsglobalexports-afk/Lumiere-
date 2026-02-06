
import React from 'react';
import { Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { getSkinAdvice } from '../services/gemini';

const Consultation: React.FC = () => {
  const [concerns, setConcerns] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<{role: 'user' | 'bot', content: string}[]>([]);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concerns.trim() || loading) return;

    const userMsg = concerns;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setConcerns('');
    setLoading(true);

    const advice = await getSkinAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', content: advice }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif">Aesthetic AI Consultant</h1>
        <p className="text-stone-500 max-w-xl mx-auto font-light">
          Describe your skin concerns, routine, or goals, and our virtual expert will curate a personalized path to radiance.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 flex flex-col h-[600px]">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Bot className="w-12 h-12 text-stone-300" />
              <p className="text-stone-400 font-serif italic">How can I help you achieve your beauty goals today?</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-amber-100 text-amber-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-[1.5rem] ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100'
                }`}>
                  <p className="text-sm leading-relaxed font-light">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center text-stone-400 text-sm italic">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                Lumière expert is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleConsult} className="p-4 md:p-6 bg-stone-50 border-t border-stone-100">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="E.g., I have dry skin and dark circles..." 
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              disabled={loading}
              className="w-full bg-white pl-6 pr-14 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-transparent transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={loading || !concerns.trim()}
              className="absolute right-2 p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation;
