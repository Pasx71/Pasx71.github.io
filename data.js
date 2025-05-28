// data.js

// --- Likert Scale Configuration (from config.py) ---
const MIN_LIKERT_SCORE = 1;
const MAX_LIKERT_SCORE = 6;
const MID_LIKERT_POINT = (MIN_LIKERT_SCORE + MAX_LIKERT_SCORE) / 2.0;
const GRAY_AREA_DELTA = 0.75; // For alternatives (can implement later)

// --- Question Counts (from config.py) ---
const QUESTIONS_PER_STANDARD_AXIS = 10;
const QUESTIONS_FOR_MOTIVATIONAL_AXIS = 15;

// --- Axis Definitions (from config.py) ---
const PRIMARY_AXIS_CODES_FOR_QUESTIONS = {
    'E': "Extraversion", 'O': "Openness", 'A': "Agreeableness", 'TF': "Thinking/Feeling",
    'C': "Conscientiousness", 'N': "Neuroticism", 'M': "Motivational Style",
    'Na': "Narcissism", 'Ma': "Machiavellianism", 'Ps': "Psychopathy",
    'Ax': "Attachment Anxiety", 'Av': "Attachment Avoidance", 'As': "Assertiveness",
    'Ag': "Aggressiveness",
};
const MOTIVATIONAL_SUB_AXES_CODES = {
    'M_H': "Motivational Head", 'M_G': "Motivational Gut", 'M_R': "Motivational Heart",
};
const ALL_SCORABLE_AXES_DEFINITIONS = {
    ...PRIMARY_AXIS_CODES_FOR_QUESTIONS, // Spreads the keys from primary
    ...MOTIVATIONAL_SUB_AXES_CODES   // Spreads the keys from motivational sub-axes
};
// Remove 'M' as it's not directly scorable, but its sub-axes are
delete ALL_SCORABLE_AXES_DEFINITIONS['M'];

const PERSONALITY_CODE_AXES_ORDER = [
    'E', 'A', 'C', 'N',       // Group 1 (Core)
    'O', 'TF', 'M_H',         // Group 2 (Suffix)
    'M_G', 'M_R', 'As', 'Ag', // Group 3 (Prefix)
    'Na', 'Ma', 'Ps', 'Ax', 'Av' // Group 4 (Part 4 Qualifier)
];

const TRAIT_GROUPINGS = { // Simplified for JS example
    "group1": { "name": "Foundational Temperament & Self-Regulation", "codes": PERSONALITY_CODE_AXES_ORDER.slice(0,4) },
    "group2": { "name": "Cognitive & Perceptual Style", "codes": PERSONALITY_CODE_AXES_ORDER.slice(4,7) },
    "group3": { "name": "Drive, Action & Interpersonal Influence Style", "codes": PERSONALITY_CODE_AXES_ORDER.slice(7,11) },
    "group4": { "name": "Complex Relational & Self-Identity Patterns", "codes": PERSONALITY_CODE_AXES_ORDER.slice(11,16) }
};


