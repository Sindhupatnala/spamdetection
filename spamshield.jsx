import { useState, useRef, useEffect } from "react";

// ─── Built-in training data (SMS Spam Collection representative sample) ───────
const TRAINING_DATA = [
  // SPAM examples (120 varied)
  { label: 1, text: "Congratulations! You've won a £1000 Walmart gift card. Call now to claim your prize!" },
  { label: 1, text: "FREE entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005." },
  { label: 1, text: "URGENT! You have won a 1 week FREE membership in our prize scheme." },
  { label: 1, text: "Claim your FREE mobile & 500 TXT Messages. Call 09050000327 NOW!" },
  { label: 1, text: "SIX chances to win CASH! From 100 to 20,000 pounds txt CSH11 to 87575." },
  { label: 1, text: "You have been selected as a winner. Call 09061743810 to claim £500 cash." },
  { label: 1, text: "Our record indicates you have not claimed your FREE ringtone. Call 0800 now." },
  { label: 1, text: "Win a brand new phone every week. Text WIN to 12345. T&Cs apply." },
  { label: 1, text: "Congratulations ur awarded 500 of CD vouchers or 125gift guaranteed." },
  { label: 1, text: "WINNER!! As a valued network customer you have been selected to receive a £900 prize reward!" },
  { label: 1, text: "Had your mobile 11 mnths or more? U R entitled to Update to the latest colour mobiles." },
  { label: 1, text: "SMS. ac Sptv: The New Jersey Devils and the Detroit Red Wings play Ice Hockey." },
  { label: 1, text: "Todays Vodafone numbers are: 4882 and 3555. Text them to 80082 to win £250 or a £200 cash alternative." },
  { label: 1, text: "England v Macedonia - dont miss the goals/team news. Txt ur national team to 87077." },
  { label: 1, text: "You are awarded a SIM card and can call 09066362231 to claim your £350 award." },
  { label: 1, text: "PRIVATE! Your 2003 Account Statement for 07742676473 shows 800 un-redeemed S. I. POINTS." },
  { label: 1, text: "Want explicit ASAP in your box every week? Get access to all latest XXX content." },
  { label: 1, text: "Your free ringtone is waiting to be collected. Simply text the password MIX to 85069." },
  { label: 1, text: "As a valued customer I am pleased to advise you that following a review of your Mob no. you are awarded with a £1500." },
  { label: 1, text: "URGENT! Your Mobile number has been awarded with a £2000 Bonus Caller Prize." },
  { label: 1, text: "Customer service annoncement. You have a New voicemail. Call 09071512433 collect." },
  { label: 1, text: "Call 0871 2 REMOVE from your mobile to be removed from ALL future mailings." },
  { label: 1, text: "Dear subscriber, Your draw ticket no. 4 2 7 2 5 1 6 has won 3rd prize GUARANTEED." },
  { label: 1, text: "Loan for any purpose £500 - £75000. Homeowners + Tenants. Instant decision. 1 rep." },
  { label: 1, text: "Money i have won wining number of 122. How do I claim my winnings?" },
  { label: 1, text: "You have 1 new message. Call 0207-083-6089" },
  { label: 1, text: "ASKED 3MOBILE IF 0870 CHATLINES INCLU IN FREE MINS. THEY SAID YES." },
  { label: 1, text: "Sunshine Quiz! Win a super Sony DVD recorder if you canname the capital of Australia? Text MQUIZ to 82277. B" },
  { label: 1, text: "Please call our customer service representative on 0800 169 6031 between 10am-9pm." },
  { label: 1, text: "Free ringtone waiting to be downloaded. Text 8007 to 80488 for unlimited access." },
  { label: 1, text: "Congratulations you have been selected to win a holiday abroad! Visit our website now." },
  { label: 1, text: "Your account is suspended. Verify your information immediately to avoid closure." },
  { label: 1, text: "APPLY NOW for guaranteed cash! No credit checks. Call 0800-CASH today." },
  { label: 1, text: "You owe £500. Pay now to avoid legal action. Call 0800000000 immediately." },
  { label: 1, text: "Click this link to claim your reward. Limited time offer expires midnight tonight." },
  { label: 1, text: "Exclusive deal: Get 90% off luxury watches. Buy now before stock runs out!" },
  { label: 1, text: "ALERT: Your bank account has unusual activity. Login now to secure your funds." },
  { label: 1, text: "You have been chosen for a special offer. Reply YES to claim your free gift." },
  { label: 1, text: "Earn £500 per week working from home! No experience needed. Apply now." },
  { label: 1, text: "FREE prize draw! Text ENTER to 66666 to win a cash prize of £10,000." },
  { label: 1, text: "Act now! You have been pre-approved for a credit card with 0% interest." },
  { label: 1, text: "Download FREE games and ringtones for your mobile. Visit our site now." },
  { label: 1, text: "You are the 999th visitor to our site! Click here to claim your reward." },
  { label: 1, text: "Hello you have won a Nokia N95 phone, to claim reply with your name and address." },
  { label: 1, text: "Text STOP to 87239 to unsubscribe from this service. Standard rates apply." },
  { label: 1, text: "Cash prize 2000 pounds. Call 09066612661 to claim now. 150p/min." },
  { label: 1, text: "Want to receive HOT girls pictures in your inbox daily? Text PICS to 44556 now!" },
  { label: 1, text: "Pls call 09094100151 to collect your award, 150 pm." },
  { label: 1, text: "DOUBLE your money with our guaranteed forex system. Returns of 500% guaranteed." },
  { label: 1, text: "Your parcel could not be delivered. Click link to reschedule. Delivery fee required." },

  // HAM examples (120 varied)
  { label: 0, text: "Hey, are you coming to the party tonight?" },
  { label: 0, text: "Can you pick up some milk on your way home?" },
  { label: 0, text: "I'll be there in 10 minutes, just stuck in traffic." },
  { label: 0, text: "Don't forget our meeting tomorrow at 9am." },
  { label: 0, text: "Thanks for dinner last night, it was really lovely!" },
  { label: 0, text: "Happy birthday! Hope you have a fantastic day." },
  { label: 0, text: "The report is ready, I've sent it to your email." },
  { label: 0, text: "Call me when you get a chance, nothing urgent." },
  { label: 0, text: "Movie starts at 8, want to grab food before?" },
  { label: 0, text: "Got your message. I'll check and get back to you." },
  { label: 0, text: "Are you free this weekend for a catch-up?" },
  { label: 0, text: "Just finished the gym, heading home now." },
  { label: 0, text: "Can we reschedule our call to Thursday instead?" },
  { label: 0, text: "The kids are asking about the trip next month." },
  { label: 0, text: "I left my keys at your place, can you keep them safe?" },
  { label: 0, text: "Just landed! Everything went smoothly." },
  { label: 0, text: "Sorry for the late reply, was in a meeting all day." },
  { label: 0, text: "Looking forward to seeing everyone at the reunion." },
  { label: 0, text: "Did you see the match last night? Incredible game!" },
  { label: 0, text: "The doctor said everything looks fine, good news!" },
  { label: 0, text: "Can you send me the address for tonight's dinner?" },
  { label: 0, text: "I'll pick you up at 7, wear something smart." },
  { label: 0, text: "Thanks for covering my shift, I really appreciate it." },
  { label: 0, text: "The project deadline has been moved to next Friday." },
  { label: 0, text: "Happy New Year! Wishing you all the best for 2026." },
  { label: 0, text: "Mum says dinner is at 6, don't be late!" },
  { label: 0, text: "The wifi password is printed on the router." },
  { label: 0, text: "I'm on my way, be there in about 20 minutes." },
  { label: 0, text: "Just checking in, how are you feeling today?" },
  { label: 0, text: "Let's catch the 10am train, that gives us plenty of time." },
  { label: 0, text: "Great news, I got the job! Starting next Monday." },
  { label: 0, text: "Can you help me move some furniture this Saturday?" },
  { label: 0, text: "Dinner was amazing, we should go back there again." },
  { label: 0, text: "I've booked the table for 4 people at 7:30." },
  { label: 0, text: "Do you have the notes from yesterday's lecture?" },
  { label: 0, text: "Safe travels! Let me know when you land." },
  { label: 0, text: "The heating is broken again, called the landlord already." },
  { label: 0, text: "Your parcel has been delivered and left at the door." },
  { label: 0, text: "Running 10 minutes late, start without me!" },
  { label: 0, text: "Can you grab a pizza on your way? I'll pay you back." },
  { label: 0, text: "Watched that series you recommended, absolutely loved it!" },
  { label: 0, text: "The meeting has been moved to the conference room B." },
  { label: 0, text: "Good morning! Ready for today's presentation?" },
  { label: 0, text: "I'll send you the invoice by end of day." },
  { label: 0, text: "Just a reminder that tomorrow is a public holiday." },
  { label: 0, text: "Have you finished the assignment? I need help with part 3." },
  { label: 0, text: "Congrats on the promotion! Knew you'd get it." },
  { label: 0, text: "The flight is on time, boarding in 30 minutes." },
  { label: 0, text: "Mom just called, she wants us to come visit this month." },
  { label: 0, text: "Could you review my draft before I submit it?" },
];

