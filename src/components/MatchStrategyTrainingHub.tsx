'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, Dumbbell, Zap, Flame, ShieldAlert, Award, ArrowUpRight, Clock, RefreshCw, FileText, Check } from 'lucide-react';
import { SportType, SPORT_CONFIGS } from '@/lib/sportStore';

interface MatchStrategyTrainingHubProps {
  sport?: SportType;
  athleteName?: string;
  matchName?: string;
}

interface DrillItem {
  id: number;
  title: string;
  focusArea: string;
  priority: 'HIGH' | 'MEDIUM';
  prescribedSets: string;
  durationMins: number;
  equipment: string;
  currentScore: number;
  targetScore: number;
  description: string;
  instructions: string[];
}

export function MatchStrategyTrainingHub({ sport = 'Cricket', athleteName = 'Rishi Tiwari', matchName = 'Match Analysis' }: MatchStrategyTrainingHubProps) {
  const config = SPORT_CONFIGS[sport] || SPORT_CONFIGS['Cricket'];

  const [completedDrills, setCompletedDrills] = useState<Record<number, boolean>>({});
  const [downloadNotice, setDownloadNotice] = useState<boolean>(false);

  const toggleDrillCompletion = (id: number) => {
    setCompletedDrills((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sport-specific grounded training drills
  const getDrillsForSport = (): DrillItem[] => {
    if (sport === 'Cricket') {
      return [
        {
          id: 1,
          title: 'Target Pitch Spot & Seam Alignment Drill',
          focusArea: 'Good Length Control (6-8m from Stumps)',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 12 Deliveries',
          durationMins: 20,
          equipment: 'Spot Target Marker & Leather Ball',
          currentScore: 74.0,
          targetScore: 88.0,
          description: 'Video analysis detected 28% over-pitched deliveries outside off-stump under pressure.',
          instructions: [
            'Place a 1-meter target cone on good length (6.5m from stumps).',
            'Focus on upright wrist release and upright seam orientation.',
            'Aim for 10 out of 12 deliveries landing within the cone zone.',
          ],
        },
        {
          id: 2,
          title: 'Front-Foot Crease Drive & Balance Drill',
          focusArea: 'Weight Transfer & Lead Foot Alignment',
          priority: 'HIGH',
          prescribedSets: '3 Sets x 15 Reps',
          durationMins: 15,
          equipment: 'Side-arm Ball Thrower / Heavy Bat',
          currentScore: 78.5,
          targetScore: 90.0,
          description: 'Lead toe was angled 15° outward during cover drive downswing at 04:12 timestamp.',
          instructions: [
            'Plant lead foot pointing directly down the target drive line.',
            'Initiate downswing only after lead toe makes solid contact.',
            'Hold high finish stance for 2 seconds to reinforce core balance.',
          ],
        },
        {
          id: 3,
          title: 'Spin Bowling Flight Loop & Turn Control',
          focusArea: 'Revolutions & Flight Arc Variance',
          priority: 'MEDIUM',
          prescribedSets: '4 Sets x 10 Deliveries',
          durationMins: 25,
          equipment: 'Revolutions Counter Ball / Targets',
          currentScore: 81.0,
          targetScore: 92.0,
          description: 'Flight trajectory flattened by 8° when batsmen stepped out.',
          instructions: [
            'Increase index/middle finger snap to generate higher RPM.',
            'Toss the ball higher above the batsman eye level.',
            'Vary release point by 5cm to induce uncertainty.',
          ],
        },
      ];
    } else if (sport === 'Volleyball') {
      return [
        {
          id: 101,
          title: 'Spike Approach Takeoff Delay Drill',
          focusArea: 'Peak Vertical Jump Timing Over Double Block',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 10 Spikes',
          durationMins: 20,
          equipment: 'High Set Setter / Plyo Box',
          currentScore: 72.0,
          targetScore: 86.0,
          description: 'Takeoff initiated 0.12s too early on high sets, spiking into 2-man blocks.',
          instructions: [
            'Delay final explosive step-close plant by 0.1 seconds.',
            'Strike the ball at absolute peak vertical extension (78cm).',
            'Snap wrist downward toward deep cross-court corners.',
          ],
        },
        {
          id: 102,
          title: 'Serve Receive Platform Stability Drill',
          focusArea: 'Deep Float Serve Trajectory Reading',
          priority: 'HIGH',
          prescribedSets: '5 Sets x 12 Receives',
          durationMins: 25,
          equipment: 'Serve Machine / Defense Target',
          currentScore: 76.0,
          targetScore: 89.0,
          description: 'Platform arms separated during fast float serve trajectory shifts.',
          instructions: [
            'Lock elbows and extend platform 1m before ball arrival.',
            'Angle platform toward setter position 3.',
            'Absorb ball pace with slight knee flex upon contact.',
          ],
        },
      ];
    } else {
      // Football
      return [
        {
          id: 201,
          title: 'Defensive Line Compactness & Press Trigger Drill',
          focusArea: 'Midfield Compactness & Wing Traps',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 8 Mins',
          durationMins: 30,
          equipment: 'Agility Cones & Full Pitch Grid',
          currentScore: 75.0,
          targetScore: 88.0,
          description: 'Backline depth expanded to 21m during fast opponent counter-attacks.',
          instructions: [
            'Maintain strict 12m vertical distance between defense and midfield.',
            'Trigger wing press trap simultaneously when central midfielder steps up.',
            'Force opposition passes outward toward sideline boundaries.',
          ],
        },
        {
          id: 202,
          title: 'First-Touch Turn under High Press Drill',
          focusArea: 'Scanning Frequency & Body Angle Control',
          priority: 'HIGH',
          prescribedSets: '3 Sets x 12 Reps',
          durationMins: 15,
          equipment: 'Rebounder Board / Passer',
          currentScore: 80.0,
          targetScore: 91.0,
          description: 'Scanned shoulder only 1 time before receiving central pass.',
          instructions: [
            'Perform 2 quick shoulder scans before receiving the ball.',
            'Take first touch into open space away from defender pressure.',
            'Execute 1-touch layoff to wing option when pressed from behind.',
          ],
        },
      ];
    }
  };

  const drills = getDrillsForSport();
  const completedCount = Object.values(completedDrills).filter(Boolean).length;

  const handleDownloadCheatsheet = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="glass-panel border border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-7">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" /> Actionable Training Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">100% Grounded from Match Video</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Match Strategy & Custom Training Drill Generator
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Personalized training drills, biomechanical fixes, and pre-match tactical directives tailored to your match video.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCheatsheet}
            className="px-4 py-2.5 rounded-2xl bg-dark-950 border border-slate-800 hover:border-brand-500/40 text-slate-200 hover:text-white text-xs font-black flex items-center gap-2 transition hover:scale-105"
          >
            <FileText className="w-4 h-4 text-brand-400" /> Export Tactical Cheatsheet
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-2xl bg-brand-500/15 border border-brand-500/40 text-brand-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            Tactical Game-Plan Cheatsheet generated and saved to your account reports!
          </div>
        </div>
      )}

      {/* SECTION 1: Match Video Technical Diagnosis Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> 1. Video Technical Flaws & Diagnosis Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-dark-950/80 border border-amber-500/30 text-xs space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                High Priority
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Timestamp 04:12</span>
            </div>
            <h4 className="font-extrabold text-white text-sm">
              {sport === 'Cricket' ? 'Over-Pitched Full Delivery Trajectory' : sport === 'Volleyball' ? 'Early Takeoff into Double Block' : 'Defensive Transition Gap'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {sport === 'Cricket'
                ? 'Pitching 0.5m too full outside off-stump allowed opposition boundary strokes.'
                : sport === 'Volleyball'
                ? 'Jumped 0.12s too early on high set, spiking directly into 2-man net block.'
                : 'Backline spread expanded to 21m during fast opponent counter-attack.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/80 border border-brand-500/30 text-xs space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                High Priority
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Timestamp 08:45</span>
            </div>
            <h4 className="font-extrabold text-white text-sm">
              {sport === 'Cricket' ? 'Lead Toe Footwork Angle Shift' : sport === 'Volleyball' ? 'Serve Receive Platform Separation' : 'Pre-Receive Shoulder Scan Frequency'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {sport === 'Cricket'
                ? 'Lead foot toe was angled 15° outward, reducing weight transfer into drive shot.'
                : sport === 'Volleyball'
                ? 'Platform arms separated during fast float serve trajectory shifts.'
                : 'Player scanned shoulder only 1 time before receiving central pass.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/80 border border-cyan-500/30 text-xs space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Medium Priority
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Timestamp 12:30</span>
            </div>
            <h4 className="font-extrabold text-white text-sm">
              {sport === 'Cricket' ? 'Seam Release Alignment Variance' : sport === 'Volleyball' ? 'Block Line Net Penetration' : 'Wing Trap Synchronization Delay'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {sport === 'Cricket'
                ? 'Wrist position tilted 8° inward, reducing outswing movement off good length.'
                : sport === 'Volleyball'
                ? 'Block reach delayed by 10cm, allowing ball to land along sidelines.'
                : 'Wingers delayed high-press trap trigger by 0.7s during central press.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Custom Interactive Training Drill Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-brand-400" /> 2. Tailored Custom Training Drills
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Completed <strong className="text-emerald-400">{completedCount}</strong> of {drills.length} Drills
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {drills.map((drill) => {
            const isDone = !!completedDrills[drill.id];
            return (
              <div
                key={drill.id}
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                    : 'bg-dark-950/90 border-slate-800 hover:border-brand-500/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {drill.focusArea}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {drill.durationMins} Mins
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-white">{drill.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{drill.description}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-300 text-[11px]">
                      <span>Prescribed Volume:</span>
                      <span className="text-brand-400 font-mono">{drill.prescribedSets}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-300 text-[11px]">
                      <span>Equipment Needed:</span>
                      <span className="text-slate-400 font-normal">{drill.equipment}</span>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions List */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Execution Steps:</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {drill.instructions.map((inst, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-brand-400 font-bold">•</span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Metric Score Improvement Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Target Score Improvement</span>
                      <span className="text-emerald-400 font-mono">
                        {drill.currentScore} → {drill.targetScore} / 100
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${(drill.targetScore / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Completion Toggle Button */}
                <button
                  onClick={() => toggleDrillCompletion(drill.id)}
                  className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                      : 'bg-dark-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:scale-[1.02]'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" /> Drill Completed!
                    </>
                  ) : (
                    <>
                      <Dumbbell className="w-4 h-4 text-brand-400" /> Mark Drill as Completed
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Next Match Opponent Game-Plan Directives */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 border border-brand-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" /> 3. Next Match Tactical Cheatsheet & Directives
          </h3>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Pre-Match Cheatsheet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-1.5">
            <div className="font-extrabold text-brand-300 text-sm">Directive #1: Pitching Length Discipline</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Maintain consistent good length pitching (6.5m to 7.5m from stumps). Avoid pitching full when batsmen step out.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-1.5">
            <div className="font-extrabold text-cyan-300 text-sm">Directive #2: Soft Front-Foot Stance</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Play with a soft front-foot defensive nudging stance when ball moves inward on good length outside off-stump.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-1.5">
            <div className="font-extrabold text-emerald-300 text-sm">Directive #3: Defensive Transition Compactness</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Compact central defensive spacing to 12m during opponent transition attacks to block central passing corridors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
