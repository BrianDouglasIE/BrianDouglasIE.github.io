class ChickenAsks extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="content-container">
            <img src="/images/hen-sm.png" alt="" class="image" />
            <div class="content">${content}</div>
        </div>`;
  }
}

class MagpieReplies extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="content-container">
            <div class="content">${content}</div>
            <img src="/images/magpie-sm.png" alt="" class="image" />
        </div>`;
  }
}

class MagpieTrinket extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.template(this.innerHTML);
  }

  template(content) {
    return `
        <div class="content-container">
            <div class="content">
                <h3>Magpie's Trinket</h3>
                <div class="my-0 prose-p:my-0">${content}</div>
            </div>
            <img src="/images/magpie-md.png" class="image" alt="" />
        </div>`;
  }
}

customElements.define("chicken-asks", ChickenAsks);
customElements.define("magpie-trinket", MagpieTrinket);
customElements.define("magpie-replies", MagpieReplies);
