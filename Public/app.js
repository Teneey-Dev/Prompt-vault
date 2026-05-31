// ==========================================
// 1. GLOBAL STATE & CONFIGURATION (Always Top)
// ==========================================
let storeApi = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
let apiKey = "AQ.Ab8RN6IQvWLfxKN6ZQfeMIrWXTXOHf5_KV3bMmdUtCB2Uq0jVQ"

// 💡 LOCAL STORAGE INTEGRATION: Load saved prompts or fall back to default arrays
let defaultPrompts = [
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

let promptsVault = JSON.parse(localStorage.getItem("promptsVault")) || defaultPrompts;
let prompts= parseInt(localStorage.getItem("creditCount")) || 50;


// ==========================================
// 2. DOM ELEMENT SELECTION
// ==========================================
let promptInput = document.querySelector("#prompt-input");
let creditEl = document.querySelector("#credit-count");
let promptEl = document.querySelector("#prompt-grid");
let optimizeBtn = document.querySelector("#optimize-btn");
let saveBtn = document.querySelector("#save-btn");
let searchInput = document.querySelector("#search-input");

// Initialize UI Display
creditEl.textContent = prompts;

// ==========================================
// 3. CORE FUNCTIONS / CORE FEATURES
// ==========================================

// Helper function to update LocalStorage seamlessly across operations
function updateLocalStorage() {
    localStorage.setItem("promptsVault", JSON.stringify(promptsVault));
    localStorage.setItem("creditCount", prompts);
}

// Render Vault Cards to Dashboard Grid
function renderVault(filteredArray = promptsVault) {
    promptEl.innerHTML = "";
    
    if (filteredArray.length === 0) {
        promptEl.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 2rem;">No prompts found matching that search.</p>`;
        return;
    }

    for (let i = 0; i < filteredArray.length; i++) {
        let currentPrompt = filteredArray[i];
        let originalIndex = promptsVault.indexOf(currentPrompt);

        promptEl.innerHTML += `
            <div class="prompt-card">
                <span class="category-tag">${currentPrompt.category}</span>
                <h3>${currentPrompt.title}</h3>
                <p class="prompt-text">${currentPrompt.text}</p>
                <div class="card-actions">
                    <button class="view-btn" onclick="viewPrompt(${originalIndex})">View</button>
                    <button class="copy-btn" onclick="copyPrompt(${originalIndex})">Copy</button>
                </div>
            </div>
        `;
    }
}

// Initial paint on load
renderVault();

// Feature: Real-Time Search Filtering
if (searchInput) {
    searchInput.addEventListener("input", function(e) {
        let searchTerm = e.target.value.toLowerCase().trim();
        
        let matches = promptsVault.filter(function(promptCard) {
            return promptCard.title.toLowerCase().includes(searchTerm) || 
                   promptCard.category.toLowerCase().includes(searchTerm) || 
                   promptCard.text.toLowerCase().includes(searchTerm);
        });
        
        renderVault(matches);
    });
}

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
                contents: [{
                    parts: [{ text: `System: You are an expert AI Prompt Engineer. Rewrite and optimize the following user prompt to make it clear, professional, and structured for maximum AI performance.\n\nUser Draft: "${rawText}"` }]
                }]
            })
        });

        let data = await response.json();

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            let optimizedText = data.candidates[0].content.parts[0].text.trim();
            promptInput.value = optimizedText;
            
            // 💡 Automatically append the optimization result to your state so it updates live
            let optimizedCard = {
                title: "AI Optimized Prompt",
                category: "Optimized",
                text: optimizedText
            };
            
            promptsVault.push(optimizedCard);
            updateLocalStorage(); // Save changes permanently!
            renderVault();
            
        } else {
            alert("The AI couldn't optimize this specific text. Please try rewriting it slightly.");
        }
        
    } catch (error) {
        console.error("Optimization Error:", error);
        alert("Failed to connect to the AI engine. Please verify your connection.");
    }

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
                contents: [{
                    parts: [{ text: `You are a text validator. Review the following snippet for quality. Is it a solid, helpful, and descriptive prompt, or is it completely weak/empty? Reply with just the single word 'Strong' or 'Weak'. Do not include any other text.\n\nSnippet to review: "${userText}"` }]
                }]
            })
        });

        let data = await response.json();
        let aiVerdict = "Strong";
        
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiVerdict = data.candidates[0].content.parts[0].text.trim();
        }

        if (aiVerdict === "Weak") {
            let saveAnyway = confirm("The AI flags this prompt as weak! Click CANCEL to stop saving, and then click the 'AI Optimize' button on the sidebar to have Gemini upgrade your prompt automatically.");
            if (!saveAnyway) return;
        }

        let newPrompt = {
            text: userText,
            category: userCategory,
            title: userTitle
        };
        
        promptsVault.push(newPrompt);
        updateLocalStorage(); // Save changes permanently!
        promptInput.value = "";
        renderVault();

    } catch (error) {
        console.error("Save Error:", error);
        alert("Could not process the prompt verdict. Check your network.");
    }
}

// Copy Feature
function copyPrompt(index) {
    let textToCopy = promptsVault[index].text;
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert("🚀 Prompt copied to clipboard successfully!"))
        .catch(err => console.error("Copy failed:", err));
}

// View Feature
function viewPrompt(index) {
    promptInput.value = promptsVault[index].text;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 4. EVENT LISTENERS (Always Bottom)
// ==========================================
optimizeBtn.addEventListener("click", optimizedPrompt);
saveBtn.addEventListener("click", savePrompt);