// --- Questions (from questions.py) ---
const QUESTIONS_BANK = {
    'E': [
        {"text": "I feel energized when I am around other people.", "reverse": false},
        {"text": "I enjoy being the center of attention.", "reverse": false},
        {"text": "I prefer lively social gatherings to quiet evenings alone.", "reverse": false},
        {"text": "I often initiate conversations with strangers.", "reverse": false},
        {"text": "I feel drained after spending time with many people.", "reverse": true},
        {"text": "I enjoy solitary activities more than social ones.", "reverse": true},
        {"text": "I find it easy to approach new people.", "reverse": false},
        {"text": "I often seek excitement and thrills.", "reverse": false},
        {"text": "I prefer working in teams rather than alone.", "reverse": false},
        {"text": "I avoid social events when possible.", "reverse": true},
    ],
    'O': [
        {"text": "I enjoy trying new and unusual experiences.", "reverse": false},
        {"text": "I like to explore new ideas and concepts.", "reverse": false},
        {"text": "I prefer variety over routine in my daily life.", "reverse": false},
        {"text": "I often think about abstract or philosophical topics.", "reverse": false},
        {"text": "I find new ways of doing things exciting.", "reverse": false},
        {"text": "I prefer familiar activities and environments.", "reverse": true},
        {"text": "I avoid changing my habits whenever possible.", "reverse": true},
        {"text": "I enjoy creative pursuits such as art or music.", "reverse": false},
        {"text": "I like to question traditional ways of thinking.", "reverse": false},
        {"text": "I am generally open to alternative viewpoints.", "reverse": false},
    ],
    'A': [
        {"text": "I trust others easily.", "reverse": false},
        {"text": "I am kind and considerate toward others.", "reverse": false},
        {"text": "I avoid arguments and conflicts.", "reverse": false},
        {"text": "I am sympathetic to other people’s feelings.", "reverse": false},
        {"text": "I am generally cooperative and easy to get along with.", "reverse": false},
        {"text": "I sometimes manipulate others to get what I want.", "reverse": true},
        {"text": "I can be skeptical of others’ intentions.", "reverse": true},
        {"text": "I sometimes act selfishly without concern for others.", "reverse": true},
        {"text": "I tend to forgive others easily.", "reverse": false},
        {"text": "I try to be helpful even when it’s inconvenient.", "reverse": false},
    ],
    'TF': [
        {"text": "I make decisions based on logic rather than emotions.", "reverse": false},
        {"text": "I value fairness and justice over personal feelings.", "reverse": false},
        {"text": "I try to stay objective in difficult situations.", "reverse": false},
        {"text": "I am comfortable expressing my emotions openly.", "reverse": true},
        {"text": "I consider the impact on people before making decisions.", "reverse": true},
        {"text": "I tend to prioritize harmony over strict rules.", "reverse": true},
        {"text": "I rely on my feelings to guide my choices.", "reverse": true},
        {"text": "I am quick to analyze problems logically.", "reverse": false},
        {"text": "I find it hard to separate feelings from facts.", "reverse": true},
        {"text": "I prefer clear criteria over emotional considerations.", "reverse": false},
    ],
    'C': [
        {"text": "I am well organized and like to plan ahead.", "reverse": false},
        {"text": "I follow rules and procedures carefully.", "reverse": false},
        {"text": "I complete tasks thoroughly and on time.", "reverse": false},
        {"text": "I often procrastinate important tasks.", "reverse": true},
        {"text": "I keep my living and working space neat.", "reverse": false},
        {"text": "I am reliable and can be counted on.", "reverse": false},
        {"text": "I sometimes act without thinking about consequences.", "reverse": true},
        {"text": "I stick to my commitments even when it’s difficult.", "reverse": false},
        {"text": "I am detail-oriented and careful in my work.", "reverse": false},
        {"text": "I like to set clear goals and work steadily toward them.", "reverse": false},
    ],
    'N': [
        {"text": "I often feel anxious or worried.", "reverse": false},
        {"text": "I get upset easily over small things.", "reverse": false},
        {"text": "I frequently feel tense or stressed.", "reverse": false},
        {"text": "I remain calm even in difficult situations.", "reverse": true},
        {"text": "I tend to overthink problems and mistakes.", "reverse": false},
        {"text": "I am emotionally stable most of the time.", "reverse": true},
        {"text": "I sometimes feel overwhelmed by my emotions.", "reverse": false},
        {"text": "I recover quickly from stressful events.", "reverse": true},
        {"text": "I am prone to mood swings.", "reverse": false},
        {"text": "I handle criticism well without getting defensive.", "reverse": true},
    ],
    'M': [
        {"text": "I prefer to analyze situations before acting.", "reverse": false, "sub_axis": "H"},
        {"text": "I value knowledge and understanding above all.", "reverse": false, "sub_axis": "H"},
        {"text": "I enjoy thinking through complex problems.", "reverse": false, "sub_axis": "H"},
        {"text": "I often rely on logic to guide me.", "reverse": false, "sub_axis": "H"},
        {"text": "I tend to withdraw when overwhelmed emotionally.", "reverse": false, "sub_axis": "H"},
        {"text": "I trust my instincts when making decisions.", "reverse": false, "sub_axis": "G"},
        {"text": "I react quickly in stressful situations.", "reverse": false, "sub_axis": "G"},
        {"text": "I prefer to act decisively rather than hesitate.", "reverse": false, "sub_axis": "G"},
        {"text": "I am sensitive to feelings of anger or discomfort in my body.", "reverse": false, "sub_axis": "G"},
        {"text": "I like to keep control over my environment.", "reverse": false, "sub_axis": "G"},
        {"text": "I am deeply aware of my own emotions.", "reverse": false, "sub_axis": "R"},
        {"text": "I empathize strongly with others’ feelings.", "reverse": false, "sub_axis": "R"},
        {"text": "I often feel motivated by love or compassion.", "reverse": false, "sub_axis": "R"},
        {"text": "I express my emotions openly and honestly.", "reverse": false, "sub_axis": "R"},
        {"text": "I seek meaningful connections with people.", "reverse": false, "sub_axis": "R"},
    ],
    'Na': [
        {"text": "I enjoy being the center of attention.", "reverse": false},
        {"text": "I believe I am more special than most people.", "reverse": false},
        {"text": "I often fantasize about being admired.", "reverse": false},
        {"text": "I take advantage of others to get ahead.", "reverse": false},
        {"text": "I feel entitled to special treatment.", "reverse": false},
        {"text": "I tend to be humble.", "reverse": true},
        {"text": "I consider myself better than average.", "reverse": false},
        {"text": "I crave praise and recognition.", "reverse": false},
        {"text": "I lack empathy for others.", "reverse": false},
        {"text": "I admit my mistakes openly.", "reverse": true},
    ],
    'Ma': [
        {"text": "I believe it is wise to manipulate others to get what I want.", "reverse": false},
        {"text": "I am willing to lie to achieve my goals.", "reverse": false},
        {"text": "I avoid trusting others easily.", "reverse": false},
        {"text": "I enjoy controlling social situations.", "reverse": false},
        {"text": "I often think others are selfish.", "reverse": false},
        {"text": "I treat people as tools for my own benefit.", "reverse": false},
        {"text": "I am cautious about revealing my true intentions.", "reverse": false},
        {"text": "I believe the ends justify the means.", "reverse": false},
        {"text": "I prefer honesty even if it hurts.", "reverse": true},
        {"text": "I try to avoid hurting others unnecessarily.", "reverse": true},
    ],
    'Ps': [
        {"text": "I often act impulsively without thinking of consequences.", "reverse": false},
        {"text": "I find it easy to lie and deceive others.", "reverse": false},
        {"text": "I lack remorse after hurting someone.", "reverse": false},
        {"text": "I am often reckless in my actions.", "reverse": false},
        {"text": "I enjoy taking risks that others avoid.", "reverse": false},
        {"text": "I feel guilt when I harm others.", "reverse": true},
        {"text": "I can be cold and unemotional.", "reverse": false},
        {"text": "I tend to be charming and persuasive.", "reverse": false},
        {"text": "I am indifferent to rules and laws.", "reverse": false},
        {"text": "I often ignore others’ feelings.", "reverse": false},
    ],
    'Ax': [
        {"text": "I worry that others don’t really love me.", "reverse": false},
        {"text": "I am afraid of being abandoned.", "reverse": false},
        {"text": "I often feel insecure in relationships.", "reverse": false},
        {"text": "I need a lot of reassurance from my partner.", "reverse": false},
        {"text": "I get jealous easily.", "reverse": false},
        {"text": "I feel comfortable being independent.", "reverse": true},
        {"text": "I trust my partner to be there for me.", "reverse": true},
        {"text": "I do not fear rejection.", "reverse": true},
        {"text": "I sometimes cling to people too tightly.", "reverse": false},
        {"text": "I am confident in my relationships.", "reverse": true},
    ],
    'Av': [
        {"text": "I feel uncomfortable getting close to others.", "reverse": false},
        {"text": "I prefer to keep my distance emotionally.", "reverse": false},
        {"text": "I avoid depending on others.", "reverse": false},
        {"text": "I find it hard to trust people.", "reverse": false},
        {"text": "I like to be self-reliant.", "reverse": false},
        {"text": "I enjoy being emotionally intimate with others.", "reverse": true},
        {"text": "I seek out deep emotional connections.", "reverse": true},
        {"text": "I worry about losing my independence.", "reverse": false},
        {"text": "I find it difficult to open up to people.", "reverse": false},
        {"text": "I prefer to handle problems on my own.", "reverse": false},
    ],
    'As': [
        {"text": "I stand up for myself in difficult situations.", "reverse": false},
        {"text": "I express my opinions confidently.", "reverse": false},
        {"text": "I find it easy to say no to others.", "reverse": false},
        {"text": "I tend to avoid confrontation.", "reverse": true},
        {"text": "I take initiative in group settings.", "reverse": false},
        {"text": "I speak clearly and directly.", "reverse": false},
        {"text": "I sometimes let others push me around.", "reverse": true},
        {"text": "I feel comfortable leading others.", "reverse": false},
        {"text": "I struggle to voice my needs.", "reverse": true},
        {"text": "I am decisive and firm in my choices.", "reverse": false},
    ],
    'Ag': [
        {"text": "I get angry easily.", "reverse": false},
        {"text": "I often argue with others.", "reverse": false},
        {"text": "I express my frustration openly.", "reverse": false},
        {"text": "I prefer to avoid conflict.", "reverse": true},
        {"text": "I sometimes use intimidation to get my way.", "reverse": false},
        {"text": "I tend to hold grudges.", "reverse": false},
        {"text": "I am quick to confront people who upset me.", "reverse": false},
        {"text": "I control my anger well.", "reverse": true},
        {"text": "I am usually calm even under stress.", "reverse": true},
        {"text": "I am competitive and assertive.", "reverse": false},
    ],
};

