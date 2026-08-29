import React from "react";

export const HomeHero = ({ onSelectRole, onOpenMemoryTest, t }) => {
  return (
    <section className="hero" id="hero">
      <div className="container hero__grid">
        <div className="hero__left">
          
          {/* 🧠 Top Heading & Button for Memory Test Feature (Marked Area) */}
          <div className="hero-memory-test-banner">
            <div className="hero-memory-test-text">
              <span className="hero-memory-test-tag">🧠 Cognitive & Motor Assessment</span>
              <h3 className="hero-memory-test-title">Test Your Memory & Cross-Body Agility</h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenMemoryTest && onOpenMemoryTest()}
              className="hero-memory-test-btn cursor-pointer"
              title="Open the interactive Voice Agent memory & motor coordination assessment page"
            >
              <span>🧠 Take Memory Test</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="hero__badge">
            <span className="badge-dot"></span>
            <span>{t?.hero?.badge || "AI-Powered Cognitive Care Platform"}</span>
          </div>

          <h1 className="hero__title">
            <span>{t?.hero?.t1 || "Your Elder's"}</span><br />
            <span className="hero__title--accent">{t?.hero?.t2 || "AI Cognitive Companion"}</span>
          </h1>

          <p className="hero__desc">
            {t?.hero?.desc || "Transforming games, daily living, memories, and regional culture into adaptive cognitive stimulation — an empathetic AI companion assisting caregivers in monitoring longitudinal progress."}
          </p>

          <div className="hero__ctas">
            <button
              className="btn btn--primary btn--xl cursor-pointer"
              id="heroMainCta"
              onClick={() => onSelectRole && onSelectRole("patient")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.8" />
                <path d="M8 7l6 3-6 3V7z" fill="white" />
              </svg>
              <span>{t?.hero?.cta1 || "Start Therapy"}</span>
            </button>
            <button
              className="btn btn--outline btn--xl cursor-pointer"
              onClick={() => onSelectRole && onSelectRole("family")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="3" width="12" height="15" rx="2" stroke="#2563EB" strokeWidth="1.8" />
                <path d="M7 7h6M7 10h6M7 13h4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{t?.hero?.cta2 || "Caregiver Dashboard"}</span>
            </button>
          </div>

          <div className="hero__trust">
            <div className="trust-faces">
              <span className="trust-face">👵</span>
              <span className="trust-face">👴</span>
              <span className="trust-face">🧑‍⚕️</span>
              <span className="trust-face trust-face--more">+2k</span>
            </div>
            <p>{t?.hero?.trust || "Trusted by 2,000+ families & clinicians"}</p>
          </div>
        </div>

        {/* Right: Modern Bento Grid Visual with Top 4 Platform Features */}
        <div className="hero__right">
          <div className="hero-bento">
            
            {/* Bento Item 1: Tall Elder Testing Cognitive Therapy Website Real Photo Card */}
            <div className="bento-card bento-card--photo">
              <img
                src={`${import.meta.env.BASE_URL}images/elder_testing_website.jpg`}
                alt="Elder grandfather testing cognitive therapy website on tablet"
                className="bento-photo-img"
                onError={(e) => {
                  e.currentTarget.src = `${import.meta.env.BASE_URL}images/cat_memory_elder.svg`;
                }}
              />
              <div className="bento-photo-badge">
                <span className="bento-pulse-dot"></span>
                <span>{t?.hero?.fb1 || "AI Cognitive Therapy Active"}</span>
              </div>
            </div>

            {/* Bento Feature 1: AI Adaptive Engine */}
            <div className="bento-card bento-feat-card bento-feat-card--ai">
              <div className="bento-feat-top">
                <span className="bento-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 014.44-2.04" />
                    <path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-4.44-2.04" />
                  </svg>
                </span>
                <span className="bento-feat-tag">{t?.hero?.f1Tag || "AI Engine"}</span>
              </div>
              <h4 className="bento-feat-title">{t?.hero?.f1Title || "Adaptive Cognitive Engine"}</h4>
              <p className="bento-feat-desc">{t?.hero?.f1Desc || "Auto-adjusts challenge levels based on response time, accuracy & hints"}</p>
            </div>

            {/* Bento Feature 2: Regional Voice AI */}
            <div className="bento-card bento-feat-card bento-feat-card--voice">
              <div className="bento-feat-top">
                <span className="bento-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </span>
                <span className="bento-feat-tag">{t?.hero?.f2Tag || "Voice AI"}</span>
              </div>
              <h4 className="bento-feat-title">{t?.hero?.f2Title || "Regional Voice Companion"}</h4>
              <p className="bento-feat-desc">{t?.hero?.f2Desc || "Natural conversational engagement in Hindi, Assamese, Manipuri & more"}</p>
            </div>

            {/* Bento Feature 3: Caregiver Personalization */}
            <div className="bento-card bento-feat-card bento-feat-card--pers">
              <div className="bento-feat-top">
                <span className="bento-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <span className="bento-feat-tag">{t?.hero?.f3Tag || "Personalized"}</span>
              </div>
              <h4 className="bento-feat-title">{t?.hero?.f3Title || "Family Reminiscence & Photos"}</h4>
              <p className="bento-feat-desc">{t?.hero?.f3Desc || "Personalized memories, family faces, daily routines & soothing music"}</p>
            </div>

            {/* Bento Feature 4: 100% Offline Mode */}
            <div className="bento-card bento-feat-card bento-feat-card--offline">
              <div className="bento-feat-top">
                <span className="bento-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0122.58 9" />
                    <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </span>
                <span className="bento-feat-tag">{t?.hero?.f4Tag || "100% Offline"}</span>
              </div>
              <h4 className="bento-feat-title">{t?.hero?.f4Title || "Full Offline Therapy Mode"}</h4>
              <p className="bento-feat-desc">{t?.hero?.f4Desc || "All 6 cognitive exercise modules run seamlessly in remote rural areas"}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
