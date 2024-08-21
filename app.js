class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$form = document.querySelector("#form");
    this.$notes = document.querySelector("#notes");
    this.$placeholder = document.querySelector("#placeholder");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$formCloseButton = document.querySelector("#form-close-button");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector("#color-tooltip");

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener("mouseover", (event) => {
      this.openToolbar(event);
    });

    document.body.addEventListener("mouseout", (event) => {
      this.closeToolbar(event);
    });

    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.$colorTooltip.addEventListener("click", (event) => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = this.$noteText.value;
      const title = this.$noteTitle.value;
      const hasNote = title || text;

      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", (event) => {
      this.closeModal();
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    const text = this.$noteText.value;
    const title = this.$noteTitle.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add("form-open");
    this.$noteTitle.style.display = "block";
    this.$formButtons.style.display = "block";
  }

  closeForm() {
    this.$form.classList.remove("form-open");
    this.$noteTitle.style.display = "none";
    this.$formButtons.style.display = "none";
    this.$noteText.value = "";
    this.$noteTitle.value = "";
  }

  openToolbar(event) {
    if (!event.target.matches(".toolbar-color")) return;

    this.id = event.target.dataset.id;
    const baseCoords = event.target.getBoundingClientRect();
    const horizontal = baseCoords.left + window.scrollX;
    const vertical = baseCoords.top + window.scrollY;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeToolbar(event) {
    if (!event.target.matches(".toolbar-color")) return;

    this.$colorTooltip.style.display = "none";
  }

  editNoteColor(color) {
    const text = this.$modalText.value;
    const title = this.$modalTitle.value;
    this.notes = this.notes.map((note) =>
      note.id == this.id ? { ...note, color } : note
    );
    this.render();
  }

  addNote({ text, title }) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };

    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  deleteNote(event) {
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.previousElementSibling.dataset.id;
    this.notes = this.notes.filter((note) => note.id != id);
    this.render();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";

    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <i class="fa-solid fa-palette toolbar-color" data-id='${
                note.id
              }'></i>
              <i class="fa-solid fa-trash toolbar-delete"></i>
            </div>
          </div>
        </div>
        `
      )
      .join("");
  }

  render() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
    this.displayNotes();
  }

  openModal(event) {
    if (
      event.target.matches(".toolbar-delete") ||
      event.target.matches(".toolbar-color")
    )
      return;

    if (event.target.closest(".note")) {
      this.$modal.classList.add("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    } else if (event.target.matches(".modal")) {
      this.closeModal();
    }
  }

  closeModal() {
    this.editNote();
    this.$modal.classList.remove("open-modal");
  }

  editNote() {
    const text = this.$modalText.value;
    const title = this.$modalTitle.value;
    this.notes = this.notes.map((note) =>
      note.id == this.id ? { ...note, text, title } : note
    );
    this.render();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".note");
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;

    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }
}

new App();
