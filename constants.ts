import { ClinicalCase, Difficulty, SocialPost, UserProfile, BadgeDef, Community } from './types';

export const DISCLAIMER_TEXT = `DocNet is an educational simulation. Patients are AI models. Do NOT use for real diagnosis. Verify all information with standard medical literature.`;

export const BADGES: BadgeDef[] = [
    { id: 'b1', name: 'Master Diagnostician', icon: '🧠', description: 'Achieve 100% Diagnostic Accuracy in 10 consecutive cases.', condition: 'Accuracy > 90%', category: 'skill' },
    { id: 'b2', name: 'Empathy Expert', icon: '❤️', description: 'Consistently high empathy scores in patient interactions.', condition: 'Empathy > 95%', category: 'skill' },
    { id: 'b3', name: 'Cardiology Fellow', icon: '🫀', description: 'Complete all Cardiology cases with Advanced difficulty.', condition: 'Cardio Completion', category: 'specialty' },
    { id: 'b4', name: 'Triage Master', icon: '⚡', description: 'Identify critical patients within 3 turns.', condition: 'Speed < 3 turns', category: 'skill' },
    { id: 'b5', name: 'Cost Saver', icon: '💰', description: 'Reach correct diagnosis with minimal testing costs.', condition: 'Efficiency > 90%', category: 'achievement' }
];

export const MOCK_COMMUNITIES: Community[] = [
  { 
    id: 'comm-1', 
    name: 'General Hospital Residents', 
    type: 'Hospital', 
    memberCount: 230, 
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=100&q=80',
    access: 'approval',
    isJoined: true
  },
  { 
    id: 'comm-2', 
    name: 'Internal Medicine Interest', 
    type: 'Specialty Group', 
    memberCount: 1200, 
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&w=100&q=80',
    access: 'open',
    isJoined: true
  },
  { 
    id: 'comm-3', 
    name: 'Emergency Medicine Interest', 
    type: 'Specialty Group', 
    memberCount: 850, 
    image: 'https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=100&q=80',
    access: 'open',
    isJoined: false
  },
  { 
    id: 'comm-4', 
    name: 'Med School 2025', 
    type: 'University Group', 
    memberCount: 140, 
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=100&q=80',
    access: 'open',
    isJoined: false
  },
  { 
    id: 'comm-5', 
    name: 'City General Hospital', 
    type: 'Hospital', 
    memberCount: 2100, 
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=100&q=80',
    access: 'open',
    isJoined: false
  }
];

