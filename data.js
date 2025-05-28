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
const PREFIX_MODIFIERS_BLURBS = { /* Copy-paste from your blurbs.py */ };
const CORE_PERSONALITIES_BLURBS = { /* ... */ };
const SUFFIX_MODIFIERS_BLURBS = { /* ... */ };
const PART4_QUALIFIERS_BLURBS = { /* ... */ };
// Example:
PREFIX_MODIFIERS_BLURBS["Vanguarding"] = "Leads with a bold, forward-thinking approach...";
// ... (populate all blurbs)

// --- Naming Maps (from naming_rules.py) ---
// For JS, map keys from tuples of booleans to strings like "true,false,true,false"
const CORE_PERSONALITY_MAP = {
    "true,true,true,false": "Executive",
    "true,true,false,false": "Harmonizer",
    // ... (populate all 16 from initialize_core_personality_map)
};
const SUFFIX_MODIFIER_MAP = {
    "true,true,true": "Conceptualizing",
    // ... (populate all 8 from initialize_suffix_modifier_map)
};
const PREFIX_MODIFIER_MAP = {
    "false,false,false,false": "Guiding",
    // ... (populate all 16 from initialize_prefix_modifier_map)
};
const PART4_QUALIFIER_MAP = {
    "false,false,false,false,false": "Authentic-Presence",
    // ... (populate all 32 from initialize_part4_qualifier_map, including your filler logic if necessary)
    // Or, if the filler logic is too complex, ensure all 32 are manually mapped.
};

// Default names if a map lookup fails (from config.py name lists)
const DEFAULT_PREFIX_MODIFIER = "Guiding"; // Or pick one
const DEFAULT_CORE_PERSONALITY = "Analyst";
const DEFAULT_SUFFIX_MODIFIER = "Exploring";
const DEFAULT_PART4_QUALIFIER = "Authentic-Presence";
