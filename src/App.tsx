import { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── 타입 ─────────────────────────────────────────────────
type CharAbility = { name: string; desc: string };
type CharStats = { combat: number; pop: number; danger: number };
type Char = {
  id: string;
  f: "hero" | "villain" | "other";
  name: string;
  codename: string;
  role: string;
  age: number;
  gradeCls: string;
  badgeLabel: string;
  factionLabel: string;
  stats: CharStats;
  desc: string;
  personality: string;
  abilities: CharAbility[];
};

// ─── 캐릭터 데이터 ────────────────────────────────────────
const CHARS: Char[] = [
  { id: "cheon", f: "hero", name: "천지안", codename: "", role: "히어로 협회 국장", age: 37, gradeCls: "", badgeLabel: "", factionLabel: "협회국", stats: { combat: 35, pop: 75, danger: 80 }, desc: "겉으로는 자애로운 어머니상. 실제로는 냉혹한 성과주의자.", personality: "누구에게나 상냥하고 존댓말을 쓰는 자애로운 이미지지만, 철저한 성과주의자이자 냉혹한 정치가. 사람을 \"인재, 리스크, 폐기물\"로 분류하여 관리한다. 특수부대 출신으로 사격 실력이 수준급이지만 무력보다는 정치적으로 움직이는 타입.", abilities: [{ name: "정치적 압박", desc: "성과 압박과 달콤한 회유로 히어로를 통제하고, 법적 제재와 언론 플레이로 빌런의 숨통을 조인다." }, { name: "사격 (비능력)", desc: "특수부대 출신 수준급 사격. 무력은 최후의 수단." }] },
  { id: "cha_sh", f: "hero", name: "차시헌", codename: "", role: "히어로 협회 운영실장", age: 34, gradeCls: "", badgeLabel: "", factionLabel: "협회국", stats: { combat: 72, pop: 30, danger: 55 }, desc: "냉철한 공리주의자. 가혹하다는 걸 알지만, 악역을 맡아야 한다고 믿는다.", personality: "냉철한 공리주의자. 자신의 일이 신인류에게 가혹하다는 죄책감을 느끼면서도 사회 질서를 위해 누군가는 악역을 맡아야 한다고 믿는다. 차수진의 쌍둥이 오빠. 군 특수부대 및 대테러 장교 출신.", abilities: [{ name: "전술 지휘 (비능력)", desc: "군 특수부대 출신. 권총 사격·CQC·전술 지휘 수준급." }, { name: "조직 운영", desc: "협회국 전체 운영 총괄. 엄격하지만 든든한 상사." }] },
  { id: "lee_rm", f: "hero", name: "이루미", codename: "노바 프리즈", role: "S급 히어로", age: 27, gradeCls: "cb-s", badgeLabel: "S급", factionLabel: "협회국", stats: { combat: 97, pop: 70, danger: 60 }, desc: "압도적 절대영도 능력. 감정 표현이 서툰 맹탕 쿠데레.", personality: "감정 표현이 서툴러 오해를 자주 받는 맹탕 쿠데레. 협회 관계자에게는 \"말 안 듣는 고양이\", 빌런에게는 \"말이 안 통하는 자연재해\".", abilities: [{ name: "빙결 조작", desc: "주변 열에너지를 빼앗아 모든 것을 얼린다. 도시 블록 하나를 얼음 감옥으로 만들 수 있다." }, { name: "광역 제압", desc: "날아오는 미사일을 통째로 얼려 정지시키는 등 방어에도 탁월." }] },
  { id: "han_jy", f: "hero", name: "한재이", codename: "리코일", role: "A급 히어로", age: 25, gradeCls: "cb-a", badgeLabel: "A급", factionLabel: "협회국", stats: { combat: 84, pop: 91, danger: 45 }, desc: "에너지 넘치는 팀의 분위기 메이커. 팬들에게 먼저 다가가는 서비스 정신.", personality: "언제나 에너지가 넘치고 친화력이 좋다. 팬들에게 먼저 다가가 셀카를 찍어주고 우는 아이를 달래주는 서비스 정신. 빌런에게는 \"끈질기고 귀찮은 열혈 바보\".", abilities: [{ name: "운동 에너지 축적", desc: "타격하거나 타격받을 때의 충격 에너지를 몸 안에 축적한다." }, { name: "폭발적 방출", desc: "축적 에너지를 한 번에 방출하는 일격 필살. 탱커와 딜러 역할 동시 수행." }] },
  { id: "seo_yd", f: "hero", name: "서연두", codename: "바운스 베리", role: "B급 히어로", age: 21, gradeCls: "cb-b", badgeLabel: "B급", factionLabel: "협회국", stats: { combat: 62, pop: 80, danger: 30 }, desc: "존재 자체가 활력소. 가장 믿음직한 방패이자 지켜주고 싶은 여동생.", personality: "힘든 전투 중에도 \"할 수 있어요!\"를 외치는 따뜻한 캐릭터. 빌런에게는 \"공격이 안 먹혀서 짜증 나는 방해꾼\".", abilities: [{ name: "물리 법칙 완화", desc: "일정 반경 내 바닥·공기를 젤리처럼 변형. 추락 시민을 안전하게 받아내는 데 특화." }, { name: "방어막 형성", desc: "공기에 탄성을 부여해 보이지 않는 방패 생성. 물리 공격은 방어하지만 열·에너지에 취약." }] },
  { id: "baek_yj", f: "hero", name: "백이준", codename: "그라비온", role: "S급 히어로", age: 27, gradeCls: "cb-s", badgeLabel: "S급", factionLabel: "협회국", stats: { combat: 96, pop: 55, danger: 65 }, desc: "히어로를 월급 나오는 고위험 직종으로 인식하는 귀차니스트 S급.", personality: "정의감보다는 직업의식으로 움직이는 귀차니스트. 협회의 보여주기식 행정을 싫어한다. 빌런에게는 \"가장 상대하기 싫은 넘사벽\".", abilities: [{ name: "중력 조작", desc: "일정 반경 내 중력을 자유롭게 조절. 공간 압축으로 국지적 중력 극대화." }, { name: "궤도 왜곡", desc: "날아오는 물리적 공격의 궤도를 휘게 만들어 빗나가게 한다." }] },
  { id: "cha_sj", f: "villain", name: "차수진", codename: "모노크롬", role: "빌런 협회 협회장", age: 34, gradeCls: "cb-s", badgeLabel: "S급", factionLabel: "빌런협회", stats: { combat: 92, pop: 60, danger: 98 }, desc: "\"능력은 신이 준 선물이지, 국가의 대여품이 아니다.\" 화술의 달인.", personality: "조곤조곤한 말로 상대를 설득하거나 압박하는 화술의 달인. 빌런에게는 \"진정한 자유를 주는 어머니\", 히어로에게는 \"신념을 흔드는 매혹적인 악마\". 차시헌의 쌍둥이 여동생.", abilities: [{ name: "이중 개념 반전", desc: "지정 대상의 속성을 정반대로 뒤집는다. 치유→맹독, 강화→약화." }, { name: "물리적 반전", desc: "불→냉기, 강철→액체 등 물리 법칙의 근간을 흔든다." }] },
  { id: "noh_jh", f: "villain", name: "노재하", codename: "블루 베놈", role: "빌런 협회 실행부", age: 26, gradeCls: "cb-a", badgeLabel: "A급", factionLabel: "빌런협회", stats: { combat: 86, pop: 20, danger: 88 }, desc: "말수가 극도로 적어 오해를 사는 고슴도치. 사실은 낯가림이 심할 뿐.", personality: "말수가 극도로 적어 \"차가운 살의\"로 오해받지만 사실은 낯가림이 심한 것뿐. 동료에게는 \"가장 신뢰할 수 있는 등\".", abilities: [{ name: "체내 독성 합성", desc: "모든 체액을 치명적인 독으로 전환. 마수 외피를 녹이거나 히어로 근육을 마비시킨다." }, { name: "독성 영역 확산", desc: "숨을 내쉬어 주변 공기를 독가스로 채운다." }] },
  { id: "pyo_nr", f: "villain", name: "표나리", codename: "스칼렛 프라이드", role: "빌런 협회 실행부", age: 24, gradeCls: "cb-b", badgeLabel: "B급", factionLabel: "빌런협회", stats: { combat: 73, pop: 65, danger: 72 }, desc: "세상의 중심은 자신. 자부심 넘치는 매력적인 악녀.", personality: "세상의 중심은 자신이라 믿는다. 자신을 무시하는 사람은 절대 용서하지 않는다. 협회에게는 \"혈압 오르는 골칫덩어리\".", abilities: [{ name: "혈액 조작", desc: "혈액을 채찍·칼날·망치 등으로 변형시켜 공격한다." }, { name: "혈류 교란", desc: "상대의 상처에 피를 주입해 혈액 순환 방해 또는 신체 능력 저하." }] },
  { id: "yoo_to", f: "villain", name: "유태오", codename: "슬릿", role: "빌런 협회 전술 특수 작전", age: 29, gradeCls: "cb-a", badgeLabel: "잠재 S", factionLabel: "빌런협회", stats: { combat: 90, pop: 40, danger: 95 }, desc: "농담 뒤에 냉철한 계산과 잔혹함을 숨긴 조커. 어디로 튈지 모른다.", personality: "\"재밌잖아?\"라는 이유로 판을 뒤엎기도 한다. 동료에게는 \"믿음직스럽지만 왠지 불안한 참모\", 히어로에게는 \"가장 상대하기 싫은 능글맞은 여우\".", abilities: [{ name: "공간 절단", desc: "허공에 손가락으로 선을 그어 공간을 베어버린다. 그 선 위의 모든 물질이 물리적으로 분리." }, { name: "정밀 절개", desc: "실선부터 거대한 참격까지 조절 가능. 단, 직선만 가능하며 곡선은 불가." }] },
  { id: "jin_gr", f: "other", name: "진가람", codename: "오버드라이브", role: "무소속 프리랜서 용병", age: 28, gradeCls: "cb-a", badgeLabel: "잠재 A", factionLabel: "미등록", stats: { combat: 85, pop: 30, danger: 70 }, desc: "히어로도 빌런도 소꿉장난 취급. 입금 확인 문자만이 그녀를 움직인다.", personality: "히어로·빌런 구분 없는 야생의 늑대. 자신만의 선은 절대 넘지 않는다. 빌런에게는 \"언제 배신할지 모르는 칼날\".", abilities: [{ name: "잠재 성능 극대화", desc: "손에 쥔 모든 무기의 성능을 한계치 이상으로 끌어올린다." }, { name: "즉각 숙련", desc: "처음 보는 무기라도 잡는 순간 완벽 파악. 숟가락도 살상 무기가 된다." }] },
  { id: "kaize", f: "other", name: "카이제", codename: "", role: "네브라키움 원 조율자", age: 215, gradeCls: "cb-omega", badgeLabel: "이클립스", factionLabel: "네브라키움", stats: { combat: 100, pop: 5, danger: 100 }, desc: "\"더 진화한 상위 포식자\"라 여긴다. 인간을 개미 정도로 취급.", personality: "자신을 신이 아닌 \"더 진화한 상위 포식자\"로 여긴다. 화를 내거나 동요하는 일이 거의 없다. 개미가 문다고 화를 내는 사람은 없으니까.", abilities: [{ name: "물리 법칙 재배치", desc: "중력·열역학·운동량 보존 법칙 등 우주의 기본 상수를 의지대로 편집한다." }, { name: "제3의 눈 — 인과 간섭", desc: "이미 일어난 사건의 결과만 재배치 가능. 원인은 유지하되 결과를 바꾼다. 반동이 심해 자주 쓰지 않음." }] },
  { id: "quasar", f: "other", name: "퀘이사", codename: "", role: "네브라키움 공명집행자", age: 189, gradeCls: "cb-omega", badgeLabel: "오메가", factionLabel: "네브라키움", stats: { combat: 95, pop: 10, danger: 97 }, desc: "\"가엾은 아이야, 고통을 덜어주마\"라고 말하며 팔다리를 꺾는 이중성.", personality: "겉으로는 자애롭고 성스러운 말투. 그 이중성이 더욱 소름 끼치게 만든다.", abilities: [{ name: "감각 탈취", desc: "대상의 오감 중 하나를 선택하여 빼앗는다. 빼앗은 감각이 자신에게 귀속." }, { name: "의식 동조", desc: "자신의 의식을 상대의 뇌에 강제로 연결. 기억과 감각 경험·조작 가능." }] },
];

// ─── 스크롤 리빌 훅 ───────────────────────────────────────
function useReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observerRef.current?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    const obs = observerRef.current;
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => obs.observe(el));
    return () => {
      els.forEach((el) => obs.unobserve(el));
    };
  }, []);
}

