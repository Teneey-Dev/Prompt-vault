let prompts = 50
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
]

let promptInput = document.querySelector("#prompt-input")
let creditEl = document.querySelector("#credit-count")
let promptEl = document.querySelector("#prompt-grid")

creditEl.textContent = prompts

function renderVault() {
    promptEl.innerHTML = ""
    
    for(let i = 0; i < promptsVault.length; i++){
        let currentPrompt = promptsVault[i]

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
        `
    }
}
renderVault()

function optimizedPrompt () {
    if (prompts === 0) {
        return alert("You are out of Prompts")
    }
prompts--

creditEl.textContent = prompts

}

document.querySelector("#optimize-btn").addEventListener("click", optimizedPrompt)

async