// --- Blurbs (from blurbs.py) ---
const PREFIX_MODIFIERS_BLURBS = {
    "Vanguarding": "Leads with a bold, forward-thinking approach, often pushing boundaries, taking initiative, and venturing into new territory with energetic drive.",
    "Inspiring": "Motivates and uplifts others through vision, empathy, and encouragement, fostering enthusiasm and collective action towards a shared purpose.",
    "Challenging": "Questions the status quo by testing limits or through direct confrontation, aiming to provoke growth, assert boundaries, or drive change.",
    "Advancing": "Systematically progresses goals with determination and focused action, overcoming obstacles to achieve forward momentum.",
    "Guiding": "Offers direction, wisdom, and support to others, helping them navigate complexities and find their path with a clear, often principled approach.",
    "Transforming": "Acts as a catalyst for significant change and development, reshaping situations, perspectives, or systems through impactful intervention.",
    "Pioneering": "Ventures into uncharted territories with courage and an innovative spirit, establishing new methods, ideas, or pathways.",
    "Nurturing": "Fosters growth, well-being, and potential in others through care, support, and encouragement, creating a supportive environment.",
    "Driving": "Propels action with intense energy and a relentless focus on outcomes, often characterized by a powerful, forward-moving force.",
    "Persuading": "Influences others' thoughts, feelings, or actions through reasoned argument, emotional appeal, or compelling presence.",
    "Asserting": "Clearly and confidently expresses needs, opinions, and boundaries, standing firm in their position without undue aggression.",
    "Unifying": "Brings together diverse elements or individuals, fostering cohesion, collaboration, and shared understanding towards a common goal.",
    "Dynamic": "Displays vigorous activity and a forceful, energetic style, often adapting quickly and making a notable impact.",
    "Resolute": "Shows unwavering determination and firmness of purpose, maintaining their course despite difficulties or opposition.",
    "Empowering": "Enables and encourages others to realize their own strength, potential, and autonomy, often by delegating or fostering self-belief.",
    "Directing": "Provides clear, focused leadership and instruction, organizing efforts and guiding actions towards specific, well-defined objectives."
};

