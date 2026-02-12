import { useState, useEffect } from "react";
import "./App.css";

// ─── 타입 ─────────────────────────────────────────────────

type CharStats = { power: number; intelligence: number; speed: number; durability: number };
type Character = {
  name: string;
  title: string;
  faction: string;
  power: string;
  threat?: string;
  rank?: string;
  description: string;
  stats: CharStats;
};

// ─── 데이터 ───────────────────────────────────────────────

const newsData = [
  { id: 1, type: "BREAKING", title: "VOID 조직, 중앙은행 습격 시도",                 time: "2시간 전",  threat: "HIGH"     },
  { id: 2, type: "ALERT",    title: "ZENITH vs HAVOC 시내 중심가에서 격돌",           time: "5시간 전",  threat: "CRITICAL" },
  { id: 3, type: "UPDATE",   title: "Hero Association, 새로운 S-Class 히어로 영입",   time: "8시간 전",  threat: "LOW"      },
  { id: 4, type: "WARNING",  title: "NIGHTFALL, 정부 시설 침투 흔적 발견",            time: "12시간 전", threat: "MEDIUM"   },
  { id: 5, type: "INTEL",    title: "ECLIPSE 조직원 3명 검거, 심문 진행 중",          time: "1일 전",    threat: "LOW"      },
];

const timeline = [
  { year: "2015", event: "첫 이능력자 출현",       desc: "평범한 시민이 염력을 각성하며 새로운 시대가 시작되다." },
  { year: "2018", event: "Hero Association 설립",  desc: "이능력 범죄에 대응하기 위한 공식 히어로 조직 창설."   },
  { year: "2021", event: "ECLIPSE 등장",           desc: "정체불명의 빌런 조직이 처음으로 모습을 드러내다."     },
  { year: "2024", event: "대격돌의 해",            desc: "AEGIS vs VOID의 전설적인 대결, 도시 절반이 파괴되다." },
  { year: "2026", event: "현재",                  desc: "팽팽한 긴장 속 불안한 평화. 다음 충돌을 앞두고…"      },
];

const characters = {
  void:      { name: "VOID",      title: "Supreme Leader",    faction: "ECLIPSE", power: "Reality Manipulation",  threat: "SSS",   description: "현실을 왜곡하는 능력을 가진 ECLIPSE의 절대 권력자. 그의 진짜 정체는 아무도 모른다.",    stats: { power: 98, intelligence: 95, speed: 85, durability: 90 } },
  nightfall: { name: "NIGHTFALL", title: "Shadow Assassin",   faction: "ECLIPSE", power: "Shadow Control",         threat: "SS",    description: "그림자를 자유자재로 조종하는 암살 전문가. 완벽주의자이며 실패를 용납하지 않는다.",    stats: { power: 85, intelligence: 88, speed: 95, durability: 75 } },
  havoc:     { name: "HAVOC",     title: "Destroyer",         faction: "ECLIPSE", power: "Destructive Energy",     threat: "SS",    description: "파괴적인 에너지를 다루는 전투광. 싸움 그 자체를 즐기는 광기어린 성격.",              stats: { power: 95, intelligence: 65, speed: 80, durability: 92 } },
  mirage:    { name: "MIRAGE",    title: "Mind Witch",        faction: "ECLIPSE", power: "Illusion & Mind Control", threat: "S",    description: "정신을 조작하고 환영을 만들어내는 능력자. 계산적이고 냉혹한 전략가.",                stats: { power: 82, intelligence: 93, speed: 78, durability: 70 } },
  wraith:    { name: "WRAITH",    title: "Ghost Agent",       faction: "ECLIPSE", power: "Intangibility",           threat: "A",    description: "물리적 형태를 무형화할 수 있는 능력. 침투와 정보 수집의 달인.",                     stats: { power: 75, intelligence: 85, speed: 90, durability: 68 } },
  aegis:     { name: "AEGIS",     title: "Invincible Shield", faction: "HEROES",  power: "Invulnerability",         rank: "S-Class", description: "어떤 공격도 막아내는 절대 방어의 히어로. 정의와 평화를 수호하는 상징.",            stats: { power: 88, intelligence: 82, speed: 75, durability: 99 } },
  zenith:    { name: "ZENITH",    title: "The Peak",          faction: "HEROES",  power: "Energy Projection",       rank: "S-Class", description: "압도적인 에너지 공격을 구사하는 최강 히어로. 오만하지만 실력은 확실하다.",          stats: { power: 96, intelligence: 80, speed: 88, durability: 85 } },
  quantum:   { name: "QUANTUM",   title: "Time Master",       faction: "HEROES",  power: "Time Manipulation",       rank: "S-Class", description: "시간을 조작하는 천재 과학자 출신 히어로. 냉철한 판단력의 소유자.",                  stats: { power: 90, intelligence: 98, speed: 92, durability: 78 } },
  blaze:     { name: "BLAZE",     title: "Inferno",           faction: "HEROES",  power: "Fire Control",            rank: "A-Class", description: "불을 자유자재로 다루는 젊은 히어로. 열정적이지만 경험이 부족하다.",                stats: { power: 83, intelligence: 72, speed: 85, durability: 75 } },
  tempest:   { name: "TEMPEST",   title: "Storm Caller",      faction: "HEROES",  power: "Weather Control",         rank: "A-Class", description: "날씨를 조종하는 능력자. 정의감이 강하고 동료를 아끼는 성격.",                       stats: { power: 80, intelligence: 78, speed: 82, durability: 77 } },
};

