import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { translations } from "../../data/translations";
import {
  Brain,
  Wifi,
  WifiOff,
  Globe,
  ChevronDown,
  Check,
  MoreVertical,
  X,
  ChevronRight,
  Home,
  User,
  Users,
  Stethoscope,
  PhoneCall,
  LogIn,
  UserPlus,
  Bell,
  Clock,
  Lock
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

export const Header = ({
  currentRole = "home",
  onRoleChange,
  profile,
  onProfileUpdate,
  onOpenVoice,
  onOpenCaregiverCall,
  onOpenAuthModal,
  reminders = [],
  tasks = [],
  onToggleReminder,
  onStartTask,
  onAddReminder,
  onMarkAllRemindersDone
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === "doctor";

  const t = translations[profile?.language] || translations.en;

  const pendingReminders = reminders.filter((r) => !r.completed);
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const totalPending = pendingReminders.length + pendingTasks.length;

  const langOptions = [
    { code: "en", label: "English", flag: "🌐" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "as", label: "অসমীয়া", flag: "🇮🇳" },
    { code: "bn", label: "বাংলা", flag: "🇮🇳" },
    { code: "mni", label: "মৈতৈলোন্", flag: "🇮🇳" },
    { code: "lus", label: "Mizo ṭawng", flag: "🇮🇳" }
  ];

  // Close dropdowns on outside click or Esc key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("#header-three-dots-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const brandName =
    profile?.language === "hi"
      ? "स्मृति साथी"
      : profile?.language === "as"
      ? "স্মৃতি সংগী"
      : profile?.language === "bn"
      ? "স্মৃতি সঙ্গী"
      : profile?.language === "mni"
      ? "স্মৃতি সংগী"
      : profile?.language === "lus"
      ? "Smriti Saathi"
      : "Smriti Saathi";

  const brandTagline =
    profile?.language === "hi"
      ? "AI संज्ञानात्मक साथी"
      : profile?.language === "as"
      ? "AI ज्ञानীয় সংগী"
      : profile?.language === "bn"
      ? "AI কগনিটিভ সঙ্গী"
      : profile?.language === "mni"
      ? "AI ৱাখলগী সংগী"
      : profile?.language === "lus"
      ? "AI Cognitive Companion"
      : "AI Cognitive Companion";

  const navLinks = [
    { id: "home", label: t?.nav?.home || "Home", icon: Home },
    { id: "patient", label: t?.nav?.patient || "Patient", icon: User },
    { id: "family", label: t?.nav?.caregiver || "Caregiver", icon: Users },
    { id: "doctor", label: t?.nav?.doctor || "Doctor", icon: Stethoscope }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Brand Identity */}
          <button
            onClick={() => onRoleChange("home")}
            className="flex items-center gap-2.5 sm:gap-3 text-left group transition cursor-pointer shrink-0"
            title="Go to Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl text-[#0F172A] tracking-tight truncate">
                  {brandName}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block truncate">
                {brandTagline}
              </span>
            </div>
          </button>

          {/* Desktop & Tablet Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-semibold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;
              const isLockedForUser = item.id === "doctor" && !isDoctor;
              return (
                <button
                  key={item.id}
                  id={`header-nav-${item.id}`}
                  onClick={() => onRoleChange(item.id)}
                  title={isLockedForUser ? "Doctor Portal (Doctor Login Required)" : item.label}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-blue-700 font-bold bg-blue-50/90 shadow-xs border border-blue-100"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {isLockedForUser && (
                    <Lock className="w-3 h-3 text-slate-400 opacity-75 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Reminders/Notification Bell, Caregiver Online, Sync OK, Language, and Mobile 3-Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* 🔔 Notifications & Reminders Bell Button (Desktop, Tablet & Mobile) */}
            <button
              id="header-notification-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`relative flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
                notificationOpen
                  ? "bg-blue-600 border-blue-700 text-white shadow-md"
                  : totalPending > 0
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100 border-blue-200 text-blue-900 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              }`}
              title="Your Reminders & Daily Tasks"
              aria-label="Your Reminders & Daily Tasks"
            >
              <div className="relative flex items-center">
                <Bell
                  className={`w-4 h-4 sm:w-4 sm:h-4 ${
                    totalPending > 0 && !notificationOpen ? "text-blue-600" : ""
                  }`}
                />
                {totalPending > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-white font-extrabold text-[10px] ring-2 ring-white animate-pulse shadow-xs">
                    {totalPending}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline ml-1.5 font-bold">Reminders</span>
            </button>

            {/* Contact / Caregiver Status Button (Desktop & Tablet) */}
            <button
              id="header-caregiver-online-btn"
              onClick={onOpenCaregiverCall}
              className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Contact Caregiver & Clinical Support • Click to Call or Message"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Contact</span>
            </button>

            {/* Offline Simulation / Sync OK Switcher (Desktop & Tablet) */}
            <button
              onClick={() => onProfileUpdate && onProfileUpdate({ isOffline: !profile?.isOffline })}
              className={`hidden md:flex px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-semibold transition items-center gap-1.5 cursor-pointer active:scale-95 ${
                profile?.isOffline
                  ? "bg-amber-100 border-amber-300 text-amber-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
              title={
                profile?.isOffline
                  ? "Currently in Offline Edge Mode (Click to connect)"
                  : "Online Cloud Sync Active (Click to simulate offline edge mode)"
              }
            >
              {profile?.isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-xs font-bold">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold">Sync OK</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown (Desktop & Tablet) */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                id="header-lang-toggle"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {langOptions.find((l) => l.code === (profile?.language || "en"))?.label || "English"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {langOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        if (onProfileUpdate) onProfileUpdate({ language: opt.code });
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${
                        (profile?.language || "en") === opt.code
                          ? "text-blue-600 font-bold bg-blue-50/70"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </span>
                      {(profile?.language || "en") === opt.code && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile / Compact Three Dots Menu Button */}
            <div className="md:hidden flex items-center gap-1">
              {/* Mobile Quick Contact Button */}
              <button
                onClick={onOpenCaregiverCall}
                className="flex sm:hidden items-center justify-center p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                title="Contact Caregiver & Doctor"
                aria-label="Contact Caregiver & Doctor"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </button>

              {/* Three Dots Button */}
              <button
                id="header-three-dots-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl text-slate-700 transition cursor-pointer flex items-center justify-center border ${
                  mobileMenuOpen
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                }`}
                aria-label="Toggle full navigation menu"
                title="All Menus & Portals"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <MoreVertical className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Three-Dots Scroll-Down Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-1 pb-5 pt-3 border-t border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-150 rounded-b-2xl bg-white shadow-xl px-3"
          >
            {/* Header bar of the mobile dropdown with Close (Cross) button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Menu & Settings
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                title="Close Menu"
                aria-label="Close Menu"
              >
                <span className="text-[11px] font-bold">Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: All App Menus & Portals */}
            <div>
              <div className="px-1 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Navigation & Portals</span>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                  All Views
                </span>
              </div>
              <div className="space-y-1 mt-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRole === item.id;
                  const isLockedForUser = item.id === "doctor" && !isDoctor;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onRoleChange(item.id);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-between transition cursor-pointer ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                          : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {isLockedForUser && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Doctor only</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive ? "text-blue-600" : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Quick Tools & Assistance */}
            <div className="pt-2 border-t border-slate-100">
              <div className="px-3 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Quick Tools & Actions
              </div>
              <div className="grid grid-cols-1 gap-2 mt-1 px-1">
                {/* Reminders & Tasks Shortcut */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setNotificationOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span>Reminders & Tasks</span>
                        {totalPending > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                            {totalPending} due
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-normal text-blue-700">
                        Medicine, hydration & exercises
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] bg-blue-200/80 px-2.5 py-1 rounded-lg text-blue-900 font-semibold">
                    View
                  </span>
                </button>

                {/* Caregiver Call */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCaregiverCall) onOpenCaregiverCall();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span>Caregiver Priya</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                      <div className="text-[10px] font-normal text-emerald-700">
                        Online & Ready to Assist
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-200/80 px-2.5 py-1 rounded-lg text-emerald-900 font-semibold">
                    Call
                  </span>
                </button>

                {/* Offline / Cloud Sync Toggle */}
                <button
                  onClick={() => {
                    if (onProfileUpdate) {
                      onProfileUpdate({ isOffline: !profile?.isOffline });
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    profile?.isOffline
                      ? "bg-amber-100 border-amber-300 text-amber-900"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        profile?.isOffline
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {profile?.isOffline ? (
                        <WifiOff className="w-4 h-4" />
                      ) : (
                        <Wifi className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <div>Cloud Edge Sync</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {profile?.isOffline
                          ? "Offline Mode Enabled"
                          : "Online Cloud Synchronized"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold ${
                      profile?.isOffline
                        ? "bg-amber-200 text-amber-900"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {profile?.isOffline ? "Offline" : "Sync OK"}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: Regional Language Selector */}
            <div className="pt-2 border-t border-slate-100">
              <div className="px-3 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-blue-600" />
                <span>Regional Language</span>
              </div>
              <div className="grid grid-cols-2 gap-2 px-1 pt-1.5">
                {langOptions.map((opt) => {
                  const isSelected = (profile?.language || "en") === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        if (onProfileUpdate) onProfileUpdate({ language: opt.code });
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Account Authentication */}
            {onOpenAuthModal && (
              <div className="pt-2 border-t border-slate-100">
                <div className="px-3 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Account & Portals
                </div>
                <div className="grid grid-cols-2 gap-2 px-1 pt-1.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal({ mode: "login" });
                    }}
                    className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal({ mode: "register" });
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register New</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reminders & Daily Tasks Notification Modal / Dropdown */}
      <NotificationDropdown
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        reminders={reminders}
        tasks={tasks}
        onToggleReminder={onToggleReminder}
        onStartTask={(task) => {
          if (onStartTask) onStartTask(task);
        }}
        onAddReminder={onAddReminder}
        onMarkAllDone={onMarkAllRemindersDone}
        profile={profile}
      />
    </header>
  );
};

