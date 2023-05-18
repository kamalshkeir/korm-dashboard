class ask extends HTMLElement {
    static css = `
        *, :after, :before {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :host {
            font-family: Arial, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            background: rgba(0,0,0,0.9);
            right: 0;
            bottom: 0;
            z-index:99999999999;
            --darkest:#212529;
            --dark:#495057;
        }

        .modal {
            width: auto;
            max-height: 400px;
            position: fixed;
            max-width: 600px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            border-radius: 15px;
            overflow: hidden;
            visibility: hidden;
            opacity: 0;
            transition: all 2s ease-in-out;
        }

        .modal.open {
            visibility: visible;
            opacity: 1;
        }
        .modal .header {
            width: 100%;
            background-color: var(--dark);
            color: white;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            font-weight: 200;
            z-index: 10;
            box-shadow: 0px 20px 50px black;
            gap: 10px;
        }
        
        .modal .header svg{
            width: 30px;
            height: 30px;
            max-width: 30px;
            max-height: 30px;
            fill: none;
            stroke: #ced4da;
            inline-size: 100px;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        
        .modal .footer {
            width: 100%;
            background-color: var(--darkest);
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 15px 15px;
            box-shadow: inset 0 10px 10px -10px rgba(0,0,0,.5);
        }
        
        .modal .footer button {
            padding: 10px 15px;
            margin-inline: 8px;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 600;
        }
        
        .modal .footer button.cancel {
            background-color: var(--dark);
            color: white;
            border: 0px;
        }
        
        .modal .footer button.cancel:hover {
            box-shadow: 0px 0px 10px rgba(0,0,0,1);
        }
        
        .modal .footer button.confirm:hover {
            box-shadow: 0px 0px 10px rgba(0,0,0,1);
        }
        
        .modal .footer button.confirm {
            padding: 8px 13px;
            background-color: transparent;
            color:rgb(145, 167, 255);
            border: 2px solid rgb(145, 167, 255);
        }
    `;

    static get observedAttributes() {
        return ["message"];
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
        document.body.appendChild(this);
    }

    get message() {
        return this.getAttribute("message");
    }

    set message(value) {
        return this.setAttribute("message",value);
    }

    remove() {
        document.body.removeChild(this);
    }

    show() {
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.classList.add("open");
        this.modal.innerHTML= `
        <div class="header">
            <svg aria-hidden="true">
                <title>A warning icon</title>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>

            <p>${this.message}</p>
        </div>

        <div class="footer">
            <button class="butn cancel">Cancel</button>
            <button class="butn confirm">Confirm</button>
        </div>
        `;

        let style = document.createElement("style");
        style.innerHTML=Ask.css;
        this.shadowRoot.append(style,this.modal);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        
    }

}

customElements.define("k-ask",ask);


async function Ask(message) {
    return new Promise((resolve) => {
        let a = new ask();
        a.message=message;
        a.show()
        a.modal.querySelector(".footer .cancel").addEventListener("click",(e) => {
            e.preventDefault();
            a.remove();
            resolve(false);
        });
        a.modal.querySelector(".footer .confirm").addEventListener("click",(e) => {
            e.preventDefault();
            a.remove();
            resolve(true);
        })       
    });
}

function elementFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML=html.trim();
    return template.content.firstElementChild;
}