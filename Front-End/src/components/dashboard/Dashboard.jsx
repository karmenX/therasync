import React, {useState, useEffect} from 'react'
import './Dashboard.css'


import logo1 from '../assets/logo.png'
import calendar from '../assets/calendar.svg'
import chatbox from '../assets/chatbox.svg'
import notes from '../assets/notes.svg'
import PatientPhoto from '../assets/patient.svg';
import ProfileIcon from '../assets/user.svg'

const photoMap = {
  "patient.svg": PatientPhoto,
  // Add other patient photo mappings if needed
};

const Dashboard = () => {
    const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [activePage, setActivePage] = useState('patients');

    useEffect(() => {
        fetch('/exampledataset.json')
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(err => {
                console.error("Error loading patient data:", err);
                setPatients([]);
            });
        }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const nextPatient = () => {
        if (currentPatientIndex < patients.length - 4) {
            setCurrentPatientIndex(currentPatientIndex + 1);
        }
    };

    const prevPatient = () => {
        if (currentPatientIndex > 0) {
            setCurrentPatientIndex(currentPatientIndex - 1);
        }
    };

    const visiblePatients = patients.slice(currentPatientIndex, currentPatientIndex + 4);


    return (
        <div className="dashboard">
            <nav className="sidebar">
                <div className="nav-item">
                    <img src={logo1} alt="TheraSync" style={{height: "75px", width: "100px",alignItems:"left"}}  className="nav-icon" />
                </div>
                <div className="nav-item">
                    <img src={calendar} alt="Calendar" className="nav-icon" />
                    <span>Calendar</span>
                </div>
                 <div className={`nav-item ${activePage === 'patients' ? 'active' : ''}`}>
                    <img src={notes} alt="Patients"  className="nav-icon" />
                    <span>Patients</span>
                </div>
                <div className="nav-item">
                    <img src={chatbox} alt="Chat" className="nav-icon" />
                    <span>Chat</span>
                </div>
                <div className="nav-item">
                    {<img src={ProfileIcon} alt="Profile" className="nav-icon" />}
                    <span>Profile</span>
                </div>
                <div className="nav-item support">
                    <span className="support-text">TheraSync</span>
                    <span className="support-text">support</span>
                    {/*<img src={SupportIcon} alt="Support" className="nav-icon" />*/}
                </div>
            </nav>

            <main className="main-content">

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPatientIndex(0); // Reset to first page on new search
                        }}
                        className="search-bar"
                    />
                </div>


                {/* Hasta Kartları Bölümü */}
                <div className="patients-section">
                    <button
                        className="nav-arrow left"
                        onClick={prevPatient}
                        disabled={currentPatientIndex === 0}
                    >
                        &#8249;
                    </button>

                    <div className="patients-container">
                        {visiblePatients.map((patient, index) => (
                            <div key={patient.id} className="patient-card">
                                <div className="patient-photo">
                                    <img src={patient.photo} alt={patient.name} />
                                </div>
                                <div className="patient-name">
                                    {patient.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="nav-arrow right"
                        onClick={nextPatient}
                        disabled={currentPatientIndex >= patients.length - 3}
                    >
                        &#8250;
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;