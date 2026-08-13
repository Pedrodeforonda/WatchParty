"use client";

import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  Heart,
  History,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Moon,
  Play,
  Search,
  Send,
  Share2,
  Shield,
  Sparkles,
  Star,
  Sun,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "home" | "rooms" | "room" | "search" | "profile";
type RoomTab = "chat" | "stats" | "rating";
type Theme = "dark" | "light";

type ChatMessage = {
  id: number;
  initials: string;
  name: string;
  time: string;
  text: string;
  tone: "green" | "blue" | "orange" | "purple";
};

const initialMessages: ChatMessage[] = [
  { id: 1, initials: "LC", name: "Lucía C.", time: "67:08", text: "¡Qué atajada! La sacó del ángulo.", tone: "purple" },
  { id: 2, initials: "MR", name: "Mateo R.", time: "67:21", text: "El partido está para cualquiera ahora.", tone: "blue" },
  { id: 3, initials: "JP", name: "Juli P.", time: "67:42", text: "Necesitamos más presión por la derecha.", tone: "orange" },
  { id: 4, initials: "SM", name: "Sofi M.", time: "68:01", text: "Este segundo tiempo levantó muchísimo 🔥", tone: "green" },
];

const upcomingMatches = [
  { home: "Racing", away: "Independiente", homeCode: "RAC", awayCode: "IND", day: "Mañana", time: "17:00", watchers: "1,2 mil" },
  { home: "San Lorenzo", away: "Huracán", homeCode: "CAS", awayCode: "HUR", day: "Sáb 9", time: "19:30", watchers: "860" },
  { home: "Rosario Central", away: "Newell’s", homeCode: "CARC", awayCode: "NOB", day: "Dom 10", time: "16:00", watchers: "1,8 mil" },
];

const feedItems = [
  { initials: "LC", name: "Lucía Cabrera", action: "calificó el partido", match: "River 1–1 Boca", score: "4.5", text: "Ritmo altísimo y un segundo tiempo que no dio respiro.", time: "hace 2 min", tone: "purple" },
  { initials: "MR", name: "Mateo Ruiz", action: "comentó en vivo", match: "River vs. Boca", score: null, text: "El cambio de esquema abrió completamente el partido.", time: "hace 6 min", tone: "blue" },
  { initials: "SM", name: "Sofía Méndez", action: "sumó a su historial", match: "Argentina 2–0 Uruguay", score: "4.8", text: "Una noche para guardar. El mediocampo fue la gran figura.", time: "ayer", tone: "green" },
];

const historyMatches = [
  { date: "Hoy", home: "River", away: "Boca", result: "1 – 1", rating: 4.5, code: "RIV" },
  { date: "27 jul", home: "Racing", away: "Vélez", result: "2 – 0", rating: 4.2, code: "RAC" },
  { date: "20 jul", home: "Argentina", away: "Uruguay", result: "2 – 0", rating: 4.8, code: "ARG" },
  { date: "13 jul", home: "San Lorenzo", away: "Lanús", result: "1 – 2", rating: 3.6, code: "CAS" },
];

function TeamMark({ code, variant = "navy", size = "md" }: { code: string; variant?: "navy" | "gold" | "sky" | "red" | "green"; size?: "sm" | "md" | "lg" }) {
  return <span className={`team-mark team-mark--${variant} team-mark--${size}`} aria-hidden="true">{code}</span>;
}