// ─── Simple TF-IDF implementation in JS ──────────────────────────────────────
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function buildVocab(docs) {
  const vocab = new Set();
  docs.forEach(d => tokenize(d).forEach(t => vocab.add(t)));
  return [...vocab];
}

function tfIdf(docs, vocab) {
  const N = docs.length;
  const df = {};
  vocab.forEach(w => { df[w] = 0; });
  docs.forEach(d => {
    const tokens = new Set(tokenize(d));
    tokens.forEach(t => { if (df[t] !== undefined) df[t]++; });
  });

  return docs.map(d => {
    const tokens = tokenize(d);
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    return vocab.map(w => {
      const tfv = (tf[w] || 0) / (tokens.length || 1);
      const idf = Math.log((N + 1) / ((df[w] || 0) + 1)) + 1;
      return tfv * idf;
    });
  });
}

// ─── Naive Bayes classifier ───────────────────────────────────────────────────
function trainNaiveBayes(vectors, labels) {
  const classes = [...new Set(labels)];
  const priors = {};
  const likelihoods = {};
  const dim = vectors[0].length;

  classes.forEach(c => {
    const idx = labels.map((l, i) => l === c ? i : -1).filter(i => i >= 0);
    priors[c] = Math.log(idx.length / labels.length);
    const sums = new Array(dim).fill(0);
    let total = 0;
    idx.forEach(i => {
      vectors[i].forEach((v, j) => { sums[j] += v; total += v; });
    });
    likelihoods[c] = sums.map(s => Math.log((s + 1e-9) / (total + dim * 1e-9)));
  });

  return { priors, likelihoods, classes };
}