// ─── 로딩 ─────────────────────────────────────────────────

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="eclipse-anim">
          <div className="sun" />
          <div className="moon" />
        </div>
        <h1 className="loading-title">ECLIPSE</h1>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
      </div>
    </div>
  );
}

// ─── 캐릭터 모달 ──────────────────────────────────────────

function CharModal({ char, onClose }: { char: Character | null; onClose: () => void }) {
  if (!char) return null;
  const isVillain = char.faction === "ECLIPSE";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-top">
          <div className={`modal-avatar ${isVillain ? "v" : "h"}`}>
            <div className="avatar-glow" />
            <span>IMG</span>
          </div>
          <h2 className="modal-name">{char.name}</h2>
          <p className="modal-sub">{char.title}</p>
          <span className={`modal-tag ${isVillain ? "v" : "h"}`}>{char.faction}</span>
        </div>

        <div className="modal-body">
          <InfoRow label="POWER"          value={char.power} />
          <InfoRow label="CLASSIFICATION" value={char.threat || char.rank} highlight />
          <div className="modal-row">
            <span className="row-label">PROFILE</span>
            <p className="row-desc">{char.description}</p>
          </div>
          <div className="modal-row">
            <span className="row-label">STATS</span>
            <div className="stats">
              {(Object.entries(char.stats) as [keyof CharStats, number][]).map(([k, v]) => (
                <div key={k} className="stat">
                  <span className="stat-k">{k.toUpperCase()}</span>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${v}%` }} />
                  </div>
                  <span className="stat-v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="modal-row">
      <span className="row-label">{label}</span>
      <span className={highlight ? "row-val-hi" : "row-val"}>{value}</span>
    </div>
  );
}

// ─── 공통 컴포넌트 ────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="sec-header">
      <h2 className="sec-title">{title}</h2>
      <p className="sec-sub">{sub}</p>
    </div>
  );
}

function Pill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="pill">
      <span className="pill-label">{label}</span>
      <span className={`pill-value ${color || ""}`}>{value}</span>
    </div>
  );
}

// ─── 홈 페이지 ────────────────────────────────────────────

function HomePage() {
  return (
    <div className="page-home">

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <h1 className="hero-title">ECLIPSE</h1>
        <p className="hero-sub">WHERE SHADOWS RISE</p>
        <div className="hero-scroll-hint">↓ SCROLL</div>
      </section>

      {/* 세계관 섹션 */}
      <section className="section">
        <div className="section-inner">
          <SectionHeader title="WORLD" sub="SETTING & LORE" />

          <div className="world-cards">
            {[
              { title: "THE AWAKENING", body: "2015년, 첫 이능력자의 출현으로 세상은 영원히 바뀌었다. 평범한 사람들이 초인적인 힘을 얻기 시작했고, 새로운 시대가 열렸다." },
              { title: "THE CITY",      body: "거대 메트로폴리스. 낮에는 평화로운 도시지만, 밤이 되면 히어로와 빌런의 전장으로 변한다. 네온 불빛 아래서 정의와 혼돈이 충돌한다." },
              { title: "POWER SYSTEM", body: "이능력은 각성 → 성장 → 진화의 3단계로 발전한다. 능력 강도에 따라 등급이 매겨지며, SSS급은 도시 하나를 파괴할 수 있는 수준이다." },
            ].map(c => (
              <div key={c.title} className="world-card">
                <h3 className="world-card-title">{c.title}</h3>
                <p className="world-card-body">{c.body}</p>
              </div>
            ))}
          </div>

          {/* 타임라인 */}
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot" />
                <div className="tl-content">
                  <span className="tl-year">{item.year}</span>
                  <span className="tl-event">{item.event}</span>
                  <span className="tl-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 세력 대결 섹션 */}
      <section className="section section-dark">
        <div className="section-inner">
          <SectionHeader title="FACTIONS" sub="ECLIPSE vs HEROES" />

          <div className="vs-wrap">
            <div className="vs-side villain">
              <div className="vs-icon villain">⚡</div>
              <h3 className="vs-name villain">ECLIPSE</h3>
              <p className="vs-desc">세상의 어둠 속에서 활동하는 빌런 조직. VOID를 정점으로 수직적 구조를 가진다. 기존 질서의 파괴와 새로운 세계의 건설이 목표.</p>
              <div className="vs-stats">
                <Pill label="멤버"     value="5명"     />
                <Pill label="최고 위협도" value="SSS"   color="red"   />
                <Pill label="활동 기간"  value="2021~" />
              </div>
            </div>

            <div className="vs-center">VS</div>

            <div className="vs-side hero">
              <div className="vs-icon hero">🛡️</div>
              <h3 className="vs-name hero">HEROES</h3>
              <p className="vs-desc">정의와 평화를 수호하는 공식 히어로 조직. 등급제로 운영되며 정부의 지원을 받는다. 시민의 안전과 질서의 유지가 목표.</p>
              <div className="vs-stats">
                <Pill label="멤버"    value="5명"      />
                <Pill label="최고 등급" value="S-Class" color="green" />
                <Pill label="설립 연도" value="2018"   />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 뉴스피드 섹션 */}
      <section className="section">
        <div className="section-inner">
          <SectionHeader title="RECENT EVENTS" sub="LIVE UPDATES" />

          <div className="news-list">
            {newsData.map((n, i) => (
              <div
                key={n.id}
                className={`news-item threat-${n.threat}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="news-left">
                  <span className="news-type">{n.type}</span>
                  <span className="news-title">{n.title}</span>
                </div>
                <span className="news-time">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── 캐릭터 페이지 ────────────────────────────────────────

function CharactersPage({ onSelect }: { onSelect: (char: Character) => void }) {
  const [filter, setFilter] = useState("all");

  const list = Object.entries(characters).filter(([, c]) => {
    if (filter === "villains") return c.faction === "ECLIPSE";
    if (filter === "heroes")   return c.faction === "HEROES";
    return true;
  });

  return (
    <div className="page-chars">
      <div className="section-inner" style={{ paddingTop: "60px" }}>
        <SectionHeader title="PROFILES" sub="KEY PLAYERS" />

        <div className="filter-tabs">
          {[["all", "ALL"], ["villains", "VILLAINS"], ["heroes", "HEROES"]].map(([v, l]) => (
            <button
              key={v}
              className={`filter-tab ${filter === v ? "active" : ""}`}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="char-grid">
          {list.map(([id, c]) => (
            <div key={id} className="char-card" onClick={() => onSelect(c)}>
              <div className="char-avatar"><span>IMG</span></div>
              <h3 className="char-name">{c.name}</h3>
              <p className="char-title">{c.title}</p>
              <span className={`char-tag ${c.faction === "ECLIPSE" ? "v" : "h"}`}>
                {c.faction}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 루트 ─────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState("home");
  const [selectedChar, setChar] = useState<Character | null>(null);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {selectedChar && <CharModal char={selectedChar} onClose={() => setChar(null)} />}

      <div className="stars">
        <div className="stars-canvas" />
      </div>

      <div className="layout">
        {/* 상단 네비 */}
        <nav className="topnav">
          <div className="topnav-logo">ECLIPSE</div>
          <div className="topnav-tabs">
            <button
              className={`topnav-tab ${page === "home"  ? "active" : ""}`}
              onClick={() => setPage("home")}
            >
              HOME
            </button>
            <button
              className={`topnav-tab ${page === "chars" ? "active" : ""}`}
              onClick={() => setPage("chars")}
            >
              CHARACTERS
            </button>
          </div>
        </nav>

        {/* 페이지 전환 */}
        {page === "home"  && <HomePage />}
        {page === "chars" && <CharactersPage onSelect={setChar} />}

        <footer className="footer">
          <p>© 2026 ECLIPSE // ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </>
  );
}