let statePath = [];

function addStateToPath(state0) {
  statePath.push(state0);
}

function testString() {

  statePath = [];

  let inputString = document.getElementById('testInput').value;
  let currentState = 'q0';
  let table = document.getElementById('transitionTable');
  let acceptanceStates = [];
  let charGroup = document.getElementById('charGroup').value;

  console.log(table.rows[0].cells[5].innerText);

  if(!table.rows[0].cells[5].innerText) {
    alert('Debes seleccionar un grupo de caracteres');
    return;
  }
  
  // Leer estados de aceptación de la columna FDC
  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    if (row.cells[6].querySelector('input').value === "SI") {
      acceptanceStates.push(row.cells[0].innerText);
    }
  }

  addStateToPath(currentState);

  for (let char of inputString) {
    let colIndex = getColumnIndex(char, charGroup);

    if (colIndex === -1) {
      alert(`Cadena inválida: Carácter no reconocido. Camino: ${statePath.join(' -> ')}`);
      document.getElementById('testInput').value = "";
      return;
    }

    let rowIndex = getStateRowIndex(currentState);
    if(rowIndex < 0) {
      alert(`Cadena inválida: Transición no definida. Camino: ${statePath.join(' -> ')}`);
    } else {
      currentState = table.rows[rowIndex].cells[colIndex].querySelector('input').value;
      addStateToPath(currentState);
    }


    if (currentState === "") {
      alert(`Cadena inválida: Transición no definida. Camino: ${statePath.join(' -> ')}`);
      document.getElementById('testInput').value = "";
      return;
    }

    /*
    if (currentState === "q6") {
      alert("Cadena inválida.");
      document.getElementById('testInput').value = "";
      return;
    }
    */
    
  }

  if (acceptanceStates.includes(currentState)) {
    alert("Cadena válida. Camino: " + statePath.join(' -> '));
  } else {
    alert("Cadena inválida. Camino: " + statePath.join(' -> '));
  }

  drawAutomata();

  document.getElementById('testInput').value = "";
}

function getColumnIndex(char, charGroup) {
  let table = document.getElementById('transitionTable');
  let headerRow = table.rows[0];
  for (let i = 1; i < headerRow.cells.length - 1; i++) { // -1 para evitar la columna FDC
    console.log(`${headerRow.cells[i].innerText} === ${char} = ${headerRow.cells[i].innerText === char}`)
    if (headerRow.cells[i].innerText === char) {
        return i;
    }
  }
  if (charGroup === "digit" && isDigit(char)) return headerRow.cells.length - 2; // Penúltima columna
  if (charGroup === "letter" && isLetter(char)) return headerRow.cells.length - 2;
  if (charGroup === "vowel" && isVowel(char)) return headerRow.cells.length - 2;
  return -1;
}

function getStateRowIndex(state) {
  let table = document.getElementById('transitionTable');
  for (let i = 1; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].innerText === state) {
      return i;
    }
  }
  return -1;
}

function isDigit(char) {
  return /^[0-9]$/i.test(char);
}

function isLetter(char) {
  return /^[a-zA-Z]$/i.test(char);
}

function isVowel(char) {
  return /^[aeiouAEIOU]$/i.test(char);
}

document.getElementById('charGroup').addEventListener('change', function() {
  let table = document.getElementById('transitionTable');
  let selectedValue = this.value; // Obtiene el valor seleccionado del dropdown

  switch (selectedValue) {
    case 'digit':
      table.rows[0].cells[5].innerText = 'Digito';
      break;
    case 'letter':
      table.rows[0].cells[5].innerText = 'Letra';
      break;
    case 'vowel':
      table.rows[0].cells[5].innerText = 'Vocal';
      break;
  }
});

function drawAutomata() {
  const nodes = [];
  const edges = [];

  const table = document.getElementById('transitionTable');
  
  for (let i = 1; i < table.rows.length; i++) {
    const state = table.rows[i].cells[0].innerText;
    nodes.push({id: state, label: state});
  }

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const fromState = row.cells[0].innerText;
    for (let j = 1; j < row.cells.length - 1; j++) {  // -1 para evitar la columna FDC
      const toState = row.cells[j].querySelector('input').value;
      const char = table.rows[0].cells[j].innerText;
      if (toState) {
        edges.push({from: fromState, to: toState, label: char});
      }
    }
  }

  const container = document.getElementById('diagram');
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };
  const options = {};
  new vis.Network(container, data, options);
}
