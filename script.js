// script.js
document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questionsContainer');
    const quizForm = document.getElementById('quizForm');
    const resultsContainer = document.getElementById('resultsContainer');

    // --- Helper: Load Questions into HTML ---
    function loadQuestions() {
        let questionNumber = 0;
        for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
            if (QUESTIONS_BANK[axisCode]) {
                const groupDiv = document.createElement('div');
                groupDiv.classList.add('question-group');
                const groupTitle = document.createElement('h3');
                groupTitle.textContent = `${PRIMARY_AXIS_CODES_FOR_QUESTIONS[axisCode]} Questions`;
                groupDiv.appendChild(groupTitle);

                QUESTIONS_BANK[axisCode].forEach((q, index) => {
                    questionNumber++;
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('question-item');
                    itemDiv.innerHTML = `<p>${questionNumber}. ${q.text}</p>`;
                    
                    const scaleDiv = document.createElement('div');
                    scaleDiv.classList.add('likert-scale');

                    for (let i = MIN_LIKERT_SCORE; i <= MAX_LIKERT_SCORE; i++) {
                        const label = document.createElement('label');
                        const radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.name = `q_${axisCode}_${index}`;
                        radio.value = i;
                        radio.required = true; // Make sure every question is answered
                        
                        label.appendChild(document.createTextNode(i));
                        label.appendChild(radio);
                        scaleDiv.appendChild(label);
                    }
                    itemDiv.appendChild(scaleDiv);
                    groupDiv.appendChild(itemDiv);
                });
                questionsContainer.appendChild(groupDiv);
            }
        }
    }

    // --- Logic from archetype_system.py (ported to JS) ---

    function calculateAllScores(userResponses) {
        const allCalculatedScores = {};

        for (const axisCode in QUESTIONS_BANK) {
            if (axisCode === 'M') continue; // Handle 'M' separately

            const responses = userResponses[axisCode];
            if (!responses) {
                console.error(`Missing responses for axis: ${axisCode}`);
                // You might want to throw an error or handle this more gracefully
                return null; 
            }
            if (responses.length !== QUESTIONS_PER_STANDARD_AXIS) {
                 console.error(`Expected ${QUESTIONS_PER_STANDARD_AXIS} for ${axisCode}, got ${responses.length}`);
                 return null;
            }

            let currentAxisScoreSum = 0.0;
            QUESTIONS_BANK[axisCode].forEach((questionData, i) => {
                let responseVal = parseFloat(responses[i]);
                if (questionData.reverse) {
                    responseVal = (MAX_LIKERT_SCORE + MIN_LIKERT_SCORE) - responseVal;
                }
                currentAxisScoreSum += responseVal;
            });
            allCalculatedScores[axisCode] = currentAxisScoreSum / QUESTIONS_PER_STANDARD_AXIS;
        }

        // Handle Motivational Style 'M'
        if (QUESTIONS_BANK['M'] && userResponses['M']) {
            const mResponses = userResponses['M'];
             if (mResponses.length !== QUESTIONS_FOR_MOTIVATIONAL_AXIS) {
                console.error(`Expected ${QUESTIONS_FOR_MOTIVATIONAL_AXIS} for M, got ${mResponses.length}`);
                return null;
            }

            const subScoresSum = {'H': 0.0, 'G': 0.0, 'R': 0.0};
            const subScoresCount = {'H': 0, 'G': 0, 'R': 0};

            QUESTIONS_BANK['M'].forEach((questionData, i) => {
                let responseVal = parseFloat(mResponses[i]);
                const subAxisKey = questionData.sub_axis;

                if (questionData.reverse) { // Though 'M' questions aren't reversed in your Python
                    responseVal = (MAX_LIKERT_SCORE + MIN_LIKERT_SCORE) - responseVal;
                }
                subScoresSum[subAxisKey] += responseVal;
                subScoresCount[subAxisKey]++;
            });

            for (const subKey in subScoresSum) {
                if (subScoresCount[subKey] > 0) {
                    allCalculatedScores[`M_${subKey}`] = subScoresSum[subKey] / subScoresCount[subKey];
                } else {
                    console.error(`No questions/responses for M sub-axis M_${subKey}`);
                    return null;
                }
            }
        } else {
             console.error("Motivational 'M' questions or responses not found.");
             return null;
        }
        
        // Ensure all scorable axes are present
        for (const code of PERSONALITY_CODE_AXES_ORDER) {
            if (!(code in allCalculatedScores)) {
                 console.error(`Internal Error: Score for axis '${code}' was not calculated.`);
                 return null; // Or throw error
            }
        }
        return allCalculatedScores;
    }

    function generatePersonalityCode(calculatedScores) {
        let codeLetters = [];
        PERSONALITY_CODE_AXES_ORDER.forEach(axisCode => {
            const score = calculatedScores[axisCode];
            if (score === undefined) {
                console.error(`Score for '${axisCode}' not found for code gen.`);
                return; // Or throw
            }
            const letterToUse = axisCode.includes('_') ? axisCode.split('_')[1] : axisCode;
            codeLetters.push(score > MID_LIKERT_POINT ? letterToUse.toUpperCase() : letterToUse.toLowerCase());
        });
        return codeLetters.join("");
    }

    // --- Logic from naming_rules.py (ported to JS) ---
    // The MAP objects are in data.js
    function determinePrefixModifier(scores) {
        const mg_pos = scores['M_G'] > MID_LIKERT_POINT;
        const mr_pos = scores['M_R'] > MID_LIKERT_POINT;
        const as_pos = scores['As'] > MID_LIKERT_POINT;
        const ag_pos = scores['Ag'] > MID_LIKERT_POINT;
        const key = `${mg_pos},${mr_pos},${as_pos},${ag_pos}`;
        return PREFIX_MODIFIER_MAP[key] || DEFAULT_PREFIX_MODIFIER;
    }

    function determineCorePersonality(scores) {
        const e_pos = scores['E'] > MID_LIKERT_POINT;
        const a_pos = scores['A'] > MID_LIKERT_POINT;
        const c_pos = scores['C'] > MID_LIKERT_POINT;
        const n_pos = scores['N'] > MID_LIKERT_POINT;
        const key = `${e_pos},${a_pos},${c_pos},${n_pos}`;
        return CORE_PERSONALITY_MAP[key] || DEFAULT_CORE_PERSONALITY;
    }

    function determineSuffixModifier(scores) {
        const o_pos = scores['O'] > MID_LIKERT_POINT;
        const tf_is_thinking = scores['TF'] > MID_LIKERT_POINT;
        const mh_pos = scores['M_H'] > MID_LIKERT_POINT;
        const key = `${o_pos},${tf_is_thinking},${mh_pos}`;
        return SUFFIX_MODIFIER_MAP[key] || DEFAULT_SUFFIX_MODIFIER;
    }
    
    function determinePart4Qualifier(scores) {
        const na_pos = scores['Na'] > MID_LIKERT_POINT;
        const ma_pos = scores['Ma'] > MID_LIKERT_POINT;
        const ps_pos = scores['Ps'] > MID_LIKERT_POINT;
        const ax_pos = scores['Ax'] > MID_LIKERT_POINT;
        const av_pos = scores['Av'] > MID_LIKERT_POINT;
        const key = `${na_pos},${ma_pos},${ps_pos},${ax_pos},${av_pos}`;
        return PART4_QUALIFIER_MAP[key] || DEFAULT_PART4_QUALIFIER;
    }


    function generateArchetypeNmeParts(calculatedScores) {
        const prefix = determinePrefixModifier(calculatedScores);
        const core = determineCorePersonality(calculatedScores);
        const suffix = determineSuffixModifier(calculatedScores);
        const part4 = determinePart4Qualifier(calculatedScores);
        return { prefix, core, suffix, part4 };
    }


    // --- Main Quiz Submission Handler ---
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(quizForm);
        const userResponses = {};

        // Initialize response arrays for each axis
        for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
            userResponses[axisCode] = [];
        }
        
        // Collate responses
        for (const [key, value] of formData.entries()) {
            // key is like "q_E_0"
            const parts = key.split('_'); // ["q", "E", "0"]
            const axisCode = parts[1];
            // const questionIndex = parseInt(parts[2]); // Not strictly needed here if order is preserved
            if(userResponses[axisCode]){
                 userResponses[axisCode].push(parseInt(value));
            } else {
                console.warn(`Unexpected form key: ${key}`);
            }
        }
        
        // Validate all questions answered (basic check - FormData only includes answered radio groups)
        // A more robust check would be to iterate over all expected question inputs
        let allAnswered = true;
        for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
            const expectedCount = axisCode === 'M' ? QUESTIONS_FOR_MOTIVATIONAL_AXIS : QUESTIONS_PER_STANDARD_AXIS;
            if (!userResponses[axisCode] || userResponses[axisCode].length !== expectedCount) {
                allAnswered = false;
                alert(`Please answer all questions for ${PRIMARY_AXIS_CODES_FOR_QUESTIONS[axisCode]}.`);
                break;
            }
        }
        if (!allAnswered) return;


        const calculatedScores = calculateAllScores(userResponses);
        if (!calculatedScores) {
            alert("There was an error calculating scores. Please check console.");
            return;
        }

        const personalityCode = generatePersonalityCode(calculatedScores);
        const nameParts = generateArchetypeNmeParts(calculatedScores);
        const fullArchetypeName = `${nameParts.prefix} ${nameParts.core} ${nameParts.suffix} with ${nameParts.part4}`;

        // Display results
        document.getElementById('archetypeName').textContent = fullArchetypeName;
        document.getElementById('personalityCode').textContent = personalityCode;

        document.getElementById('prefixName').textContent = nameParts.prefix;
        document.getElementById('prefixBlurb').textContent = PREFIX_MODIFIERS_BLURBS[nameParts.prefix] || "N/A";
        document.getElementById('coreName').textContent = nameParts.core;
        document.getElementById('coreBlurb').textContent = CORE_PERSONALITIES_BLURBS[nameParts.core] || "N/A";
        document.getElementById('suffixName').textContent = nameParts.suffix;
        document.getElementById('suffixBlurb').textContent = SUFFIX_MODIFIERS_BLURBS[nameParts.suffix] || "N/A";
        document.getElementById('part4Name').textContent = nameParts.part4;
        document.getElementById('part4Blurb').textContent = PART4_QUALIFIERS_BLURBS[nameParts.part4] || "N/A";
        
        const scoresList = document.getElementById('scoresList');
        scoresList.innerHTML = ''; // Clear previous scores
        PERSONALITY_CODE_AXES_ORDER.forEach(code => {
            const li = document.createElement('li');
            const score = calculatedScores[code];
            li.textContent = `${ALL_SCORABLE_AXES_DEFINITIONS[code]} (${code}): ${score !== undefined ? score.toFixed(2) : 'N/A'}`;
            scoresList.appendChild(li);
        });

        resultsContainer.style.display = 'block';
        quizForm.style.display = 'none'; // Hide form
        document.getElementById('introduction').style.display = 'none'; // Hide intro

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // TODO: Implement "close to midpoint" alternatives logic if desired
        // This would involve:
        // 1. Iterating through calculatedScores
        // 2. Identifying scores within MID_LIKERT_POINT +/- GRAY_AREA_DELTA
        // 3. For each such trait, temporarily "flip" its score (above/below midpoint)
        // 4. Recalculate the relevant name part (prefix, core, suffix, part4)
        // 5. If the name part changes, display it as an alternative.
        // This logic is similar to _get_alternative_name_part_if_flipped in your Python.
    });

    // --- Initialize ---
    loadQuestions();
});
