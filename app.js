const dateInput = document.getElementById("date");
const coursesEl = document.getElementById("courses");
const resultsEl = document.getElementById("results");

dateInput.valueAsDate = new Date();

async function loadCourses() {
  try {
    const response = await fetch("data/courses.json");
    if (!response.ok) throw new Error("Kenttälistaa ei voitu ladata.");

    const courses = await response.json();

    coursesEl.innerHTML = Object.entries(courses).map(([id, course]) => `
      <label class="course-label">
        <input type="checkbox" value="${id}">
        <span>${course.name}</span>
      </label>
    `).join("");
  } catch (error) {
    coursesEl.textContent = error.message;
  }
}

function getSelection() {
  const courseIds = [...coursesEl.querySelectorAll('input[type="checkbox"]:checked')]
    .map(input => input.value);

  return {
    date: dateInput.value,
    courses: courseIds
  };
}

document.getElementById("search").addEventListener("click", () => {
  const selection = getSelection();

  if (!selection.date) {
    resultsEl.textContent = "Valitse päivämäärä.";
    return;
  }

  if (selection.courses.length === 0) {
    resultsEl.textContent = "Valitse vähintään yksi kenttä.";
    return;
  }

  resultsEl.textContent =
    `Valittu päivä: ${selection.date}\n` +
    `Valitut kentät: ${selection.courses.join(", ")}\n\n` +
    "Varsinainen WiseGolf-haku liitetään seuraavassa vaiheessa.";
});

document.getElementById("wisegolf-test").addEventListener("click", () => {
  const selection = getSelection();

  resultsEl.textContent =
    "WiseGolf-integraation testipohja toimii.\n\n" +
    `Päivä: ${selection.date || "ei valittu"}\n` +
    `Kentät: ${selection.courses.length ? selection.courses.join(", ") : "ei valittu"}\n\n` +
    "Authorization-tietoja ei lueta eikä tallenneta tässä versiossa.";
});

loadCourses();