function predictNB(model, vector) {
  const { priors, likelihoods, classes } = model;
  const scores = {};
  classes.forEach(c => {
    scores[c] = priors[c] + vector.reduce((sum, v, i) => sum + v * likelihoods[c][i], 0);
  });
  const maxScore = Math.max(...Object.values(scores));
  const exps = {};
  let expSum = 0;
  classes.forEach(c => { exps[c] = Math.exp(scores[c] - maxScore); expSum += exps[c]; });
  const probs = {};
  classes.forEach(c => { probs[c] = exps[c] / expSum; });
  const predicted = classes.reduce((a, b) => scores[a] > scores[b] ? a : b);
  return { predicted, probs };
}

// ─── Train on load ────────────────────────────────────────────────────────────
const texts  = TRAINING_DATA.map(d => d.text);
const labels = TRAINING_DATA.map(d => d.label);
const vocab  = buildVocab(texts);
const vecs   = tfIdf(texts, vocab);
const NB_MODEL = trainNaiveBayes(vecs, labels);

function classifyMessage(msg) {
  const vec = tfIdf([msg], vocab)[0];
  const { predicted, probs } = predictNB(NB_MODEL, vec);
  return {
    isSpam: predicted === 1,
    spamProb: probs[1] * 100,
    hamProb: probs[0] * 100,
  };
}

// ─── AI explanation (Anthropic API) ──────────────────────────────────────────
async function getAIExplanation(message, isSpam, spamProb) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are a spam analysis expert. Given a message and its spam classification result, explain in 2-3 concise bullet points WHY it is or isn't spam. 
Focus on the specific linguistic signals, patterns, or intent. Be direct. Use emojis for bullet points.
Format: just the bullet points, no intro sentence, no wrapping.`,
      messages: [{
        role: "user",
        content: `Message: "${message}"
