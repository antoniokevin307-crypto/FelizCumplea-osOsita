const fs = require('fs');
let c = fs.readFileSync('styles.css','utf8');
const index = c.indexOf('/ *   E s t i l o s');
if (index !== -1) {
    c = c.substring(0, index);
}
c += `/* Estilos para el mensaje profundo */
#deepMessageOverlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  z-index: 10000;
  transition: opacity 2s ease-in-out;
  backdrop-filter: blur(5px);
}

#deepMessageOverlay.active {
  opacity: 1;
}

.deep-message-box {
  background: rgba(10, 15, 30, 0.8);
  border: 1px solid rgba(150, 200, 255, 0.5);
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 50px rgba(100, 150, 255, 0.4);
}

.deep-message-box p {
  font-size: 1.5em;
  line-height: 1.6;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  font-weight: 300;
}`;
fs.writeFileSync('styles.css', c);
