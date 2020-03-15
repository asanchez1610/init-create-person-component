import { html, css, LitElement } from 'lit-element';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/Select';
import '@ui5/webcomponents/dist/Button';

export class CreateComponent extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .one-columns {
        display: grid;
        grid-template-columns: 1fr;
      }

      .content-column {
        padding:5px;
      }

      .content-buttons {
        display:flex;
        justify-content: center;
      }

      @media screen and (max-width: 480px) {
        .two-columns {
          display: grid;
          grid-template-columns: 1fr;
        }
      }

    `;
  }

  static get properties() {
    return {
      persona: { type: Object }
    };
  }

  constructor() {
    super();
    this.persona = {};
  }

  async _processInputs() {
    let tipoDocumento;
    let opciones = this.shadowRoot.querySelector('#tipoDocumento').querySelectorAll('ui5-option');
    let data = {};
    opciones.forEach((option)=>{
      if(option.selected) {
        tipoDocumento = option.getAttribute('value');
      }
    });
    let inputs = this.shadowRoot.querySelectorAll('ui5-input');
    inputs.forEach((input)=>{
      if(input.value) {
        data[input.name] = input.value;
      }
    });

    if(tipoDocumento) {
      data.tipoDocumento = tipoDocumento;
    }
    this.persona = data;
    await this.requestUpdate();
  }

  async _register() {
    if(this._validate()) {
      await this._processInputs();
      console.log(this.persona);
      const event = new CustomEvent('data-person-value', {
        detail: this.persona,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }
  }

  _validate() {
    let inputs = this.shadowRoot.querySelectorAll('ui5-input');
    let errors = 0;
    inputs.forEach((input)=>{
      if(input.required && !input.value){
        input.valueState = 'Error';
        errors++;
      }else{
        input.removeAttribute('value-state');
      }
      if(input.value && input.type === 'Email') {
        if(!this._validateEmail(input.value)){
          input.valueState = 'Error';
          errors++;
        }else {
          input.removeAttribute('value-state');
        }
      }
    });
    return errors === 0;
  }

  _validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  _resetForm() {
    let inputs = this.shadowRoot.querySelectorAll('ui5-input');
    inputs.forEach((input)=>{
      input.removeAttribute('value-state');
      input.value = '';
    });

    let opciones = this.shadowRoot.querySelector('#tipoDocumento').querySelectorAll('ui5-option');
    opciones.forEach((opt,i)=>{
      if(i === 0) {
        opt.selected = true;
      }else{
        opt.selected = false;
      }
    });
    this.shadowRoot.querySelector('#tipoDocumento')._toggleIcon();
    this.shadowRoot.querySelector('#tipoDocumento')._toggleIcon();
  }

  clearForm() {
    this._resetForm();
  }

  render() {
    return html`
    <div class = "two-columns">
      <div class = "content-column">
        <ui5-label  for="tipoDocumento">Tipo de documento</ui5-label>
        <ui5-select id="tipoDocumento" class="select" name = "tipoDocumento">
          <ui5-option value = "DNI">DNI</ui5-option>
          <ui5-option value = "RUC">RUC</ui5-option>
          <ui5-option value = "OTROS">OTROS</ui5-option>
        </ui5-select>
      </div>
      <div class = "content-column">
        <ui5-label  for = "numeroDocumento" required show-colon>Número de documento</ui5-label>
        <ui5-input id = "numeroDocumento" required name = "numeroDocumento" ></ui5-input>
      </div>
    </div>

    <div class = "two-columns">
      <div class = "content-column">
        <ui5-label  for = "apellidos" required show-colon>Apellidos</ui5-label>
        <ui5-input id = "apellidos" required name = "apellidos" ></ui5-input>
      </div>
      <div class = "content-column">
        <ui5-label  for = "nombres" required show-colon>Nombres</ui5-label>
        <ui5-input id = "nombres" required name = "nombres" ></ui5-input>
      </div>
    </div>

    <div class = "two-columns">
      <div class = "content-column">
        <ui5-label  for = "telefono">Telefono</ui5-label>
        <ui5-input id = "telefono" name = "telefono" ></ui5-input>
      </div>
      <div class = "content-column">
        <ui5-label  for = "email">Email</ui5-label>
        <ui5-input type = "Email" id = "email" name = "email" ></ui5-input>
      </div>
    </div>

    <div class = "ome-columns">
      <div class = "content-column">
        <ui5-label  for="direccion">Dirección</ui5-label>
        <ui5-input id="direccion" name="direccion" ></ui5-input>
      </div>
    </div>

    <div class = "content-buttons">
      <div class = "content-column">
        <ui5-button design="Emphasized" @click = ${this._register} >Registrar</ui5-button>
      </div>
      <div class = "content-column">
        <ui5-button design="Negative" @click = ${this._resetForm} >Cancelar</ui5-button>
      </div>
    </div>


    `;
  }
}
