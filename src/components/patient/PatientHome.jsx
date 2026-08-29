import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  allUnifiedGames
} from "../../data/unifiedGamesData";
import { TourDriver } from "./TourDriver";
import { TASK_GAME_MAP } from "../../data/tourData";
import { translations } from "../../data/translations";
import {
  ElderlyAvatar,
  MorningStretchGraphic,
  MemoryMatchGraphic,
  PatternRecallGraphic
} from "../common/GraphicAssets";
import {
  Brain,
  Sparkles,
  Volume2,
  Phone,
  Play,
  Calendar,
  CloudSun,
  Droplets,
  Pill,
  Home as HomeIcon,
  CheckSquare,
  BarChart2,
  Settings,
  Check,
  Gamepad2,
  BookOpen,
  Stethoscope,
  LogIn,
  Lock,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { IconHelper } from "../common/IconHelper";
export const PatientHome = ({
  profile,
  tasks,
  physicalActivities = [],
  freePlayGames,
  reminders,
  performance,
  onStartTask,
  onStartPhysicalActivity,
  onOpenOfflineCenter,
  onOpenVoice,
  onOpenCaregiverCall,
  onToggleReminder,
  onNavigateTab,
  onOpenDoctorPortal,
  onOpenAuthModal
}) => {
  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === "doctor";
  const t = translations[profile.language];
  const [selectedGameFilter, setSelectedGameFilter] = useState("all");
  const filteredGames = allUnifiedGames.filter((game) => {
    if (selectedGameFilter === "all") return true;
    if (selectedGameFilter === "physical") return game.gameType === "physical_memory";
    if (selectedGameFilter === "cognitive") return game.gameType === "cognitive";
    return game.coreCategory === selectedGameFilter;
  });
  const handleLaunchGame = (game) => {
    const task = {
      id: game.id,
      title: game.title.toUpperCase(),
      domain: game.domain || "Memory",
      difficulty: game.difficulty || "Easy",
      durationMinutes: game.durationMinutes,
      doctorAssigned: false,
      status: "pending",
      iconName: game.iconName,
      description: game.tagline,
      required: false
    };
    onStartTask(task);
  };
  // ── Tour integration: launch the correct game domain when tour starts a step ──
  const handleTourLaunchGame = (taskIndex) => {
    const domain = TASK_GAME_MAP[taskIndex]; // e.g. "memory", "attention"
    const match = allUnifiedGames.find(
      (g) => g.coreCategory?.toLowerCase().includes(domain) && g.gameType === "cognitive"
    ) ?? allUnifiedGames.find(
      (g) => g.coreCategory?.toLowerCase().includes(domain)
    ) ?? allUnifiedGames[0];

    const task = {
      id: match.id,
      title: match.title.toUpperCase(),
      domain: match.domain || "Memory",
      difficulty: match.difficulty || "Easy",
      durationMinutes: match.durationMinutes,
      doctorAssigned: false,
      status: "pending",
      iconName: match.iconName,
      description: match.tagline,
      required: false,
    };
    onStartTask(task);
  };

  const handleLaunchGameByName = (gameName) => {
    const matchedUnified = allUnifiedGames.find(
      (g) => g.title.toLowerCase().includes(gameName.toLowerCase())
    );
    if (matchedUnified) {
      handleLaunchGame(matchedUnified);
      return;
    }
    const matched = tasks.find((t2) => t2.title.toLowerCase().includes(gameName.toLowerCase())) || {
      id: `task-${gameName.toLowerCase().replace(/[\s\.\&]+/g, "-")}`,
      title: gameName.toUpperCase(),
      domain: "Memory",
      difficulty: "Easy",
      durationMinutes: 5,
      doctorAssigned: false,
      status: "pending",
      iconName: "Brain",
      description: `Engage with ${gameName} at a calm, supportive pace.`,
      required: false
    };
    onStartTask(matched);
  };
  // ── Render a single game card ─────────────────────────────────────────────
  const renderGameCard = (game) => (
    <div
      key={game.id}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
    >
      {/* Picture Banner with Badges & Gradient */}
      <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${game.gameType === "physical_memory" ? "bg-emerald-500/90 text-white" : "bg-indigo-600/90 text-white"}`}>
            {game.gameType === "physical_memory" ? "🤸 Physical + Memory" : "🧠 Cognitive"}
          </span>
          {game.popular && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
              ★ Popular
            </span>
          )}
        </div>
        {/* Bottom Overlay Info on Picture */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold pointer-events-none">
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">⏱️ ~{game.durationMinutes} min</span>
          <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-teal-200">{game.difficulty}</span>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${game.color} text-white flex items-center justify-center shadow-2xs shrink-0`}>
              <IconHelper name={game.iconName} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0A2540] group-hover:text-[#0D7377] transition-colors leading-tight">
                {game.title}
              </h3>
              <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-teal-100">
                {game.coreCategoryLabel}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">{game.tagline}</p>
          <div className="text-[11px] text-teal-900 font-semibold bg-teal-50/80 p-2.5 rounded-xl border border-teal-100/90 leading-snug">
            <span className="font-extrabold text-[#0D7377]">Example:</span> {game.examplePrompt}
          </div>
        </div>
        {/* Bottom Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            Domain: <strong className="text-teal-800">{game.domain}</strong>
          </span>
          <button
            onClick={() => handleLaunchGame(game)}
            className="py-2.5 px-4 bg-[#0D7377] hover:bg-[#0A5C5F] active:bg-[#074648] text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow transition active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );

  return <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-28 select-none animate-in fade-in duration-200">
      {/* Guided Tour Driver — renders portals into document.body */}
      <TourDriver
        language={profile.language}
        onLaunchGame={handleTourLaunchGame}
      />

      {
    /* Offline Alert if active */
  }
      {profile.isOffline && <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-amber-900 text-sm mb-0.5">
              {t.offlineMode}
            </h4>
            <p className="text-xs text-amber-800 font-medium">
              {t.offlineSub}
            </p>
          </div>
        </div>}

      {
    /* ============================================================ */
  }
      {
    /* 1. TOP GREETING HEADER (GOOD MORNING, LAKSHMI / DATE / VOICE) */
  }
      {
    /* ============================================================ */
  }
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight uppercase">
            GOOD MORNING, {profile.preferredName.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Tuesday, 25 August · Guwahati, Assam
          </p>
          <p className="text-xs font-semibold text-[#0D7377] mt-0.5">
            How are you feeling today?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
    onClick={onOpenVoice}
    title="Voice Assistant"
    className="w-12 h-12 rounded-full bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 flex items-center justify-center text-[#0D7377] shadow-xs active:scale-95 transition cursor-pointer"
  >
            <Volume2 className="w-6 h-6" />
          </button>
          <button
    onClick={onOpenVoice}
    title="Profile & Voice Companion"
    className="relative hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
            <ElderlyAvatar size="w-12 h-12" />
          </button>
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 2. PRIMARY HERO CARD: TODAY'S ACTIVITIES & [ START TODAY'S TASKS ] */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-gradient-to-br from-[#0D7377] to-[#148A85] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#0D7377]/25 space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-[#9DF3C4]">
              {tasks.filter((t2) => t2.status === "pending").length} TASKS REMAINING
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
              TODAY'S ACTIVITIES
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium">
              {tasks.filter((t2) => t2.status === "completed").length} of {tasks.length} doctor-assigned activities completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#9DF3C4]">
            <Brain className="w-7 h-7" />
          </div>
        </div>

        {
    /* Progress Bar */
  }
        <div className="space-y-1.5">
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div
    className="bg-[#9DF3C4] h-full rounded-full transition-all duration-500"
    style={{
      width: `${Math.round(tasks.filter((t2) => t2.status === "completed").length / tasks.length * 100)}%`
    }}
  />
          </div>
        </div>

        {
    /* ONE LARGE PRIMARY START BUTTON */
  }
        <button
    onClick={() => {
      const nextPending = tasks.find((t2) => t2.status !== "completed") || tasks[0];
      onStartTask(nextPending);
    }}
    className="w-full py-4 bg-white hover:bg-teal-50 text-[#0D7377] rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
  >
          <Play className="w-5 h-5 fill-current" />
          <span>START TODAY'S TASKS</span>
        </button>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 3. TODAY'S REQUIRED TASKS (DOCTOR ASSIGNED - 2x2 Grid) */
  }
      {
    /* ============================================================ */
  }
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-[#0A2540] uppercase tracking-tight">
            TODAY'S REQUIRED FOCUS
          </h2>
          <span className="text-[11px] font-bold text-[#1D7BF6]">
            DOCTOR ASSIGNED
          </span>
        </div>

        {
    /* 2x2 Grid of 4 Cards */
  }
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          
          {
    /* Card 1: MORNING STRETCH (Blue) */
  }
          <div className="bg-[#1D7BF6] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 shadow-md shadow-blue-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <MorningStretchGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                MORNING STRETCH
              </h3>
              <button
    onClick={() => handleLaunchGameByName("Morning Stretch")}
    className="w-full py-2 bg-white text-[#1D7BF6] hover:bg-blue-50 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
  >
                <span>PLAY</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {
    /* Card 2: MEMORY MATCH GAME (Green) */
  }
          <div className="bg-[#28B463] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 shadow-md shadow-green-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <MemoryMatchGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                MEMORY MATCH
              </h3>
              <button
    onClick={() => handleLaunchGameByName("Memory Match")}
    className="w-full py-2 bg-white text-[#28B463] hover:bg-emerald-50 rounded-full font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
  >
                <span>COMPLETED</span>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {
    /* Card 3: STORY RECALL (Orange) */
  }
          <div className="bg-[#FF7A00] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 shadow-md shadow-orange-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <BookOpen className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                  STORY RECALL
                </h3>
                <span className="text-[9px] font-black uppercase bg-white/30 px-1.5 py-0.5 rounded">
                  TODAY
                </span>
              </div>
              <button
    onClick={() => handleLaunchGameByName("Story Recall")}
    className="w-full py-2 bg-white text-[#FF7A00] hover:bg-orange-50 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
  >
                <span>PLAY</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {
    /* Card 4: PATTERN RECALL (Slate / Completed) */
  }
          <div className="bg-[#28B463] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 shadow-md shadow-green-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <PatternRecallGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                PATTERN RECALL
              </h3>
              <button
    onClick={() => handleLaunchGameByName("Pattern Recall")}
    className="w-full py-2 bg-white text-[#28B463] hover:bg-emerald-50 rounded-full font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
  >
                <span>COMPLETED</span>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 4. WEATHER & ROUTINE ASSISTANCE CARD */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border border-amber-200 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
          <CloudSun className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
              DAILY ASSISTANT
            </span>
            <span className="text-xs font-bold text-amber-900">28°C · Guwahati</span>
          </div>
          <p className="text-xs text-amber-900 font-semibold leading-relaxed pt-1">
            "Gentle weather this morning. Hydrate well and choose any cognitive or movement exercise below at your own calm pace."
          </p>
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 5. UNIFIED ALL-IN-ONE GAMES & ACTIVITIES DIRECTORY (30 GAMES) */
  }
      {
    /* ============================================================ */
  }
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A2540] uppercase tracking-tight flex items-center gap-1.5">
              <Gamepad2 className="w-5 h-5 text-[#0D7377]" />
              <span>ALL GAMES & ACTIVITIES ({allUnifiedGames.length})</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Cognitive training & Physical + Memory exercises in one categorized hub
            </p>
          </div>
          <span className="text-xs font-black text-[#0D7377] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            {filteredGames.length} Available
          </span>
        </div>

        {
    /* Unified Category Filter Pills */
  }
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {[
    { id: "all", label: `All (${allUnifiedGames.length})` },
    { id: "memory_improvement", label: "\u{1F9E0} Memory Improvement" },
    { id: "attention_concentration", label: "\u{1F3AF} Attention & Concentration" },
    { id: "daily_routine_recall", label: "\u{1F4C5} Daily Routine Recall" },
    { id: "pattern_recognition", label: "\u{1F9E9} Pattern Recognition" },
    { id: "object_recognition", label: "\u{1F50D} Object Recognition" },
    { id: "emotional_mental_engagement", label: "\u{1F496} Emotional / Mental" },
    { id: "physical", label: "\u{1F938} Physical (15)" },
    { id: "cognitive", label: "\u{1F4A1} Cognitive (15)" }
  ].map((flt) => <button
    key={flt.id}
    onClick={() => setSelectedGameFilter(flt.id)}
    className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${selectedGameFilter === flt.id ? "bg-[#0D7377] text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
  >
              {flt.label}
            </button>)}
        </div>

        {
    /* Unified All Games Grid */
  }
        {/* Category anchor elements for the tour — id="cat-1" through id="cat-6" */}
        <div className="space-y-6">
          {/* cat-1: Memory Improvement */}
          <div>
            <div id="cat-1" className="relative flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 mb-3">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-tight">🧠 Memory Improvement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "memory_improvement").length > 0
                ? filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "memory_improvement").map(game => renderGameCard(game))
                : null}
            </div>
          </div>
          {/* cat-2: Attention & Concentration */}
          <div>
            <div id="cat-2" className="relative flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-2xl border border-indigo-200 mb-3">
              <span className="text-xs font-black uppercase text-indigo-800 tracking-tight">🎯 Attention &amp; Concentration</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "attention_concentration").map(game => renderGameCard(game))}
            </div>
          </div>
          {/* cat-3: Daily Routine Recall */}
          <div>
            <div id="cat-3" className="relative flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-2xl border border-amber-200 mb-3">
              <span className="text-xs font-black uppercase text-amber-800 tracking-tight">📅 Daily Routine Recall</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "daily_routine_recall").map(game => renderGameCard(game))}
            </div>
          </div>
          {/* cat-4: Pattern Recognition */}
          <div>
            <div id="cat-4" className="relative flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-2xl border border-purple-200 mb-3">
              <span className="text-xs font-black uppercase text-purple-800 tracking-tight">🧩 Pattern Recognition</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "pattern_recognition").map(game => renderGameCard(game))}
            </div>
          </div>
          {/* cat-5: Object Recognition */}
          <div>
            <div id="cat-5" className="relative flex items-center gap-2 px-3 py-2 bg-rose-50 rounded-2xl border border-rose-200 mb-3">
              <span className="text-xs font-black uppercase text-rose-800 tracking-tight">🔍 Object Recognition</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "object_recognition").map(game => renderGameCard(game))}
            </div>
          </div>
          {/* cat-6: Emotional / Mental Engagement */}
          <div>
            <div id="cat-6" className="relative flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-2xl border border-teal-200 mb-3">
              <span className="text-xs font-black uppercase text-teal-800 tracking-tight">💖 Emotional / Mental Engagement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredGames.filter(g => selectedGameFilter !== "all" || g.coreCategory === "emotional_mental_engagement").map(game => renderGameCard(game))}
            </div>
          </div>
          {/* Physical games (no cat ID needed for tour) */}
          {selectedGameFilter === "all" || selectedGameFilter === "physical" ? (
            <div>
              <div className="relative flex items-center gap-2 px-3 py-2 bg-green-50 rounded-2xl border border-green-200 mb-3">
                <span className="text-xs font-black uppercase text-green-800 tracking-tight">🤸 Physical + Memory</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredGames.filter(g => g.gameType === "physical_memory").map(game => renderGameCard(game))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 6. DAILY REMINDERS & MEDICINE CHECK */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase text-[#0A2540] tracking-tight">
            YOUR REMINDERS
          </h3>
          <span className="text-[11px] font-bold text-slate-400">TODAY</span>
        </div>

        <div className="space-y-2">
          {reminders.map((rem) => <div
    key={rem.id}
    className={`p-3 rounded-2xl border flex items-center justify-between ${rem.completed ? "bg-slate-50 border-slate-200 opacity-80" : "bg-[#F8FAFC] border-slate-200"}`}
  >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${rem.category === "medicine" ? "bg-rose-100 text-rose-700" : rem.category === "water" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}`}>
                  {rem.category === "medicine" ? <Pill className="w-4 h-4" /> : rem.category === "water" ? <Droplets className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800">{rem.title}</h4>
                  <p className="text-[10px] font-bold text-[#1D7BF6]">{rem.time}</p>
                </div>
              </div>

              <button
    onClick={() => onToggleReminder(rem.id)}
    className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer ${rem.completed ? "bg-emerald-100 text-emerald-800" : "bg-[#1D7BF6] text-white hover:bg-blue-700"}`}
  >
                {rem.completed ? "\u2713 DONE" : rem.actionLabel}
              </button>
            </div>)}
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 7. DOCTOR & CLINICAL PORTAL (ROLE RESTRICTED) */
  }
      {
    /* ============================================================ */
  }
      <div className={`rounded-3xl p-5 text-white shadow-lg space-y-3 relative overflow-hidden ${
        isDoctor
          ? "bg-gradient-to-r from-teal-900 to-blue-950 shadow-teal-950/20"
          : "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 shadow-slate-950/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDoctor ? "bg-teal-500/20 text-teal-300" : "bg-white/10 text-blue-200"
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">
                {isDoctor ? "Doctor Review Mode Active" : "Doctor & Clinical Portal"}
              </h3>
              <p className="text-[11px] text-blue-200 font-medium">
                {isDoctor
                  ? `Viewing Patient: ${profile.name} (${profile.patientCode || "PT-7241"})`
                  : `${profile.doctorName || "Dr. Debabrata Roy"} · ${profile.doctorHospital || "Apollo Neurological Centre"}`}
              </p>
            </div>
          </div>
          {isDoctor ? (
            <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold border border-teal-400/30 flex items-center gap-1">
              <span>Doctor Mode</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold border border-amber-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Doctor Only</span>
            </span>
          )}
        </div>

        <p className="text-xs text-blue-100/90 leading-relaxed">
          {isDoctor
            ? "You are inspecting this patient's exercises, cognitive performance, and reminders. You have full access to test activities or manage their therapy."
            : "The Doctor Dashboard is strictly restricted to verified clinicians. Patients cannot view clinical diagnostic telemetry, MoCA records, or prescription management tools."}
        </p>

        <div className="pt-1">
          {isDoctor ? (
            <button
              onClick={() => onOpenDoctorPortal && onOpenDoctorPortal()}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>Return to Doctor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal({ mode: "login", initialRole: "doctor" })}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Doctor Sign In</span>
              </button>
              <button
                onClick={() => onOpenDoctorPortal && onOpenDoctorPortal()}
                className="w-full sm:w-auto py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Doctor Access Info</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 8. CALL FAMILY / CAREGIVER (LARGE BOTTOM ACTION) */
  }
      {
    /* ============================================================ */
  }
      <button
    onClick={onOpenCaregiverCall}
    className="w-full py-4 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-md shadow-rose-500/20 flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
  >
        <Phone className="w-5 h-5" />
        <span>CALL CAREGIVER / FAMILY</span>
      </button>

      {
    /* ============================================================ */
  }
      {
    /* 8. BOTTOM NAVIGATION BAR (Home, Games, Tasks, Analysis, Settings) */
  }
      {
    /* ============================================================ */
  }
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 shadow-lg">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          
          {
    /* Home (Active) */
  }
          <button
    onClick={() => onNavigateTab("home")}
    className="flex flex-col items-center text-[#1D7BF6] font-bold text-[10px] gap-0.5 cursor-pointer"
  >
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <HomeIcon className="w-4.5 h-4.5 text-[#1D7BF6]" />
            </div>
            <span>Home</span>
          </button>

          {
    /* Games (Free Play) */
  }
          <button
    onClick={() => onNavigateTab("games")}
    className="flex flex-col items-center text-slate-500 hover:text-[#0D7377] font-bold text-[10px] gap-0.5 transition cursor-pointer"
  >
            <div className="w-8 h-8 rounded-full hover:bg-teal-50 flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5" />
            </div>
            <span>Games</span>
          </button>

          {
    /* Tasks */
  }
          <button
    onClick={() => onNavigateTab("tasks")}
    className="flex flex-col items-center text-slate-500 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition cursor-pointer"
  >
            <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <span>Tasks</span>
          </button>

          {
    /* Analysis */
  }
          <button
    onClick={() => onNavigateTab("analysis")}
    className="flex flex-col items-center text-slate-500 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition cursor-pointer"
  >
            <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <BarChart2 className="w-4.5 h-4.5" />
            </div>
            <span>Analysis</span>
          </button>

          {
    /* Settings / Caregiver */
  }
          <button
    onClick={onOpenCaregiverCall}
    className="flex flex-col items-center text-slate-500 hover:text-rose-600 font-bold text-[10px] gap-0.5 transition cursor-pointer"
  >
            <div className="w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <span>Caregiver</span>
          </button>

        </div>
      </div>

    </div>;
};