function Avatar({ initials, tone = "green", size = "md" }: { initials: string; tone?: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar--${tone} avatar--${size}`} aria-hidden="true">{initials}</span>;
}

function RatingStars({ value, onChange, compact = false }: { value: number; onChange?: (value: number) => void; compact?: boolean }) {
  return (
    <div className={`rating-stars ${compact ? "rating-stars--compact" : ""}`} aria-label={`Calificación ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" className={star <= value ? "is-active" : ""} onClick={() => onChange?.(star)} disabled={!onChange} aria-label={`${star} estrellas`}>
          <Star fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

function NavButton({ active, icon, children, onClick }: { active: boolean; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return <button className={`nav-button ${active ? "is-active" : ""}`} onClick={onClick}>{icon}<span>{children}</span></button>;
}

export default function HomePage() {
  const [view, setView] = useState<View>("home");
  const [roomTab, setRoomTab] = useState<RoomTab>("chat");
  const [messages, setMessages] = useState(initialMessages);
  const [messageDraft, setMessageDraft] = useState("");
  const [reactionCounts, setReactionCounts] = useState({ fire: 284, clap: 176, heart: 132 });
  const [matchRating, setMatchRating] = useState(0);
  const [playerRatings, setPlayerRatings] = useState<Record<string, number>>({});
  const [ratingSent, setRatingSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme: Theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(initialTheme);
  }, []);

  function applyTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("watchparty-theme", nextTheme);
  }

  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  const liveParticipants = useMemo(() => 2847 + messages.length - initialMessages.length, [messages.length]);

  function navigate(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openRoom(tab: RoomTab = "chat") {
    setRoomTab(tab);
    navigate("room");
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), initials: "FL", name: "Fran Lang", time: "Ahora", text, tone: "green" }]);
    setMessageDraft("");
  }

  function ratePlayer(name: string, rating: number) {
    setPlayerRatings((current) => ({ ...current, [name]: rating }));
    setRatingSent(false);
  }

  if (!loggedIn) {
    return (
      <main className="auth-shell">
        <button
          className="icon-button theme-toggle auth-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
        <section className="auth-story">
          <div className="brand brand--light"><span className="brand-ball"><span /></span><span>Watch<strong>Party</strong></span></div>
          <div className="auth-copy">
            <span className="eyebrow eyebrow--light"><Zap size={14} fill="currentColor" /> La segunda pantalla del fútbol</span>
            <h1>Viví cada partido<br />con tu gente.</h1>
            <p>Comentá en tiempo real, calificá a los protagonistas y guardá cada partido que viste.</p>
            <div className="auth-live-card">
              <span className="live-pill"><span /> EN VIVO · 68&apos;</span>
              <div><TeamMark code="RIV" variant="red" /><strong>1</strong><span>—</span><strong>1</strong><TeamMark code="BOC" variant="gold" /></div>
              <small><Users size={14} /> {liveParticipants.toLocaleString("es-AR")} personas en la sala</small>
            </div>
          </div>
        </section>
        <section className="auth-panel">
          <button className="back-to-demo" onClick={() => setLoggedIn(true)}><ChevronLeft size={16} /> Volver a la demo</button>
          <div className="auth-form-wrap">
            <span className="mobile-auth-mark"><span className="brand-ball"><span /></span></span>
            <p className="eyebrow">BIENVENIDO DE NUEVO</p>
            <h2>Entrá a la tribuna</h2>
            <p>Usá tu cuenta para volver a tus partidos y comunidades.</p>
            <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }}>
              <label>Correo electrónico<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vos@ejemplo.com" required /></label>
              <label>Contraseña<input type="password" placeholder="••••••••" required /></label>
              <div className="auth-options"><label className="check-label"><input type="checkbox" defaultChecked /> Recordarme</label><button type="button">Olvidé mi contraseña</button></div>
              <button className="primary-button primary-button--full" type="submit">Ingresar <ChevronRight size={18} /></button>
            </form>
            <p className="signup-copy">¿Todavía no tenés cuenta? <button onClick={() => setLoggedIn(true)}>Crear cuenta gratis</button></p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("home")} aria-label="WatchParty, ir al inicio"><span className="brand-ball"><span /></span><span>Watch<strong>Party</strong></span></button>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <NavButton active={view === "home"} icon={<Home />} onClick={() => navigate("home")}>Inicio</NavButton>
          <NavButton active={view === "rooms" || view === "room"} icon={<MessageCircle />} onClick={() => navigate("rooms")}>Salas</NavButton>
          <NavButton active={view === "search"} icon={<Search />} onClick={() => navigate("search")}>Buscar</NavButton>
          <NavButton active={view === "profile"} icon={<CircleUserRound />} onClick={() => navigate("profile")}>Perfil</NavButton>
        </nav>
        <div className="topbar-actions">
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button className="icon-button notification-button" aria-label="Notificaciones"><Bell /><span /></button>
          <button className="logout-button" onClick={() => setLoggedIn(false)} aria-label="Cerrar sesión"><LogOut /><span>Cerrar sesión</span></button>
        </div>
      </header>

      {view === "home" && <HomeView openRoom={openRoom} liveParticipants={liveParticipants} />}
      {view === "rooms" && <RoomsView openRoom={openRoom} liveParticipants={liveParticipants} />}
      {view === "room" && (
        <MatchRoom
          roomTab={roomTab}
          setRoomTab={setRoomTab}
          messages={messages}
          messageDraft={messageDraft}
          setMessageDraft={setMessageDraft}
          sendMessage={sendMessage}
          reactionCounts={reactionCounts}
          react={(key) => setReactionCounts((current) => ({ ...current, [key]: current[key] + 1 }))}
          matchRating={matchRating}
          setMatchRating={(value) => { setMatchRating(value); setRatingSent(false); }}
          playerRatings={playerRatings}
          ratePlayer={ratePlayer}
          ratingSent={ratingSent}
          submitRating={() => setRatingSent(true)}
          liveParticipants={liveParticipants}
          back={() => navigate("rooms")}
        />
      )}
      {view === "search" && <SearchView openRoom={openRoom} />}
      {view === "profile" && <ProfileView openRoom={openRoom} />}

      <nav className="mobile-nav" aria-label="Navegación móvil">
        <NavButton active={view === "home"} icon={<Home />} onClick={() => navigate("home")}>Inicio</NavButton>
        <NavButton active={view === "rooms" || view === "room"} icon={<MessageCircle />} onClick={() => navigate("rooms")}>Salas</NavButton>
        <NavButton active={view === "search"} icon={<Search />} onClick={() => navigate("search")}>Buscar</NavButton>
        <NavButton active={view === "profile"} icon={<CircleUserRound />} onClick={() => navigate("profile")}>Perfil</NavButton>
      </nav>
    </main>
  );
}