const CORE_PERSONALITIES_BLURBS = {
    "Architect": "A strategic and imaginative thinker who excels at creating complex systems, plans, and innovative solutions with foresight and precision.",
    "Sentinel": "A reliable, observant, and dutiful individual dedicated to maintaining order, upholding standards, and ensuring stability and security.",
    "Mediator": "An empathetic, idealistic, and diplomatic individual who seeks harmony and understanding, often working to reconcile differing perspectives.",
    "Commander": "A decisive, strategic, and assertive leader who confidently takes charge, organizes effectively, and drives towards ambitious goals.",
    "Advocate": "A principled and compassionate individual driven by strong convictions to speak up for others and champion meaningful causes.",
    "Virtuoso": "A hands-on, practical, and resourceful individual who excels at mastering tools and skills, often with an adaptable and experimental approach.",
    "Logician": "A deeply analytical and inventive thinker, fascinated by logical systems, abstract concepts, and the pursuit of knowledge and truth.",
    "Executive": "An organized, decisive, and efficient individual who excels at managing people and processes, implementing plans, and achieving tangible results.",
    "Harmonizer": "A warm, cooperative, and supportive individual who prioritizes interpersonal accord, fosters positive relationships, and creates a sense of community.",
    "Explorer": "An adventurous, energetic, and spontaneous individual who thrives on new experiences, variety, and the freedom to discover.",
    "Stabilizer": "A calm, consistent, and pragmatic presence who provides a sense of security and order, ensuring reliability and steady progress.",
    "Analyst": "A methodical, objective, and detail-oriented individual who excels at dissecting information, identifying patterns, and drawing logical conclusions.",
    "Catalyst": "An energetic and influential individual who initiates change, sparks new ideas, and motivates others to action, often challenging norms.",
    "Guardian": "A protective, responsible, and conscientious individual committed to safeguarding values, traditions, and the well-being of their community.",
    "Pragmatist": "A sensible, resourceful, and results-oriented individual who focuses on practical solutions and what works effectively in the real world.",
    "Idealist": "A visionary and principled individual, deeply committed to their values and a better future, often inspiring hope and striving for positive change."
};

