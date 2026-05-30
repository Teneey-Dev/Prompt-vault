
let prompts = 50;
let storeApi = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
let apiKey = "AQ.Ab8RN6IskMayv6L6ifZc7OVPDFkRQs-ydM_0y_-1hRL8kDcrRw"

let promptsVault = [
    {
        title: "Test Coding Prompt",
        category: "Coding",
        text: "This is my first test prompt text."
    },
    {
        title: "Test Marketing Prompt",
        category: "Marketing",
        text: "This is my second test prompt text."
    }
];

// ==========================================
// 2. DOM ELEMENT SELECTION
// ==========================================
let promptInput = document.querySelector("#prompt-input");
let creditEl = document.querySelector("#credit-count");
let promptEl = document.querySelector("#prompt-grid");
let optimizeBtn = document.querySelector("#optimize-btn");
let saveBtn = document.querySelector("#save-btn");

// Copy Prompt Text to Clipboard
function copyPrompt(index) {
    let textToCopy = promptsVault[index].text;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("🚀 Prompt copied to clipboard successfully!");
        })
        .catch(err => {
            console.error("Copy failed:", err);
        });
}

// Load Selected Card Back into the Textarea Box
function viewPrompt(index) {
    let selectedText = promptsVault[index].text;
    promptInput.value = selectedText;
    
    // Smoothly scroll mobile users back up to the text input panel
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize UI Display
creditEl.textContent = prompts;

// ==========================================
// 3. CORE FUNCTIONS / CORE FEATURES
// ==========================================

// Render Vault Cards to Dashboard Grid
function renderVault() {
    promptEl.innerHTML = "";
    
    for (let i = 0; i < promptsVault.length; i++) {
        let currentPrompt = promptsVault[i];

        promptEl.innerHTML += `
            <div class="prompt-card">
                <span class="category-tag">${currentPrompt.category}</span>
                <h3>${currentPrompt.title}</h3>
                <p class="prompt-text">${currentPrompt.text}</p>
                <div class="card-actions">
                    <button class="view-btn" onclick="viewPrompt(${i})">View</button>
                    <button class="copy-btn" onclick="copyPrompt(${i})">Copy</button>
                </div>
            </div>
        `;
    }
}
    promptEl.innerHTML = "";
    
    for (let i = 0; i < promptsVault.length; i++) {
        let currentPrompt = promptsVault[i];

        promptEl.innerHTML += `
            <div class="prompt-card">
                <span class="category-tag">${currentPrompt.category}</span>
                <h3>${currentPrompt.title}</h3>
                <p class="prompt-text">${currentPrompt.text}</p>
                <div class="card-actions">
                    <button class="view-btn">View</button>
                    <button class="copy-btn">Copy</button>
                </div>
            </div>
        `;
    }

renderVault();

// Feature: AI Optimize Button Logic
async function optimizedPrompt() {
    if (prompts === 0) {
        return alert("You are out of Prompts");
    }

    let rawText = promptInput.value.trim();
    if (rawText === "") {
        alert("Please type a draft prompt first so the AI can optimize it!");
        return;
    }

    // Deduct credits and update UI state
    prompts--;
    creditEl.textContent = prompts;
    optimizeBtn.innerText = "Optimizing...";

    try {
        let response = await fetch(storeApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: `You are an expert Prompt Engineer. Rewrite and optimize this user prompt to make it professional, highly detailed, clear, and structured for the best AI response. Reply with ONLY the rewritten prompt text. Do not include any introductory text, explanation, conversational chatter, or markdown formatting backticks. Just return the prompt itself.\n\nUser Prompt to optimize: "${rawText}"` }
                        ]
                    }
                ]
            })
        });

        let data = await response.json();
        console.log("Optimize Response Object:", data);

        // Safe Guard parsing check
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            let optimizedText = data.candidates[0].content.parts[0].text.trim();
            promptInput.value = optimizedText;
        } else {
            console.warn("Gemini payload structure was unexpected or blocked.");
            alert("The AI couldn't optimize this specific text. Please try rewriting it slightly.");
        }
        
    } catch (error) {
        console.error("Optimization Error:", error);
        alert("Failed to connect to the AI engine. Please verify your connection.");
    }

    // Always reset button text
    optimizeBtn.innerText = "AI Optimize";
}

// Feature: Save Prompt Card Logic
async function savePrompt() {
    let userText = promptInput.value.trim();
    if (userText === "") {
        return alert("Input Your desired Prompts");
    }

    let userCategory = prompt("Enter a category for this prompt (e.g., Coding, Marketing, General):");
    if (userCategory === null || userCategory.trim() === "") {
        userCategory = "General";
    }
    
    let userTitle = prompt("Enter a short, catchy title for this card:");
    if (userTitle === null || userTitle.trim() === "") {
        userTitle = userText.length > 25 ? userText.substring(0, 25) + "..." : userText;
    }

    try {
        let response = await fetch(storeApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: `You are a text validator. Review the following snippet for quality. Is it a solid, helpful, and descriptive prompt, or is it completely weak/empty? Reply with just the single word 'Strong' or 'Weak'. Do not include any other text.\n\nSnippet to review: "${userText}"` }
                        ]
                    }
                ]
            })
        });

        let data = await response.json();
        console.log("Save Response Object:", data);

        // Safe Guard parsing check: defaults to Strong if Google blocks the evaluation payload
        let aiVerdict = "Strong";
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiVerdict = data.candidates[0].content.parts[0].text.trim();
        } else {
            console.warn("Gemini verdict layout unexpected. Defaulting to safe save.");
        }

        if (aiVerdict === "Weak") {
            let saveAnyway = confirm("The AI flags this prompt as weak! Click CANCEL to stop saving, and then click the 'AI Optimize' button on the sidebar to have Gemini upgrade your prompt automatically.");
            if (!saveAnyway) {
                return;
            }
        }

        // Add verified prompt to local array
        let newPrompt = {
            text: userText,
            category: userCategory,
            title: userTitle
        };
        
        promptsVault.push(newPrompt);
        promptInput.value = "";
        renderVault();

    } catch (error) {
        console.error("Save Error:", error);
        alert("Could not process the prompt verdict. Check your network.");
    }
}

// ==========================================
// 4. EVENT LISTENERS (Always Bottom)
// ==========================================
optimizeBtn.addEventListener("click", optimizedPrompt);
saveBtn.addEventListener("click", savePrompt);