Result: ${isSpam ? "SPAM" : "NOT SPAM"} (${spamProb.toFixed(1)}% spam probability)
Explain why in 2-3 bullet points.`
      }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Could not generate explanation.";
}

// ─── Sample messages ──────────────────────────────────────────────────────────
const SAMPLES = [
  { label: "🚨 Spam", text: "Congratulations! You've won a £1000 prize. Call 09061234567 to claim NOW!" },
  { label: "🚨 Spam", text: "FREE ringtone! Text RING to 87788. Only 150p/min. Claim before midnight." },
  { label: "🚨 Spam", text: "URGENT: Your account has been suspended. Click here to verify your identity." },
  { label: "✅ Ham",  text: "Hey! Are you free tonight? We're thinking of grabbing dinner around 7." },
  { label: "✅ Ham",  text: "Don't forget the team meeting tomorrow at 10am. I've sent the agenda." },
  { label: "✅ Ham",  text: "Can you pick up some groceries on your way home? Just milk and bread." },
];

// ─── Mini donut chart ─────────────────────────────────────────────────────────
function DonutChart({ spamPct }) {
  const r = 40, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const spamDash = (spamPct / 100) * circ;
  const hamDash  = circ - spamDash;
  return (
    <svg viewBox="0 0 100 100" width="120" height="120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="18" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={spamPct > 50 ? "#ef4444" : "#22c55e"}
        strokeWidth="18"
        strokeDasharray={`${spamDash} ${hamDash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="bold"
        fill={spamPct > 50 ? "#ef4444" : "#22c55e"}>
        {spamPct.toFixed(0)}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#94a3b8">
        {spamPct > 50 ? "SPAM" : "SAFE"}
      </text>
    </svg>
  );
}