const SUFFIX_MODIFIERS_BLURBS = {
    "Analyzing": "Approaches information with a logical, systematic, and in-depth cognitive style, adept at deconstructing complex problems.",
    "Reflecting": "Engages in deep introspection and thoughtful consideration, processing experiences and ideas internally before forming conclusions.",
    "Imagining": "Utilizes a creative and conceptual cognitive style, readily envisioning possibilities, alternatives, and novel ideas.",
    "Exploring": "Possesses an active and curious cognitive style, driven to seek out new information, experiences, and diverse perspectives, even within known boundaries if external openness is lower.",
    "Synthesizing": "Excels at integrating diverse ideas and information into new, coherent wholes, seeing patterns and connections.",
    "Structuring": "Prefers to organize information and concepts into clear frameworks and logical systems, bringing order to complexity.",
    "Conceptualizing": "Thinks in abstract terms, adept at forming theories, understanding broad principles, and grasping intangible ideas.",
    "Perceiving": "Maintains an open, receptive, and often intuitive cognitive stance, attuned to nuances and absorbing a wide range of sensory or emotional data."
};

const PART4_QUALIFIERS_BLURBS = {
    "Authentic-Presence": "Interacts with genuineness and transparency, with a core identity largely free from manipulative, grandiose, or insecure relational patterns.",
    "Independent-Resolve": "Demonstrates a firm commitment to self-reliance and emotional autonomy, preferring to navigate life with personal strength and less dependence on deep intimacy.",
    "Relational-Anchor": "Deeply values and seeks secure, close connections, often investing considerable emotional energy into maintaining important bonds and needing reassurance.",
    "Vigilant-Awareness": "Maintains a heightened alertness to social cues and relational dynamics, driven by a complex interplay of needing connection yet fearing vulnerability.",
    "Daring-Spirit": "Embraces risk, novelty, and excitement with an adventurous and often impulsive approach, sometimes with less regard for conventional consequences.",
    "Solitary-Strength": "Finds comfort and effectiveness in independence, often taking a detached, risk-tolerant path and relying on inner resources.",
    "Impetuous-Current": "Characterized by a tendency towards spontaneous actions in relationships, sometimes driven by impulsive emotional needs or reactions to perceived threats to connection.",
    "Rebellious-Heart": "Navigates relationships with a non-conformist and often conflicted style, challenging norms while simultaneously experiencing complex attachment needs.",
    "Strategic-Acumen": "Possesses a sharp ability to plan and maneuver effectively in social situations, often with foresight into interpersonal dynamics and outcomes.",
    "Guarded-Stance": "Maintains a cautious, distrustful, and self-protective approach to relationships, preferring emotional distance and strategic self-reliance.",
    "Cautious-Tactician": "Employs careful strategy and planning in social interactions, often driven by a need to manage relational anxieties and ensure favorable outcomes.",
    "Warying-Mind": "Approaches relationships with significant distrust and caution, often anticipating negative intentions while managing complex internal needs for both closeness and independence.",
    "Calculated-Engagement": "Interacts socially with forethought, strategic consideration, and a degree of emotional detachment, often weighing potential gains and risks.",
    "Detached-Observer": "Tends to view social situations and emotional expressions from an objective, sometimes emotionally distant and strategic standpoint, often preferring independence.",
    "Tenacious-Grip": "Pursues goals or maintains relational positions with intense, strategic, and sometimes impulsive persistence, potentially driven by underlying anxieties.",
    "Tenacious-Will": "Exhibits powerful, multifaceted determination in pursuing aims, driven by a complex interplay of strategic thinking, impulsivity, and deep-seated relational needs.",
    "Self-Possessed": "Exhibits a strong sense of self, confidence, and self-focus, often comfortable taking center stage and prioritizing personal ambitions.",
    "Assertive-Identity": "Clearly defines and upholds their sense of self and personal entitlements with confidence, often maintaining independence and a strong personal direction.",
    "Seeking-Validation": "Often looks to others for approval, admiration, and reassurance, with self-esteem and relational security closely tied to external feedback.",
    "Defensive-Presence": "Manages a self-focused identity alongside complex attachment needs (both anxious and avoidant), often resulting in protective or defensive interpersonal behaviors.",
    "Charming-Facade": "Often presents an engaging, likable, and persuasive exterior that can effectively attract attention and influence, though it may mask other underlying motives or a degree of impulsivity.",
    "Stoic-Reserve": "Maintains a composed, often self-possessed and emotionally detached exterior, navigating social risks with a degree of calculated independence.",
    "Unconventional-Lens": "Perceives and acts with a unique, attention-seeking, and often impulsive style, sometimes driven by anxious needs for connection or validation in non-standard ways.",
    "Pragmatic-Realist": "Navigates their complex internal landscape of self-focus, impulsivity, and varied attachment needs with a practical focus on what works for them in the moment.",
    "Ambitious-Self": "Driven by a strong need for achievement and recognition, strategically pursuing personal advancement and status with confidence.",
    "Dominant-Influence": "Asserts a confident, strategic, and independent leadership style, comfortable directing others and shaping outcomes to fit their vision.",
    "Magnetic-Influence": "Combines strategic charm with a relational drive for approval, capably drawing others in and influencing situations to meet personal and relational goals.",
    "Insightful-Edge": "Possesses a keen, often strategic, understanding of social dynamics, born from navigating a complex interplay of self-interest and multifaceted attachment needs.",
    "Exploitative-Intellect": "May utilize a sharp intellect, charm, and strategic thinking to manipulate situations or people for personal gain, often with a degree of detachment.",
    "Assertive-Stance": "Forcefully maintains their position and independence, driven by a potent combination of self-assurance, strategic thinking, and disregard for conventional constraints.",
    "Intense-Drive": "Characterized by a powerful and complex motivational force, stemming from high self-focus, strategic intent, impulsivity, and anxious relational energy.",
    "Dominant-Vector": "Represents an extremely potent and multifaceted personality, where high levels of self-focus, strategic thinking, impulsivity, and complex attachment needs create a strong, often overwhelming, directional force."
};

