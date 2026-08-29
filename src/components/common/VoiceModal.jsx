import { useState } from "react";
import { Volume2, Mic, X, Sparkles, Phone, Play } from "lucide-react";
import { translations } from "../../data/translations";
export const VoiceModal = ({
  isOpen,
  onClose,
  profile,
  onCommandTrigger
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastRecognized, setLastRecognized] = useState("");
  const t = translations[profile.language];
  if (!isOpen) return null;
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  const handleSimulateListen = (commandText) => {
    setIsListening(true);
    setTimeout(() => {
      setLastRecognized(commandText);
      setIsListening(false);
      speakText("Got it! " + commandText);
      onCommandTrigger(commandText);
    }, 1200);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#0D7377]/20 relative text-center">
        
        {
    /* Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
    aria-label="Close voice assistant"
  >
          <X className="w-6 h-6" />
        </button>

        {
    /* Voice Icon Animation */
  }
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-[#0D7377] to-[#148A85] flex items-center justify-center text-white shadow-xl shadow-[#0D7377]/30 mb-6 relative">
          <Mic className={`w-12 h-12 text-[#9DF3C4] ${isListening ? "animate-bounce" : ""}`} />
          {isListening && <span className="absolute inset-0 rounded-full border-4 border-[#9DF3C4] animate-ping opacity-75" />}
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display mb-2">
          {t.voiceAssistant}
        </h3>

        {
    /* Calming AI spoken prompt */
  }
        <div className="bg-[#EBF7F5] rounded-2xl p-4 sm:p-5 border border-[#0D7377]/20 mb-6 text-left flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0D7377] text-white flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0D7377] mb-0.5">MindSathi AI says:</p>
            <p className="text-base sm:text-lg text-[#132A2F] font-medium leading-relaxed">
              "{t.voicePrompt}"
            </p>
          </div>
        </div>

        {
    /* Quick Voice Command Buttons for Elderly Accessibility */
  }
        <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Tap or speak a command
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-left">
          <button
    onClick={() => handleSimulateListen("Start the game")}
    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#E8F6F4] hover:border-[#0D7377]/40 border border-slate-200 text-left font-bold text-[#132A2F] transition text-sm sm:text-base active:scale-98"
  >
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
              <Play className="w-4 h-4" />
            </span>
            "Start the game"
          </button>

          <button
    onClick={() => handleSimulateListen("Repeat instruction")}
    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#E8F6F4] hover:border-[#0D7377]/40 border border-slate-200 text-left font-bold text-[#132A2F] transition text-sm sm:text-base active:scale-98"
  >
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
              <Volume2 className="w-4 h-4" />
            </span>
            "Repeat instruction"
          </button>

          <button
    onClick={() => handleSimulateListen("Show my progress")}
    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-[#E8F6F4] hover:border-[#0D7377]/40 border border-slate-200 text-left font-bold text-[#132A2F] transition text-sm sm:text-base active:scale-98"
  >
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            "Show my progress"
          </button>

          <button
    onClick={() => handleSimulateListen("Call caregiver")}
    className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 hover:border-rose-300 border border-rose-200 text-left font-bold text-rose-800 transition text-sm sm:text-base active:scale-98"
  >
            <span className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-black shrink-0">
              <Phone className="w-4 h-4" />
            </span>
            "Call caregiver"
          </button>
        </div>

        {lastRecognized && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold mb-4">
            Recognized: "{lastRecognized}"
          </div>}

        <div className="flex gap-3">
          <button
    onClick={() => speakText(t.voicePrompt)}
    className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition flex items-center justify-center gap-2"
  >
            <Volume2 className="w-5 h-5 text-[#0D7377]" />
            Listen Again
          </button>

          <button
    onClick={onClose}
    className="flex-1 py-3.5 px-4 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-bold text-base transition shadow-md shadow-[#0D7377]/25"
  >
            Done
          </button>
        </div>

      </div>
    </div>;
};