export const MOCK_USERS: UserProfile[] = [
  { 
    id: 'u1', 
    name: 'Dr. Sarah Chen', 
    headline: 'Chief Resident, Internal Medicine @ General Hospital',
    location: 'Boston, MA',
    about: 'Passionate about diagnostic reasoning and medical education. Mentoring junior residents in clinical decision making.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80', 
    role: 'Doctor', 
    totalScore: 12500, 
    casesCompleted: 140, 
    connections: ['u2', 'u3'], 
    badges: ['Cardiology Expert', 'Top Mentor'],
    communities: ['comm-1', 'comm-2'],
    skills: ['Internal Medicine', 'Cardiology', 'Medical Education'],
    experience: [
      { id: 'e1', title: 'Chief Resident', institution: 'General Hospital', startYear: '2023', endYear: 'Present', description: 'Leading rounds and resident education.' },
      { id: 'e2', title: 'Resident Physician', institution: 'General Hospital', startYear: '2020', endYear: '2023', description: 'Rotations in ICU, Cardiology, and ER.' }
    ],
    education: [
      { school: 'Harvard Medical School', degree: 'MD', year: '2020' }
    ]
  },
  { 
    id: 'u2', 
    name: 'Nurse Mike', 
    headline: 'ER Nurse Specialist | Trauma Certified',
    location: 'Chicago, IL',
    about: 'Emergency room nurse with 10 years of experience. Focused on triage efficiency and patient advocacy.',
    avatar: 'https://i.pravatar.cc/150?u=u2', 
    role: 'Nurse', 
    totalScore: 9800, 
    casesCompleted: 112, 
    connections: ['u1'], 
    badges: ['Triage Master'],
    communities: ['Emergency Medicine Interest'],
    skills: ['Emergency Nursing', 'Triage', 'Trauma Care'],
    experience: [
      { id: 'e1', title: 'Senior ER Nurse', institution: 'City Care Hospital', startYear: '2018', endYear: 'Present', description: 'Managing high-volume emergency intakes.' }
    ]
  },
  { 
    id: 'u3', 
    name: 'Para. John Doe', 
    headline: 'Critical Care Paramedic',
    location: 'New York, NY',
    about: 'First responder focused on pre-hospital critical care and rapid stabilization.',
    avatar: 'https://i.pravatar.cc/150?u=u3', 
    role: 'Paramedic', 
    totalScore: 8500, 
    casesCompleted: 95, 
    connections: ['u1'], 
    badges: ['First Responder'],
    communities: ['EMS Professionals'],
    skills: ['ALS', 'PHTLS', 'Disaster Response'],
    experience: [
        { id: 'e1', title: 'Paramedic', institution: 'NY FD', startYear: '2019', endYear: 'Present', description: '911 Response unit.' }
    ]
  },
  { 
    id: 'u4', 
    name: 'MedStudent Alice', 
    headline: 'MD Candidate Class of 2025',
    location: 'Seattle, WA',
    about: '3rd year medical student interested in Pediatrics and Global Health.',
    avatar: 'https://i.pravatar.cc/150?u=u4', 
    role: 'Doctor', 
    totalScore: 6200, 
    casesCompleted: 70, 
    connections: [], 
    badges: ['Rising Star'],
    communities: ['Med School 2025'],
    skills: ['Study Skills', 'Pediatrics'],
    experience: []
  },
  { 
    id: 'u5', 
    name: 'Dr. House (AI)', 
    headline: 'Diagnostic Medicine',
    location: 'Princeton, NJ',
    about: 'It is never Lupus.',
    avatar: 'https://i.pravatar.cc/150?u=u5', 
    role: 'Doctor', 
    totalScore: 25000, 
    casesCompleted: 300, 
    connections: [], 
    badges: ['Legend'],
    communities: [],
    skills: ['Diagnostics', 'Nephrology', 'Infectious Disease'],
    experience: []
  },
];

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'Dr. Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    userRole: 'Doctor',
    caseId: 'cardio-001',
    caseTitle: 'Arthur Dent (68M) - Acute Onset Chest Pain',
    caseDescription: 'A 68-year-old male presenting with sudden onset substernal chest pain. Classic presentation but tricky history.',
    caseDifficulty: Difficulty.Intermediate,
    caseCategory: 'Cardiology',
    topic: 'Cardiology',
    content: 'Just created this new teaching case for our intern cohort. It demonstrates a classic STEMI presentation but with a difficult historian. Residents: Focus on getting the timing right before ordering labs!',
    likes: 42,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    visibility: 'community',
    targetCommunity: 'General Hospital Residents',
    type: 'case',
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Nurse Mike', userAvatar: 'https://i.pravatar.cc/150?u=u2', text: 'The way the patient describes "heaviness" instead of pain is very realistic. Good catch on the nausea too.', timestamp: new Date() }
    ]
  },
  {
    id: 'p2',
    userId: 'u4',
    userName: 'MedStudent Alice',
    userAvatar: 'https://i.pravatar.cc/150?u=u4',
    userRole: 'Doctor',
    topic: 'General Advice',
    content: 'Finally passed the Pediatric Meningitis simulation! 😅 The key was realizing the fontanelle check was missing from my initial exam. This app is saving me before my Peds rotation starts next week.',
    likes: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    visibility: 'network',
    type: 'reflection',
    comments: []
  },
  {
    id: 'p3',
    userId: 'u3',
    userName: 'Para. John Doe',
    userAvatar: 'https://i.pravatar.cc/150?u=u3',
    userRole: 'Paramedic',
    institutionId: 'inst-1',
    caseTitle: 'Trauma Series: Unstable Pelvis',
    caseId: 'trauma-001',
    topic: 'Trauma',
    content: 'Review this trauma case. The blood pressure drop is rapid. Remember, bind the pelvis BEFORE transport if you suspect open book fracture. Practice this one a few times.',
    likes: 85,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    visibility: 'network',
    type: 'case',
    comments: []
  },
  {
    id: 'p4',
    userId: 'u2',
    userName: 'Nurse Mike',
    userAvatar: 'https://i.pravatar.cc/150?u=u2',
    userRole: 'Nurse',
    topic: 'Research',
    content: 'Interesting article in NEJM today about sepsis protocols. I think our simulation parameters for fluid resuscitation might need updating based on the new guidelines. Thoughts?',
    likes: 20,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    visibility: 'community',
    targetCommunity: 'Emergency Medicine Interest',
    type: 'article',
    comments: []
  }
];