// --- Naming Maps (from naming_rules.py) ---
// For JS, map keys from tuples of booleans to strings like "true,false,true,false"
const CORE_PERSONALITY_MAP = {
    // N Negative (Stable leaning)
    "true,true,true,false": "Executive",
    "true,true,false,false": "Harmonizer",
    "true,false,true,false": "Commander",
    "true,false,false,false": "Pragmatist",
    "false,true,true,false": "Sentinel",
    "false,true,false,false": "Idealist",
    "false,false,true,false": "Architect",
    "false,false,false,false": "Analyst",

    // N Positive (Neuroticism/Sensitivity leaning)
    "true,true,true,true": "Catalyst",
    "true,true,false,true": "Explorer",
    "true,false,true,true": "Stabilizer",
    "true,false,false,true": "Virtuoso",
    "false,true,true,true": "Advocate",
    "false,true,false,true": "Mediator",
    "false,false,true,true": "Logician",
    "false,false,false,true": "Guardian"
};

const SUFFIX_MODIFIER_MAP = {
    "true,true,true": "Conceptualizing",
    "true,true,false": "Analyzing",
    "true,false,true": "Synthesizing",
    "true,false,false": "Imagining",
    "false,true,true": "Structuring",
    "false,true,false": "Reflecting",
    "false,false,true": "Perceiving",
    "false,false,false": "Exploring"
};

const PREFIX_MODIFIER_MAP = {
    // Ag Negative
    "false,false,false,false": "Guiding",
    "false,false,true,false": "Asserting",
    "false,true,false,false": "Nurturing",
    "false,true,true,false": "Inspiring",
    "true,false,false,false": "Dynamic",
    "true,false,true,false": "Vanguarding",
    "true,true,false,false": "Empowering",
    "true,true,true,false": "Advancing",

    // Ag Positive
    "false,false,false,true": "Challenging",
    "false,false,true,true": "Directing",
    "false,true,false,true": "Persuading",
    "false,true,true,true": "Unifying",
    "true,false,false,true": "Driving",
    "true,false,true,true": "Pioneering",
    "true,true,false,true": "Resolute",
    "true,true,true,true": "Transforming"
};

const PART4_QUALIFIER_MAP = {
    // Pattern: (na_pos, ma_pos, ps_pos, ax_pos, av_pos)
    // Keys: "na,ma,ps,ax,av" (true/false strings)

    // All Low (Secure, Authentic)
    "false,false,false,false,false": "Authentic-Presence",

    // Single Highs
    "true,false,false,false,false": "Self-Possessed",
    "false,true,false,false,false": "Strategic-Acumen",
    "false,false,true,false,false": "Daring-Spirit",
    "false,false,false,true,false": "Relational-Anchor",
    "false,false,false,false,true": "Independent-Resolve",

    // Dark Triad Pairs (Attachment Low)
    "true,true,false,false,false": "Ambitious-Self",
    "true,false,true,false,false": "Charming-Facade",
    "false,true,true,false,false": "Calculated-Engagement",

    // Attachment Pair (Dark Triad Low)
    "false,false,false,true,true": "Vigilant-Awareness",

    // Dark Triad All High (Attachment Low)
    "true,true,true,false,false": "Exploitative-Intellect",

    // Specific Na + Attachment
    "true,false,false,true,false": "Seeking-Validation",
    "true,false,false,false,true": "Assertive-Identity",

    // Specific Ma + Attachment
    "false,true,false,true,false": "Cautious-Tactician",
    "false,true,false,false,true": "Guarded-Stance",

    // Specific Ps + Attachment
    "false,false,true,true,false": "Impetuous-Current",
    "false,false,true,false,true": "Solitary-Strength",

    // Three Highs - Two Dark Triad + One Attachment
    "true,true,false,true,false": "Magnetic-Influence",   // Na+, Ma+, Ax+
    "true,true,false,false,true": "Dominant-Influence",   // Na+, Ma+, Av+
    "true,false,true,true,false": "Unconventional-Lens",  // Na+, Ps+, Ax+
    "true,false,true,false,true": "Stoic-Reserve",        // Na+, Ps+, Av+
    "false,true,true,true,false": "Tenacious-Grip",       // Ma+, Ps+, Ax+
    "false,true,true,false,true": "Detached-Observer",    // Ma+, Ps+, Av+

    // Three Highs - One Dark Triad + Both Attachment Anxious & Avoidant (Fearful)
    "true,false,false,true,true": "Defensive-Presence",   // Na+, Ax+, Av+
    "false,true,false,true,true": "Warying-Mind",         // Ma+, Ax+, Av+
    "false,false,true,true,true": "Rebellious-Heart",     // Ps+, Ax+, Av+

    // Four Highs
    "true,true,true,true,false": "Intense-Drive",        // Dark Triad high, Ax+
    "true,true,true,false,true": "Assertive-Stance",     // Dark Triad high, Av+
    "true,true,false,true,true": "Insightful-Edge",      // Na+, Ma+, Ax+, Av+
    "true,false,true,true,true": "Pragmatic-Realist",    // Na+, Ps+, Ax+, Av+
    "false,true,true,true,true": "Tenacious-Will",       // Ma+, Ps+, Ax+, Av+

    // All High
    "true,true,true,true,true": "Dominant-Vector"
};

