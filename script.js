document.getElementById("checkGrammarBtn").addEventListener("click", onApply);

function onApply() {
    const input = document.getElementById("inputText").value || "";
    const mode = document.getElementById("modeSelect").value; // "1" to "7"
    const task = document.getElementById("taskSelect").value;
    const output = document.getElementById("outputText");

    if (input.trim() === "") {
        output.innerHTML = formatMode(mode, "Please enter some text.");
        return;
    }

    let result = "";

    switch (task) {
        case "correct":
            result = correctGrammar(input);
            break;
        case "summarize":
            result = summarizeText(input);
            break;
        case "rewrite":
            result = rewriteText(input);
            break;
        case "explain":
            result = explainText(input);
            break;
        case "improve":
            result = improveClarity(input);
            break;
        case "convert":
            result = convertText(input);
            break;
        case "analyze":
            result = analyzeText(input);
            break;
        default:
            result = input;
    }

    output.innerHTML = formatMode(mode, result);
}

/* Utilities */

function formatMode(mode, text) {
    // Small presentation change per mode to show difference (tone/length hints).
    switch (mode) {
        case "1": // Professional
            return `<strong>Professional:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "2": // Casual
            return `<strong>Casual:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "3": // Student
            return `<strong>Student:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "4": // Teacher
            return `<strong>Teacher:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "5": // Creative
            return `<strong>Creative:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "6": // Quick Answer
            return `<strong>Quick Answer:</strong><div class="result">${escapeHtml(text)}</div>`;
        case "7": // Detailed Analysis
            return `<strong>Detailed Analysis:</strong><div class="result">${escapeHtml(text)}</div>`;
        default:
            return `<div class="result">${escapeHtml(text)}</div>`;
    }
}

function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>");
}

/* Task implementations (simple, local heuristics) */

function correctGrammar(input) {
    let corrected = input;

    // basic capitalization and common fixes
    corrected = corrected.replace(/\bi am\b/gi, "I am");
    corrected = corrected.replace(/\bhe dont\b/gi, "he doesn't");
    corrected = corrected.replace(/\bshe dont\b/gi, "she doesn't");
    corrected = corrected.replace(/\bteh\b/gi, "the");
    corrected = corrected.replace(/\bi've\b/gi, "I've");
    corrected = corrected.replace(/\bi'll\b/gi, "I'll");
    corrected = corrected.replace(/\bi'm\b/gi, "I'm");
    // Capitalize first letter of sentences (simple heuristic)
    corrected = corrected.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c){ return c.toUpperCase(); });

    // fix common spacing issues
    corrected = corrected.replace(/\s+([.,!?;:])/g, "$1");
    corrected = corrected.replace(/([.,!?;:])([^\s])/g, "$1 $2");

    return corrected;
}

function summarizeText(input) {
    // Naive summarization: return first 2 sentences or first 150 chars
    const sentences = input.match(/[^.!?]+[.!?]*/g) || [input];
    let out = sentences.slice(0, 2).join(" ").trim();
    if (out.length === 0) out = input.slice(0, 150) + (input.length > 150 ? "..." : "");
    return out;
}

function rewriteText(input) {
    // Very simple rewrite: replace some words with simpler synonyms and shorten long sentences
    let s = input;
    s = s.replace(/\butilize\b/gi, "use");
    s = s.replace(/\bdoes not\b/gi, "doesn't");
    s = s.replace(/\bis not\b/gi, "isn't");
    s = s.replace(/\bmoreover\b/gi, "also");
    s = s.replace(/\bconsequently\b/gi, "so");

    // break overly long comma-separated parts
    s = s.replace(/,([^,]{80,})/g, ". $1");
    if (s.length > 800) s = s.slice(0, 800) + "...";
    return s;
}

function explainText(input) {
    // Produce a sentence-by-sentence explanation (very simple)
    const sentences = input.match(/[^.!?]+[.!?]*/g) || [input];
    const explanations = sentences.map((sent, i) => {
        const trimmed = sent.trim();
        if (!trimmed) return "";
        return `${i+1}. "${trimmed}" — This sentence means: ${trimmed.replace(/^[A-Z]/,'').trim()}.`;
    });
    return explanations.join("\n\n");
}

function improveClarity(input) {
    // Fix spacing around punctuation, ensure sentence capitalization, remove repeated spaces
    let out = input.replace(/\s+([.,!?;:])/g, "$1");
    out = out.replace(/([.,!?;:])([^\s])/g, "$1 $2");
    out = out.replace(/\s{2,}/g, " ");
    out = out.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c){ return c.toUpperCase(); });
    // Replace ambiguous contractions for clarity only when helpful
    out = out.replace(/\bhe's\b/gi, "he is").replace(/\bshe's\b/gi, "she is");
    return out;
}

function convertText(input) {
    // Convert paragraphs into numbered points (simple)
    const sentences = input.match(/[^.!?]+[.!?]*/g) || [input];
    const points = sentences.map(s => s.trim()).filter(Boolean);
    if (points.length === 0) return input;
    return points.map((p,i) => `${i+1}. ${p}`).join("\n");
}

function analyzeText(input) {
    // Basic analysis: word count, sentence count, most common words
    const words = input.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const wordCount = words.length;
    const sentences = input.match(/[^.!?]+[.!?]*/g) || [];
    const sentenceCount = sentences.length;
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const common = Object.entries(freq).sort((a,b)=> b[1]-a[1]).slice(0,5).map(e=> `${e[0]}(${e[1]})`);
    const avgWordsPerSentence = sentenceCount ? (wordCount / sentenceCount).toFixed(1) : "0";
    return `Word count: ${wordCount}\nSentence count: ${sentenceCount}\nAvg words/sentence: ${avgWordsPerSentence}\nMost common words: ${common.join(", ")}`;
}
