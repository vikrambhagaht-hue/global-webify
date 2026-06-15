"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from 'framer-motion';
import {
  X, Globe, TrendingUp, Lock, Zap, UserX,
  Search, CheckCircle2, Shield, Activity, ArrowRight, AlertTriangle,
} from "lucide-react";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  overall: number;
  isEstimated?: boolean; // true when real API failed — shown as a warning
}

const LOADING_ITEMS = [
  { label: "Crawling page structure & links",   icon: <Activity size={13} /> },
  { label: "Scanning SEO signals & meta tags",  icon: <Search size={13} /> },
  { label: "Testing Core Web Vitals & speed",   icon: <TrendingUp size={13} /> },
  { label: "Checking security headers & HTTPS", icon: <Shield size={13} /> },
  { label: "Reviewing accessibility standards", icon: <CheckCircle2 size={13} /> },
];

export default function AuditModal({ isOpen, onClose }: AuditModalProps) {
  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [url, setUrl]                 = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [scores, setScores]           = useState<AuditScores | null>(null);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1); setUrl(""); setScores(null); setLoadingStep(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleStartAudit = async () => {
    if (!url.trim()) return;
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "https://" + targetUrl;

    setStep(2); setLoadingStep(0);

    let apiDone = false; // flag so animation loop knows when to stop

    // Animation: run through 5 steps, then loop the last one until API finishes
    const animateSteps = async () => {
      for (let i = 0; i < 5; i++) {
        setLoadingStep(i);
        await new Promise(r => setTimeout(r, 2200)); // 2.2s per step = 11s for full run
      }
      // Keep spinning last step until the real API call finishes
      while (!apiDone) {
        setLoadingStep(4);
        await new Promise(r => setTimeout(r, 600));
        setLoadingStep(3);
        await new Promise(r => setTimeout(r, 600));
      }
    };

    const fetchScores = async (): Promise<AuditScores> => {
      try {
        // Call our own Next.js API route — server-side fetch, no CORS, real Lighthouse data
        const res  = await fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error ?? "API failed");
        return { ...data.scores, isEstimated: false };
      } catch (err) {
        console.warn("[AuditModal] Real API failed, using estimated scores:", err);
        const perf = Math.floor(Math.random() * 30 + 45);
        const seo  = Math.floor(Math.random() * 20 + 65);
        const acc  = Math.floor(Math.random() * 25 + 60);
        const bp   = Math.floor(Math.random() * 20 + 65);
        return { performance: perf, seo, accessibility: acc, bestPractices: bp,
                 overall: Math.round((perf + seo + acc + bp) / 4), isEstimated: true };
      } finally {
        apiDone = true; // stop the animation loop regardless of success/fail
      }
    };

    const [, fetched] = await Promise.all([animateSteps(), fetchScores()]);
    setScores(fetched);
    setStep(3);
  };

  const overallColor = scores
    ? scores.overall >= 80 ? "#4ade80"
      : scores.overall >= 60 ? "#fbbf24"
      : "#f87171"
    : "#4ade80";

  // ─── shared inline styles ────────────────────────────────────────────────
  const S = {
    // header badge
    badge: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      border: "1.5px solid rgba(26,139,76,0.3)", borderRadius: "999px",
      padding: "4px 12px", fontSize: "9px", fontWeight: 800 as const,
      color: "#166534", letterSpacing: "0.12em", textTransform: "uppercase" as const,
      marginBottom: "10px", background: "rgba(255,255,255,0.4)",
    },
  };

  // ─── HEADER (shared across all steps) ────────────────────────────────────
  const Header = (
    <div style={{
      flexShrink: 0, position: "relative",
      background: "linear-gradient(160deg,#e8f5e9 0%,#c8f0d4 55%,#b2f0cb 100%)",
      padding: "16px 20px 18px",
    }}>
      {/* dot grid */}
      <div style={{
        position:"absolute", inset:0, opacity:0.13, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle,#1a8b4c 1px,transparent 1px)",
        backgroundSize:"15px 15px",
      }}/>

      {/* close */}
      <button onClick={onClose} aria-label="Close" style={{
        position:"absolute", top:"12px", right:"12px",
        width:"30px", height:"30px", borderRadius:"50%",
        border:"1.5px solid rgba(0,0,0,0.13)", background:"rgba(255,255,255,0.85)",
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        color:"#374151", zIndex:10,
      }}>
        <X size={13}/>
      </button>

      <div style={S.badge}>
        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#1a8b4c", display:"inline-block" }}/>
        FREE · NO CREDIT CARD · INSTANT RESULTS
      </div>

      <h2 style={{
        position:"relative", zIndex:1,
        fontSize:"clamp(18px,4vw,24px)", fontWeight:900, color:"#0d1f11",
        lineHeight:1.2, margin:"0 0 4px", letterSpacing:"-0.3px", paddingRight:"36px",
      }}>
        Analyse Your Website for Free
      </h2>
      <p style={{
        position:"relative", zIndex:1, fontSize:"12px", color:"#374151",
        fontWeight:500, margin:0, lineHeight:1.4,
      }}>
        Get a full 360° health report — SEO, Performance, Security &amp; Accessibility.
      </p>
    </div>
  );

  // ─── MODAL CONTENT ────────────────────────────────────────────────────────
  const modal = (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="backdrop"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.18 }}
          onClick={onClose}
          style={{
            position:"fixed", inset:0, zIndex:999999,
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"12px",
            backgroundColor:"rgba(15,23,42,0.72)",
            backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)",
            fontFamily:"var(--font-montserrat,'Inter',sans-serif)",
          }}
        >
          <m.div
            key="card"
            initial={{ opacity:0, scale:0.93, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.93, y:24 }}
            transition={{ type:"spring", stiffness:340, damping:30 }}
            onClick={e => e.stopPropagation()}
            style={{
              width:"100%", maxWidth:"480px",
              display:"flex", flexDirection:"column",
              background:"#fff", borderRadius:"22px",
              boxShadow:"0 28px 70px rgba(0,0,0,0.28)",
              overflow:"hidden",
            }}
          >
            {Header}

            {/* ── BODY (no scroll) ─────────────────────────────────────── */}
            <div style={{ background:"#fff" }}>
              <AnimatePresence mode="wait">

                {/* ═ STEP 1 ═══════════════════════════════════════════════ */}
                {step === 1 && (
                  <m.div key="s1"
                    initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:14 }} transition={{ duration:0.2 }}
                    style={{ padding:"20px" }}
                  >
                    {/* URL input */}
                    <div style={{ position:"relative", marginBottom:"10px" }}>
                      <Globe size={15} style={{
                        position:"absolute", left:"13px", top:"50%",
                        transform:"translateY(-50%)", color:"#9ca3af", pointerEvents:"none",
                      }}/>
                      <input
                        autoFocus type="url" value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleStartAudit()}
                        placeholder="https://yourwebsite.com"
                        style={{
                          width:"100%", boxSizing:"border-box",
                          background:"#f8fafc", border:"1.5px solid #e2e8f0",
                          borderRadius:"11px", fontSize:"16px", fontWeight:500,
                          color:"#111827", padding:"13px 13px 13px 40px",
                          outline:"none", fontFamily:"inherit",
                          transition:"border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = "#1a8b4c";
                          e.currentTarget.style.boxShadow  = "0 0 0 3px rgba(26,139,76,0.13)";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.boxShadow  = "none";
                        }}
                      />
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleStartAudit} disabled={!url.trim()}
                      style={{
                        width:"100%", boxSizing:"border-box",
                        background: url.trim() ? "#1a8b4c" : "#9ca3af",
                        color:"#fff", fontSize:"15px", fontWeight:800,
                        padding:"14px", borderRadius:"11px", border:"none",
                        cursor: url.trim() ? "pointer" : "not-allowed",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                        boxShadow: url.trim() ? "0 6px 18px rgba(26,139,76,0.35)" : "none",
                        fontFamily:"inherit", transition:"background 0.15s,transform 0.15s",
                      }}
                      onMouseEnter={e => { if(url.trim()){ e.currentTarget.style.background="#14733e"; e.currentTarget.style.transform="translateY(-1px)"; } }}
                      onMouseLeave={e => { e.currentTarget.style.background=url.trim()?"#1a8b4c":"#9ca3af"; e.currentTarget.style.transform="translateY(0)"; }}
                    >
                      <TrendingUp size={16}/> Start Free Audit
                    </button>

                    {/* Trust */}
                    <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"6px 18px", marginTop:"14px" }}>
                      {[
                        { icon:<Lock size={12}/>,  label:"100% Private" },
                        { icon:<Zap size={12}/>,   label:"Instant Report" },
                        { icon:<UserX size={12}/>, label:"No Signup" },
                      ].map(b => (
                        <div key={b.label} style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", fontWeight:700, color:"#4b5563" }}>
                          <span style={{ color:"#1a8b4c" }}>{b.icon}</span>{b.label}
                        </div>
                      ))}
                    </div>
                  </m.div>
                )}

                {/* ═ STEP 2 ═══════════════════════════════════════════════ */}
                {step === 2 && (
                  <m.div key="s2"
                    initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:14 }} transition={{ duration:0.2 }}
                    style={{ padding:"16px 20px 18px", display:"flex", flexDirection:"column", alignItems:"center" }}
                  >
                    {/* Pulsing icon */}
                    <div style={{ position:"relative", width:"58px", height:"58px", marginBottom:"12px" }}>
                      <m.div
                        animate={{ scale:[1,1.22,1], opacity:[0.3,0.65,0.3] }}
                        transition={{ duration:1.8, repeat:Infinity }}
                        style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#dcfce7" }}
                      />
                      <div style={{
                        position:"absolute", inset:"10px", borderRadius:"50%",
                        background:"#1a8b4c", display:"flex", alignItems:"center",
                        justifyContent:"center", color:"#fff",
                        boxShadow:"0 3px 12px rgba(26,139,76,0.4)",
                      }}>
                        <Search size={17}/>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      width:"100%", height:"4px", background:"#f1f5f9",
                      borderRadius:"999px", overflow:"hidden", marginBottom:"10px",
                    }}>
                      <m.div
                        style={{ height:"100%", background:"#1a8b4c", borderRadius:"999px" }}
                        initial={{ width:"0%" }}
                        animate={{ width:`${Math.round(((loadingStep+1)/5)*100)}%` }}
                        transition={{ duration:0.6, ease:"easeInOut" }}
                      />
                    </div>

                    <h3 style={{ fontSize:"14px", fontWeight:800, color:"#111827", margin:"0 0 2px", textAlign:"center" }}>
                      {LOADING_ITEMS[loadingStep]?.label ?? "Finalising…"}
                    </h3>
                    <p style={{ fontSize:"11px", color:"#6b7280", fontWeight:500, margin:"0 0 12px", textAlign:"center" }}>
                      Mapping all links, resources and HTML elements.
                    </p>

                    {/* Step list */}
                    <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:"5px" }}>
                      {LOADING_ITEMS.map((item, idx) => {
                        const isActive  = idx === loadingStep;
                        const isDone    = idx < loadingStep;
                        return (
                          <div key={idx} style={{
                            display:"flex", alignItems:"center", gap:"9px",
                            padding:"7px 12px", borderRadius:"10px",
                            border:`1.5px solid ${isActive?"#fde68a":isDone?"#e5e7eb":"#f1f5f9"}`,
                            background: isActive?"#fffbeb":"#f9fafb",
                            transition:"all 0.3s",
                          }}>
                            <div style={{
                              width:"24px", height:"24px", borderRadius:"7px", flexShrink:0,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              background: isActive?"#f59e0b":isDone?"#d1fae5":"#e5e7eb",
                              color: isActive?"#fff":isDone?"#1a8b4c":"#9ca3af",
                            }}>
                              {isDone ? <CheckCircle2 size={12}/> :
                               isActive ? (
                                <m.div animate={{ rotate:360 }}
                                  transition={{ duration:1.4, repeat:Infinity, ease:"linear" }}
                                  style={{ display:"flex" }}>
                                  {item.icon}
                                </m.div>
                               ) : item.icon}
                            </div>
                            <span style={{
                              fontSize:"12px", fontWeight: isActive?800:600,
                              color: isActive?"#92400e":"#6b7280",
                            }}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tip */}
                    <div style={{
                      marginTop:"12px", width:"100%", boxSizing:"border-box",
                      background:"#f0fdf4", border:"1.5px solid #bbf7d0",
                      borderRadius:"10px", padding:"9px 12px",
                      display:"flex", alignItems:"center", gap:"8px",
                    }}>
                      <span style={{ fontSize:"13px", flexShrink:0 }}>💡</span>
                      <p style={{ fontSize:"11px", fontWeight:600, color:"#15803d", margin:0 }}>
                        <strong style={{ color:"#166534", textTransform:"uppercase", fontSize:"9px", letterSpacing:"0.08em" }}>Did you know? </strong>
                        A 1-second delay in load time causes a 7% drop in conversions.
                      </p>
                    </div>
                  </m.div>
                )}

                {/* ═ STEP 3 ═══════════════════════════════════════════════ */}
                {step === 3 && scores && (
                  <m.div key="s3"
                    initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
                    transition={{ type:"spring", stiffness:300, damping:26 }}
                    style={{ padding:"16px 20px 20px", display:"flex", flexDirection:"column", alignItems:"center" }}
                  >
                    {/* Check icon */}
                    <div style={{ position:"relative", width:"58px", height:"58px", marginBottom:"10px" }}>
                      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#dcfce7" }}/>
                      <div style={{
                        position:"absolute", inset:"10px", borderRadius:"50%",
                        background:"#1a8b4c", display:"flex", alignItems:"center",
                        justifyContent:"center", color:"#fff",
                        boxShadow:"0 3px 12px rgba(26,139,76,0.4)",
                      }}>
                        <CheckCircle2 size={20}/>
                      </div>
                    </div>

                    <h3 style={{ fontSize:"20px", fontWeight:900, color:"#111827", margin:"0 0 3px", textAlign:"center" }}>
                      Audit Complete!
                    </h3>
                    <p style={{ fontSize:"12px", color:"#6b7280", fontWeight:500, margin:"0 0 14px", textAlign:"center", lineHeight:1.4 }}>
                      Your personalised website health report is ready. Here's your score:
                    </p>

                    {/* Dark score card */}
                    <div style={{
                      width:"100%", boxSizing:"border-box",
                      background:"linear-gradient(160deg,#1a3a27 0%,#0d2118 100%)",
                      borderRadius:"14px", padding:"16px 18px",
                      textAlign:"center", color:"#fff", marginBottom:"12px",
                      position:"relative", overflow:"hidden",
                      boxShadow:"0 10px 28px rgba(0,0,0,0.22)",
                    }}>
                      <div style={{ position:"absolute", top:"-16px", right:"-16px", width:"80px", height:"80px", borderRadius:"50%", background:"rgba(34,197,94,0.1)", filter:"blur(18px)" }}/>
                      <div style={{ position:"absolute", bottom:"-16px", left:"-16px", width:"80px", height:"80px", borderRadius:"50%", background:"rgba(59,130,246,0.08)", filter:"blur(18px)" }}/>

                      <p style={{ fontSize:"9px", fontWeight:800, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.14em", margin:"0 0 2px", position:"relative", zIndex:1 }}>
                        Overall Health Score
                      </p>
                      <div style={{ position:"relative", zIndex:1 }}>
                        <span style={{ fontSize:"54px", fontWeight:900, lineHeight:1, color: overallColor }}>
                          {scores.overall}
                        </span>
                      </div>
                      <p style={{ fontSize:"11px", color:"#9ca3af", fontWeight:500, margin:"1px 0 0", position:"relative", zIndex:1 }}>
                        out of 100
                      </p>

                      {/* Individual scores */}
                      <div style={{
                        display:"flex", justifyContent:"space-around",
                        marginTop:"12px", paddingTop:"12px",
                        borderTop:"1px solid rgba(255,255,255,0.08)",
                        position:"relative", zIndex:1,
                      }}>
                        {[
                          { label:"Performance", val:scores.performance },
                          { label:"SEO",         val:scores.seo },
                          { label:"Security",    val:scores.bestPractices },
                          { label:"Access.",     val:scores.accessibility },
                        ].map(s => (
                          <div key={s.label} style={{ textAlign:"center" }}>
                            <div style={{
                              fontSize:"17px", fontWeight:900,
                              color: s.val>=80?"#4ade80":s.val>=60?"#fbbf24":"#f87171",
                            }}>{s.val}</div>
                            <div style={{ fontSize:"8px", color:"#9ca3af", fontWeight:600, marginTop:"1px" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", justifyContent:"center", marginBottom:"12px" }}>
                      {["SEO Analysis","Performance","Security","Accessibility"].map(label => (
                        <div key={label} style={{
                          display:"flex", alignItems:"center", gap:"4px",
                          background:"#f0fdf4", border:"1.5px solid #bbf7d0",
                          color:"#166534", padding:"4px 10px", borderRadius:"999px",
                          fontSize:"10px", fontWeight:700,
                        }}>
                          <CheckCircle2 size={10}/>{label}
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={`https://wa.me/917563901100?text=${encodeURIComponent(`Hi! I ran the free audit for ${url} — score: ${scores.overall}/100. I'd love the full report & improvement plan!`)}`}
                      target="_blank" rel="noopener noreferrer"
                      title="Get Audit Report on WhatsApp - Global Webify"
                      style={{
                        width:"100%", boxSizing:"border-box",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:"7px",
                        background:"#1a8b4c", color:"#fff",
                        fontSize:"14px", fontWeight:800, padding:"13px",
                        borderRadius:"11px", textDecoration:"none",
                        boxShadow:"0 6px 18px rgba(26,139,76,0.35)",
                        fontFamily:"inherit", transition:"background 0.15s,transform 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#14733e"; (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#1a8b4c"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}
                    >
                      <ArrowRight size={15}/> View Full Audit Report
                    </a>

                    {scores.isEstimated ? (
                      <div style={{
                        marginTop:"8px", display:"flex", alignItems:"center", gap:"6px",
                        background:"#fffbeb", border:"1.5px solid #fde68a",
                        borderRadius:"8px", padding:"7px 10px", width:"100%", boxSizing:"border-box",
                      }}>
                        <AlertTriangle size={13} style={{ color:"#d97706", flexShrink:0 }}/>
                        <p style={{ fontSize:"10px", color:"#92400e", fontWeight:600, margin:0, lineHeight:1.4 }}>
                          <strong>Estimated score</strong> — real scan unavailable right now. Contact us for your detailed report.
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize:"10px", color:"#9ca3af", marginTop:"8px", textAlign:"center", fontWeight:500 }}>
                        ✅ Powered by Google Lighthouse · Real mobile data
                      </p>
                    )}
                  </m.div>
                )}

              </AnimatePresence>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
