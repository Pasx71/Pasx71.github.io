// script.js
document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    const quizForm = document.getElementById('quizForm');
    const resultsContainer = document.getElementById('results-section'); // Matches HTML
    const introductionSection = document.getElementById('quiz-section').querySelector('p'); // For hiding intro text

    // --- Helper: Load Questions into HTML ---
    function loadQuestions() {
        // console.log("loadQuestions function called.");
        let questionNumber = 0;

        if (!PRIMARY_AXIS_CODES_FOR_QUESTIONS || Object.keys(PRIMARY_AXIS_CODES_FOR_QUESTIONS).length === 0) {
            console.error("PRIMARY_AXIS_CODES_FOR_QUESTIONS is missing or empty in data.js!");
            if(questionsContainer) questionsContainer.innerHTML = "<p style='color:red;'>Error: Could not load axis data.</p>";
            return;
        }
        if (!QUESTIONS_BANK || Object.keys(QUESTIONS_BANK).length === 0) {
            console.error("QUESTIONS_BANK is missing or empty in data.js!");
            if(questionsContainer) questionsContainer.innerHTML = "<p style='color:red;'>Error: Could not load question data.</p>";
            return;
        }
        if (!questionsContainer) {
            console.error("The 'questions-container' element was not found in the HTML!");
            return;
        }

        questionsContainer.innerHTML = ''; // Clear any existing content

        for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
            // console.log(`Processing axis: ${axisCode}`);
            if (QUESTIONS_BANK[axisCode]) {
                // console.log(`Found questions for ${axisCode} in QUESTIONS_BANK.`);
                const groupDiv = document.createElement('div');
                groupDiv.classList.add('question-group');
                const groupTitle = document.createElement('h3');
                groupTitle.textContent = `${PRIMARY_AXIS_CODES_FOR_QUESTIONS[axisCode]} Questions`;
                groupDiv.appendChild(groupTitle);

                QUESTIONS_BANK[axisCode].forEach((q, index) => {
                    questionNumber++;
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('question-item');
                    itemDiv.innerHTML = `<p>${questionNumber}. ${q.text || "Error: Question text missing"}</p>`;

                    const scaleDiv = document.createElement('div');
                    scaleDiv.classList.add('likert-scale');

                    for (let i = MIN_LIKERT_SCORE; i <= MAX_LIKERT_SCORE; i++) {
                        const label = document.createElement('label');
                        const radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.name = `q_${axisCode}_${index}`;
                        radio.value = i;
                        radio.required = true;

                        label.appendChild(document.createTextNode(i.toString()));
                        label.appendChild(radio);
                        scaleDiv.appendChild(label);
                    }
                    itemDiv.appendChild(scaleDiv);
                    groupDiv.appendChild(itemDiv);
                });
                questionsContainer.appendChild(groupDiv);
                // console.log(`Appended question group for ${axisCode} to the container.`);
            } else {
                console.warn(`No questions found in QUESTIONS_BANK for axisCode: ${axisCode}`);
            }
        }
        if (questionNumber === 0) {
            console.warn("No questions were loaded into the page. Check data and logic.");
            if(questionsContainer) questionsContainer.innerHTML = "<p style='color:orange;'>Warning: No questions were loaded. Please check the configuration.</p>";
        } else {
             // console.log(`Successfully loaded ${questionNumber} questions.`);
        }
    }

    // --- Logic from archetype_system.py (ported to JS) ---

    function calculateAllScores(userResponses) {
        const allCalculatedScores = {};

        for (const axisCode in QUESTIONS_BANK) { // Iterate over QUESTIONS_BANK to ensure we cover all defined question sets
            if (axisCode === 'M') continue;

            const responses = userResponses[axisCode];
            if (!responses) { // This might happen if an axis in QUESTIONS_BANK isn't in PRIMARY_AXIS_CODES_FOR_QUESTIONS
                console.warn(`No responses found for axis: ${axisCode} during calculation, though it exists in QUESTIONS_BANK. Skipping.`);
                continue;
            }
            // It's possible QUESTIONS_BANK has more axes than PRIMARY_AXIS_CODES_FOR_QUESTIONS (e.g. if M was still there)
            // but the form only generates inputs based on PRIMARY_AXIS_CODES_FOR_QUESTIONS.
            // So, only process if responses exist for it.

            if (responses.length !== QUESTIONS_PER_STANDARD_AXIS) {
                 console.error(`Expected ${QUESTIONS_PER_STANDARD_AXIS} responses for ${axisCode}, got ${responses.length}.`);
                 return null; // Or handle more gracefully
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

                if (!subAxisKey || !subScoresSum.hasOwnProperty(subAxisKey)) {
                    console.error(`Invalid or missing sub_axis '${subAxisKey}' for M question: ${questionData.text}`);
                    // Potentially skip this question or return null depending on desired strictness
                    return; // Skips this iteration of forEach
                }

                if (questionData.reverse) {
                    responseVal = (MAX_LIKERT_SCORE + MIN_LIKERT_SCORE) - responseVal;
                }
                subScoresSum[subAxisKey] += responseVal;
                subScoresCount[subAxisKey]++;
            });

            for (const subKey in subScoresSum) {
                if (subScoresCount[subKey] > 0) {
                    allCalculatedScores[`M_${subKey}`] = subScoresSum[subKey] / subScoresCount[subKey];
                } else {
                    // This might happen if M questions for a sub-axis were missing or had errors
                    console.warn(`No questions/responses processed for M sub-axis M_${subKey}. Score will be missing.`);
                    // To avoid errors later, we might assign a default or NaN
                    // allCalculatedScores[`M_${subKey}`] = NaN; // Or handle as critical error
                }
            }
        } else if (PRIMARY_AXIS_CODES_FOR_QUESTIONS.hasOwnProperty('M')) { // Only error if 'M' was expected
             console.error("Motivational 'M' questions defined in PRIMARY_AXIS_CODES but responses or bank entry not found.");
             return null; // Critical if M is part of the primary set
        }

        // Ensure all scorable axes (as per PERSONALITY_CODE_AXES_ORDER) are present
        for (const code of PERSONALITY_CODE_AXES_ORDER) {
            if (!(code in allCalculatedScores)) {
                 console.error(`Internal Error: Score for axis '${code}' was not calculated or populated. This axis is required.`);
                 // One reason could be an M_SubKey not getting calculated if there were issues
                 return null;
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
                // This indicates a problem in calculateAllScores if an axis in PERSONALITY_CODE_AXES_ORDER wasn't populated
                codeLetters.push('?'); // Placeholder for missing score
                return;
            }
            const letterToUse = axisCode.includes('_') ? axisCode.split('_')[1] : axisCode;
            codeLetters.push(score > MID_LIKERT_POINT ? letterToUse.toUpperCase() : letterToUse.toLowerCase());
        });
        return codeLetters.join("");
    }

    // --- Logic from naming_rules.py (ported to JS) ---
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


    function generateArchetypeNmeParts(calculatedScores) { // Renamed to avoid typo Name -> Nme
        const prefix = determinePrefixModifier(calculatedScores);
        const core = determineCorePersonality(calculatedScores);
        const suffix = determineSuffixModifier(calculatedScores);
        const part4 = determinePart4Qualifier(calculatedScores);
        return { prefix, core, suffix, part4 };
    }


    // --- Main Quiz Submission Handler ---
    if (quizForm) {
        quizForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(quizForm);
            const userResponses = {};

            for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
                userResponses[axisCode] = [];
            }

            for (const [key, value] of formData.entries()) {
                const parts = key.split('_');
                const axisCode = parts[1];
                if(userResponses[axisCode] !== undefined){ // Check if the axisCode is a valid key
                     userResponses[axisCode].push(parseInt(value));
                } else {
                    console.warn(`Unexpected form key for axis code: ${axisCode} from key ${key}`);
                }
            }

            let allAnswered = true;
            for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
                const expectedCount = axisCode === 'M' ? QUESTIONS_FOR_MOTIVATIONAL_AXIS : QUESTIONS_PER_STANDARD_AXIS;
                if (!userResponses[axisCode] || userResponses[axisCode].length !== expectedCount) {
                    allAnswered = false;
                    alert(`Please answer all questions for ${PRIMARY_AXIS_CODES_FOR_QUESTIONS[axisCode]}. (${userResponses[axisCode] ? userResponses[axisCode].length : 0}/${expectedCount} answered)`);
                    return; // Exit if not all answered
                }
            }
            // No need for: if (!allAnswered) return; because the loop now returns directly.


            const calculatedScores = calculateAllScores(userResponses);
            if (!calculatedScores) {
                alert("There was an error calculating scores. Please check the console for details.");
                return;
            }

            const personalityCode = generatePersonalityCode(calculatedScores);
            const nameParts = generateArchetypeNmeParts(calculatedScores); // Corrected function name
            const fullArchetypeName = `${nameParts.prefix} ${nameParts.core} ${nameParts.suffix} with ${nameParts.part4}`;

            // Display results - IDs must match your index.html
            document.getElementById('result-full-name').textContent = fullArchetypeName;
            document.getElementById('result-code').textContent = personalityCode;

            document.getElementById('result-prefix-name').textContent = nameParts.prefix;
            document.getElementById('result-prefix-blurb').textContent = PREFIX_MODIFIERS_BLURBS[nameParts.prefix] || "Blurb not found.";
            document.getElementById('result-core-name').textContent = nameParts.core;
            document.getElementById('result-core-blurb').textContent = CORE_PERSONALITIES_BLURBS[nameParts.core] || "Blurb not found.";
            document.getElementById('result-suffix-name').textContent = nameParts.suffix;
            document.getElementById('result-suffix-blurb').textContent = SUFFIX_MODIFIERS_BLURBS[nameParts.suffix] || "Blurb not found.";
            document.getElementById('result-part4-name').textContent = nameParts.part4;
            document.getElementById('result-part4-blurb').textContent = PART4_QUALIFIERS_BLURBS[nameParts.part4] || "Blurb not found.";

            const scoresList = document.getElementById('result-scores-list'); // Matches HTML
            scoresList.innerHTML = '';
            PERSONALITY_CODE_AXES_ORDER.forEach(code => {
                const li = document.createElement('li');
                const score = calculatedScores[code];
                li.textContent = `${ALL_SCORABLE_AXES_DEFINITIONS[code] || code} (${code}): ${score !== undefined ? score.toFixed(2) : 'N/A'}`;
                scoresList.appendChild(li);
            });

            if(resultsContainer) resultsContainer.style.display = 'block';
            if(quizForm) quizForm.style.display = 'none';
            if(introductionSection) introductionSection.style.display = 'none'; // Hide the "Please answer all questions below." paragraph

            if(resultsContainer) resultsContainer.scrollIntoView({ behavior: 'smooth' });

        });
    } else {
        console.error("Quiz form element not found. Cannot attach submit listener.");
    }

    // --- Initialize ---
    // console.log("About to call loadQuestions().");
    if (typeof loadQuestions === "function") { // Ensure loadQuestions is defined
        loadQuestions();
    } else {
        console.error("loadQuestions function is not defined!");
    }
    // console.log("Finished calling loadQuestions().");
});
