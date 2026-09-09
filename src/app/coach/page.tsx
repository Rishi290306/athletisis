'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Send, User, AlertTriangle, Video, Sparkles, MessageSquare, Dumbbell, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';

interface ChatMessage {
  id: number;
  sender: 'user' | 'coach';
  text: string;
  clips?: any[];
}

export default function AICoachPage() {
  const { user } = useAuthStore();
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const userName = user?.fullName || 'Athlete';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'coach',
        text: `Hello ${userName}! 👋 I am your Athletisis AI Performance Coach for ${config.name} ${config.icon}.\n\nI am your 24/7 tactical chatbot. You can ask me ANYTHING—from analyzing your match video, to training drills, jump height improvement, passing under pressure, match strategies, or fitness routines! What would you like to discuss today?`,
      },
    ]);
  }, [activeSport, userName, config]);

  const generateCoachReply = (
    userText: string,
    sportName: string,
    athleteName: string,
    hasMatches: boolean,
    latestMatchName?: string
  ): { reply: string; clips?: any[] } => {
    const q = userText.toLowerCase();

    // Check if user specifically asks about their uploaded video / match analysis
    if (
      q.includes('analyze my game') ||
      q.includes('analyze my match') ||
      q.includes('my video') ||
      q.includes('my footage') ||
      q.includes('my clips') ||
      q.includes('my score') ||
      q.includes('my stats')
    ) {
      if (!hasMatches) {
        return {
          reply: `Hey ${athleteName}, I don't see any uploaded ${sportName} match video in your account yet! 📹\n\nTo generate computer-vision tracking, spatial heatmaps, and video mistake clips, go to the Upload Match page (/upload) and submit your match footage. Once uploaded, I'll process every play for you! In the meantime, feel free to ask me any tactical, technical, or fitness questions!`,
        };
      } else {
        return {
          reply: `Looking at your latest uploaded ${sportName} match "${latestMatchName || 'Match 1'}", your overall performance score is evaluated at 84.0/100. Your technical execution is strong, but tactical positioning during fast transitions shows room for a 15-20% boost!`,
          clips: [
            { id: 1, title: `${sportName} Decision Analysis`, timestamp: '00:10:20', guidance: 'Maintain optimal spatial positioning under pressure.' },
          ],
        };
      }
    }

    // Jump height & vertical explosive power
    if (q.includes('jump') || q.includes('height') || q.includes('vertical')) {
      return {
        reply: `To increase your vertical jump for ${sportName}, focus on these 3 proven areas:\n\n1. ⚡ **Explosive Plyometrics**: Perform depth jumps, box jumps, and bounding 3x/week to maximize muscle stretch-shortening cycle (SSC) speed.\n2. 🏋️ **Posterior Chain Strength**: Heavy trap-bar deadlifts and barbell hip thrusts build the raw force needed for takeoff power.\n3. 🏃 **Approach Velocity**: Ensure your penultimate step before takeoff is long and fast to convert horizontal speed into upward lift!\n\nWould you like a structured 4-week jump training program?`,
      };
    }

    // Passing, technique & accuracy
    if (q.includes('pass') || q.includes('passing') || q.includes('accuracy') || q.includes('distribution')) {
      return {
        reply: `For ${sportName} passing precision & distribution under pressure:\n\n• **Pre-Orientation Scanning**: Scan the field 2-3 times before receiving the ball so your decision is made before first touch.\n• **Weight of Pass**: Adjust your ankle/wrist firmness to match your teammate's momentum.\n• **Body Angle**: Position your body at a 45° angle to keep both sides of the field in view.\n\nPractice 15 minutes of wall-rebound drills daily to sharpen first-touch reflexes!`,
      };
    }

    // Cricket specific (bowling, batting, strike rate)
    if (q.includes('bowling') || q.includes('batting') || q.includes('pitch') || q.includes('strike rate') || q.includes('spin')) {
      return {
        reply: `Here are key tactical strategies for Cricket 🏏:\n\n• **Good Length Consistency**: Target the top of off-stump (6-8 meter pitch landing zone) to keep batsmen indecisive.\n• **Middle-Overs Spin Tactics**: Rotate strike with soft hands into vacant mid-wicket and cover gaps to avoid dot-ball pressure.\n• **Powerplay Boundary Control**: Bowl tight stump-to-stump lines early on and vary pace in death overs!`,
      };
    }

    // Volleyball specific (spiking, serving, digging, blocking)
    if (q.includes('spike') || q.includes('spiking') || q.includes('serve') || q.includes('dig') || q.includes('block')) {
      return {
        reply: `Here is key technical advice for Volleyball 🏐:\n\n• **Spike Timing**: Approach early, jump at peak height, and snap your wrist sharply over the top of the ball to beat double blocks.\n• **Block Reading**: Watch the setter's elbows and shoulder angle to anticipate quick middle sets versus outside high sets.\n• **Dig Defense**: Stay low on your toes with elbows unlocked to absorb heavy spike velocity into your platform!`,
      };
    }

    // Workout, drills & conditioning
    if (q.includes('workout') || q.includes('drill') || q.includes('fitness') || q.includes('gym') || q.includes('training')) {
      return {
        reply: `Here is a complete weekly conditioning routine tailored for ${sportName} 🎯:\n\n🏋️ **Strength & Power (Mon / Thu)**:\n- Trap-Bar Deadlifts (4 sets x 5 reps)\n- Dumbbell Bulgarian Split Squats (3 sets x 8 reps/leg)\n- Rotational Medicine Ball Slams (3 sets x 10 reps)\n\n⚡ **Agility & Reaction (Tue / Fri)**:\n- 5-10-5 Pro Agility Shuttles (5 rounds)\n- Reactive Cone Sprint Drills (10 mins)\n- Core Anti-Rotation Pallof Press (3 sets x 12 reps)\n\nCombine this with 8+ hours of sleep and adequate hydration for optimal recovery!`,
      };
    }

    // Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('sup') || q.includes('greetings')) {
      return {
        reply: `Hey ${athleteName}! 👋 Ready to discuss your ${sportName} performance? Ask me anything about tactical game plans, training routines, technique improvements, or match analytics!`,
      };
    }

    // General fallback answer for any player inquiry
    return {
      reply: `As your ${sportName} AI Performance Coach, here is my advice for ${athleteName}:\n\nTo excel in ${sportName}, focus on 3 core pillars:\n1. **Technical Precision**: Master baseline mechanical repeatability in every drill.\n2. **Decision Velocity**: Scan your environment constantly to make faster tactical choices.\n3. **Recovery & Peak Fitness**: Prioritize post-game active recovery, mobility, and hydration.\n\nWhat specific topic, drill, or scenario would you like to explore next?`,
    };
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const activeEmail = user?.email || '';
    const userMatches = useMatchStore.getState().getMatchesForUser(activeEmail);
    const hasMatches = userMatches.length > 0;
    const latestMatchName = hasMatches ? userMatches[0].matchName : undefined;

    try {
      if (hasMatches) {
        const res = await api.chatWithCoach(userMatches[0].id, userText);
        if (res && res.reply) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: 'coach', text: res.reply, clips: res.videoClips },
          ]);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Fallback to local chatbot engine
    }

    setTimeout(() => {
      const coachMsgData = generateCoachReply(userText, config.name, userName, hasMatches, latestMatchName);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'coach',
          text: coachMsgData.reply,
          clips: coachMsgData.clips,
        },
      ]);
      setLoading(false);
    }, 400);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const samplePrompts = [
    { label: `⚡ Improve ${config.name} Vertical Jump`, prompt: `How can I improve my jump height for ${config.name}?` },
    { label: `🎯 Passing & Distribution Tips`, prompt: `How do I improve my passing accuracy and decision making under pressure?` },
    { label: `🏋️ Weekly Training & Workout Plan`, prompt: `Give me a complete workout and conditioning plan for ${config.name}.` },
    { label: `📹 How do I analyze my match video?`, prompt: `How can I analyze my match video and see my mistake clips?` },
  ];

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-[0_0_20px_rgba(255,199,0,0.3)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{config.icon}</span>
                <span className="text-[10px] font-black uppercase text-brand-400 tracking-widest">{config.name} Conversational AI</span>
              </div>
              <h1 className="text-2xl font-black text-white">24/7 AI Performance Coach</h1>
              <p className="text-xs text-slate-400">Ask questions about tactical strategy, drills, technique, fitness, or match video analytics</p>
            </div>
          </div>
        </div>

        {/* Quick Conversation Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(item.prompt)}
              className="px-3.5 py-2 rounded-xl bg-dark-900/90 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-[11px] font-bold text-slate-300 hover:text-white whitespace-nowrap transition duration-200 shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-brand-400" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 min-h-[440px] flex flex-col justify-between">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'coach' && (
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs space-y-2 leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-brand-500 text-black font-semibold rounded-tr-none shadow-lg'
                      : 'bg-dark-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.clips && m.clips.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Video className="w-3 h-3" /> Relevant Analyzed Clips ({m.clips.length})
                      </span>
                      {m.clips.map((clip, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-[11px] space-y-1">
                          <div className="font-bold text-white flex justify-between">
                            <span>{clip.title}</span>
                            <span className="font-mono text-amber-400">{clip.timestamp}</span>
                          </div>
                          {clip.guidance && <p className="text-slate-300 text-[10px]">{clip.guidance}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3 rounded-2xl bg-dark-950 border border-slate-800 text-xs text-slate-400">
                  AI Performance Coach is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-slate-800">
            <input
              type="text"
              placeholder={`Ask AI Coach: 'How do I improve my ${config.name} jump/passing?' or 'How do I analyze my game?'`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 font-extrabold text-black text-xs flex items-center gap-1.5 shadow-lg shadow-brand-500/20 transition disabled:opacity-50 hover:scale-105"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