// ─── 캐릭터 카드 (스탯 애니메이션용) ─────────────────────
function CharCard({
  char,
  index,
  onView,
}: {
  char: Char;
  index: number;
  onView: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      cardRef.current?.querySelectorAll(".cc-stat-fill").forEach((el) => {
        const v = (el as HTMLElement).dataset.v;
        if (v) (el as HTMLElement).style.width = v + "%";
      });
    }, 60 + index * 50);
    return () => clearTimeout(t);
  }, [index]);

  const badge = char.badgeLabel ? (
    <div className={`cc-badge ${char.gradeCls === "cb-s" ? "cc-badge-s" : ""}`}>
      {char.badgeLabel}
    </div>
  ) : null;

  return (
    <div
      ref={cardRef}
      className="char-card"
      data-f={char.f}
    >
      <div className="cc-faction-line" />
      <div className="cc-img">
        <div className="cc-ph">
          <svg className="cc-ph-sigil" viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1}>
            <circle cx="24" cy="24" r="20" />
            <polygon points="24,8 36,28 12,28" />
            <circle cx="24" cy="24" r="5" />
          </svg>
          <div className="cc-ph-path">/images/characters/{char.id}_thumb.png</div>
        </div>
        <img
          src={`/images/characters/${char.id}_thumb.png`}
          alt={char.name}
          loading="lazy"
          onLoad={(e) => {
            const ph = (e.target as HTMLImageElement).previousElementSibling as HTMLElement;
            if (ph) ph.style.display = "none";
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {badge}
      </div>
      <div className="cc-body">
        <div className="cc-name">{char.name}</div>
        <div className="cc-code">
          {char.codename ? "⟡ " + char.codename : "◇ " + char.factionLabel}
        </div>
        <div className="cc-role">{char.role}</div>
        <div className="cc-stats">
          <div className="cc-stat-row">
            <span className="cc-stat-lbl">전투</span>
            <div className="cc-stat-track">
              <div className="cc-stat-fill combat" data-v={char.stats.combat} />
            </div>
            <span className="cc-stat-val">{char.stats.combat}</span>
          </div>
          <div className="cc-stat-row">
            <span className="cc-stat-lbl">인기</span>
            <div className="cc-stat-track">
              <div className="cc-stat-fill pop" data-v={char.stats.pop} />
            </div>
            <span className="cc-stat-val">{char.stats.pop}</span>
          </div>
          <div className="cc-stat-row">
            <span className="cc-stat-lbl">위험</span>
            <div className="cc-stat-track">
              <div className="cc-stat-fill danger" data-v={char.stats.danger} />
            </div>
            <span className="cc-stat-val">{char.stats.danger}</span>
          </div>
        </div>
        <div className="cc-desc">{char.desc}</div>
        <button type="button" className="cc-view" onClick={onView}>
          상세 보기 →
        </button>
      </div>
    </div>
  );
}

