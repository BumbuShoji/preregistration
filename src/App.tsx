import { ChevronDown, Clock, Eye, Mail, Shield, Zap } from 'lucide-react';
import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('メールアドレスを入力してください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('エラーが発生しました。もう一度お試しください');
      }

      setIsModalOpen(true);
      setEmail('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-purple-900 to-violet-900 text-white">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
        style={{
          backgroundImage: 'url("/image/31182843_l.jpg")'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 py-5">
            MatchingCupid
          </h1>
          <h2 className="font-hiragino text-xl md:text-2xl mb-8 text-gray-300">
            <span className="block">AIがあなたの『らしさ』を翻訳！</span>
            <span className="block mt-2 md:mt-3">堅いプロフィールから本音を読み取り、ズバッと刺さる一言を自動生成。</span>
            <span className="block mt-3 md:mt-4 font-bold">マッチングアプリ疲れの新常識</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            {[
              { icon: Eye, text: "個性を解析" },
              { icon: Zap, text: "会話を最適化" },
              { icon: Clock, text: "時間を節約" }
            ].map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-center gap-2 justify-center">
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Main Form Section */}
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl">
            <p className="font-hiragino text-xl text-center mb-8">
            事前登録受付中！
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                  aria-label="Email address"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg font-semibold 
                         transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Get Early Access'
                )}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto pt-8 text-center text-sm text-gray-400">
          <div className="mb-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <p> 2025 MatchingCupid. All rights reserved.</p>
        </footer>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-md mx-4 text-center">
            <h3 className="text-2xl font-semibold mb-4">ありがとうございます</h3>
            <p className="mb-6">登録に成功しました！サービス開始までお待ちください。</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;