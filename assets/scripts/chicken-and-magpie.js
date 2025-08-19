class ChickenAsks extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="chicken-asks">
            <img src="/images/hen-sm.png" alt="A studious chick" class="image" />
            <div>${content}</div>
        </div>`;
  }
}

class MagpieReplies extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="magpie-replies">
            <div>${content}</div>
            <img src="/images/magpie-sm.png" alt="A wise magpie" class="image" />
        </div>`;
  }
}

class MagpieTrinket extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="magpie-trinket">
            <div>${content}</div>
            <img src="/images/magpie-md.png" class="image" alt="A wise magpie" />
        </div>`;
  }
}

customElements.define("chicken-asks", ChickenAsks);
customElements.define("magpie-trinket", MagpieTrinket);
customElements.define("magpie-replies", MagpieReplies);