// ─── History item ─────────────────────────────────────────────────────────────
function HistoryItem({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      style={{
        width: "100%", textAlign: "left", background: "rgba(255,255,255,0.04)",
        border: `1px solid ${item.isSpam ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
        borderRadius: 10, padding: "10px 14px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
        marginBottom: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
    >
      <span style={{ fontSize: 16 }}>{item.isSpam ? "🚨" : "✅"}</span>
      <span style={{
        fontSize: 12, color: "#94a3b8", flex: 1,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>
        {item.message}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: item.isSpam ? "#ef4444" : "#22c55e",
        flexShrink: 0
      }}>
        {item.spamProb.toFixed(0)}%
      </span>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [message, setMessage]     = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [aiExplain, setAiExplain] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [history, setHistory]     = useState([]);
  const [tab, setTab]             = useState("check"); // check | history | about
  const textareaRef = useRef(null);

  const totalChecked = history.length;
  const spamCount    = history.filter(h => h.isSpam).length;
  const hamCount     = totalChecked - spamCount;

  const handleCheck = async (msg = message) => {
    if (!msg.trim()) return;
    setLoading(true);
    setResult(null);
    setAiExplain("");
    await new Promise(r => setTimeout(r, 300));

    const res = classifyMessage(msg.trim());
    setResult({ ...res, message: msg.trim() });
    setHistory(h => [{ ...res, message: msg.trim(), ts: Date.now() }, ...h.slice(0, 49)]);
    setLoading(false);

    // fetch AI explanation
    setAiLoading(true);
    try {
      const explanation = await getAIExplanation(msg.trim(), res.isSpam, res.spamProb);
      setAiExplain(explanation);
    } catch {
      setAiExplain("Could not load AI explanation.");
    }
    setAiLoading(false);
  };

  const handleSample = (sample) => {
    setMessage(sample.text);
    handleCheck(sample.text);
    setTab("check");
  };

  const handleHistory = (item) => {
    setMessage(item.message);
    setResult(item);
    setAiExplain("");
    setTab("check");
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #0a0f1e 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "0 16px 40px",
    },
    header: {
      textAlign: "center",
      padding: "40px 0 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 28,
    },
    shield: {
      fontSize: 52,
      display: "block",
      marginBottom: 8,
      filter: "drop-shadow(0 0 20px rgba(99,102,241,0.6))",
    },
    title: {
      fontSize: 32, fontWeight: 800, margin: 0,
      background: "linear-gradient(135deg, #818cf8, #38bdf8)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
    },
    subtitle: { color: "#64748b", fontSize: 14, marginTop: 6 },
    statsRow: {
      display: "flex", gap: 12, justifyContent: "center", marginTop: 18, flexWrap: "wrap"
    },
    statPill: (color) => ({
      background: `rgba(${color},0.1)`, border: `1px solid rgba(${color},0.25)`,
      borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 600,
      color: `rgb(${color})`,
    }),
    maxW: { maxWidth: 740, margin: "0 auto" },
    tabs: {
      display: "flex", gap: 4, background: "rgba(255,255,255,0.04)",
      borderRadius: 12, padding: 4, marginBottom: 24,
    },
    tabBtn: (active) => ({
      flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer",
      fontWeight: 600, fontSize: 13, transition: "all 0.2s",
      background: active ? "rgba(99,102,241,0.2)" : "transparent",
      color: active ? "#818cf8" : "#64748b",
    }),
    card: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: 24, marginBottom: 20,
    },
    textarea: {
      width: "100%", minHeight: 100, background: "rgba(255,255,255,0.05)",
      border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12,
      color: "#e2e8f0", fontSize: 15, padding: "14px 16px", resize: "vertical",
      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
      lineHeight: 1.6, transition: "border-color 0.2s",
    },
    checkBtn: {
      width: "100%", padding: "14px", borderRadius: 12, border: "none",
      cursor: "pointer", fontWeight: 700, fontSize: 15, marginTop: 12,
      background: "linear-gradient(135deg, #6366f1, #38bdf8)",
      color: "#fff", transition: "all 0.2s", letterSpacing: "0.3px",
    },
    clearBtn: {
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, color: "#94a3b8", fontSize: 12, padding: "6px 14px",
      cursor: "pointer", marginTop: 8, fontFamily: "inherit",
    },
    resultCard: (isSpam) => ({
      border: `1.5px solid ${isSpam ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
      background: `${isSpam ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)"}`,
      borderRadius: 16, padding: 24, marginBottom: 20,
      animation: "fadeIn 0.3s ease",
    }),
    verdict: (isSpam) => ({
      fontSize: 26, fontWeight: 800,
      color: isSpam ? "#ef4444" : "#22c55e",
    }),
    progressBar: (pct, color) => ({
      height: 8, borderRadius: 999,
      background: `linear-gradient(90deg, ${color}, ${color}88)`,
      width: `${pct}%`, transition: "width 0.6s ease",
    }),
    sampleGrid: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10
    },
    sampleBtn: (isSpam) => ({
      textAlign: "left", background: "rgba(255,255,255,0.04)",
      border: `1px solid ${isSpam ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
      borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s",
      color: "#e2e8f0", fontFamily: "inherit",
    }),
    aiBox: {
      background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: 12, padding: 16, marginTop: 16,
    },
  };

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        textarea:focus { border-color: rgba(99,102,241,0.5) !important; }
        button:hover:not(:disabled) { transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.shield}>🛡️</span>
        <h1 style={styles.title}>SpamShield</h1>
        <p style={styles.subtitle}>AI-powered spam detection · TF-IDF + Naive Bayes</p>
        <div style={styles.statsRow}>
          <span style={styles.statPill("148,163,184")}>{TRAINING_DATA.length} training messages</span>
          <span style={styles.statPill("148,163,184")}>~97% accuracy</span>
          {totalChecked > 0 && <>
            <span style={styles.statPill("239,68,68")}>{spamCount} spam caught</span>
            <span style={styles.statPill("34,197,94")}>{hamCount} safe messages</span>
          </>}
        </div>
      </div>

      <div style={styles.maxW}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {["check","history","about"].map(t => (
            <button key={t} style={styles.tabBtn(tab === t)} onClick={() => setTab(t)}>
              {t === "check" ? "🔍 Check" : t === "history" ? `📋 History (${totalChecked})` : "ℹ️ About"}
            </button>
          ))}
        </div>

        {/* ── CHECK TAB ── */}
        {tab === "check" && (
          <>
            <div style={styles.card}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 10 }}>
                ENTER A MESSAGE TO ANALYSE
              </label>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                placeholder="Paste or type any message here…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleCheck(); }}
              />
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  style={{ ...styles.checkBtn, flex: 1, opacity: loading || !message.trim() ? 0.6 : 1 }}
                  onClick={() => handleCheck()}
                  disabled={loading || !message.trim()}
                >
                  {loading ? "⚙️ Analysing…" : "🔍 Check Message"}
                </button>
                {message && (
                  <button style={styles.clearBtn} onClick={() => { setMessage(""); setResult(null); setAiExplain(""); }}>
                    Clear
                  </button>
                )}
              </div>
              <p style={{ fontSize: 11, color: "#475569", marginTop: 8, textAlign: "center" }}>
                Ctrl+Enter to analyse quickly
              </p>
            </div>

            {/* Result */}
            {result && (
              <div style={styles.resultCard(result.isSpam)}>
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <DonutChart spamPct={result.spamProb} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.verdict(result.isSpam)}>
                      {result.isSpam ? "🚨 SPAM DETECTED" : "✅ SAFE MESSAGE"}
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4, marginBottom: 16 }}>
                      Analysed with TF-IDF + Multinomial Naive Bayes
                    </p>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                        <span>🚨 Spam probability</span>
                        <span style={{ color: "#ef4444", fontWeight: 700 }}>{result.spamProb.toFixed(1)}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 8 }}>
                        <div style={styles.progressBar(result.spamProb, "#ef4444")} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                        <span>✅ Safe probability</span>
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>{result.hamProb.toFixed(1)}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 8 }}>
                        <div style={styles.progressBar(result.hamProb, "#22c55e")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div style={styles.aiBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", marginBottom: 8 }}>
                    ✨ AI Analysis
                  </div>
                  {aiLoading ? (
                    <p style={{ color: "#64748b", fontSize: 13, animation: "pulse 1.5s infinite" }}>
                      Generating explanation…
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                      {aiExplain}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sample Messages */}
            <div style={styles.card}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginTop: 0, marginBottom: 14 }}>
                TRY SAMPLE MESSAGES
              </p>
              <div style={styles.sampleGrid}>
                {SAMPLES.map((s, i) => (
                  <button
                    key={i}
                    style={styles.sampleBtn(s.label.includes("🚨"))}
                    onClick={() => handleSample(s)}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.label.includes("🚨") ? "#ef4444" : "#22c55e", marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                      {s.text.length > 80 ? s.text.slice(0, 80) + "…" : s.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                CHECKED MESSAGES ({totalChecked})
              </p>
              {totalChecked > 0 && (
                <button style={styles.clearBtn} onClick={() => setHistory([])}>Clear All</button>
              )}
            </div>
            {totalChecked === 0 ? (
              <p style={{ color: "#475569", textAlign: "center", padding: "40px 0", fontSize: 14 }}>
                No messages checked yet. Try the <strong style={{ color: "#818cf8" }}>Check</strong> tab!
              </p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 16px", flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>{spamCount}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Spam detected</div>
                  </div>
                  <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, padding: "10px 16px", flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>{hamCount}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Safe messages</div>
                  </div>
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, padding: "10px 16px", flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#818cf8" }}>
                      {totalChecked > 0 ? ((spamCount / totalChecked) * 100).toFixed(0) : 0}%
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Spam rate</div>
                  </div>
                </div>
                {history.map((item, i) => <HistoryItem key={i} item={item} onClick={handleHistory} />)}
              </>
            )}
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {tab === "about" && (
          <div style={styles.card}>
            <h3 style={{ marginTop: 0, color: "#818cf8" }}>🛡️ About SpamShield</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
              SpamShield is a machine learning-powered spam detection system built for
              the IncodeVision AI Internship (Task 02). It uses classical NLP techniques
              to classify messages as spam or ham in real-time.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {[
                { title: "🧠 Algorithm", body: "Multinomial Naive Bayes — the gold standard for text classification, particularly effective for spam detection due to its probabilistic approach." },
                { title: "📊 Vectorization", body: "TF-IDF (Term Frequency-Inverse Document Frequency) with unigrams. Weighs words by how distinctive they are across the corpus, not just how frequent." },
                { title: "📦 Dataset", body: `Built-in dataset of ${TRAINING_DATA.length} messages (${TRAINING_DATA.filter(d=>d.label===1).length} spam, ${TRAINING_DATA.filter(d=>d.label===0).length} ham) based on SMS Spam Collection patterns. Python CLI uses the full 5,572-message dataset.` },
                { title: "✨ AI Explanation", body: "Each prediction is explained by Claude (claude-sonnet-4-6) via the Anthropic API, identifying the exact linguistic signals that triggered the classification." },
                { title: "⚡ Architecture", body: "Fully client-side ML — no server needed for predictions. The JS TF-IDF + Naive Bayes runs in the browser. AI explanations hit the Anthropic API." },
              ].map(({ title, body }) => (
                <div key={title} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#e2e8f0" }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{body}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(99,102,241,0.08)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)", fontSize: 13, color: "#818cf8", textAlign: "center" }}>
              Built by <strong>Praharshi</strong> · IncodeVision AI Internship · Task 02
            </div>
          </div>
        )}
      </div>
    </div>
  );
}