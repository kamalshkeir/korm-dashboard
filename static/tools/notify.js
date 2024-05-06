// notify class
// usage Notify("message","success")
class notify extends HTMLElement {
    static css = `.notice{
      width: auto;
      position: fixed;
      top: -12%;
      right: -5%;
      opacity: 0;
      color: white;
      padding: 15px 25px;
      overflow: hidden;
      background: rgba(28, 28, 49, 0.3);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(56, 102, 255, 0.1);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      font-size: clamp(8px,3vw,15px);
      }
      
      
    .notice.active{
      z-index: 1000000;
      animation: notify 6s cubic-bezier(.17,.67,.55,1.31);
    }
    
    .notice strong {
        font-weight: 600;
        padding-right: 10px;
    }
    
    .notice-success strong {
        color: #74ba28!important;
    }
    
    .notice-danger strong{
        color: #eb344f;
    }
    
    .notice-info strong{
      color: #1db4bd;
    }
    
    
      
    @keyframes notify {
      0% {
        top: -12%;
        right: -5%;
        opacity: 0;
      }
    
      15% {
        top: 12%;
        right: 5%;
        opacity: 1;
        z-index: 1000000;
      }
    
      90% {
        top: 12%;
        right: 5%;
        opacity: 1;
        z-index: 1000000;
      }
    
      100% {
        top: -12%;
        right: -5%;
        opacity: 0;
      }
    }
    
    `;

    static get observedAttributes() {
        return ["message", "type"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        let style = document.createElement("style");
        style.innerHTML = notify.css;
        this.shadowRoot.append(style);
        document.body.appendChild(this);
    }

    get message() {
        return this.getAttribute("message");
    }

    set message(value) {
        return this.setAttribute("message", value);
    }

    get type() {
        return this.getAttribute("type");
    }

    set type(value) {
        return this.setAttribute("type", value);
    }

    remove() {
        document.body.removeChild(this);
    }

    show() {
        this.notification = document.createElement('div');
        this.notification.classList.add('notice');
        document.querySelector('body').appendChild(this.notification);
        if (this.type === 'success') {
            this.notification.classList.add('notice-success');
            `<strong>Success</strong> +${this.message}`
            this.notification.innerHTML = `<strong>SUCCESS</strong>  ${this.message}`;
        } else if (this.type === 'error') {
            this.notification.classList.add('notice-danger');
            this.notification.innerHTML = `<strong>ERROR</strong>  ${this.message}`;
        } else if (this.type === 'info') {
            this.notification.classList.add('notice-info');
            this.notification.innerHTML = `<strong>INFO</strong>  ${this.message}`;
        }
        this.notification.classList.add('active');
        this.shadowRoot.append(this.notification);
        // setTimeout(() => {
        //     this.notification.classList.remove('active');
        //     this.notification.textContent = '';
        //     this.remove();
        // }, 6100);
    }
}

customElements.define("k-notify", notify);

function Notify(message, type) {
    let n = new notify();
    n.message = message;
    n.type = type;
    n.show();
}