// ─── 캐릭터 모달 ──────────────────────────────────────────
function CharModal({
  char,
  onClose,
}: {
  char: Char | null;
  onClose: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    if (!char) return;
    setImgLoaded(false);
  }, [char?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (char) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [char, onClose]);

  if (!char) return null;

  return (
    <div
      id="modal"
      className="open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box" data-mf={char.f} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <div className="modal-faction-bar" />
        <div className="modal-img-wrap">
          <div className="modal-img-ph" id="mPh" style={{ display: imgLoaded ? "none" : "flex" }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1}>
              <circle cx="24" cy="24" r="20" />
              <polygon points="24,8 36,28 12,28" />
              <circle cx="24" cy="24" r="5" />
            </svg>
            <span>/images/characters/{char.id}_full.png</span>
          </div>
          <img
            className="modal-img"
            id="mImg"
            src={`/images/characters/${char.id}_full.png`}
            alt={char.name}
            style={{ display: imgLoaded ? "block" : "none" }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
          />
        </div>
        <div className="modal-header">
          <div>
            <div className="modal-name">{char.name}</div>
            <div className="modal-code">
              {char.codename ? "⟡ " + char.codename : "◇ " + char.factionLabel}
            </div>
            <div className="modal-role">{char.role} · 만 {char.age}세</div>
          </div>
          <div className="modal-grade-badge">{char.badgeLabel || "—"}</div>
        </div>
        <div className="modal-body">
          <div className="modal-col">
            <div className="modal-section-lbl">캐릭터 설명</div>
            <div className="modal-personality">{char.personality}</div>
          </div>
          <div className="modal-col">
            <div className="modal-section-lbl">능력</div>
            <div>
              {char.abilities.map((a) => (
                <div key={a.name} className="ability-block">
                  <div className="ability-name">{a.name}</div>
                  <div className="ability-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 히어로 시길 SVG ───────────────────────────────────────
function HeroSigilSvg() {
  return (
    <svg className="hero-sigil" viewBox="0 0 160 160" fill="none">
      <g className="sigil-ring">
        <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4 24" />
      </g>
      <g className="sigil-ring-ccw">
        <circle cx="80" cy="80" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <circle cx="80" cy="80" r="54" stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="2 14" />
      </g>
      <g stroke="rgba(255,255,255,0.2)" strokeWidth={1} fill="none">
        <polygon points="80,44 110,62 110,98 80,116 50,98 50,62" />
        <polygon points="80,58 96,80 80,102 64,80" />
      </g>
      <circle cx="80" cy="80" r="4" fill="rgba(255,255,255,0.5)" />
      <line x1="80" y1="20" x2="80" y2="44" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1="80" y1="116" x2="80" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1="20" y1="80" x2="44" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1="116" y1="80" x2="140" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
    </svg>
  );
}

// ─── 푸터 시길 SVG ───────────────────────────────────────
function FooterSigilSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1}>
      <circle cx="24" cy="24" r="22" />
      <polygon points="24,6 40,34 8,34" />
      <circle cx="24" cy="24" r="6" />
    </svg>
  );
}

export default function App() {
  const [charFilter, setCharFilter] = useState<"all" | "hero" | "villain" | "other">("all");
  const [gradePanel, setGradePanel] = useState<"gh" | "gv" | "gm" | "gn">("gh");
  const [selectedChar, setSelectedChar] = useState<Char | null>(null);

  useReveal();

  useEffect(() => {
    document.title = "빌어먹을 히어로 — 세계관 아카이브";
  }, []);

  const filteredChars = charFilter === "all" ? CHARS : CHARS.filter((c) => c.f === charFilter);

  return (
    <>
      <nav id="nav">
        <div className="nav-logo">
          <img src="/images/fkhero.png" alt="빌어먹을 히어로" className="nav-logo-img" />
        </div>
        <ul className="nav-links">
          <li><a href="#world">세계관</a></li>
          <li><a href="#grades">등급</a></li>
          <li><a href="#chars">인물</a></li>
          <li><a href="#masoo">마수</a></li>
          {/* <li><a href="#timeline">연표</a></li>
          <li><a href="#themes">주제</a></li> */}
        </ul>
        <div className="nav-status">
          <span className="status-dot" />
          ARCHIVE LIVE
        </div>
      </nav>

      <section id="hero">
        <div className="hero-bg-lines" />
        <div className="hero-sigil-wrap">
          <HeroSigilSvg />
        </div>
        <div className="hero-content">
          <div className="hero-title">
            <img src="/images/fkhero.png" alt="빌어먹을 히어로" className="hero-title-img" />
          </div>
          <div className="hero-sub">Modern Fantasy Universe · Official Archive</div>
          <div className="hero-tagline">
            "능력은 신이 준 선물이지,<br />국가의 대여품이 아니다."
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <div className="hero-meta-num">13</div>
              <div className="hero-meta-lbl">등록 인물</div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-num">4</div>
              <div className="hero-meta-lbl">주요 세력</div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-num">40<span style={{ fontSize: "1.5rem" }}>Y</span></div>
              <div className="hero-meta-lbl">세계관 역사</div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-num">Ω</div>
              <div className="hero-meta-lbl">최고 위협 등급</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="h-rule" />

      <section id="world" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">01 · World</div>
            <h2 className="section-title">세계의 <span className="em">구조</span></h2>
            <p className="section-desc">각성 이후 40년. 인류는 적응했고, 시스템은 굳었으며, 균열은 깊어졌다.</p>
          </header>
          <div className="world-grid reveal">
            {[
              { tag: "Phenomenon", title: "신인류 각성", en: "The Awakening", desc: "40년 전, 원인 불명의 사건으로 인류 일부가 초자연적 능력을 각성했다. 유전적 요인, 환경, 심리적 트라우마 등 다양한 설이 있으나 아직 확정된 이론은 없다.", tags: ["히어로", "빌런", "미등록"] },
              { tag: "System", title: "라이선스 제도", en: "The License System", desc: "각성자는 국가 승인 없이 능력을 사용할 수 없다. 히어로 협회국에 등록하면 합법적 활동이 가능하지만, 일거수일투족이 감시·통제된다. 이 제도에 저항한 집단이 빌런 협회다.", tags: ["관료제", "통제", "저항"] },
              { tag: "Threat", title: "마수 (魔獸)", en: "The Masoo", desc: "각성 현상과 함께 등장한 이형 생물체. 기원 불명. 본능적으로 각성자와 충돌한다. 히어로 협회국과 빌런 협회가 가끔 비공식적으로 협력하는 유일한 이유.", tags: ["기원 불명", "D~Ω 등급"] },
              { tag: "Unknown", title: "네브라키움", en: "Nebrakium", desc: "인류보다 수백 년 앞선 것으로 추정되는 비인류 세력. \"그냥 보러 왔다\"고 주장하지만 아무도 믿지 않는다. 보유 개체 중 하나인 카이제의 능력은 물리 법칙을 편집하는 수준.", tags: ["비인류", "관측자", "코드: 이클립스"] },
            ].map((cell) => (
              <div key={cell.title} className="world-cell">
                <div className="world-cell-tag">{cell.tag}</div>
                <div className="world-cell-title">{cell.title}</div>
                <div className="world-cell-en">{cell.en}</div>
                <div className="world-cell-desc">{cell.desc}</div>
                <div className="world-cell-tags">
                  {cell.tags.map((t) => (
                    <span key={t} className="world-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="orgs-grid reveal d1">
            {[
              { type: "org-hero", name: "히어로 협회국", en: "Hero Bureau", desc: "국가 인가 능력자 관리 기관. 히어로를 \"자산\"으로, 빌런을 \"리스크\"로 분류한다. 라이선스 발급·등급 심사·사건 출동 지령을 담당.", depts: ["천지안 — 협회 국장", "차시헌 — 운영실장", "등록 히어로 전원 소속"] },
              { type: "org-villain", name: "빌런 협회", en: "Villain Association", desc: "라이선스 제도에 저항하는 각성자 집단. 범죄 조직이지만 내부엔 뚜렷한 이념이 있다. 협회국이 억압할수록 규모가 커지는 아이러니한 존재.", depts: ["차수진 — 협회장", "노재하 / 표나리 — 실행부", "유태오 — 전술 특수 작전"] },
              { type: "org-nebra", name: "네브라키움", en: "Nebrakium", desc: "인류 사회 바깥의 비인류 세력. 목적 불명. 접촉 기록이 있으나 그들이 공개한 정보는 전무하다. 히어로·빌런 양측 모두 정면 충돌을 기피.", depts: ["카이제 — 원 조율자", "퀘이사 — 공명집행자", "나머지 개체 수: 미상"] },
              { type: "org-masoo", name: "마수 (魔獸)", en: "Masoo / The Beasts", desc: "조직 없음. 지능 없음. 다만 강함. D급 해충부터 Ω급 재해까지 스펙트럼이 광범위하다. 히어로 협회국과 빌런 협회 모두에게 공통의 위협.", depts: ["D급 — 훈련용 해충", "Ω급 — 국가 비상사태 사유", "기원: 각성 현상과 동시 발생"] },
            ].map((org) => (
              <div key={org.name} className={`org-card ${org.type}`}>
                <div className="org-card-bar" />
                <div className="org-name">{org.name}</div>
                <div className="org-en">{org.en}</div>
                <div className="org-desc">{org.desc}</div>
                <div className="org-depts">
                  {org.depts.map((d) => (
                    <div key={d} className="org-dept"><div className="dept-i" />{d}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="h-rule" />

      <section id="grades" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">02 · Classification</div>
            <h2 className="section-title">등급 <span className="em">체계</span></h2>
            <p className="section-desc">히어로, 빌런, 마수, 네브라키움 — 네 개의 체계, 각자의 기준.</p>
          </header>
          <div className="grade-tabs reveal">
            {(["gh", "gv", "gm", "gn"] as const).map((panel) => (
              <button
                key={panel}
                type="button"
                className={`grade-tab ${gradePanel === panel ? "active" : ""}`}
                onClick={() => setGradePanel(panel)}
              >
                {panel === "gh" && "히어로 등급"}
                {panel === "gv" && "빌런 등급"}
                {panel === "gm" && "마수 위험도"}
                {panel === "gn" && "네브라키움 코드"}
              </button>
            ))}
          </div>
          <div id="gh" className={`grade-panel ${gradePanel === "gh" ? "active" : ""}`}>
            <table className="grade-table">
              <thead><tr><th>등급</th><th>명칭</th><th>영문</th><th>기준</th><th>비고</th></tr></thead>
              <tbody>
                {[
                  { pill: "S", pillCls: "gp-s", name: "S급", en: "Sovereign", eng: "SOVEREIGN CLASS", desc: "국가 전략 자산. 도시 하나를 혼자 지키거나 파괴 가능.", quip: "\"걸어 다니는 대기업\"" },
                  { pill: "A", pillCls: "gp-a", name: "A급", en: "Apex", eng: "APEX CLASS", desc: "엘리트 히어로. 대형 마수 토벌의 주력이며 지역구 스타.", quip: "\"임원급, 야근은 여전히\"" },
                  { pill: "B", pillCls: "gp-b", name: "B급", en: "Baseline", eng: "BASELINE CLASS", desc: "가장 많은 사건을 처리하는 실무진. 시민과 직접 부딪히는 동네 히어로.", quip: "\"가성비의 상징\"" },
                  { pill: "C", pillCls: "gp-c", name: "C급", en: "Cadet", eng: "CADET CLASS", desc: "라이선스 유지 목적 활동. 일반인보다 조금 나은 수준에 불과.", quip: "\"히어로 호소인\"" },
                ].map((r) => (
                  <tr key={r.pill}>
                    <td><span className={`grade-pill ${r.pillCls}`}>{r.pill}</span></td>
                    <td><div className="grade-name">{r.name}</div><div className="grade-en">{r.en}</div></td>
                    <td>{r.eng}</td>
                    <td className="grade-desc">{r.desc}</td>
                    <td className="grade-quip">{r.quip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="gv" className={`grade-panel ${gradePanel === "gv" ? "active" : ""}`}>
            <table className="grade-table">
              <thead><tr><th>등급</th><th>명칭</th><th>영문</th><th>기준</th><th>비고</th></tr></thead>
              <tbody>
                {[
                  { pill: "S", pillCls: "gp-s", name: "S급", en: "Supreme", eng: "SUPREME THREAT", desc: "국가 전복 위협. 도시 기능 마비 또는 대량 학살이 가능한 재앙급.", quip: "\"국가 비상사태 대상\"" },
                  { pill: "A", pillCls: "gp-a", name: "A급", en: "Acute", eng: "ACUTE THREAT", desc: "다수 인명 피해 가능. 히어로 여러 명이 붙어도 제압 장담 불가.", quip: "\"협회가 긴장하는 수준\"" },
                  { pill: "B", pillCls: "gp-b", name: "B급", en: "Basic", eng: "BASIC THREAT", desc: "지역구 깡패. 경찰력으론 불가능하지만 상위 히어로 출동 시 정리 가능.", quip: "\"골치는 아프지만\"" },
                  { pill: "C", pillCls: "gp-c", name: "C급", en: "Common", eng: "COMMON THREAT", desc: "잡범. 능력 좀 쓴다고 으스대다가 편의점 털다 잡히는 수준.", quip: "\"빌런도 경력을 쌓는다\"" },
                ].map((r) => (
                  <tr key={r.pill}>
                    <td><span className={`grade-pill ${r.pillCls}`}>{r.pill}</span></td>
                    <td><div className="grade-name">{r.name}</div><div className="grade-en">{r.en}</div></td>
                    <td>{r.eng}</td>
                    <td className="grade-desc">{r.desc}</td>
                    <td className="grade-quip">{r.quip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="gm" className={`grade-panel ${gradePanel === "gm" ? "active" : ""}`}>
            <table className="grade-table">
              <thead><tr><th>등급</th><th>명칭</th><th>영문</th><th>기준</th><th>비고</th></tr></thead>
              <tbody>
                {[
                  { pill: "Ω", pillCls: "gp-omega", name: "Ω급", en: "Apocalypse", eng: "APOCALYPSE", desc: "재해 등급. 행성 단위 파괴 가능성. 존재 자체가 재앙.", quip: "\"유언장을 쓰세요\"" },
                  { pill: "S", pillCls: "gp-s", name: "S급", en: "Severe", eng: "SEVERE", desc: "국가 비상사태 선포 및 주가 폭락 유발.", quip: "\"시장이 먼저 반응\"" },
                  { pill: "A", pillCls: "gp-a", name: "A급", en: "Advanced", eng: "ADVANCED", desc: "재난 문자 발송 및 대피령. 뉴스 속보 확정.", quip: "\"헤드라인 확정\"" },
                  { pill: "B", pillCls: "gp-b", name: "B급", en: "Broad", eng: "BROAD", desc: "정규 히어로팀 파견 기준. 뉴스 속보감.", quip: "\"일상적인 비일상\"" },
                  { pill: "C", pillCls: "gp-c", name: "C급", en: "Common", eng: "COMMON", desc: "동네 비상. 미세먼지 경보처럼 일상화됨.", quip: "\"루틴한 하루\"" },
                  { pill: "D", pillCls: "gp-d", name: "D급", en: "Dormant", eng: "DORMANT", desc: "소형 해충 취급. 신인 히어로 훈련용.", quip: "\"성장통\"" },
                ].map((r) => (
                  <tr key={r.pill + r.eng}>
                    <td><span className={`grade-pill ${r.pillCls}`}>{r.pill}</span></td>
                    <td><div className="grade-name">{r.name}</div><div className="grade-en">{r.en}</div></td>
                    <td>{r.eng}</td>
                    <td className="grade-desc">{r.desc}</td>
                    <td className="grade-quip">{r.quip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="gn" className={`grade-panel ${gradePanel === "gn" ? "active" : ""}`}>
            <table className="grade-table">
              <thead><tr><th>코드</th><th>명칭</th><th>영문</th><th>기준</th><th>비고</th></tr></thead>
              <tbody>
                {[
                  { pill: "E", pillCls: "gp-e", name: "이클립스", en: "Eclipse", eng: "CODE ECLIPSE", desc: "등급 산정 불가. 행성 단위 위협. 관측 기록상 극소수만 확인.", quip: "\"협상 테이블이 사라진다\"", italic: true },
                  { pill: "Ω", pillCls: "gp-omega", name: "오메가", en: "Omega", eng: "CODE OMEGA", desc: "물리 법칙 교란 및 국지적 현실 조작. 지구 과학으로 설명 불가.", quip: "\"개입 vs 관찰, 영원한 갈등\"" },
                  { pill: "α", pillCls: "gp-b", name: "알파", en: "Alpha", eng: "CODE ALPHA", desc: "마수 출현의 원인으로 추정되는 개체. 주로 데이터 수집용.", quip: "\"지켜보는 수준\"" },
                ].map((r) => (
                  <tr key={r.eng}>
                    <td><span className={`grade-pill ${r.pillCls}`} style={r.italic ? { fontFamily: "var(--serif)", fontStyle: "italic" } : undefined}>{r.pill}</span></td>
                    <td><div className="grade-name">{r.name}</div><div className="grade-en">{r.en}</div></td>
                    <td>{r.eng}</td>
                    <td className="grade-desc">{r.desc}</td>
                    <td className="grade-quip">{r.quip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="h-rule" />

      <section id="chars" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">03 · Characters</div>
            <h2 className="section-title">등록 <span className="em">인물</span></h2>
            <p className="section-desc">협회국, 빌런 협회, 그리고 어디에도 속하지 않는 자들.</p>
          </header>
          <div className="char-filter-bar reveal">
            {(["all", "hero", "villain", "other"] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`c-filter ${charFilter === f ? "active" : ""}`}
                onClick={() => setCharFilter(f)}
              >
                {f === "all" && "전체"}
                {f === "hero" && "히어로"}
                {f === "villain" && "빌런"}
                {f === "other" && "기타"}
              </button>
            ))}
          </div>
          <div className="char-grid">
            {filteredChars.map((c, i) => (
              <CharCard key={c.id} char={c} index={i} onView={() => setSelectedChar(c)} />
            ))}
          </div>
        </div>
      </section>

      <hr className="h-rule" />

      <section id="masoo" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">04 · Beasts</div>
            <h2 className="section-title">마수의 <span className="em">위협</span></h2>
          </header>
          <div className="masoo-layout">
            <div className="reveal">
              <div className="masoo-intro-tag">Threat Classification</div>
              <div className="masoo-intro-title">모든 각성자의<br /><em>공통된 적</em></div>
              <div className="masoo-intro-desc">마수는 히어로·빌런의 싸움과 무관하게 존재한다. 기원 불명. 목적 불명. 다만 강하고, 각성자에게 적대적이다. 히어로 협회국과 빌런 협회가 비공식적으로 협력하는 유일한 이유.</div>
              <div className="masoo-facts">
                <div className="masoo-fact"><div className="masoo-fact-marker">01</div>각성 현상과 동시에 최초 목격. 연관성 여부는 현재도 조사 중.</div>
                <div className="masoo-fact"><div className="masoo-fact-marker">02</div>D급은 해충 수준이지만 Ω급은 국가 전략 자산 히어로 여럿이 협공해야 겨우 제압 가능.</div>
                <div className="masoo-fact"><div className="masoo-fact-marker">03</div>첫 Ω급 출현 당시(D-12), 히어로 협회국과 빌런 협회가 비공식 연합 작전을 수행. 양측 모두 공식적으로 부정.</div>
                <div className="masoo-fact"><div className="masoo-fact-marker">04</div>네브라키움이 마수 출현의 원인이라는 설이 있으나 증거 없음.</div>
              </div>
            </div>
            <div className="masoo-grades reveal d1">
              {[
                { letter: "Ω", cls: "mg-omega", name: "Ω급 — 아포칼립스", desc: "재해 등급. 국가 비상 동원령. 도시 소개.", quip: "행성 단위 파괴 가능성." },
                { letter: "S", cls: "mg-s", name: "S급 — 시비어", desc: "국가 비상사태 선포. 주가 폭락 유발.", quip: "\"시장이 먼저 반응한다.\"" },
                { letter: "A", cls: "", name: "A급 — 어드밴스드", desc: "재난 문자 발송 및 대피령. 뉴스 속보 확정.", quip: "\"헤드라인은 보장됩니다.\"" },
                { letter: "B", cls: "", name: "B급 — 브로드", desc: "정규 히어로팀 파견 기준. 민간 대피 권고.", quip: "\"일상이 된 비일상.\"" },
                { letter: "C", cls: "", name: "C급 — 코먼", desc: "동네 단위 비상. 미세먼지 경보처럼 처리.", quip: "\"루틴한 하루.\"" },
                { letter: "D", cls: "", name: "D급 — 도먼트", desc: "소형 해충 취급. 신인 훈련용.", quip: "\"성장통이라 부른다.\"" },
              ].map((row) => (
                <div key={row.letter} className="masoo-grade-row">
                  <div className={`mg-letter ${row.cls}`} style={row.letter === "D" ? { fontSize: "1.2rem" } : undefined}>{row.letter}</div>
                  <div className="mg-info"><div className="mg-name">{row.name}</div><div className="mg-desc">{row.desc}</div><div className="mg-quip">{row.quip}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 40년의 역사 (연표)
      <hr className="h-rule" />
      <section id="timeline" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">05 · History</div>
            <h2 className="section-title">40년의 <span className="em">역사</span></h2>
            <p className="section-desc">각성 이전은 없었던 것처럼 취급된다. 이 세계는 그날부터 시작한다.</p>
          </header>
          <div className="tl-wrap">
            {[
              { year: "D-40", tag: "FIRST AWAKENING", title: "최초 각성 사례 보고", desc: "전 세계에서 동시다발적 이능력자 등장. 각국 정부는 은폐를 시도했고, 군사화를 시도했고, 결국 둘 다 실패했다." },
              { year: "D-35", tag: "HERO BUREAU ESTABLISHED", title: "히어로 협회국 설립", desc: "라이선스 제도 도입. 능력자들은 처음엔 환영했고, 나중엔 후회했다. 시스템은 생각보다 빠르게 굳었다." },
              { year: "D-28", tag: "VILLAIN ASSOCIATION FORMED", title: "빌런 협회 결성", desc: "탄압으로 오히려 성장한 저항 조직. 협회국이 빌런 협회를 키웠다는 말은 틀리지 않았다." },
              { year: "D-20", tag: "FIRST CONTACT", title: "네브라키움 첫 접촉", desc: "\"걱정 마시오, 우리는 그냥 보러 왔소.\" 지금까지 그 말을 100% 믿는 사람은 없다." },
              { year: "D-12", tag: "CRISIS ALPHA", title: "첫 Ω급 마수 출현", desc: "히어로 협회국과 빌런 협회의 비공식 연합 작전. 둘 다 이 사실을 공식적으로는 부정한다." },
              { year: "NOW", tag: "PRESENT · STORY BEGINS", title: "이야기의 시작", desc: "히어로는 출근하고, 빌런은 계획을 세우고, 네브라키움은 관측한다. 오늘도 마수 경보가 울린다." },
            ].map((item, i) => (
              <div key={item.year} className={`tl-item reveal ${i % 2 === 1 ? "d1" : i % 2 === 0 && i > 0 ? "d2" : ""}`}>
                <div className="tl-dot" />
                <div className="tl-year">{item.year}</div>
                <div className="tl-tag">{item.tag}</div>
                <div className="tl-title">{item.title}</div>
                <div className="tl-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* 핵심 주제
      <hr className="h-rule" />
      <section id="themes" className="section">
        <div className="container">
          <header className="section-header reveal">
            <div className="section-num">06 · Themes</div>
            <h2 className="section-title">핵심 <span className="em">주제</span></h2>
          </header>
          <div className="themes-grid">
            {[
              { num: "01", title: "권력과 통제", desc: "능력은 누구의 것인가. 협회국의 라이선스 시스템은 질서인가, 통제인가. 법 안에서 자유로울 수 있는가." },
              { num: "02", title: "선의의 역설", desc: "좋은 의도로 나쁜 결과를 만드는 사람들. 차시헌의 냉혹한 행정, 차수진의 자유주의적 테러. 누가 옳은가는 불분명하다." },
              { num: "03", title: "각성의 무게", desc: "능력은 선물인가, 저주인가. 강해질수록 주변은 멀어지고, 시스템은 당신을 더 작게 정의하려 한다." },
              { num: "04", title: "인간의 경계", desc: "네브라키움은 인간보다 진화했지만 감정이 없다. 마수는 강력하지만 의지가 없다. 인간임을 규정하는 것은 무엇인가." },
            ].map((theme, i) => (
              <div key={theme.num} className={`theme-card reveal ${i === 1 ? "d1" : i === 2 ? "d2" : i === 3 ? "d3" : ""}`}>
                <div className="theme-num">{theme.num}</div>
                <div className="theme-title">{theme.title}</div>
                <div className="theme-desc">{theme.desc}</div>
                <div className="theme-accent" />
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      <footer id="footer">
        <div className="footer-sigil">
          <FooterSigilSvg />
        </div>
        <div className="footer-logo">빌어먹을 <em>히어로</em></div>
        <div className="footer-tagline">
          세계관 · 작품 제작: 김타부 (gimtabeu)<br />
          홈페이지 제작: 몽유도인 (KimDiUm)
        </div>
        <div className="footer-meta">DAMN HERO UNIVERSE · OFFICIAL ARCHIVE · ALL RIGHTS RESERVED</div>
      </footer>

      <CharModal char={selectedChar} onClose={() => setSelectedChar(null)} />

      {/* <button type="button" id="themeSwitcher">
        ← 다른 버전 보기
      </button> */}
    </>
  );
}
