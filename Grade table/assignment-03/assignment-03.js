function addRow() {
  const table = document.getElementById('tables');
  const add = document.createElement('tr');
  for (let i = 0; i < 8; i++) {//going by column
    const data = document.createElement('td');
    if(i !=7)
    {
      data.setAttribute('contenteditable', 'true'); //when new data is added it will be able to edit
    }
    add.appendChild(data);//put it on the row
  }
  table.appendChild(add);
  average(); //its it to do the aveage agin when a new row is added to the table
}

function average() {
  const table = document.getElementById('tables');
  const rows = table.querySelectorAll('tr');
  for (let i = 1; i < rows.length; i++) {
    const data = rows[i].getElementsByTagName('td');
    let sum = 0;
    let assign = 0; //to show how many assignments that are in the table
    for (let j = 2; j < data.length - 1; j++) {
      const grade = parseInt(data[j].textContent) || 0;//well its suppose to change to integer or to 0 if is invalid but doesnt work
      sum += grade;
      assign++;
    }
    const Grade = sum / assign; //divide by the assign that are there
    const roundAverage = Math.round(Grade); // get the avegage to the num of assign
    const result = data[data.length - 1];
    result.textContent = roundAverage;
    if (roundAverage < 60) {//change number colour to red
      result.style.backgroundColor = "red";
      result.style.color = "white";
    } else {
      // or keep normal
      result.style.backgroundColor = ""; 
      result.style.color = ""; 
    }
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('tables');
  table.addEventListener('input', average);
//do it for new oens 
  average();
});
let change = "percent"; 
function finaleResult() {
  const table = document.getElementById('tables');
  const rows = table.querySelectorAll('tr');
  if (change === "percent") {
    change = "letter";
    document.getElementById('finale').textContent = "Letter Grade";
  } else if (change === "letter") {
    change = "4.0";
    document.getElementById('finale').textContent = "4.0 Scale";
  } else {
    change = "percent";
    document.getElementById('finale').textContent = "Percent Grade";
  }

  for (let i = 1; i < rows.length; i++) {
    const data = rows[i].getElementsByTagName('td');
    let sum = 0;
    let numAssignments = 0;
    for (let j = 2; j < data.length - 1; j++) {
      const grade = parseInt(data[j].textContent) || 0;
      sum += grade;
      numAssignments++;;
    }
    const averageG = sum / numAssignments;
    if (change === "percent") {
      data[data.length - 1].textContent = Math.round(averageG) + "%";
    } else if (change === "letter") {
      data[data.length - 1].textContent = Letter(Math.round(averageG));
    } else if (change === "4.0") {
      data[data.length - 1].textContent = Point(Math.round(averageG));
    }
  }
}


function Letter(averageG) {
  if (averageG >= 93) {
    return 'A';
  } else if (averageG >= 90) {
    return 'A-';
  } else if (averageG>= 87) {
    return 'B+';
  } else if (averageG>= 83) {
    return 'B';
  } else if (averageG >= 80) {
    return 'B-';
  } else if (averageG >= 77) {
    return 'C+';
  } else if (averageG>= 73) {
    return 'C';
  } else if (averageG >= 70) {
    return 'C-';
  } else if (averageG >= 67) {
    return 'D+';
  } else if (averageG >= 63) {
    return 'D';
  } else if (averageG >= 60) {
    return 'D-';
  } else {
    return 'F';
  }
}

function Point(averageG) {
  if (averageG >= 93) {
    return '4.0';
  } else if (averageG >= 90) {
    return '3.7';
  } else if (averageG >= 87) {
    return '3.3';
  } else if (averageG >= 83) {
    return '3.0';
  } else if (averageG >= 80) {
    return '2.7';
  } else if (averageG >= 77) {
    return '2.3';
  } else if (averageG >= 73) {
    return '2.0';
  } else if (averageG >= 70) {
    return '1.7';
  } else if (averageG >= 67) {
    return '1.3';
  } else if (averageG >= 63) {
    return '1.0';
  } else if (averageG >= 60) {
    return '0.7';
  } else {
    return '0.0';
  }
}

function insert() {
  const table = document.getElementById('tables');
  const columnlast = 7; 
  const title = prompt('Let\'s give this column a name:');
  if (title) {
    const header = table.rows[0];
    const head1 = document.createElement('th');
    head1.textContent = title;
    header.insertBefore(head1, header.cells[columnlast]);
    for (let i = 1; i < table.rows.length; i++) {
      const row1 = document.createElement('td');
      row1.setAttribute('contenteditable', 'true');
      row1.classList.add('new-column-data');
      table.rows[i].insertBefore(row1, table.rows[i].cells[columnlast]);
    }
  }
}
function undo() {
  const table = document.getElementById('tables');
  const columnlast = 7; 
  const head = table.rows[0];
  head.deleteCell(columnlast);
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].deleteCell(columnlast);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('tables');
  
  table.addEventListener('click', function(event) {
      
      if (event.target.tagName === 'TD') {
          const clickC = event.target;
          const clickR= clickedCell.parentElement;
          if (clickR.cells[0] === clickedCell) {
              clickR.classList.toggle('highlighted');
          }
      }
  });
});

function notSubmittedwork() {
  const table = document.getElementById('tables');
  const rows = table.querySelectorAll('tr');
  let notSubmitted = document.getElementById('notSubmitted');
  let notSub = 0;
  for (let i = 1; i < rows.length; i++) {
    const data = rows[i].getElementsByTagName('td');
    for (let j = 2; j < data.length - 1; j++) {
      let num = parseInt(data[j].textContent); // Parse text content as an integer
      if (data[j].textContent === '-') {
        data[j].style.backgroundColor = 'yellow';
        notSub++;
      } else {
        data[j].style.backgroundColor = '';
      }
      if (num < 0 || num > 100) {
        data[j].textContent = '-';
      }
    }
  }
  notSubmitted.textContent = `Assignments not submitted: ${notSub}`;
}

document.addEventListener('input', notSubmittedwork);
function over() {
  const table = document.getElementById('tables');
  const rows = table.querySelectorAll('tr');
  for (let i = 1; i < rows.length; i++) {
      const data = rows[i].getElementsByTagName('td');
      for (let j = 2; j < data.length - 1; j++) {
          let num = parseInt(data[j].textContent);
              if ( num < 0 || num > 100)
            data[j].textContent = '-';
            else if(data[j].textContent == " ")
            {
              data[j].textContent = '-';
            }
          } 
      }
  }
document.addEventListener('input', over);