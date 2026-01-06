document.getElementById("checkGrammarBtn").addEventListener("click", checkGrammar);

function checkGrammar() {
    const input = document.getElementById("inputText").value;
    const output = document.getElementById("outputText");

    if (input.trim() === "") {
        output.innerHTML = "Please enter some text.";
        return;
    }

    // Basic demo correction logic (for academic project)
    let corrected = input;

    corrected = corrected.replace(/\bi am\b/gi, "I am");
    corrected = corrected.replace(/\bhe dont\b/gi, "he doesn't");
    corrected = corrected.replace(/\bshe dont\b/gi, "she doesn't");
    corrected = corrected.replace(/\bteh\b/gi, "the");

    output.innerHTML = corrected;
}
