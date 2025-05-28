// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const questionsContainer = document.getElementById('questions-container');
    const quizForm = document.getElementById('quizForm');
    const resultsContainer = document.getElementById('results-section');
    const quizIntroText = document.getElementById('quiz-intro-text');
    const axisTitleHeading = document.getElementById('axis-title');

    // Result Display Elements
    const resultFullNameSpan = document.getElementById('result-full-name');
    const resultCodeSpan = document.getElementById('result-code');
    const resultPrefixNameSpan = document.getElementById('result-prefix-name');
    const resultPrefixBlurbSpan = document.getElementById('result-prefix-blurb');
    const resultCoreNameSpan = document.getElementById('result-core-name');
    const resultCoreBlurbSpan = document.getElementById('result-core-blurb');
    const resultSuffixNameSpan = document.getElementById('result-suffix-name');
    const resultSuffixBlurbSpan = document.getElementById('result-suffix-blurb');
    const resultPart4NameSpan = document.getElementById('result-part4-name');
    const resultPart4BlurbSpan = document.getElementById('result-part4-blurb');
    const scoresListUl = document.getElementById('result-scores-list');

    // Action Buttons
    const retakeQuizButton = document.getElementById('retakeQuizButton');
    const savePdfButton = document.getElementById('savePdfButton');
    const shareResultsButton = document.getElementById('shareResultsButton');


    // --- Helper: Load Questions into HTML ---
    function loadQuestions() {
        let questionNumber = 0;

        if (!questionsContainer) {
            console.error("CRITICAL: 'questions-container' element not found in HTML.");
            return;
        }
        if (!PRIMARY_AXIS_CODES_FOR_QUESTIONS || Object.keys(PRIMARY_AXIS_CODES_FOR_QUESTIONS).length === 0) {
            console.error("PRIMARY_AXIS_CODES_FOR_QUESTIONS is missing or empty in data.js!");
            questionsContainer.innerHTML = "<p style='color:red;'>Error: Could not load axis data.</p>";
            return;
        }
        if (!QUESTIONS_BANK || Object.keys(QUESTIONS_BANK).length === 0) {
            console.error("QUESTIONS_BANK is missing or empty in data.js!");
            questionsContainer.innerHTML = "<p style='color:red;'>Error: Could not load question data.</p>";
            return;
        }

        questionsContainer.innerHTML = '';

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
            } else {
                console.warn(`No questions found in QUESTIONS_BANK for axisCode: ${axisCode}`);
            }
        }
        if (questionNumber === 0) {
            console.warn("No questions were loaded into the page. Check data and logic.");
            questionsContainer.innerHTML = "<p style='color:orange;'>Warning: No questions were loaded. Please check the configuration.</p>";
        }
    }

    // --- Helper: Get Alternative Archetype Name Part ---
    function getAlternativeNamePartIfFlipped(originalScores, traitToFlip, determinationFunction) {
        const flippedScores = { ...originalScores };
        if (originalScores[traitToFlip] <= MID_LIKERT_POINT) {
            flippedScores[traitToFlip] = MID_LIKERT_POINT + 0.01;
        } else {
            flippedScores[traitToFlip] = MID_LIKERT_POINT - 0.01;
        }
        const originalNamePart = determinationFunction(originalScores);
        const alternativeNamePart = determinationFunction(flippedScores);
        return (alternativeNamePart !== originalNamePart) ? alternativeNamePart : null;
    }

    // --- Core Logic Functions ---
    function calculateAllScores(userResponses) {
        const allCalculatedScores = {};
        for (const axisCode in QUESTIONS_BANK) {
            if (axisCode === 'M') continue;
            const responses = userResponses[axisCode];
            if (!responses) {
                console.warn(`No responses for axis: ${axisCode} in userResponses during calculation. Skipping.`);
                continue;
            }
            if (responses.length !== QUESTIONS_PER_STANDARD_AXIS) {
                 console.error(`Score Calc Error: Expected ${QUESTIONS_PER_STANDARD_AXIS} for ${axisCode}, got ${responses.length}`);
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

        if (QUESTIONS_BANK['M'] && userResponses['M']) {
            const mResponses = userResponses['M'];
             if (mResponses.length !== QUESTIONS_FOR_MOTIVATIONAL_AXIS) {
                console.error(`Score Calc Error: Expected ${QUESTIONS_FOR_MOTIVATIONAL_AXIS} for M, got ${mResponses.length}`);
                return null;
            }
            const subScoresSum = {'H': 0.0, 'G': 0.0, 'R': 0.0};
            const subScoresCount = {'H': 0, 'G': 0, 'R': 0};
            QUESTIONS_BANK['M'].forEach((questionData, i) => {
                let responseVal = parseFloat(mResponses[i]);
                const subAxisKey = questionData.sub_axis;
                if (!subAxisKey || !subScoresSum.hasOwnProperty(subAxisKey)) {
                    console.error(`Score Calc Error: Invalid sub_axis '${subAxisKey}' for M question: ${questionData.text}`);
                    return;
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
                    console.warn(`Score Calc Warning: No Qs/resps for M sub-axis M_${subKey}. Score will be missing.`);
                    allCalculatedScores[`M_${subKey}`] = NaN;
                }
            }
        } else if (PRIMARY_AXIS_CODES_FOR_QUESTIONS.hasOwnProperty('M')) {
             console.error("Score Calc Error: Motivational 'M' Qs expected but not found in responses/bank.");
             return null;
        }

        for (const code of PERSONALITY_CODE_AXES_ORDER) {
            if (!(code in allCalculatedScores)) {
                 console.error(`Score Calc Error: Score for required axis '${code}' was not calculated.`);
                 return null;
            }
        }
        return allCalculatedScores;
    }

    function generatePersonalityCode(calculatedScores) {
        let codeLetters = [];
        PERSONALITY_CODE_AXES_ORDER.forEach(axisCode => {
            const score = calculatedScores[axisCode];
            if (score === undefined || isNaN(score)) {
                console.warn(`Code Gen Warning: Score for '${axisCode}' is undefined or NaN.`);
                codeLetters.push('?');
                return;
            }
            const letterToUse = axisCode.includes('_') ? axisCode.split('_')[1] : axisCode;
            codeLetters.push(score > MID_LIKERT_POINT ? letterToUse.toUpperCase() : letterToUse.toLowerCase());
        });
        return codeLetters.join("");
    }

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

    // --- Event Listeners for Action Buttons ---
    if (retakeQuizButton) {
        retakeQuizButton.addEventListener('click', () => window.location.reload());
    }
    if (savePdfButton) {
        savePdfButton.addEventListener('click', () => window.print());
    }
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', () => {
            const archetypeFullName = resultFullNameSpan.textContent;
            // const personalityCode = resultCodeSpan.textContent; // No longer used in share text
            const siteUrl = window.location.origin + window.location.pathname;

            if (navigator.share) {
                navigator.share({
                    title: 'My ArcheMorph Personality',
                    text: `I discovered my ArcheMorph type: ${archetypeFullName}! Find out yours:`, // MODIFIED
                    url: siteUrl,
                }).catch((error) => console.warn('Share API error:', error));
            } else {
                const shareText = `I discovered my ArcheMorph type: ${archetypeFullName}! Find out yours at ${siteUrl}`; // MODIFIED
                prompt("Share your Archetype! Copy this text:", shareText);
            }
        });
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
                if(userResponses[axisCode] !== undefined){
                     userResponses[axisCode].push(parseInt(value));
                } else {
                    console.warn(`Unexpected form key during response collation: ${key} (axis ${axisCode})`);
                }
            }

            for (const axisCode in PRIMARY_AXIS_CODES_FOR_QUESTIONS) {
                const expectedCount = axisCode === 'M' ? QUESTIONS_FOR_MOTIVATIONAL_AXIS : QUESTIONS_PER_STANDARD_AXIS;
                if (!userResponses[axisCode] || userResponses[axisCode].length !== expectedCount) {
                    alert(`Please answer all questions for ${PRIMARY_AXIS_CODES_FOR_QUESTIONS[axisCode]}. (${userResponses[axisCode] ? userResponses[axisCode].length : 0}/${expectedCount} answered)`);
                    return;
                }
            }

            const calculatedScores = calculateAllScores(userResponses);
            if (!calculatedScores) {
                alert("An error occurred while calculating scores. Please check the console for more details.");
                return;
            }

            const personalityCode = generatePersonalityCode(calculatedScores);
            const nameParts = generateArchetypeNmeParts(calculatedScores);
            const fullArchetypeName = `${nameParts.prefix} ${nameParts.core} ${nameParts.suffix} with ${nameParts.part4}`;

            resultFullNameSpan.textContent = fullArchetypeName;
            resultCodeSpan.textContent = personalityCode;
            resultPrefixNameSpan.textContent = nameParts.prefix;
            resultPrefixBlurbSpan.textContent = PREFIX_MODIFIERS_BLURBS[nameParts.prefix] || "Blurb N/A";
            resultCoreNameSpan.textContent = nameParts.core;
            resultCoreBlurbSpan.textContent = CORE_PERSONALITIES_BLURBS[nameParts.core] || "Blurb N/A";
            resultSuffixNameSpan.textContent = nameParts.suffix;
            resultSuffixBlurbSpan.textContent = SUFFIX_MODIFIERS_BLURBS[nameParts.suffix] || "Blurb N/A";
            resultPart4NameSpan.textContent = nameParts.part4;
            resultPart4BlurbSpan.textContent = PART4_QUALIFIERS_BLURBS[nameParts.part4] || "Blurb N/A";

            scoresListUl.innerHTML = '<h3>Understanding Your Traits:</h3>';

            PERSONALITY_CODE_AXES_ORDER.forEach(code => {
                const score = calculatedScores[code];
                if (score === undefined || isNaN(score)) {
                    console.warn(`Skipping display for trait ${code} due to missing/NaN score.`);
                    return;
                }

                const traitFullName = ALL_SCORABLE_AXES_DEFINITIONS[code] || code;
                let scoreDirection = "";
                let traitBlurbText = "";
                const traitSpecificBlurbs = (typeof TRAIT_DESCRIPTIONS === 'object' && TRAIT_DESCRIPTIONS !== null) ? TRAIT_DESCRIPTIONS[code] : null;

                if (score > MID_LIKERT_POINT + GRAY_AREA_DELTA) {
                    scoreDirection = "High";
                    traitBlurbText = traitSpecificBlurbs && traitSpecificBlurbs.High ? traitSpecificBlurbs.High : "High score blurb unavailable.";
                } else if (score < MID_LIKERT_POINT - GRAY_AREA_DELTA) {
                    scoreDirection = "Low";
                    traitBlurbText = traitSpecificBlurbs && traitSpecificBlurbs.Low ? traitSpecificBlurbs.Low : "Low score blurb unavailable.";
                } else {
                    scoreDirection = "Moderate";
                    traitBlurbText = traitSpecificBlurbs && traitSpecificBlurbs.Moderate ? traitSpecificBlurbs.Moderate : "Moderate score blurb unavailable.";
                }

                const li = document.createElement('li');
                li.innerHTML = `<strong>${traitFullName} (${code}): ${score.toFixed(2)} (${scoreDirection})</strong><br><span class="trait-description-text">${traitBlurbText}</span>`;
                scoresListUl.appendChild(li);

                if (scoreDirection === "Moderate" &&
                    (typeof TRAIT_GROUPINGS === 'object' && TRAIT_GROUPINGS !== null) &&
                    typeof getAlternativeNamePartIfFlipped === 'function') {

                    let affectedDeterminationFunction = null;
                    let originalNamePartForTraitStr = null;
                    let namePartLabel = "";
                    let blurbDictionaryForAlt = null;

                    if (TRAIT_GROUPINGS.group1 && TRAIT_GROUPINGS.group1.codes && TRAIT_GROUPINGS.group1.codes.includes(code)) {
                        affectedDeterminationFunction = determineCorePersonality;
                        originalNamePartForTraitStr = nameParts.core;
                        namePartLabel = "Core Personality";
                        blurbDictionaryForAlt = CORE_PERSONALITIES_BLURBS;
                    } else if (TRAIT_GROUPINGS.group2 && TRAIT_GROUPINGS.group2.codes && TRAIT_GROUPINGS.group2.codes.includes(code)) {
                        affectedDeterminationFunction = determineSuffixModifier;
                        originalNamePartForTraitStr = nameParts.suffix;
                        namePartLabel = "Suffix Modifier";
                        blurbDictionaryForAlt = SUFFIX_MODIFIERS_BLURBS;
                    } else if (TRAIT_GROUPINGS.group3 && TRAIT_GROUPINGS.group3.codes && TRAIT_GROUPINGS.group3.codes.includes(code)) {
                        affectedDeterminationFunction = determinePrefixModifier;
                        originalNamePartForTraitStr = nameParts.prefix;
                        namePartLabel = "Prefix Modifier";
                        blurbDictionaryForAlt = PREFIX_MODIFIERS_BLURBS;
                    } else if (TRAIT_GROUPINGS.group4 && TRAIT_GROUPINGS.group4.codes && TRAIT_GROUPINGS.group4.codes.includes(code)) {
                        affectedDeterminationFunction = determinePart4Qualifier;
                        originalNamePartForTraitStr = nameParts.part4;
                        namePartLabel = "Qualifier";
                        blurbDictionaryForAlt = PART4_QUALIFIERS_BLURBS;
                    }

                    if (affectedDeterminationFunction && originalNamePartForTraitStr && blurbDictionaryForAlt) {
                        const alternativeNamePart = getAlternativeNamePartIfFlipped(
                            calculatedScores, code, affectedDeterminationFunction
                        );
                        if (alternativeNamePart && alternativeNamePart !== originalNamePartForTraitStr) {
                            const altBlurb = (typeof blurbDictionaryForAlt === 'object' && blurbDictionaryForAlt !== null) ? (blurbDictionaryForAlt[alternativeNamePart] || "Alt blurb N/A.") : "Alt blurb dict N/A.";
                            const altLi = document.createElement('li');
                            altLi.classList.add('alternative-suggestion-item');
                            altLi.innerHTML = `↪ Because your ${traitFullName} score is moderate, if it leaned differently,
                                               your '${namePartLabel}' could also be expressed as
                                               <strong>${alternativeNamePart}</strong> <em>(${altBlurb})</em>.
                                               This highlights potential flexibility.`;
                            scoresListUl.appendChild(altLi);
                        }
                    }
                }
            });

            if(resultsContainer) resultsContainer.style.display = 'block';
            if(quizForm) quizForm.style.display = 'none';
            // if(quizIntroText) quizIntroText.style.display = 'none'; // Covered by quizForm hide
            // if(axisTitleHeading) axisTitleHeading.style.display = 'none'; // Covered by quizForm hide

            if(resultsContainer) resultsContainer.scrollIntoView({ behavior: 'smooth' });
        });
    } else {
        console.error("Quiz form element (#quizForm) not found. Cannot attach submit listener.");
    }

    // --- Initialize Quiz ---
    if (typeof loadQuestions === "function") {
        loadQuestions();
    } else {
        console.error("CRITICAL: loadQuestions function is not defined!");
    }
});
