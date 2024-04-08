class AutoInput extends HTMLElement {
    static css = `
    *, :after, :before {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    :host {
        width:100%;
        --fs:20px;
    }
    .input-container {
        position: relative;
        background-color: #ffffff;
        min-width: 100px;
        min-height: 50px;
        border-radius: 5px;
        font-size:var(--fs);
        font-family: sans-serif;
    }

    #myinput {
        outline: none;
        border: none;
        background-color: transparent;
        position: absolute;
        width: 100%; 
        height: 100%; 
        color: #000000;
        padding: 0 7px;
        font-size:var(--fs);
        z-index: 1; 
    }

    #suggestion {
        width: 100%; 
        height: 100%; 
        position: absolute;
        z-index: 0; 
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        padding: 0 7px;
        color: #868686;
        font-size:var(--fs);
    }

    @media screen and (max-width:600px) {
        .input-container {
            width: 80vw;
        }
    }
    `;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>${AutoInput.css}</style>`;
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');

        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', this.getAttribute('placeholder') || '');
        this.input.setAttribute('id', 'myinput'); // Added id
        this.input.value = this.getAttribute('value') || '';
        inputContainer.appendChild(this.input);

        this.suggestion = document.createElement('span');
        this.suggestion.setAttribute('id', 'suggestion');
        inputContainer.appendChild(this.suggestion);

        shadow.appendChild(inputContainer);

        // Parse the words attribute as JSON
        this._words = new Set();
        this.words = JSON.parse(this.getAttribute('words')) || [];
    }

    connectedCallback() {
        this.input.addEventListener('input', () => this.handleInput());
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleInput() {
        const inputValue = this.input.value.toLowerCase();
        const regex = new RegExp("^" + inputValue, "i");
        for (let word of this.words) {
            if (regex.test(word) && inputValue !== "") {
                this.suggestion.textContent = this.caseCheck(word);
                return;
            }
        }
        this.suggestion.textContent = '';
    }

    handleKeyDown(event) {
        if ((event.keyCode == 13 || event.keyCode == 9) && this.suggestion.textContent !== "") {
            event.preventDefault();
            this.input.value = this.suggestion.textContent;
            this.suggestion.textContent = '';
        }
    }

    caseCheck(word) {
        let inV = this.input.value;
        let upperCaseFlag = inV.toUpperCase() === inV;
        let lowerCaseFlag = inV.toLowerCase() === inV;

        if (upperCaseFlag) {
            return word.toUpperCase();
        } else if (lowerCaseFlag) {
            return word.toLowerCase();
        } else {
            return word.split("").map((letter, index) => {
                if (inV[index] === letter.toLowerCase()) {
                    return letter;
                } else {
                    return inV[index] === inV[index].toUpperCase() ? letter.toUpperCase() : letter.toLowerCase();
                }
            }).join("");
        }
    }

    static get observedAttributes() {
        return ['placeholder', 'value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder') {
            this.input.setAttribute('placeholder', newValue);
        } else if (name === 'value') {
            this.input.value = newValue;
        }
    }

    get value() {
        return this.input.value;
    }

    set value(newValue) {
        this.input.value = newValue;
        this.handleInput();
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    set placeholder(newValue) {
        this.setAttribute('placeholder', newValue);
    }

    get words() {
        return Array.from(this._words);
    }

    set words(newWords) {
        if (Array.isArray(newWords)) {
            this._words = new Set(newWords);
        } else if (typeof newWords === 'string') {
            const wordsArray = newWords.split(',').map(word => word.trim());
            this._words = new Set(wordsArray);
        } else {
            console.error("Invalid value for words attribute. Expected an array or a string.");
        }
    }
}

customElements.define('auto-input', AutoInput);