function HomeView({ openRoom, liveParticipants }: { openRoom: (tab?: RoomTab) => void; liveParticipants: number }) {
  return (
    <div className="page page--feed-home">
      <section className="favorite-room-card" aria-label="Sala de tu equipo favorito">
        <div className="favorite-room__top">
          <div>
            <span className="favorite-room__label"><Star size={14} fill="currentColor" /> SALA DE TU EQUIPO</span>
            <span className="live-pill"><span /> EN VIVO · 68&apos;</span>
          </div>
          <button className="favorite-room__more" aria-label="Más opciones"><MoreHorizontal /></button>
        </div>

        <div className="favorite-room__match">
          <div className="favorite-room__team"><TeamMark code="RIV" variant="red" size="md" /><span><strong>River Plate</strong><small>Tu equipo favorito</small></span></div>
          <div className="favorite-room__score"><span>68:14</span><div><strong>1</strong><small>—</small><strong>1</strong></div><em>Segundo tiempo</em></div>
          <div className="favorite-room__team favorite-room__team--away"><span><strong>Boca Juniors</strong><small>Visitante</small></span><TeamMark code="BOC" variant="gold" size="md" /></div>
        </div>

        <div className="favorite-room__footer">
          <div className="favorite-room__people">
            <div className="avatar-stack"><Avatar initials="LC" tone="purple" size="sm" /><Avatar initials="MR" tone="blue" size="sm" /><Avatar initials="SM" tone="green" size="sm" /><span>+2k</span></div>
            <span><strong>{liveParticipants.toLocaleString("es-AR")}</strong> personas comentando</span>
          </div>
          <button className="primary-button" onClick={() => openRoom()}><MessageCircle size={17} /> Entrar a la sala</button>
        </div>
      </section>

      <section className="home-feed-section">
        <div className="feed-title-row">
          <div><span className="eyebrow"><Users size={15} /> ACTIVIDAD</span><h2>Tu feed</h2></div>
          <div className="feed-filter" aria-label="Filtro del feed"><button className="is-active">Para vos</button><button>Siguiendo</button></div>
        </div>

        <div className="feed-home-list">
          {feedItems.map((item) => (
            <article className="feed-card feed-card--home" key={item.name + item.time}>
              <header><Avatar initials={item.initials} tone={item.tone} /><div><strong>{item.name}</strong><span>{item.action} · {item.time}</span></div><button aria-label="Más opciones"><MoreHorizontal /></button></header>
              <div className="feed-match"><TeamMark code={item.match.startsWith("River") ? "RIV" : "ARG"} variant={item.match.startsWith("River") ? "red" : "sky"} /><strong>{item.match}</strong>{item.score && <span className="score-chip"><Star size={13} fill="currentColor" /> {item.score}</span>}</div>
              <p>{item.text}</p>
              <footer><button><Heart /> 24</button><button><MessageCircle /> 6</button><button><Share2 /> Compartir</button></footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RoomsView({ openRoom, liveParticipants }: { openRoom: (tab?: RoomTab) => void; liveParticipants: number }) {
  return (
    <div className="page rooms-page">
      <section className="page-heading rooms-heading">
        <div><span className="eyebrow"><MessageCircle size={15} /> SALAS</span><h1>Partidos para compartir.</h1><p>Entrá a una sala, comentá el partido y vivilo con otros fanáticos.</p></div>
      </section>

      <section className="rooms-featured">
        <div className="section-heading"><div><span className="eyebrow"><Star size={15} fill="currentColor" /> TU EQUIPO</span><h2>River está jugando ahora</h2></div></div>
        <article className="room-directory-card room-directory-card--live">
          <div className="room-directory-card__meta"><span className="live-pill"><span /> EN VIVO · 68&apos;</span><span>Torneo Apertura · Fecha 7</span></div>
          <div className="room-directory-card__match"><div><TeamMark code="RIV" variant="red" /><strong>River Plate</strong></div><section><strong>1</strong><span>—</span><strong>1</strong></section><div><TeamMark code="BOC" variant="gold" /><strong>Boca Juniors</strong></div></div>
          <div className="room-directory-card__footer"><span><Users size={16} /> {liveParticipants.toLocaleString("es-AR")} en la sala</span><button className="primary-button" onClick={() => openRoom()}>Entrar a la sala <ChevronRight size={17} /></button></div>
        </article>
      </section>

      <section className="rooms-other">
        <div className="section-heading"><div><span className="eyebrow"><CalendarDays size={15} /> PRÓXIMAS</span><h2>Otras salas</h2></div></div>
        <div className="rooms-grid">
          {upcomingMatches.map((match, index) => (
            <article className="room-list-card" key={match.home}>
              <header><span>{match.day} · {match.time}</span><span className="room-status">PRÓXIMAMENTE</span></header>
              <div className="room-list-card__teams"><div><TeamMark code={match.homeCode} variant={index === 0 ? "sky" : index === 1 ? "red" : "gold"} size="sm" /><strong>{match.home}</strong></div><span>VS</span><div><TeamMark code={match.awayCode} variant={index === 0 ? "red" : index === 1 ? "gold" : "red"} size="sm" /><strong>{match.away}</strong></div></div>
              <footer><span><Users size={14} /> {match.watchers} interesados</span><button onClick={() => openRoom()}>Ver sala <ChevronRight size={15} /></button></footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MatchRoom(props: {
  roomTab: RoomTab; setRoomTab: (tab: RoomTab) => void; messages: ChatMessage[]; messageDraft: string; setMessageDraft: (value: string) => void; sendMessage: (event: FormEvent) => void;
  reactionCounts: { fire: number; clap: number; heart: number }; react: (key: "fire" | "clap" | "heart") => void; matchRating: number; setMatchRating: (value: number) => void;
  playerRatings: Record<string, number>; ratePlayer: (name: string, value: number) => void; ratingSent: boolean; submitRating: () => void; liveParticipants: number; back: () => void;
}) {
  const players = [
    { name: "Franco Armani", role: "Arquero", number: 1, initials: "FA" },
    { name: "Paulo Díaz", role: "Defensor", number: 17, initials: "PD" },
    { name: "Nacho Fernández", role: "Mediocampista", number: 26, initials: "NF" },
    { name: "Miguel Borja", role: "Delantero", number: 9, initials: "MB" },
  ];
  return (
    <div className="room-page">
      <section className="room-hero">
        <div className="room-hero__bar"><button onClick={props.back}><ChevronLeft size={18} /> Volver</button><span className="live-pill"><span /> EN VIVO · 68&apos;</span><div><button aria-label="Compartir"><Share2 /></button><button aria-label="Más opciones"><MoreHorizontal /></button></div></div>
        <div className="room-score"><div><TeamMark code="RIV" variant="red" size="lg" /><span><strong>River Plate</strong><small>Local</small></span></div><section><span>68:14</span><div><strong>1</strong><small>—</small><strong>1</strong></div><em>Segundo tiempo</em></section><div><span><strong>Boca Juniors</strong><small>Visitante</small></span><TeamMark code="BOC" variant="gold" size="lg" /></div></div>
        <div className="timeline"><span style={{ width: "68%" }} /><i style={{ left: "68%" }} /><div><small>0&apos;</small><small>45&apos;</small><small>90&apos;</small></div></div>
      </section>
      <section className="room-workspace">
        <div className="room-main">
          <div className="room-tabs" role="tablist"><button className={props.roomTab === "chat" ? "is-active" : ""} onClick={() => props.setRoomTab("chat")}><MessageCircle /> Sala en vivo</button><button className={props.roomTab === "stats" ? "is-active" : ""} onClick={() => props.setRoomTab("stats")}><Trophy /> Estadísticas</button><button className={props.roomTab === "rating" ? "is-active" : ""} onClick={() => props.setRoomTab("rating")}><Star /> Calificar</button></div>
          {props.roomTab === "chat" && <ChatPanel {...props} />}
          {props.roomTab === "stats" && <StatsPanel />}
          {props.roomTab === "rating" && <RatingPanel {...props} players={players} />}
        </div>
        <aside className="room-aside"><div className="aside-heading"><span><span className="presence-dot" /> {props.liveParticipants.toLocaleString("es-AR")} conectados</span><Avatar initials="FL" size="sm" /></div><h3>Momento del partido</h3><div className="moment-card"><Flame /><div><strong>Partido abierto</strong><small>Ambos equipos tuvieron chances claras en los últimos 5 minutos.</small></div></div><h3>Más activos</h3>{initialMessages.slice(0, 3).map((message, i) => <div className="active-user" key={message.id}><Avatar initials={message.initials} tone={message.tone} size="sm" /><span><strong>{message.name}</strong><small>{["38", "31", "24"][i]} interacciones</small></span><em>#{i + 1}</em></div>)}<button className="outline-button"><Shield size={16} /> Reglas de convivencia</button></aside>
      </section>
    </div>
  );
}

function ChatPanel(props: { messages: ChatMessage[]; messageDraft: string; setMessageDraft: (value: string) => void; sendMessage: (event: FormEvent) => void; reactionCounts: { fire: number; clap: number; heart: number }; react: (key: "fire" | "clap" | "heart") => void }) {
  return <section className="chat-panel"><div className="chat-feed"><div className="system-message"><Zap size={14} fill="currentColor" /> La conversación está muy activa</div>{props.messages.map((message) => <article className="chat-message" key={message.id}><Avatar initials={message.initials} tone={message.tone} size="sm" /><div><header><strong>{message.name}</strong><small>{message.time}</small></header><p>{message.text}</p><button>Responder</button></div></article>)}</div><div className="reaction-row"><span>Reaccioná al partido</span><div><button onClick={() => props.react("fire")}>🔥 <strong>{props.reactionCounts.fire}</strong></button><button onClick={() => props.react("clap")}>👏 <strong>{props.reactionCounts.clap}</strong></button><button onClick={() => props.react("heart")}>💚 <strong>{props.reactionCounts.heart}</strong></button></div></div><form className="message-form" onSubmit={props.sendMessage}><Avatar initials="FL" size="sm" /><input value={props.messageDraft} onChange={(e) => props.setMessageDraft(e.target.value)} placeholder="Comentá lo que está pasando…" maxLength={180} aria-label="Nuevo comentario" /><button type="submit" disabled={!props.messageDraft.trim()} aria-label="Enviar comentario"><Send /></button></form></section>;
}

function StatsPanel() {
  const stats = [{ label: "Posesión", home: 54, away: 46, suffix: "%" }, { label: "Remates", home: 12, away: 10 }, { label: "Al arco", home: 5, away: 4 }, { label: "Córners", home: 6, away: 3 }, { label: "Faltas", home: 8, away: 11 }];
  return <section className="stats-panel"><div className="stats-title"><div><TeamMark code="RIV" variant="red" size="sm" /> River</div><span>ESTADÍSTICAS EN VIVO</span><div>Boca <TeamMark code="BOC" variant="gold" size="sm" /></div></div>{stats.map((stat) => <div className="stat-row" key={stat.label}><div><strong>{stat.home}{stat.suffix}</strong><span>{stat.label}</span><strong>{stat.away}{stat.suffix}</strong></div><div className="stat-bars"><span style={{ width: `${stat.home}%` }} /><i style={{ width: `${stat.away}%` }} /></div></div>)}<div className="key-players"><h3>Jugadores destacados</h3><div><article><Avatar initials="NF" tone="green" /><span><strong>Nacho Fernández</strong><small>1 asistencia · 89% pases</small></span><em>8.1</em></article><article><Avatar initials="EC" tone="blue" /><span><strong>Edinson Cavani</strong><small>1 gol · 4 remates</small></span><em>7.9</em></article></div></div></section>;
}

function RatingPanel(props: { matchRating: number; setMatchRating: (value: number) => void; playerRatings: Record<string, number>; ratePlayer: (name: string, value: number) => void; ratingSent: boolean; submitRating: () => void; players: { name: string; role: string; number: number; initials: string }[] }) {
  return <section className="rating-panel"><div className="rating-intro"><span className="rating-orb"><Star fill="currentColor" /></span><div><h2>¿Qué te pareció el partido?</h2><p>Tu calificación ayuda a construir la voz de la comunidad.</p></div><RatingStars value={props.matchRating} onChange={props.setMatchRating} /></div><div className="player-rating-list"><div className="player-rating-title"><h3>Calificá a los protagonistas</h3><span>Opcional</span></div>{props.players.map((player) => <article key={player.name}><Avatar initials={player.initials} tone="blue" /><div><strong>{player.name}</strong><small>#{player.number} · {player.role}</small></div><RatingStars compact value={props.playerRatings[player.name] ?? 0} onChange={(rating) => props.ratePlayer(player.name, rating)} /></article>)}</div>{props.ratingSent ? <div className="rating-success"><Sparkles size={19} /> ¡Listo! Tu calificación ya forma parte de la comunidad.</div> : <button className="primary-button primary-button--full" disabled={!props.matchRating} onClick={props.submitRating}>Publicar calificación <ChevronRight size={18} /></button>}</section>;
}

function SearchView({ openRoom }: { openRoom: (tab?: RoomTab) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "teams" | "matches" | "users">("all");

  const teams = [
    { name: "River Plate", meta: "Tu equipo favorito", code: "RIV", variant: "red" as const },
    { name: "Boca Juniors", meta: "Liga Argentina", code: "BOC", variant: "gold" as const },
    { name: "Racing Club", meta: "Liga Argentina", code: "RAC", variant: "sky" as const },
    { name: "San Lorenzo", meta: "Liga Argentina", code: "CAS", variant: "navy" as const },
  ];
  const matches = [
    { name: "River Plate vs Boca Juniors", meta: "En vivo · 68' · Torneo Apertura", codes: ["RIV", "BOC"], live: true },
    { name: "Racing vs Independiente", meta: "Mañana · 17:00", codes: ["RAC", "IND"], live: false },
    { name: "San Lorenzo vs Huracán", meta: "Sáb 9 · 19:30", codes: ["CAS", "HUR"], live: false },
  ];
  const users = [
    { name: "Lucía Cabrera", meta: "42 partidos · 31 reseñas", initials: "LC", tone: "purple" },
    { name: "Mateo Ruiz", meta: "36 partidos · 28 reseñas", initials: "MR", tone: "blue" },
    { name: "Sofía Méndez", meta: "51 partidos · 44 reseñas", initials: "SM", tone: "green" },
  ];

  const normalized = query.trim().toLocaleLowerCase("es");
  const matchQuery = (value: string) => !normalized || value.toLocaleLowerCase("es").includes(normalized);
  const visibleTeams = teams.filter((item) => matchQuery(`${item.name} ${item.meta}`));
  const visibleMatches = matches.filter((item) => matchQuery(`${item.name} ${item.meta}`));
  const visibleUsers = users.filter((item) => matchQuery(`${item.name} ${item.meta}`));
  const resultCount =
    (category === "all" || category === "teams" ? visibleTeams.length : 0) +
    (category === "all" || category === "matches" ? visibleMatches.length : 0) +
    (category === "all" || category === "users" ? visibleUsers.length : 0);

  return (
    <div className="page search-page">
      <section className="search-hero">
        <span className="eyebrow"><Search size={15} /> EXPLORAR WATCHPARTY</span>
        <h1>Buscá lo que querés vivir.</h1>
        <p>Encontrá equipos, partidos y personas de la comunidad.</p>
        <label className="search-main-input">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar equipos, partidos o usuarios…" autoFocus />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button>}
        </label>
        <div className="search-categories" aria-label="Filtrar búsqueda">
          <button className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>Todo</button>
          <button className={category === "teams" ? "is-active" : ""} onClick={() => setCategory("teams")}>Equipos</button>
          <button className={category === "matches" ? "is-active" : ""} onClick={() => setCategory("matches")}>Partidos</button>
          <button className={category === "users" ? "is-active" : ""} onClick={() => setCategory("users")}>Usuarios</button>
        </div>
      </section>

      <section className="search-results">
        <div className="search-results__heading">
          <div><span className="eyebrow">{query ? "RESULTADOS" : "DESCUBRÍ"}</span><h2>{query ? `Resultados para “${query}”` : "Popular en WatchParty"}</h2></div>
          <span>{resultCount} {resultCount === 1 ? "resultado" : "resultados"}</span>
        </div>

        {resultCount === 0 && <div className="search-empty"><Search /><h3>No encontramos resultados</h3><p>Probá con otro equipo, partido o usuario.</p></div>}

        {(category === "all" || category === "teams") && visibleTeams.length > 0 && (
          <div className="search-group">
            <h3>Equipos</h3>
            <div className="search-list">
              {visibleTeams.map((team) => <button className="search-result-row" key={team.name}><TeamMark code={team.code} variant={team.variant} size="sm" /><span><strong>{team.name}</strong><small>{team.meta}</small></span><ChevronRight /></button>)}
            </div>
          </div>
        )}

        {(category === "all" || category === "matches") && visibleMatches.length > 0 && (
          <div className="search-group">
            <h3>Partidos</h3>
            <div className="search-list">
              {visibleMatches.map((match, index) => <button className="search-result-row" key={match.name} onClick={() => match.live ? openRoom() : undefined}><span className="search-match-marks"><TeamMark code={match.codes[0]} variant={index === 0 ? "red" : "navy"} size="sm" /><TeamMark code={match.codes[1]} variant={index === 0 ? "gold" : "red"} size="sm" /></span><span><strong>{match.name}</strong><small>{match.meta}</small></span><ChevronRight /></button>)}
            </div>
          </div>
        )}

        {(category === "all" || category === "users") && visibleUsers.length > 0 && (
          <div className="search-group">
            <h3>Usuarios</h3>
            <div className="search-list">
              {visibleUsers.map((user) => <button className="search-result-row" key={user.name}><Avatar initials={user.initials} tone={user.tone} /><span><strong>{user.name}</strong><small>{user.meta}</small></span><ChevronRight /></button>)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileView({ openRoom }: { openRoom: (tab?: RoomTab) => void }) {
  return (
    <div className="page profile-page">
      <section className="profile-hero">
        <div className="profile-person">
          <Avatar initials="FL" tone="green" size="lg" />
          <div><span className="level-chip"><Zap size={13} fill="currentColor" /> NIVEL 8</span><h1>Francisco Lang</h1><p>Fanático del fútbol · Buenos Aires</p></div>
        </div>
        <div className="profile-actions"><button className="secondary-button">Editar perfil</button></div>
        <div className="profile-stats"><div><strong>28</strong><span>Partidos vistos</span></div><div><strong>19</strong><span>Calificaciones</span></div><div><strong>146</strong><span>Comentarios</span></div><div><strong>8</strong><span>Racha semanal</span></div></div>
      </section>

      <section className="profile-content">
        <div className="history-panel">
          <div className="section-heading"><div><span className="eyebrow"><History size={15} /> TU HISTORIAL</span><h2>Partidos que viviste</h2></div><button>Ver todos <ChevronRight size={16} /></button></div>
          {historyMatches.map((match) => <article className="history-row" key={match.date + match.home}><span>{match.date}</span><TeamMark code={match.code} variant={match.home === "River" ? "red" : match.home === "Argentina" ? "sky" : "navy"} size="sm" /><div><strong>{match.home} <em>{match.result}</em> {match.away}</strong><small>Torneo Apertura</small></div><span className="score-chip"><Star size={13} fill="currentColor" /> {match.rating}</span><button aria-label="Ver partido"><ChevronRight /></button></article>)}
        </div>

        <div className="profile-cards">
          <div className="favorite-card">
            <h3>Tu equipo favorito</h3>
            <div><TeamMark code="RIV" variant="red" /><span><strong>River Plate</strong><small>8 partidos registrados</small></span></div>
            <button onClick={() => openRoom("rating")}>Calificar partido actual <ChevronRight size={16} /></button>
          </div>
          <div className="achievement-card">
            <span><Trophy /></span>
            <p className="eyebrow">PRÓXIMO LOGRO</p>
            <h3>Voz de la tribuna</h3>
            <p>Publicá 4 comentarios más para desbloquear este logro.</p>
            <div className="progress-bar"><span style={{ width: "72%" }} /></div>
            <small>18 de 25 comentarios</small>
          </div>
        </div>
      </section>
    </div>
  );
}
