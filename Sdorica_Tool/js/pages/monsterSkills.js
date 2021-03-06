let monsterSkillsTable;
let indexOfSkill = {};
let skillsLength = 0;
window.onload = () => {
  init();
  initMonsterSkillsPage();
}
initMonsterSkillsPage = async() => {
  reset();

  const json = localStorage.getItem('monster');
  const jsonObject = JSON.parse(json);

  monsters = jsonObject.monsters;
  skills = jsonObject.skills;
  skillsLength = skills.length;

  monsterSkillsTable = document.getElementById("monsterSkillsTable");

  initMonster();

  setSkillIndexMapping();
  renderTableHeader();
  renderTableBody();
  
  fillMonsterSkillTable();
}

reset = () => {
  indexOfSkill = {};
  monsters = [];
  skills = [];
  skillsLength = 0;
}

initMonster = () => {
  monsters.forEach((monster) => {
    let singleSkillMonsterCount = 0;
    let doubleSkillMonsterCount = 0;

    Object.entries(monster.numberOfStar).forEach((numberOfStar) => {
      const star = parseInt(numberOfStar[0]);
      const count = parseInt(numberOfStar[1]);
      if (star < 5) {
        singleSkillMonsterCount += count;
      } else {
        doubleSkillMonsterCount += count;
      }
    });

    monster.singleSkillMonsterCount = singleSkillMonsterCount;
    monster.doubleSkillMonsterCount = doubleSkillMonsterCount;
  });
}

setSkillIndexMapping = () => {
  skills.forEach((skill, index) => {
    indexOfSkill[skill.id] = index;
  });
}

renderTableHeader = () => {
  const header = monsterSkillsTable.querySelector("thead tr");
  let content = "<th></th>";
  skills.forEach((skill, index) => {
    content += `
      <th>${skill.name}</th>
    `;
  });
  header.innerHTML = content;
}

renderTableBody = () => {
  let content = "";
  skills.forEach((skill, index) => {
    content += `
      <th>${skill.name}</th>
    `;
    for (let otherIndex = 0; otherIndex < skillsLength; otherIndex++) {
      const otherSkill = skills[otherIndex];
      const isSameSkills = skill.id === otherSkill.id;
      const style = isSameSkills ? "background-color: #153f4f;" : "";

      content += `<td 
        id="${getDoubleSkillCellID(skill.id, otherSkill.id)}"
        style="${style}"
      ></td>`;
    }
    content = `<tr>${content}</tr>`;
  });

  const bodyElem = monsterSkillsTable.querySelector("tbody");
  bodyElem.innerHTML = content;
}

getDoubleSkillCellID = (mainSkillId, subSkillId) => {
  return `cell_${mainSkillId}_${subSkillId}`;
}

fillMonsterSkillTable = () => {
  monsters.forEach((monster) => {
    const {
      mainSkill, subSkill,
      doubleSkillMonsterCount,
    } = monster;

    if (doubleSkillMonsterCount > 0) {
      const cellId = getDoubleSkillCellID(mainSkill, subSkill);
      const cellElem = document.getElementById(cellId);
      const prefix = cellElem.innerHTML !== "" ? "<br>" : "";
      cellElem.innerHTML += prefix + `${monster.name} x${doubleSkillMonsterCount}`;
    }
  });
}