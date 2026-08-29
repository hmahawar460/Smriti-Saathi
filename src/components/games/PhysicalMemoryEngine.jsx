import { useState, useEffect } from "react";
import { physicalMemoryGamesList } from "../../data/unifiedGamesData";
import { translations } from "../../data/translations";
import {
  Volume2,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobotAvatar } from "../common/GraphicAssets";
export const PhysicalMemoryEngine = ({
  game,
  profile,
  onComplete,
  onBack
}) => {
  const t = translations[profile.language];
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(95);
  const [errorsCount, setErrorsCount] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const titleLower = (game.title || "").toLowerCase() + " " + (game.id || "").toLowerCase();
  const isTouchBody = titleLower.includes("touch the body") || titleLower.includes("pm-1");
  const isRememberMove = titleLower.includes("remember & move") || titleLower.includes("pm-2");
  const isSimonSays = titleLower.includes("simon says") || titleLower.includes("pm-3");
  const isCrossBody = titleLower.includes("cross-body") || titleLower.includes("pm-4");
  const isCountTouch = titleLower.includes("count & touch") || titleLower.includes("pm-5");
  const isLeftRight = titleLower.includes("left or right") || titleLower.includes("pm-6");
  const isFingerSeq = titleLower.includes("finger sequence") || titleLower.includes("pm-7");
  const isClapPattern = titleLower.includes("clap pattern") || titleLower.includes("pm-8");
  const isFootTap = titleLower.includes("foot tap") || titleLower.includes("pm-9");
  const isMovementSeq = titleLower.includes("movement sequence") || titleLower.includes("pm-10");
  const isColorMove = titleLower.includes("color movement") || titleLower.includes("pm-11");
  const isFreezeMove = titleLower.includes("freeze & move") || titleLower.includes("pm-12");
  const isRhythmCopy = titleLower.includes("rhythm copy") || titleLower.includes("pm-13");
  const isMirrorMe = titleLower.includes("mirror me") || titleLower.includes("pm-14");
  const isReverseSeq = titleLower.includes("reverse sequence") || titleLower.includes("pm-15");
  const playTone = (freq = 520, type = "sine", duration = 0.25) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
    }
  };
  const speakPrompt = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.85;
      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
  };
  useEffect(() => {
    let interval = null;
    if (!isPaused && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [isPaused, isCompleted]);
  const handleFinishGame = (finalScore = 96, finalErrors = errorsCount) => {
    setIsCompleted(true);
    setScore(finalScore);
    try {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch {
    }
    playTone(784, "triangle", 0.4);
    onComplete(game.id, finalScore, Math.max(70, 100 - finalErrors * 5), elapsedSeconds, finalErrors);
  };
  const touchBodyLevels = [
    { text: "Touch your nose \u2192 left ear \u2192 right shoulder", parts: ["Nose \u{1F443}", "Left Ear \u{1F442}", "Right Shoulder \u{1F4AA}"] },
    { text: "Touch your chin \u2192 right knee \u2192 forehead", parts: ["Chin \u{1F9D4}", "Right Knee \u{1F9B5}", "Forehead \u{1F9E0}"] },
    { text: "Touch left shoulder \u2192 right ear \u2192 left knee", parts: ["Left Shoulder \u{1F4AA}", "Right Ear \u{1F442}", "Left Knee \u{1F9B5}"] }
  ];
  const [touchLevelIdx, setTouchLevelIdx] = useState(0);
  const rememberMoveItems = [
    { title: "1. Wave Hand \u{1F590}\uFE0F", desc: "Wave your right hand gently" },
    { title: "2. Touch Head \u{1F646}", desc: "Place both hands gently on your head" },
    { title: "3. Clap Twice \u{1F44F}", desc: "Clap your hands together two times" }
  ];
  const [rememberMovePhase, setRememberMovePhase] = useState("study");
  const simonRounds = [
    { prompt: "Simon says: Touch your head!", simonSaid: true },
    { prompt: "Clap your hands twice!", simonSaid: false },
    { prompt: "Simon says: Raise both arms up!", simonSaid: true },
    { prompt: "Tap your knees!", simonSaid: false },
    { prompt: "Simon says: Give a warm smile and wave!", simonSaid: true }
  ];
  const [simonIndex, setSimonIndex] = useState(0);
  const [simonFeedback, setSimonFeedback] = useState(null);
  const crossBodySteps = [
    { title: "Right Hand \u2192 Left Knee", desc: "Cross your right hand down to touch your left knee." },
    { title: "Left Hand \u2192 Right Knee", desc: "Cross your left hand down to touch your right knee." },
    { title: "Right Hand \u2192 Left Shoulder", desc: "Reach right hand across to touch your left shoulder." },
    { title: "Left Hand \u2192 Right Shoulder", desc: "Reach left hand across to touch your right shoulder." }
  ];
  const [crossBodyIdx, setCrossBodyIdx] = useState(0);
  const [countTouchReps, setCountTouchReps] = useState(0);
  const targetCountReps = 3;
  const leftRightQuestions = [
    { prompt: "Raise your LEFT hand!", correct: "LEFT" },
    { prompt: "Point with your RIGHT hand!", correct: "RIGHT" },
    { prompt: "Touch your LEFT ear!", correct: "LEFT" },
    { prompt: "Tap your RIGHT knee!", correct: "RIGHT" }
  ];
  const [leftRightIdx, setLeftRightIdx] = useState(0);
  const [fingerTaps, setFingerTaps] = useState([]);
  const targetFingerSeq = ["Thumb", "Index", "Middle"];
  const [clapCount, setClapCount] = useState(0);
  const footTapSteps = ["Right Foot \u{1F9B6}", "Left Foot \u{1F9B6}", "Right Foot \u{1F9B6}", "Both Feet \u{1F463}"];
  const [footTapIdx, setFootTapIdx] = useState(0);
  const moveSeqSteps = [
    { title: "1. Hands Up \u{1F646}", desc: "Raise both arms comfortably towards the sky" },
    { title: "2. Hands Down \u2B07\uFE0F", desc: "Rest both hands gently down on your lap" },
    { title: "3. Touch Shoulders \u{1F64B}", desc: "Place fingertips on your shoulders" },
    { title: "4. Clap Hands \u{1F44F}", desc: "Clap hands once with a bright sound" }
  ];
  const [moveSeqIdx, setMoveSeqIdx] = useState(0);
  const colorMoveCards = [
    { colorName: "RED", bgClass: "bg-rose-500", action: "CLAP HANDS \u{1F44F}", voice: "Red color! Clap hands!" },
    { colorName: "BLUE", bgClass: "bg-blue-500", action: "TOUCH SHOULDERS \u{1F64B}", voice: "Blue color! Touch shoulders!" },
    { colorName: "GREEN", bgClass: "bg-emerald-500", action: "RAISE HAND \u{1F590}\uFE0F", voice: "Green color! Raise hand!" }
  ];
  const [colorMoveIdx, setColorMoveIdx] = useState(0);
  const [freezePhase, setFreezePhase] = useState("move");
  const [freezeCountdown, setFreezeCountdown] = useState(3);
  const [userRhythmBeats, setUserRhythmBeats] = useState([]);
  const mirrorSteps = [
    { title: "Raise Right Palm", desc: "Mirror the coach: Lift your right palm open." },
    { title: "Gentle Left Neck Tilt", desc: "Mirror the coach: Tilt head softly to the left." },
    { title: "Two Thumbs Up", desc: "Mirror the coach: Show two thumbs up with a smile." }
  ];
  const [mirrorIdx, setMirrorIdx] = useState(0);
  const reverseRounds = [
    { forward: "Head \u2192 Shoulder \u2192 Knee", reverse: "Knee \u2192 Shoulder \u2192 Head", parts: ["Knee", "Shoulder", "Head"] },
    { forward: "Nose \u2192 Ears \u2192 Clapping", reverse: "Clapping \u2192 Ears \u2192 Nose", parts: ["Clapping", "Ears", "Nose"] }
  ];
  const [reverseIdx, setReverseIdx] = useState(0);
  useEffect(() => {
    const defaultTagline = game.tagline || "Follow the friendly movement challenge.";
    speakPrompt(`${game.title}. ${defaultTagline}`);
  }, [game.id]);
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  if (isCompleted) {
    return <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border-2 border-emerald-300 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full">
              PHYSICAL + MEMORY COMPLETED
            </span>
            <h2 className="text-3xl font-extrabold text-[#132A2F] mt-3">
              Wonderful Job, {profile.preferredName}!
            </h2>
            <p className="text-base text-slate-600 font-medium mt-1">
              You exercised your brain and body with <span className="font-bold text-[#0D7377]">{game.title}</span>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">Score</span>
              <span className="text-2xl font-black text-[#0D7377]">{score}%</span>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">Time</span>
              <span className="text-2xl font-black text-slate-800">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">Accuracy</span>
              <span className="text-2xl font-black text-emerald-600">98%</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left flex items-start gap-3">
            <RobotAvatar size="w-10 h-10" />
            <div>
              <p className="text-xs font-extrabold text-[#0D7377] uppercase tracking-wider mb-0.5">
                NEURO-MOTOR BENEFIT NOTE
              </p>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "Combining memory recall with body movement activates the motor cortex, cerebellum, and prefrontal cortex simultaneously!"
              </p>
            </div>
          </div>

          <button
      onClick={onBack}
      className="w-full py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-lg rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
    >
            <span>Back to All Games</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>;
  }
  const gameImageUrl = game.imageUrl || physicalMemoryGamesList.find((g) => g.id === game.id || g.title.toLowerCase() === game.title.toLowerCase())?.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80";
  return <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      
      {
    /* Header bar */
  }
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-[#0D7377]/15">
        <button
    onClick={onBack}
    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm py-1.5 px-3 rounded-xl hover:bg-slate-100 transition cursor-pointer"
  >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Physical + Memory Exercise
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#132A2F] mt-0.5">
            {game.title}
          </h2>
        </div>

        <button
    onClick={() => speakPrompt(game.tagline || game.title)}
    className={`p-2 rounded-xl border transition cursor-pointer ${isSpeaking ? "bg-rose-100 border-rose-300 text-rose-800 animate-pulse" : "bg-teal-50 border-teal-200 text-[#0D7377]"}`}
    title="Read instructions aloud"
  >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {
    /* Picture & Exercise Banner */
  }
      <div className="relative w-full h-36 sm:h-44 rounded-3xl overflow-hidden shadow-xs border border-slate-200">
        <img
    src={gameImageUrl}
    alt={game.title}
    className="w-full h-full object-cover"
  />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs font-black">
          <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
            🧘 Movement Guide
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full text-teal-200">
            ~{game.durationMinutes || 3} min
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs sm:text-sm font-semibold text-teal-100 line-clamp-1">
            {game.tagline || "Follow the step-by-step physical routine at your comfortable pace."}
          </p>
        </div>
      </div>

      {
    /* Safety message */
  }
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5 text-amber-900 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
        <p className="text-xs font-bold leading-tight">
          "{game.safetyMessage || "Move at your own gentle pace while seated comfortably."}"
        </p>
      </div>

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 1: TOUCH THE BODY PART */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isTouchBody && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 text-center space-y-6">
          <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Level {touchLevelIdx + 1} of {touchBodyLevels.length}
          </span>
          
          <div className="p-5 rounded-2xl bg-teal-50/80 border-2 border-teal-200 space-y-2">
            <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Touch this sequence:</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
              {touchBodyLevels[touchLevelIdx].text}
            </h3>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {touchBodyLevels[touchLevelIdx].parts.map((part, idx) => <div
    key={idx}
    className="px-4 py-3 bg-white border-2 border-[#0D7377] rounded-2xl font-black text-sm text-[#0D7377] shadow-xs flex items-center gap-1.5"
  >
                <span className="w-5 h-5 rounded-full bg-[#0D7377] text-white text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{part}</span>
              </div>)}
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
    onClick={() => speakPrompt(touchBodyLevels[touchLevelIdx].text)}
    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center gap-1.5 cursor-pointer"
  >
              <Volume2 className="w-4 h-4" />
              <span>Hear Again</span>
            </button>

            {touchLevelIdx < touchBodyLevels.length - 1 ? <button
    onClick={() => {
      playTone(659, "triangle", 0.2);
      setTouchLevelIdx((i) => i + 1);
      speakPrompt(touchBodyLevels[touchLevelIdx + 1].text);
    }}
    className="py-3 px-6 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-extrabold text-sm shadow-md transition cursor-pointer"
  >
                Next Sequence →
              </button> : <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition cursor-pointer"
  >
                I Completed All Sequences ✓
              </button>}
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 2: REMEMBER & MOVE */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isRememberMove && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-200 text-center space-y-6">
          {rememberMovePhase === "study" ? <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Step 1: Memorize these 3 Movements
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-2">
                  Remember These 3 Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rememberMoveItems.map((item, idx) => <div key={idx} className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 text-center space-y-1">
                    <h4 className="font-extrabold text-base text-blue-950">{item.title}</h4>
                    <p className="text-xs text-blue-800 font-medium">{item.desc}</p>
                  </div>)}
              </div>

              <button
    onClick={() => {
      setRememberMovePhase("perform");
      speakPrompt("Now perform the 3 movements from memory: Wave Hand, Touch Head, Clap Twice.");
    }}
    className="py-3.5 px-8 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-extrabold text-base shadow-md transition cursor-pointer"
  >
                I've Memorized Them! Hide & Perform →
              </button>
            </div> : <div className="space-y-5">
              <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 2: Perform From Memory
              </span>
              <h3 className="text-2xl font-black text-[#132A2F]">
                Now Perform the 3 Movements in Order!
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                1. Wave Hand → 2. Touch Head → 3. Clap Twice
              </p>

              <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-md transition cursor-pointer"
  >
                I Did All 3 Movements Correctly ✓
              </button>
            </div>}
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 3: SIMON SAYS */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isSimonSays && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-200 text-center space-y-6">
          <span className="text-xs font-bold text-purple-800 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Round {simonIndex + 1} of {simonRounds.length}
          </span>

          <div className="p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 space-y-2">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Command:</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#132A2F]">
              "{simonRounds[simonIndex].prompt}"
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
    onClick={() => {
      if (simonRounds[simonIndex].simonSaid) {
        playTone(784, "triangle", 0.25);
        if (simonIndex < simonRounds.length - 1) {
          setSimonIndex((i) => i + 1);
          speakPrompt(simonRounds[simonIndex + 1].prompt);
        } else {
          handleFinishGame(98, errorsCount);
        }
      } else {
        setErrorsCount((e) => e + 1);
        playTone(260, "sawtooth", 0.2);
        alert("Oops! Simon did not say to do this! Only move when Simon says.");
      }
    }}
    className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
  >
              ✓ I Performed It!
            </button>

            <button
    onClick={() => {
      if (!simonRounds[simonIndex].simonSaid) {
        playTone(784, "triangle", 0.25);
        if (simonIndex < simonRounds.length - 1) {
          setSimonIndex((i) => i + 1);
          speakPrompt(simonRounds[simonIndex + 1].prompt);
        } else {
          handleFinishGame(98, errorsCount);
        }
      } else {
        setErrorsCount((e) => e + 1);
        playTone(260, "sawtooth", 0.2);
        alert("Simon DID say it! You should perform this movement.");
      }
    }}
    className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
  >
              ✋ Ignore (Simon Didn't Say)
            </button>
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 4: CROSS-BODY TOUCH */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isCrossBody && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-teal-200 text-center space-y-6">
          <span className="text-xs font-bold text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Step {crossBodyIdx + 1} of {crossBodySteps.length}
          </span>
          <h3 className="text-2xl font-black text-[#132A2F]">
            {crossBodySteps[crossBodyIdx].title}
          </h3>
          <p className="text-base text-slate-600 font-medium max-w-md mx-auto">
            {crossBodySteps[crossBodyIdx].desc}
          </p>

          <div className="flex justify-center gap-3">
            {crossBodyIdx < crossBodySteps.length - 1 ? <button
    onClick={() => {
      playTone(659, "triangle", 0.2);
      setCrossBodyIdx((i) => i + 1);
      speakPrompt(crossBodySteps[crossBodyIdx + 1].desc);
    }}
    className="py-3 px-6 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-extrabold text-sm shadow-md transition cursor-pointer"
  >
                Next Cross-Body Touch →
              </button> : <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition cursor-pointer"
  >
                Complete Cross-Body Session ✓
              </button>}
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 5: COUNT & TOUCH */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isCountTouch && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200 text-center space-y-6">
          <h3 className="text-2xl font-black text-[#132A2F]">
            "Touch Your Right Knee 3 Times"
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Tap the button or your knee rhythmically 3 times:
          </p>

          <div className="text-5xl font-black text-amber-600">
            {countTouchReps} / {targetCountReps}
          </div>

          <div className="flex justify-center gap-3">
            <button
    onClick={() => {
      const next = countTouchReps + 1;
      playTone(440 + next * 100, "triangle", 0.2);
      setCountTouchReps(next);
      if (next >= targetCountReps) {
        setTimeout(() => handleFinishGame(98, 0), 400);
      }
    }}
    className="py-4 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-lg shadow-md transition cursor-pointer active:scale-95"
  >
              TAP 🦵 ({countTouchReps + 1})
            </button>
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 6: LEFT OR RIGHT */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isLeftRight && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-cyan-200 text-center space-y-6">
          <span className="text-xs font-bold text-cyan-800 uppercase bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            Question {leftRightIdx + 1} of {leftRightQuestions.length}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#132A2F]">
            {leftRightQuestions[leftRightIdx].prompt}
          </h3>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {["LEFT", "RIGHT"].map((side) => <button
    key={side}
    onClick={() => {
      if (side === leftRightQuestions[leftRightIdx].correct) {
        playTone(784, "triangle", 0.25);
        if (leftRightIdx < leftRightQuestions.length - 1) {
          setLeftRightIdx((i) => i + 1);
        } else {
          handleFinishGame(98, errorsCount);
        }
      } else {
        setErrorsCount((e) => e + 1);
        playTone(260, "sawtooth", 0.2);
      }
    }}
    className="py-5 bg-white hover:bg-cyan-50 border-3 border-cyan-500 text-cyan-900 rounded-2xl font-black text-xl shadow-xs transition active:scale-95 cursor-pointer"
  >
                {side}
              </button>)}
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 7: FINGER SEQUENCE */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isFingerSeq && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-indigo-200 text-center space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
            Target: Thumb → Index → Middle
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Touch fingers on your hand or tap the buttons in exact order:
          </p>

          <div className="flex justify-center gap-2 flex-wrap">
            {["Thumb", "Index", "Middle", "Ring", "Little"].map((finger) => <button
    key={finger}
    onClick={() => {
      playTone(523, "sine", 0.2);
      const nextSeq = [...fingerTaps, finger];
      setFingerTaps(nextSeq);
      if (nextSeq.length === targetFingerSeq.length) {
        const isCorrect = nextSeq.every((f, i) => f === targetFingerSeq[i]);
        if (isCorrect) {
          handleFinishGame(98, errorsCount);
        } else {
          setErrorsCount((e) => e + 1);
          setFingerTaps([]);
          alert("Try again in order: Thumb \u2192 Index \u2192 Middle");
        }
      }
    }}
    className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-300 text-indigo-950 rounded-xl font-bold text-sm cursor-pointer active:scale-95"
  >
                {finger}
              </button>)}
          </div>

          <div className="text-xs font-bold text-indigo-700">
            Selected: {fingerTaps.join(" \u2192 ") || "None yet"}
          </div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 8: CLAP PATTERN */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isClapPattern && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-200 text-center space-y-6">
          <h3 className="text-2xl font-black text-[#132A2F]">
            Listen to Pattern: 👏 → 👏👏 → 👏 → 👏👏
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Clap along with hands and tap the clap pad:
          </p>

          <button
    onClick={() => {
      playTone(880, "triangle", 0.15);
      const next = clapCount + 1;
      setClapCount(next);
      if (next >= 6) {
        handleFinishGame(98, 0);
      }
    }}
    className="w-32 h-32 mx-auto rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-4xl flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
  >
            👏
          </button>
          <div className="text-sm font-bold text-slate-600">Claps: {clapCount} / 6</div>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 9: FOOT TAP */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isFootTap && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 text-center space-y-6">
          <h3 className="text-2xl font-black text-[#132A2F]">
            Tap: Right foot → Left foot → Right foot → Both
          </h3>
          <div className="text-2xl font-black text-emerald-700">
            Current: {footTapSteps[footTapIdx]}
          </div>

          <button
    onClick={() => {
      playTone(400, "triangle", 0.2);
      if (footTapIdx < footTapSteps.length - 1) {
        setFootTapIdx((i) => i + 1);
      } else {
        handleFinishGame(98, 0);
      }
    }}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            I Tapped {footTapSteps[footTapIdx]} →
          </button>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 10: MOVEMENT SEQUENCE */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isMovementSeq && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-200 text-center space-y-6">
          <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Step {moveSeqIdx + 1} of {moveSeqSteps.length}
          </span>
          <h3 className="text-2xl font-black text-[#132A2F]">
            {moveSeqSteps[moveSeqIdx].title}
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {moveSeqSteps[moveSeqIdx].desc}
          </p>

          <button
    onClick={() => {
      playTone(600, "triangle", 0.2);
      if (moveSeqIdx < moveSeqSteps.length - 1) {
        setMoveSeqIdx((i) => i + 1);
        speakPrompt(moveSeqSteps[moveSeqIdx + 1].desc);
      } else {
        handleFinishGame(98, 0);
      }
    }}
    className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-sm cursor-pointer"
  >
            Next Movement Step →
          </button>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 11: COLOR MOVEMENT */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isColorMove && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-200 text-center space-y-6">
          <div className={`p-8 rounded-3xl ${colorMoveCards[colorMoveIdx].bgClass} text-white space-y-2 shadow-md`}>
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              COLOR CHALLENGE
            </span>
            <h3 className="text-3xl font-black">
              {colorMoveCards[colorMoveIdx].action}
            </h3>
          </div>

          <button
    onClick={() => {
      playTone(700, "sine", 0.2);
      if (colorMoveIdx < colorMoveCards.length - 1) {
        setColorMoveIdx((i) => i + 1);
        speakPrompt(colorMoveCards[colorMoveIdx + 1].voice);
      } else {
        handleFinishGame(98, 0);
      }
    }}
    className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            I Performed the Action →
          </button>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 12: FREEZE & MOVE */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isFreezeMove && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-200 text-center space-y-6">
          <div className={`p-8 rounded-3xl ${freezePhase === "freeze" ? "bg-rose-600 animate-pulse" : "bg-teal-600"} text-white space-y-2`}>
            <h3 className="text-3xl font-black">
              {freezePhase === "freeze" ? "\u{1F6D1} FREEZE! HOLD STILL!" : "\u{1F3B5} MOVE & CLAP GENTLY"}
            </h3>
            <p className="text-sm font-semibold text-white/90">
              {freezePhase === "freeze" ? "Do not move any muscles!" : "Sway shoulders and tap your feet"}
            </p>
          </div>

          {freezePhase === "move" ? <button
    onClick={() => {
      setFreezePhase("freeze");
      playTone(300, "sawtooth", 0.4);
      speakPrompt("FREEZE! Hold still!");
    }}
    className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
              Signal Freeze Now! 🛑
            </button> : <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
              Completed Freeze Test ✓
            </button>}
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 13: RHYTHM COPY */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isRhythmCopy && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-200 text-center space-y-6">
          <h3 className="text-2xl font-black text-[#132A2F]">
            Copy This Rhythm by Tapping
          </h3>
          <div className="flex justify-center gap-3">
            <button
    onClick={() => {
      [0, 300, 700, 1e3].forEach((delay) => {
        setTimeout(() => playTone(600, "triangle", 0.15), delay);
      });
    }}
    className="py-3 px-5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-sm rounded-xl cursor-pointer"
  >
              🎵 Play Rhythm Audio
            </button>
          </div>

          <button
    onClick={() => {
      playTone(700, "sine", 0.15);
      setUserRhythmBeats((b) => [...b, Date.now()]);
    }}
    className="w-32 h-32 mx-auto rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl flex items-center justify-center shadow-lg active:scale-90 cursor-pointer"
  >
            TAP PAD 🥁
          </button>

          <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            I Copied the Rhythm ✓
          </button>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 14: MIRROR ME */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isMirrorMe && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-cyan-200 text-center space-y-6">
          <span className="text-xs font-bold text-cyan-800 uppercase bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            Action {mirrorIdx + 1} of {mirrorSteps.length}
          </span>
          <h3 className="text-2xl font-black text-[#132A2F]">
            {mirrorSteps[mirrorIdx].title}
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {mirrorSteps[mirrorIdx].desc}
          </p>

          <button
    onClick={() => {
      playTone(650, "sine", 0.2);
      if (mirrorIdx < mirrorSteps.length - 1) {
        setMirrorIdx((i) => i + 1);
        speakPrompt(mirrorSteps[mirrorIdx + 1].desc);
      } else {
        handleFinishGame(98, 0);
      }
    }}
    className="py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            I Mirrored the Movement →
          </button>
        </div>}

      {
    /* ------------------------------------------------------------- */
  }
      {
    /* GAME 15: REVERSE SEQUENCE */
  }
      {
    /* ------------------------------------------------------------- */
  }
      {isReverseSeq && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-teal-200 text-center space-y-6">
          <span className="text-xs font-bold text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Round {reverseIdx + 1} of {reverseRounds.length}
          </span>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 font-bold uppercase">Forward Order:</p>
            <h4 className="text-lg font-bold text-slate-700">{reverseRounds[reverseIdx].forward}</h4>
          </div>

          <div className="p-5 bg-teal-50 rounded-2xl border-2 border-teal-300">
            <p className="text-xs text-teal-800 font-bold uppercase">Perform in Reverse:</p>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-1">
              {reverseRounds[reverseIdx].reverse}
            </h3>
          </div>

          <button
    onClick={() => {
      playTone(700, "triangle", 0.2);
      if (reverseIdx < reverseRounds.length - 1) {
        setReverseIdx((i) => i + 1);
      } else {
        handleFinishGame(98, 0);
      }
    }}
    className="py-3 px-6 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            I Performed the Reverse Sequence ✓
          </button>
        </div>}

      {
    /* Fallback for general completion */
  }
      {!isTouchBody && !isRememberMove && !isSimonSays && !isCrossBody && !isCountTouch && !isLeftRight && !isFingerSeq && !isClapPattern && !isFootTap && !isMovementSeq && !isColorMove && !isFreezeMove && !isRhythmCopy && !isMirrorMe && !isReverseSeq && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-6">
          <h3 className="text-2xl font-black text-[#132A2F]">{game.title}</h3>
          <p className="text-sm text-slate-600 font-medium">{game.tagline || "Follow the gentle guided movements."}</p>
          <button
    onClick={() => handleFinishGame(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm cursor-pointer"
  >
            Complete Game ✓
          </button>
        </div>}

    </div>;
};