const TRAIT_DESCRIPTIONS = {
    // --- Group 1: Foundational Temperament & Self-Regulation ---
    'E': { // Extraversion
        "Low": "Prefers solitary activities or small, familiar groups. Gains energy from quiet time and reflection. May be perceived as reserved or private.",
        "Moderate": "Balances social interaction with alone time effectively. Can enjoy both group settings and solitude, adapting to the situation.",
        "High": "Feels energized by social interaction and being around others. Often outgoing, talkative, and enjoys being the center of attention or leading groups."
    },
    'A': { // Agreeableness
        "Low": "Tends to be more competitive, skeptical, and assertive of own interests. May challenge others more readily and prioritize personal objectives.",
        "Moderate": "Balances cooperativeness with self-interest. Can be agreeable and helpful but will also stand their ground when necessary.",
        "High": "Is generally compassionate, cooperative, and trusting. Values harmony and tends to be helpful, considerate, and conflict-avoidant."
    },
    'C': { // Conscientiousness
        "Low": "Prefers spontaneity and flexibility over strict plans. May be more impulsive, less organized, and sometimes procrastinate or miss details.",
        "Moderate": "Balances organization with adaptability. Can be reliable and planful when needed but is also comfortable with some flexibility and spontaneity.",
        "High": "Is typically organized, dependable, and self-disciplined. Prefers order, plans ahead, and is diligent in completing tasks thoroughly."
    },
    'N': { // Neuroticism
        "Low": "Generally emotionally stable, calm, and resilient. Tends not to worry excessively and handles stress well. (Corresponds to High Emotional Stability).",
        "Moderate": "Experiences a normal range of emotions and stress responses. Can be sensitive at times but generally maintains emotional balance.",
        "High": "Tends to be emotionally sensitive, prone to experiencing anxiety, worry, or sadness more intensely or frequently. May react strongly to stressors."
    },

    // --- Group 2: Cognitive & Perceptual Style ---
    'O': { // Openness
        "Low": "Prefers familiar routines, practical matters, and conventional approaches. May be more down-to-earth and less interested in abstract ideas or novel experiences.",
        "Moderate": "Is open to new ideas and experiences but also values tradition and practicality. Balances curiosity with a preference for the known.",
        "High": "Is highly curious, imaginative, and appreciative of art, novelty, and variety. Enjoys exploring new ideas, values, and unconventional experiences."
    },
    'TF': { // Thinking/Feeling (Score on a spectrum)
        // For TF, 'Low' means Feeling-dominant, 'High' means Thinking-dominant
        "Low": "Tends to make decisions based on personal values, empathy, and the impact on others. Prioritizes harmony and emotional considerations. (Feeling-dominant)",
        "Moderate": "Integrates both logic and emotion in decision-making. Considers both objective facts and personal values, adapting their approach.",
        "High": "Tends to make decisions based on logic, objective analysis, and impartial principles. Prioritizes fairness and consistency over personal feelings. (Thinking-dominant)"
    },
    'M_H': { // Motivational Head
        "Low": "Relies less on deep analysis or extensive information gathering before acting. May prefer more intuitive or action-oriented approaches.",
        "Moderate": "Balances thinking and action. Engages in analysis when appropriate but is also comfortable acting on intuition or practical considerations.",
        "High": "Is motivated by understanding, knowledge, and logical analysis. Prefers to think things through, gather information, and strategize before acting."
    },

    // --- Group 3: Drive, Action & Interpersonal Influence Style ---
    'M_G': { // Motivational Gut
        "Low": "Tends to be more cautious and deliberate in action. May prefer to avoid immediate confrontation or control, relying on other strengths.",
        "Moderate": "Can act decisively from instinct when needed but also considers other factors. Balances gut feelings with planned approaches.",
        "High": "Is motivated by instinct, decisiveness, and a desire for control or immediate impact. Tends to react quickly and assertively from a gut level."
    },
    'M_R': { // Motivational Heart
        "Low": "Is less driven by deep emotional connections or empathic responses in their primary motivation. May focus more on tasks or logic.",
        "Moderate": "Values relationships and empathy but also balances these with other motivations like logic or action. Connects when appropriate.",
        "High": "Is motivated by empathy, compassion, and the desire for meaningful connections and positive impact on others. Values harmony and relational well-being."
    },
    'As': { // Assertiveness
        "Low": "Tends to be more compliant, passive, or conflict-avoidant. May find it difficult to express own needs or opinions directly, especially under pressure.",
        "Moderate": "Can express own needs and opinions when important but may not always take the lead or seek confrontation. Balances assertion with accommodation.",
        "High": "Confidently expresses own opinions, needs, and boundaries. Is comfortable taking initiative, leading, and standing up for themselves."
    },
    'Ag': { // Aggressiveness
        "Low": "Tends to be conflict-avoidant, patient, and less prone to anger or confrontational behavior. Prefers peaceful interactions.",
        "Moderate": "Can express frustration or stand firm when provoked but generally maintains control and prefers non-aggressive approaches.",
        "High": "May be quick to anger, prone to argument, or use a more forceful, confrontational, or intimidating style to achieve goals or express displeasure."
    },

    // --- Group 4: Complex Relational & Self-Identity Patterns ---
    'Na': { // Narcissism
        "Low": "Tends to be humble, less focused on self-admiration or seeking attention. May prioritize others' needs or a collective focus.",
        "Moderate": "Has a healthy sense of self-esteem and confidence without an excessive need for admiration or entitlement. Balances self-focus with others' perspectives.",
        "High": "Exhibits a strong focus on self, a need for admiration, and a sense of grandiosity or entitlement. May be charismatic but potentially lacking in empathy."
    },
    'Ma': { // Machiavellianism
        "Low": "Tends to be trusting, sincere, and straightforward in dealings. Values honesty and is less inclined towards strategic manipulation.",
        "Moderate": "Is aware of social dynamics and can be strategic when necessary, but generally prefers fair and direct interactions. Balances pragmatism with principles.",
        "High": "Views others with a degree of cynicism and is inclined towards strategic manipulation, and a belief that ends can justify the means to achieve personal goals."
    },
    'Ps': { // Psychopathy (Primary psychopathy traits like impulsivity, low empathy)
        "Low": "Tends to be empathetic, responsible, and risk-averse. Shows remorse for harmful actions and generally respects rules and others' feelings.",
        "Moderate": "May exhibit some impulsivity or a degree of detachment but generally operates within social norms and shows concern for others.",
        "High": "Characterized by impulsivity, thrill-seeking, lower empathy, and less remorse. May be charming but can also be callous or disregard rules and consequences."
    },
    'Ax': { // Attachment Anxiety
        "Low": "Feels secure in relationships and generally does not worry excessively about abandonment or partner's affection. Comfortable with interdependence.",
        "Moderate": "Experiences occasional relationship insecurities or needs for reassurance but generally maintains a balanced view of attachment and independence.",
        "High": "Often worries about relationship security, fears abandonment, and may need frequent reassurance. Highly values closeness and can be sensitive to perceived threats to the bond."
    },
    'Av': { // Attachment Avoidance
        "Low": "Is comfortable with emotional closeness, intimacy, and interdependence in relationships. Values connection and is open to vulnerability.",
        "Moderate": "Values independence but is also capable of forming close bonds. Balances self-reliance with intimacy, sometimes needing space.",
        "High": "Prefers emotional distance and self-reliance, often uncomfortable with deep intimacy or depending on others. Highly values independence and may suppress emotional needs."
    }
};


// Default names if a map lookup fails
const DEFAULT_PREFIX_MODIFIER = "Guiding";
const DEFAULT_CORE_PERSONALITY = "Analyst";
const DEFAULT_SUFFIX_MODIFIER = "Exploring";
const DEFAULT_PART4_QUALIFIER = "Authentic-Presence";
