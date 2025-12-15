import React, {useState} from 'react'
import "./PatientPage.css";

import logo from '../assets/logopp.png'
import calendar from '../assets/calendarpp.png'
import chatbox from '../assets/chatboxpp.png'
import doctor from '../assets/doctorpp.png'
import session from '../assets/sessionpp.png'
    
const Navbar = () => {
   const ImageSize ={ width : '75px' , height : '75px' };
   const ImageSize1 ={ width : '25px' , height : '25px' };
  return (
    <header>
        <img src={logo} alt="TheraSync Logo" className="logo" />

      <div className="navbar">

   <div className="nav-links">
  <a href="#"><img style={ImageSize} src={doctor} alt="" /><span>DOCTORS</span></a>
  <a href="#"><img style={ImageSize} src={calendar} alt="" /><span>CALENDAR</span></a>
  <a href="#"><img style={ImageSize} src={session} alt="" /><span>SESSIONS</span></a>
  <a href="#"><img style={ImageSize} src={chatbox} alt="" /><span>CHAT</span></a>
  <a href="#"><i className="fas fa-info-circle"></i><span>     template  </span></a>
</div>


      </div>
          <div className="profile-button">profile</div>
    </header>
  );
};



/* ---------- Dummy data ---------- */
const mock = {
  nextSessions: [
    { id: 1, title: "Cognitive Therapy", date: "16 Jul" },
    { id: 2, title: "Assessment", date: "18 Jul" },
    { id: 3, title: "Follow‑up", date: "20 Jul" }
  ],
  calendarEvents: [
    { title: "Therapy", date: "2025‑07‑16" },
    { title: "Group", date: "2025‑07‑18" }
  ],
  doctor: {
    name: "Dr. Selin Kaya",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  journey: [
    { id: 1, date: "15.01.2024", label: "discovered us" },
    { id: 2, date: "16.12.2024", label: "first session" },
    { id: 3, date: "14.15.2541", label: "second session" },
    { id: 4, date: "14.84.5462", label: "N/A" }
  ]
};

/* ---------- Re‑usable sub‑components (all in this file) ---------- */

const NextSessions = () => (
  <section className="card next‑sessions">
    <h2>next sessions</h2>
    <ul>
      {mock.nextSessions.map((s) => (
        <li key={s.id}>
          <span>{s.title}</span>
          <time>{s.date}</time>
        </li>
      ))}
    </ul>
  </section>
);

const CalendarBoard = () => (
  <section className="calendar">
    {/* Real project → plug @fullcalendar/react here */}
    <div className="calendar‑grid">
      {mock.calendarEvents.map((e, i) => (
        <div key={i} className="event">
          {e.title} <small>{e.date}</small>
        </div>
      ))}
    </div>
  </section>
);

const DoctorCard = () => (
  <section className="card doctor">
    <img src={mock.doctor.avatar} alt="doctor" />
    <div className="info">
      <h3>{mock.doctor.name}</h3>
      <div className="actions">
        <button>plan session</button>
        <button className="outline">chat</button>
      </div>
    </div>
  </section>
);

const JourneyTimeline = () => (
  <section className="card journey">
    <h2>your journey</h2>
    <div className="timeline">
      {mock.journey.map((step, i) => (
        <div key={step.id} className="tick">
          <div className="dot">{String(i + 1).padStart(2, "0")}</div>
          <p>{step.date}</p>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  </section>
);

/* ---------- Root component ---------- */
export default function App() {
  return (
    <div className="wrapper">
      <Navbar />
      <main className="layout">
        {/* left column */}
        <div className="column‑left">
          <NextSessions />
          <DoctorCard />
        </div>
        {/* center calendar */}
        <CalendarBoard />
      </main>
      <JourneyTimeline />
    </div>
  );
}