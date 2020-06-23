class SunElement extends HTMLElement {

    constructor() {
        super();
        var shadow = this.attachShadow({
            mode: "open"
        });


        /* defining style here does not work  
        const style = document.createElement('style');
      
        style.textContent = `
      .btable {
        position: relative;
        display: table-row;
      };
      sun-element {
          display: table-row;
      }     `;


      */
      var border =  `
      padding: 5px;
      
      `
        this.date = document.createElement('td');
        this.sky = document.createElement('td');
        this.azimuth = document.createElement('td');
        this.elevation = document.createElement('td');

        this.date.setAttribute('style',border);
        this.sky.setAttribute('style', border);
        this.azimuth.setAttribute('style', border);
        this.elevation.setAttribute('style', border);
        this.sky.setAttribute('class', "wrapper");
        this.azimuth.setAttribute('class', "wrapper");
        this.elevation.setAttribute('class', "wrapper");

        shadow.appendChild(this.date);
        shadow.appendChild(this.sky);
        shadow.appendChild(this.azimuth);
        shadow.appendChild(this.elevation);
        console.log("shadow")

    }
    makeCell(value) {
        let x = document.createElement("td")
        x.innerText = value;
        return x;
    }
    connectedCallback() {
        var name = this.getAttribute("date")

        this.setAttribute("class", "btable");
        this.setAttribute("style", "border: 8px solid black");
        var sky = this.getAttribute("sky");
        this.date.innerText = name
        this.sky.innerText = sky;
        var azimuth = this.getAttribute('azimuth');
        this.azimuth.innerText=azimuth;
        var elevation = this.getAttribute('elevation');
        this.elevation.innerText=elevation;
    }
}
customElements.define("sun-element", SunElement);
// updateStatus("loading status")