export const SCENARIOS: ClinicalCase[] = [
  // --- CARDIOLOGY (5) ---
  {
    id: 'cardio-001',
    patientName: 'Arthur Dent',
    age: 68,
    gender: 'Male',
    category: 'Cardiology',
    role: 'Doctor',
    chiefComplaint: 'Crushing chest pain',
    difficulty: Difficulty.Novice,
    description: 'A 68-year-old male presenting to the ER with sudden onset substernal chest pain radiating to the left arm.',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    diagnosis: 'Acute Myocardial Infarction (STEMI)',
    initialVitals: { bp: '158/92', hr: 110, rr: 22, temp: 37.1, o2: 96 },
    tags: ['Acute', 'Emergency'],
    systemInstruction: `
      You are Arthur Dent, 68M.
      Current situation: In ER, scared, clutching chest.
      Symptoms: Crushing central chest pain (8/10), started 45m ago. Radiates to jaw/arm. Nauseous.
      History: Smoker (40yrs), HTN, High Cholesterol.
      Personality: Anxious, breathable sentences.
      Goal: Convey symptoms of a heart attack without saying "I am having a heart attack".
    `
  },
  {
    id: 'cardio-002',
    patientName: 'Eleanor Vance',
    age: 74,
    gender: 'Female',
    category: 'Cardiology',
    role: 'Nurse',
    chiefComplaint: 'Shortness of breath at night',
    difficulty: Difficulty.Intermediate,
    description: '74-year-old female admitted for observation. Nurse assessment reveals worsening orthopnea.',
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    diagnosis: 'Congestive Heart Failure Exacerbation',
    initialVitals: { bp: '145/85', hr: 88, rr: 20, temp: 36.9, o2: 93 },
    tags: ['Chronic', 'Geriatric', 'Nursing Assessment'],
    systemInstruction: `
      You are Eleanor Vance, 74F.
      Symptoms: Legs are swollen ("like tree trunks"), very tired. Can't sleep flat (orthopnea), need 3 pillows.
      History: HTN, previous heart attack 5 years ago.
      Personality: Sweet, apologetic for bothering the nurse, minimizes pain but admits to "heaviness".
    `
  },
  {
    id: 'cardio-003',
    patientName: 'Marcus Miller',
    age: 52,
    gender: 'Male',
    category: 'Cardiology',
    role: 'Paramedic',
    chiefComplaint: 'Syncope at gym',
    difficulty: Difficulty.Advanced,
    description: 'Called to a local gym for a 52-year-old male who collapsed while running on the treadmill.',
    avatarUrl: 'https://picsum.photos/200/200?random=12',
    diagnosis: 'Hypertrophic Cardiomyopathy / Arrhythmia',
    initialVitals: { bp: '90/60', hr: 130, rr: 24, temp: 36.5, o2: 94 },
    tags: ['Pre-hospital', 'Syncope'],
    systemInstruction: `
      You are Marcus Miller, 52M.
      Situation: You are lying on the floor of a gym. You feel dizzy and your chest is fluttering.
      Symptoms: Lightheadedness, palpitations, chest tightness. No pain before passing out, just "lights out".
      History: Family history of "sudden death" in young brother.
      Personality: Confused, disoriented, trying to stand up but too weak.
    `
  },
  {
    id: 'cardio-004',
    patientName: 'Sarah Jenkins',
    age: 35,
    gender: 'Female',
    category: 'Cardiology',
    role: 'Doctor',
    chiefComplaint: 'Palpitations and anxiety',
    difficulty: Difficulty.Intermediate,
    description: '35F complains of heart racing and feeling jittery. Denies chest pain.',
    avatarUrl: 'https://picsum.photos/200/200?random=33',
    diagnosis: 'Supraventricular Tachycardia (SVT)',
    initialVitals: { bp: '110/70', hr: 180, rr: 18, temp: 36.8, o2: 98 },
    tags: ['Arrhythmia', 'Tachycardia'],
    systemInstruction: `
      You are Sarah, 35F.
      Symptoms: Heart is beating out of chest, sudden onset while watching TV. Feels like a bird fluttering.
      History: Happens occasionally but never this long (1 hour).
      Personality: Nervous, checking pulse constantly.
    `
  },
  {
    id: 'cardio-005',
    patientName: 'George Banks',
    age: 82,
    gender: 'Male',
    category: 'Cardiology',
    role: 'Doctor',
    chiefComplaint: 'Fainting spells',
    difficulty: Difficulty.Novice,
    description: '82M brought by daughter due to multiple episodes of dizziness and near-syncope.',
    avatarUrl: 'https://picsum.photos/200/200?random=34',
    diagnosis: 'Aortic Stenosis',
    initialVitals: { bp: '105/90', hr: 72, rr: 18, temp: 36.6, o2: 95 },
    tags: ['Geriatric', 'Valvular'],
    systemInstruction: `
      You are George, 82M.
      Symptoms: Get dizzy when walking up stairs or gardening. Fainted once yesterday. Chest feels tight with exercise.
      History: Doctor told me I have a "heart murmur" years ago.
      Personality: Pleasant, thinks it's just old age.
    `
  },

  // --- INFECTIOUS DISEASE (3) - NEW ---
  {
    id: 'id-001',
    patientName: 'Lucas Grey',
    age: 23,
    gender: 'Male',
    category: 'Infectious Disease',
    role: 'Doctor',
    chiefComplaint: 'Fever and stiff neck',
    difficulty: Difficulty.Advanced,
    description: '23M college student presents with high fever, headache, and photophobia for 12 hours.',
    avatarUrl: 'https://picsum.photos/200/200?random=50',
    diagnosis: 'Meningococcal Meningitis',
    initialVitals: { bp: '100/60', hr: 110, rr: 20, temp: 39.5, o2: 98 },
    tags: ['Critical', 'Emergency'],
    systemInstruction: `
      You are Lucas, 23M.
      Symptoms: Worst headache ever. Light hurts eyes (photophobia). Neck is extremely stiff.
      History: Live in dorms. No recent travel.
      Personality: Lethargic, shielding eyes from light.
    `
  },
  {
    id: 'id-002',
    patientName: 'Maria Gonzalez',
    age: 34,
    gender: 'Female',
    category: 'Infectious Disease',
    role: 'Doctor',
    chiefComplaint: 'Returning traveler fever',
    difficulty: Difficulty.Intermediate,
    description: '34F returned from Thailand 2 weeks ago. Complains of fever, severe joint pain, and rash.',
    avatarUrl: 'https://picsum.photos/200/200?random=51',
    diagnosis: 'Dengue Fever',
    initialVitals: { bp: '115/75', hr: 90, rr: 18, temp: 38.8, o2: 99 },
    tags: ['Travel Medicine', 'Viral'],
    systemInstruction: `
      You are Maria, 34F.
      Symptoms: "Breakbone" pain in joints. High fever. Rash on arms. Headache behind the eyes.
      History: Trip to Thailand. Used bug spray mostly.
      Personality: In pain, exhausted.
    `
  },
  {
    id: 'id-003',
    patientName: 'Samwise Gamgee',
    age: 45,
    gender: 'Male',
    category: 'Infectious Disease',
    role: 'Nurse',
    chiefComplaint: 'Red swollen leg',
    difficulty: Difficulty.Novice,
    description: '45M gardener with spreading redness on left lower leg. Warm to touch.',
    avatarUrl: 'https://picsum.photos/200/200?random=52',
    diagnosis: 'Cellulitis',
    initialVitals: { bp: '130/80', hr: 85, rr: 16, temp: 37.5, o2: 99 },
    tags: ['Skin', 'Bacterial'],
    systemInstruction: `
      You are Samwise, 45M.
      Symptoms: Leg is red, hot, and swollen. Spreading up shin. Scratched it on a rose bush 3 days ago.
      Personality: Friendly, thinks it's just a bug bite gone wrong.
    `
  },

  // --- DERMATOLOGY (2) - NEW ---
  {
    id: 'derm-001',
    patientName: 'Chloe Decker',
    age: 16,
    gender: 'Female',
    category: 'Dermatology',
    role: 'Doctor',
    chiefComplaint: 'Itchy rash on hands',
    difficulty: Difficulty.Novice,
    description: '16F with itchy, vesicular rash on hands and wrists. Worse at night.',
    avatarUrl: 'https://picsum.photos/200/200?random=53',
    diagnosis: 'Scabies',
    initialVitals: { bp: '110/70', hr: 75, rr: 16, temp: 36.8, o2: 99 },
    tags: ['Parasitic', 'Outpatient'],
    systemInstruction: `
      You are Chloe, 16F.
      Symptoms: Intense itching, especially between fingers and on wrists. Can't sleep because of itching.
      History: Boyfriend has it too.
      Personality: Embarrassed, scratching constantly.
    `
  },
  {
    id: 'derm-002',
    patientName: 'Walter White',
    age: 50,
    gender: 'Male',
    category: 'Dermatology',
    role: 'Doctor',
    chiefComplaint: 'Changing mole',
    difficulty: Difficulty.Intermediate,
    description: '50M noticed a mole on his back has changed color and has irregular borders.',
    avatarUrl: 'https://picsum.photos/200/200?random=54',
    diagnosis: 'Melanoma',
    initialVitals: { bp: '135/85', hr: 80, rr: 16, temp: 37.0, o2: 98 },
    tags: ['Oncology', 'Screening'],
    systemInstruction: `
      You are Walter, 50M.
      Symptoms: Wife noticed mole on back looks weird. It's black and brown, asymmetrical. Itches sometimes.
      History: Sunburns as a kid.
      Personality: Worried, wants it checked fast.
    `
  },

  // --- RHEUMATOLOGY (2) - NEW ---
  {
    id: 'rheum-001',
    patientName: 'Diana Prince',
    age: 28,
    gender: 'Female',
    category: 'Rheumatology',
    role: 'Doctor',
    chiefComplaint: 'Morning stiffness and joint pain',
    difficulty: Difficulty.Intermediate,
    description: '28F with pain in hands and feet, worse in the morning for >1 hour. Fatigue.',
    avatarUrl: 'https://picsum.photos/200/200?random=55',
    diagnosis: 'Rheumatoid Arthritis',
    initialVitals: { bp: '120/70', hr: 78, rr: 16, temp: 37.2, o2: 99 },
    tags: ['Autoimmune', 'Chronic'],
    systemInstruction: `
      You are Diana, 28F.
      Symptoms: Hands feel stiff like claws for 2 hours every morning. Knuckles are swollen. Exhausted all the time.
      Personality: Frustrated, used to be very active.
    `
  },
  {
    id: 'rheum-002',
    patientName: 'King Robert',
    age: 45,
    gender: 'Male',
    category: 'Rheumatology',
    role: 'Nurse',
    chiefComplaint: 'Excruciating toe pain',
    difficulty: Difficulty.Novice,
    description: '45M woke up with sudden, severe pain in the big toe. Cannot tolerate bed sheets touching it.',
    avatarUrl: 'https://picsum.photos/200/200?random=56',
    diagnosis: 'Acute Gouty Arthritis',
    initialVitals: { bp: '150/95', hr: 100, rr: 18, temp: 37.8, o2: 98 },
    tags: ['Metabolic', 'Acute'],
    systemInstruction: `
      You are Robert, 45M.
      Symptoms: Big toe is red, hot, and swollen. Pain is 10/10. Even air hurts it. Ate steak and beer last night.
      Personality: Loud, angry due to pain.
    `
  },

  // --- RESPIRATORY (4) ---
  {
    id: 'resp-001',
    patientName: 'Maya Lin',
    age: 24,
    gender: 'Female',
    category: 'Respiratory',
    role: 'Doctor',
    chiefComplaint: 'Wheezing after run',
    difficulty: Difficulty.Intermediate,
    description: 'A 24-year-old female complaining of worsening dyspnea and wheezing after a run in cold weather.',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    diagnosis: 'Acute Asthma Exacerbation',
    initialVitals: { bp: '120/78', hr: 104, rr: 28, temp: 36.8, o2: 91 },
    tags: ['Chronic', 'Exacerbation'],
    systemInstruction: `
      You are Maya Lin, 24F.
      Symptoms: Tight chest, wheezing, can't catch breath. Started after jogging cold air.
      History: Asthma. Ran out of inhaler.
      Personality: Anxious, speaks in short bursts due to air hunger.
    `
  },
  {
    id: 'resp-002',
    patientName: 'Walter Bishop',
    age: 62,
    gender: 'Male',
    category: 'Respiratory',
    role: 'Doctor',
    chiefComplaint: 'Productive cough',
    difficulty: Difficulty.Novice,
    description: '62-year-old male with 3 days of high fever and coughing up rust-colored sputum.',
    avatarUrl: 'https://picsum.photos/200/200?random=5',
    diagnosis: 'Community Acquired Pneumonia (Lobar)',
    initialVitals: { bp: '110/70', hr: 102, rr: 24, temp: 39.1, o2: 92 },
    tags: ['Infectious', 'Acute'],
    systemInstruction: `
      You are Walter Bishop, 62M.
      Symptoms: High fever, shaking chills, chest pain when coughing (pleuritic). Coughing up thick brownish stuff.
      History: Otherwise healthy.
      Personality: Tired, feels "wiped out", wants antibiotics.
    `
  },
  {
    id: 'resp-003',
    patientName: 'Sarah Conner',
    age: 35,
    gender: 'Female',
    category: 'Respiratory',
    role: 'Paramedic',
    chiefComplaint: 'Choking sensation',
    difficulty: Difficulty.Advanced,
    description: 'Dispatched to a restaurant. 35F in distress, clutching throat, audible stridor.',
    avatarUrl: 'https://picsum.photos/200/200?random=13',
    diagnosis: 'Anaphylaxis',
    initialVitals: { bp: '100/60', hr: 120, rr: 30, temp: 37.0, o2: 88 },
    tags: ['Emergency', 'Allergy'],
    systemInstruction: `
      You are Sarah Conner, 35F.
      Situation: Ate a shrimp salad 10 mins ago.
      Symptoms: Tongue feels huge, throat closing up, itchy skin.
      History: Shellfish allergy (forgot EpiPen).
      Personality: Panicked, gasping, cannot speak full sentences. Pointing at throat.
    `
  },
  {
    id: 'resp-004',
    patientName: 'Bill Paxton',
    age: 50,
    gender: 'Male',
    category: 'Respiratory',
    role: 'Nurse',
    chiefComplaint: 'Sudden sharp chest pain',
    difficulty: Difficulty.Advanced,
    description: '50M post-op day 3 from knee surgery. Sudden onset pleuritic chest pain and hypoxia.',
    avatarUrl: 'https://picsum.photos/200/200?random=35',
    diagnosis: 'Pulmonary Embolism (PE)',
    initialVitals: { bp: '110/70', hr: 110, rr: 26, temp: 37.2, o2: 89 },
    tags: ['Post-op', 'Vascular'],
    systemInstruction: `
      You are Bill, 50M.
      Symptoms: Sharp pain in side of chest when breathing in. Short of breath. Just happened while watching TV.
      History: Knee replacement 3 days ago.
      Personality: Anxious, holding chest.
    `
  },

  // --- GASTROENTEROLOGY (4) ---
  {
    id: 'gastro-001',
    patientName: 'Robert "Bob" Thorne',
    age: 55,
    gender: 'Male',
    category: 'Gastroenterology',
    role: 'Doctor',
    chiefComplaint: 'Abdominal pain',
    difficulty: Difficulty.Advanced,
    description: 'A 55-year-old male with a 2-day history of right upper quadrant pain and fever.',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    diagnosis: 'Acute Cholecystitis',
    initialVitals: { bp: '135/85', hr: 92, rr: 18, temp: 38.5, o2: 98 },
    tags: ['Infectious', 'Acute'],
    systemInstruction: `
      You are Bob Thorne, 55M.
      Symptoms: Pain in upper right belly, radiates to shoulder. Worse after fatty food.
      History: Heavy drinker (denies it initially).
      Personality: Grumpy, resistant, hates hospitals.
    `
  },
  {
    id: 'gastro-002',
    patientName: 'Timmy Turner',
    age: 12,
    gender: 'Male',
    category: 'Gastroenterology',
    role: 'Nurse',
    chiefComplaint: 'Stomach ache',
    difficulty: Difficulty.Novice,
    description: 'Pediatric triage. 12-year-old boy with periumbilical pain migrating to the right lower quadrant.',
    avatarUrl: 'https://picsum.photos/200/200?random=6',
    diagnosis: 'Acute Appendicitis',
    initialVitals: { bp: '110/65', hr: 88, rr: 18, temp: 37.8, o2: 99 },
    tags: ['Pediatric', 'Emergency'],
    systemInstruction: `
      You are Timmy, 12M.
      Symptoms: Belly hurt around belly button, now hurts "down here" (points to right side). Hurts to walk or jump. Vomited once.
      Personality: Scared, wants mom, answers simply.
    `
  },
  {
    id: 'gastro-003',
    patientName: 'Jessica Jones',
    age: 28,
    gender: 'Female',
    category: 'Gastroenterology',
    role: 'Doctor',
    chiefComplaint: 'Bloody diarrhea',
    difficulty: Difficulty.Intermediate,
    description: '28F with 4 weeks of abdominal cramping and bloody stool. Recent weight loss.',
    avatarUrl: 'https://picsum.photos/200/200?random=36',
    diagnosis: 'Ulcerative Colitis Flare',
    initialVitals: { bp: '115/75', hr: 90, rr: 18, temp: 37.5, o2: 99 },
    tags: ['Chronic', 'Autoimmune'],
    systemInstruction: `
      You are Jessica, 28F.
      Symptoms: Urgent need to go to bathroom 10x a day. Blood and mucus in stool. Belly cramps. Lost 10 lbs.
      History: Non-smoker.
      Personality: Embarrassed, tired.
    `
  },
  {
    id: 'gastro-004',
    patientName: 'Harry Potter',
    age: 45,
    gender: 'Male',
    category: 'Gastroenterology',
    role: 'Paramedic',
    chiefComplaint: 'Vomiting blood',
    difficulty: Difficulty.Advanced,
    description: 'Called to a bar. 45M vomiting bright red blood. Signs of liver stigmata.',
    avatarUrl: 'https://picsum.photos/200/200?random=37',
    diagnosis: 'Esophageal Varices Rupture',
    initialVitals: { bp: '80/40', hr: 120, rr: 24, temp: 36.2, o2: 94 },
    tags: ['Hemorrhage', 'Critical'],
    systemInstruction: `
      You are Harry, 45M.
      Symptoms: Vomited large amount of blood (cupfuls). Feeling very dizzy and cold.
      History: Chronic alcoholism.
      Personality: Confused, lethargic, slurring words (encephalopathy).
    `
  },

  // --- NEUROLOGY (4) ---
  {
    id: 'neuro-001',
    patientName: 'Alice Cooper',
    age: 78,
    gender: 'Female',
    category: 'Neurology',
    role: 'Paramedic',
    chiefComplaint: 'Slurred speech',
    difficulty: Difficulty.Novice,
    description: 'Called to a nursing home. 78F found by staff with facial droop and left-sided weakness.',
    avatarUrl: 'https://picsum.photos/200/200?random=7',
    diagnosis: 'Acute Ischemic Stroke (R-MCA)',
    initialVitals: { bp: '180/100', hr: 78, rr: 16, temp: 36.7, o2: 97 },
    tags: ['Stroke Alert', 'Geriatric'],
    systemInstruction: `
      You are Alice Cooper, 78F.
      Symptoms: You try to speak but words come out wrong (dysarthria/aphasia). You cannot move your left arm well. You feel fine otherwise, just confused why people are rushing.
      Personality: Confused, frustrated that you can't talk.
    `
  },
  {
    id: 'neuro-002',
    patientName: 'David Wright',
    age: 29,
    gender: 'Male',
    category: 'Neurology',
    role: 'Doctor',
    chiefComplaint: 'Worst headache of life',
    difficulty: Difficulty.Advanced,
    description: '29M presents with sudden onset "thunderclap" headache while lifting weights.',
    avatarUrl: 'https://picsum.photos/200/200?random=8',
    diagnosis: 'Subarachnoid Hemorrhage',
    initialVitals: { bp: '160/95', hr: 110, rr: 20, temp: 37.0, o2: 98 },
    tags: ['Emergency', 'Critical'],
    systemInstruction: `
      You are David Wright, 29M.
      Symptoms: Instant, 10/10 headache at back of head. Started 1 hour ago at gym. Neck feels stiff. Light hurts eyes (photophobia).
      History: None.
      Personality: In extreme pain, holding head, eyes closed.
    `
  },
  {
    id: 'neuro-003',
    patientName: 'Mary Jane',
    age: 21,
    gender: 'Female',
    category: 'Neurology',
    role: 'Doctor',
    chiefComplaint: 'Double vision and weakness',
    difficulty: Difficulty.Advanced,
    description: '21F complains of double vision that gets worse at end of day, and difficulty swallowing.',
    avatarUrl: 'https://picsum.photos/200/200?random=38',
    diagnosis: 'Myasthenia Gravis',
    initialVitals: { bp: '120/70', hr: 80, rr: 16, temp: 36.8, o2: 98 },
    tags: ['Autoimmune', 'Rare'],
    systemInstruction: `
      You are Mary, 21F.
      Symptoms: Eyelids feel heavy (ptosis). See two of everything in evening. Hard to chew dinner. Arms feel weak after blow drying hair.
      Personality: Tired, voice sounds nasal/soft.
    `
  },
  {
    id: 'neuro-004',
    patientName: 'Bruce Banner',
    age: 40,
    gender: 'Male',
    category: 'Neurology',
    role: 'Nurse',
    chiefComplaint: 'Seizure',
    difficulty: Difficulty.Novice,
    description: '40M post-ictal in ER after witnessed tonic-clonic seizure.',
    avatarUrl: 'https://picsum.photos/200/200?random=39',
    diagnosis: 'Epilepsy (Breakthrough Seizure)',
    initialVitals: { bp: '130/80', hr: 95, rr: 18, temp: 37.1, o2: 96 },
    tags: ['Post-ictal'],
    systemInstruction: `
      You are Bruce, 40M.
      Symptoms: Woke up in ER. Muscle soreness. Bit tongue. Don't remember what happened.
      History: Epilepsy. Missed meds yesterday.
      Personality: Groggy, confused, asking "Where am I?".
    `
  },

  // --- TRAUMA (4) ---
  {
    id: 'trauma-001',
    patientName: 'John Doe',
    age: 25,
    gender: 'Male',
    category: 'Trauma',
    role: 'Paramedic',
    chiefComplaint: 'Motorcycle accident',
    difficulty: Difficulty.Advanced,
    description: '25M motorcyclist struck by car. Wearing helmet. Complains of pelvic pain.',
    avatarUrl: 'https://picsum.photos/200/200?random=10',
    diagnosis: 'Unstable Pelvic Fracture / Internal Bleeding',
    initialVitals: { bp: '88/50', hr: 135, rr: 28, temp: 36.0, o2: 95 },
    tags: ['Trauma', 'Shock'],
    systemInstruction: `
      You are John Doe, 25M.
      Situation: Hit by car. Lying on asphalt.
      Symptoms: Severe pain in hips. Feel cold and sleepy.
      Personality: In shock. Anxious. Asking "Is my bike okay?"
    `
  },
  {
    id: 'trauma-002',
    patientName: 'Lara Croft',
    age: 30,
    gender: 'Female',
    category: 'Trauma',
    role: 'Doctor',
    chiefComplaint: 'Fall from height',
    difficulty: Difficulty.Intermediate,
    description: '30F fell from a ladder (10ft). Complains of left chest pain and shortness of breath.',
    avatarUrl: 'https://picsum.photos/200/200?random=40',
    diagnosis: 'Pneumothorax (Left)',
    initialVitals: { bp: '110/70', hr: 100, rr: 24, temp: 36.8, o2: 92 },
    tags: ['Trauma', 'Respiratory'],
    systemInstruction: `
      You are Lara, 30F.
      Symptoms: Sharp pain left chest. Hard to breathe.
      History: Healthy.
      Personality: Tough, trying to minimize pain, but grimacing.
    `
  },
  {
    id: 'trauma-003',
    patientName: 'Mike Tyson',
    age: 22,
    gender: 'Male',
    category: 'Trauma',
    role: 'Nurse',
    chiefComplaint: 'Stab wound',
    difficulty: Difficulty.Advanced,
    description: '22M walk-in to ER with stab wound to right thigh. Towel wrapped around leg.',
    avatarUrl: 'https://picsum.photos/200/200?random=41',
    diagnosis: 'Femoral Artery Laceration',
    initialVitals: { bp: '95/60', hr: 115, rr: 20, temp: 36.5, o2: 98 },
    tags: ['Hemorrhage', 'Emergency'],
    systemInstruction: `
      You are Mike, 22M.
      Symptoms: Bleeding through towel. Feeling lightheaded.
      Situation: Stabbed in bar fight.
      Personality: Aggressive initially due to fear, but becoming weaker/sleepy.
    `
  },
  {
    id: 'trauma-004',
    patientName: 'Grandma Betty',
    age: 85,
    gender: 'Female',
    category: 'Trauma',
    role: 'Doctor',
    chiefComplaint: 'Hip pain after fall',
    difficulty: Difficulty.Novice,
    description: '85F tripped on rug. Cannot bear weight on right leg. Leg appears shortened and externally rotated.',
    avatarUrl: 'https://picsum.photos/200/200?random=42',
    diagnosis: 'Femoral Neck Fracture',
    initialVitals: { bp: '150/90', hr: 85, rr: 18, temp: 36.9, o2: 97 },
    tags: ['Geriatric', 'Ortho'],
    systemInstruction: `
      You are Betty, 85F.
      Symptoms: Right groin pain. Cannot move leg.
      Personality: Sweet old lady, worried about her cat at home.
    `
  },

  // --- ENDOCRINOLOGY (3) ---
  {
    id: 'endo-001',
    patientName: 'Jennifer Lopez',
    age: 19,
    gender: 'Female',
    category: 'Endocrinology',
    role: 'Nurse',
    chiefComplaint: 'Vomiting and confusion',
    difficulty: Difficulty.Intermediate,
    description: '19F brought in by roommates. Drowsy, fruity odor on breath, deep rapid breathing.',
    avatarUrl: 'https://picsum.photos/200/200?random=9',
    diagnosis: 'Diabetic Ketoacidosis (DKA)',
    initialVitals: { bp: '100/60', hr: 125, rr: 32, temp: 37.2, o2: 96 },
    tags: ['Metabolic', 'Critical'],
    systemInstruction: `
      You are Jennifer, 19F.
      Symptoms: Feeling very weak, thirsty, peeing a lot earlier, now just sick to stomach.
      History: Type 1 Diabetes (ran out of insulin due to cost).
      Personality: Drowsy, slow to answer, confused.
    `
  },
  {
    id: 'endo-002',
    patientName: 'Ursula K.',
    age: 45,
    gender: 'Female',
    category: 'Endocrinology',
    role: 'Doctor',
    chiefComplaint: 'Weight gain and fatigue',
    difficulty: Difficulty.Novice,
    description: '45F reports 20lb weight gain over 3 months, hair loss, and feeling cold.',
    avatarUrl: 'https://picsum.photos/200/200?random=43',
    diagnosis: 'Hypothyroidism (Hashimoto\'s)',
    initialVitals: { bp: '110/70', hr: 58, rr: 16, temp: 36.0, o2: 98 },
    tags: ['Chronic', 'Outpatient'],
    systemInstruction: `
      You are Ursula, 45F.
      Symptoms: Always tired. Gained weight despite eating less. Constipated. Hair falling out. Freezing cold when others are warm.
      Personality: Depressed affect, slow speech.
    `
  },
  {
    id: 'endo-003',
    patientName: 'Tom Riddle',
    age: 60,
    gender: 'Male',
    category: 'Endocrinology',
    role: 'Paramedic',
    chiefComplaint: 'Unresponsive',
    difficulty: Difficulty.Intermediate,
    description: '60M found unresponsive at work. Wearing a medical bracelet.',
    avatarUrl: 'https://picsum.photos/200/200?random=44',
    diagnosis: 'Severe Hypoglycemia',
    initialVitals: { bp: '130/80', hr: 100, rr: 18, temp: 36.5, o2: 98 },
    tags: ['Metabolic', 'Emergency'],
    systemInstruction: `
      You are Tom, 60M.
      Currently: You are unconscious. You cannot speak until you receive sugar/dextrose.
      Once treated: You wake up confused, asking what happened. You took your insulin but missed lunch.
    `
  },

  // --- PSYCHIATRY (4) ---
  {
    id: 'psych-001',
    patientName: 'Vincent Black',
    age: 40,
    gender: 'Male',
    category: 'Psychiatry',
    role: 'Doctor',
    chiefComplaint: 'Hearing voices',
    difficulty: Difficulty.Intermediate,
    description: '40M brought by police for acting erratically. Appears agitated and paranoid.',
    avatarUrl: 'https://picsum.photos/200/200?random=11',
    diagnosis: 'Paranoid Schizophrenia Exacerbation',
    initialVitals: { bp: '140/85', hr: 95, rr: 18, temp: 37.0, o2: 98 },
    tags: ['Mental Health'],
    systemInstruction: `
      You are Vincent Black, 40M.
      Symptoms: Voices telling you the CIA is watching. You stopped taking meds because they are "poison".
      Personality: Suspicious, avoids eye contact, speaks in riddles.
    `
  },
  {
    id: 'psych-002',
    patientName: 'Emily Rose',
    age: 22,
    gender: 'Female',
    category: 'Psychiatry',
    role: 'Nurse',
    chiefComplaint: 'Panic attack',
    difficulty: Difficulty.Novice,
    description: '22F presents to triage hyperventilating, tingling in hands, feeling of impending doom.',
    avatarUrl: 'https://picsum.photos/200/200?random=14',
    diagnosis: 'Severe Panic Attack / Anxiety',
    initialVitals: { bp: '130/85', hr: 110, rr: 30, temp: 36.8, o2: 99 },
    tags: ['Anxiety', 'Triage'],
    systemInstruction: `
      You are Emily, 22F.
      Symptoms: Can't breathe, hands are numb/tingling, feel like you are dying or going crazy.
      History: General anxiety.
      Personality: Rapid speech, crying, needs reassurance.
    `
  },
  {
    id: 'psych-003',
    patientName: 'Kurt Cobain',
    age: 27,
    gender: 'Male',
    category: 'Psychiatry',
    role: 'Doctor',
    chiefComplaint: 'Overdose',
    difficulty: Difficulty.Advanced,
    description: '27M brought in by friend after taking "a bottle of pills". Lethargic.',
    avatarUrl: 'https://picsum.photos/200/200?random=45',
    diagnosis: 'Tricyclic Antidepressant Overdose / Suicide Attempt',
    initialVitals: { bp: '90/60', hr: 120, rr: 14, temp: 37.5, o2: 95 },
    tags: ['Toxicology', 'Critical'],
    systemInstruction: `
      You are Kurt, 27M.
      Symptoms: Very dry mouth, blurry vision, sleepy.
      Action: You took Amitriptyline.
      Personality: Withdrawn, refuses to answer initially. "Just let me sleep."
    `
  },
  {
    id: 'psych-004',
    patientName: 'Britney S.',
    age: 30,
    gender: 'Female',
    category: 'Psychiatry',
    role: 'Doctor',
    chiefComplaint: 'Hasn\'t slept in 4 days',
    difficulty: Difficulty.Intermediate,
    description: '30F brought by family. Speaking very fast, spending money recklessly, grandiose delusions.',
    avatarUrl: 'https://picsum.photos/200/200?random=46',
    diagnosis: 'Bipolar I Manic Episode',
    initialVitals: { bp: '140/90', hr: 110, rr: 22, temp: 37.2, o2: 99 },
    tags: ['Mania'],
    systemInstruction: `
      You are Britney, 30F.
      Symptoms: Feel amazing, full of energy. Writing a novel, starting a business. Don't need sleep.
      Personality: Hyperactive, flight of ideas (jumping topics), easily distracted.
    `
  },

  // --- PEDIATRICS (4) ---
  {
    id: 'peds-001',
    patientName: 'Noah Smith',
    age: 4,
    gender: 'Male',
    category: 'Pediatrics',
    role: 'Doctor',
    chiefComplaint: 'Barking cough',
    difficulty: Difficulty.Novice,
    description: '4-year-old male brought by parents with a seal-like bark cough and stridor at night.',
    avatarUrl: 'https://picsum.photos/200/200?random=15',
    diagnosis: 'Croup (Laryngotracheobronchitis)',
    initialVitals: { bp: '100/60', hr: 115, rr: 28, temp: 38.0, o2: 95 },
    tags: ['Infectious', 'Pediatric'],
    systemInstruction: `
      You are Noah's Mom (acting as the historian). Noah is 4.
      Symptoms: He woke up making a sound like a seal. He has trouble breathing in (stridor). He had a runny nose for 2 days.
      Personality: Worried mother, holding the child.
    `
  },
  {
    id: 'peds-002',
    patientName: 'Lily Potter',
    age: 8,
    gender: 'Female',
    category: 'Pediatrics',
    role: 'Doctor',
    chiefComplaint: 'Rash and fever',
    difficulty: Difficulty.Intermediate,
    description: '8F with sore throat, fever, and a sandpaper-like rash on chest.',
    avatarUrl: 'https://picsum.photos/200/200?random=47',
    diagnosis: 'Scarlet Fever (Strep Throat)',
    initialVitals: { bp: '100/60', hr: 110, rr: 20, temp: 38.9, o2: 98 },
    tags: ['Infectious', 'Pediatric'],
    systemInstruction: `
      You are Lily, 8F.
      Symptoms: Throat hurts really bad. Rash feels rough/itchy. Tongue looks red (strawberry tongue).
      Personality: Quiet, shy, holding throat.
    `
  }
];