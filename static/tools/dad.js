/* Usage
let dad = new Dad(".container")
dad.OnDrop((files) => {
    console.log(files);
    dad.message="Drop your Files!"
    dad.size="Max File Size 25Mb"
    dad.error="some error"
})
*/
class Dad extends HTMLElement {
    static css = `
        *, :after, :before {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :host {
            font-size: 18px;
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
            line-height: 1.5rem;
        }
        .droparea {
            margin: 1rem auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap:10px;
            width: 384px;
            max-width: 100%;
            border: 4px dashed grey;
            border-radius: 15px;
            overflow:hidden;
        }
        #btnf {
            padding: 7px 10px;
            border-radius: 5px;
            background: none;
            border: 2px solid black;
            outline:none;
            cursor:pointer;
        }
        #btnf:hover {
            background: black;
            outline:none;
            color:white;
        }
        
        .droparea svg {
            font-size: 3rem;
            flex-grow: 1;
            padding-top: 1rem;
        }

        .droparea p {
            width: 90%;
            text-align:center;
            overflow-wrap: break-word;
        }
        .droparea p.red {
            color:red;
        }
        
        .green-border {
            border-color: green;
        }
        .red-border {
            border-color: red;
        }
    `;

    static get observedAttributes() {
        return ["message", "size", "error"];
    }

    constructor(selector=".k-dad") {
        super(selector);
        this.message = "Drop your Files!";
        this.size = "Max File Size 25Mb";
        this.attachShadow({ mode: "open" });
        let style = document.createElement("style");
        style.innerHTML = Dad.css;
        this.shadowRoot.append(style);
        if (!document.querySelector(selector)) {
            console.error("selector Dad not found");
            return;
        }
        this.show();
        document.querySelector(selector).prepend(this);
    }

    get message() {
        return this.getAttribute("message");
    }
    set message(value) {
        return this.setAttribute("message", value);
    }
    get size() {
        return this.getAttribute("size");
    }
    set size(value) {
        return this.setAttribute("size", value);
    }
    get error() {
        return this.getAttribute("error");
    }
    set error(value) {
        return this.setAttribute("error", value);
    }

    remove() {
        document.body.removeChild(this);
    }

    OnDrop(callback) {
        this.callback=callback;
    }

    Duration(file) {
        return new Promise((resolve) => {
            const isAudio = ['video', 'audio'].some((word) => file.type.startsWith(word));
            if (!isAudio) {
                resolve({
                    file,
                    duration: 0
                })
                return;
            }
            var objectURL = URL.createObjectURL(file);
            var mySound = new Audio([objectURL]);
            mySound.addEventListener(
                "canplaythrough",
                () => {
                    URL.revokeObjectURL(objectURL);
                    resolve(mySound.duration);
                },
                false,
            );
        });
    }

    show() {
        this.droparea = document.createElement("section");
        this.droparea.classList.add("droparea");
        this.droparea.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" viewBox="0 0 24 24">
            <g>
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill-rule="nonzero" d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z"/>
            </g>
        </svg>
        <input id="inf" type="file" multiple style="display:none">
        <p class="msg">${this.message}</p>
        <button id="btnf">Upload</button>
        <p><small class="size">${this.size}</small></p>
        `;
        ['dragenter', 'dragover'].forEach(evtName => {
            this.droparea.addEventListener(evtName, (e) => {
                e.preventDefault();
                this.droparea.classList.add("green-border");
            });
        });
        this.droparea.addEventListener("dragleave", (e) => {
            e.preventDefault();
            this.droparea.classList.remove("red-border");
        });
        
        this.droparea.addEventListener("drop", (e) => {
            e.preventDefault();
            let el = this.droparea.querySelector("p.msg");
            el.classList.remove("red");
            el.textContent=this.message;
            const dt = e.dataTransfer;
            const fileArray = [...dt.files];
            if (this.callback) {
                this.callback(fileArray);
            }
        });
        this.shadowRoot.append(this.droparea);
        let btnUpload = this.droparea.querySelector("#btnf");
        let inUpload = this.droparea.querySelector("#inf");
        inUpload.addEventListener("change",(e) => {
            e.preventDefault();
            const fileList = inUpload.files;
            const fileArray = [...fileList];
            if (this.callback) {
                this.callback(fileArray);
            } 
        })
        btnUpload.addEventListener("click",(e) => {
            e.preventDefault();
            inUpload.click();
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "message" && this.droparea) {
            this.droparea.querySelector("p.msg").textContent = newValue;
        } else if (name == "size" && this.droparea) {
            this.droparea.querySelector(".size").textContent = newValue;
        } else if (name == "error" && this.droparea) {
            this.droparea.classList.add("red-border");
            let el = this.droparea.querySelector("p.msg");
            el.classList.add("red");
            el.textContent=newValue;
        }
    }
}

customElements.define("k-dad", Dad);


