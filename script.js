const SUPABASE_URL =
  "https://iuronvdnglktvzhryjqo.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_OzIuaEhdwtOkpvXb1hbRJw_9EO71bBk";


const grid =
  document.getElementById("projectGrid");

const errorMessage =
  document.getElementById("projectError");


const modal =
  document.getElementById("videoModal");

const modalVideo =
  document.getElementById("modalVideo");

const modalTitle =
  document.getElementById("modalTitle");

const modalNote =
  document.getElementById("modalNote");

const modalClose =
  document.querySelector(".modal-close");


const menuToggle =
  document.getElementById("menuToggle");

const mainNavigation =
  document.getElementById("mainNavigation");


const contactForm =
  document.getElementById("contactForm");

const formStatus =
  document.getElementById("formStatus");


/* =========================
   LOAD PROJECTS
========================= */

async function loadProjects() {

  try {

    const endpoint =
      `${SUPABASE_URL}/rest/v1/projects` +
      `?select=*` +
      `&published=eq.true` +
      `&order=display_order.asc`;


    const response =
      await fetch(
        endpoint,
        {
          headers: {
            apikey: SUPABASE_KEY
          }
        }
      );


    if (!response.ok) {

      const details =
        await response.text();


      throw new Error(
        `Supabase request failed ` +
        `(${response.status}): ${details}`
      );

    }


    const projects =
      await response.json();


    if (
      !Array.isArray(projects) ||
      projects.length === 0
    ) {

      throw new Error(
        "No published projects were returned."
      );

    }


    renderProjects(projects);

  } catch (error) {

    console.error(error);


    grid.innerHTML = "";


    errorMessage.hidden = false;

  }

}


/* =========================
   RENDER PROJECTS
========================= */

function renderProjects(projects) {

  grid.innerHTML = "";


  projects.forEach((project) => {

    const card =
      document.createElement("button");


    card.className =
      "project-card";

    card.type =
      "button";


    card.setAttribute(
      "aria-label",
      `Play ${project.title}`
    );


    const image =
      document.createElement("img");


    image.src =
      project.cover_url;

    image.alt =
      project.title;

    image.loading =
      "lazy";

    image.decoding =
      "async";


    const overlay =
      document.createElement("span");


    overlay.className =
      "project-overlay";


    const title =
      document.createElement("span");


    title.className =
      "project-title";

    title.textContent =
      project.title;


    card.append(
      image,
      overlay,
      title
    );


    card.addEventListener(
      "click",
      () => {
        openProject(project);
      }
    );


    grid.appendChild(card);

  });

}


/* =========================
   VIDEO MODAL
========================= */

function openProject(project) {

  modalTitle.textContent =
    project.title;


  modalNote.textContent =
    project.note || "";


  modalNote.style.display =
    project.note
      ? "block"
      : "none";


  modalVideo.src =
    project.video_url;


  modalVideo.currentTime = 0;


  modal.classList.add("open");


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  modalVideo
    .play()
    .catch(() => {});

}


function closeProject() {

  modalVideo.pause();


  modalVideo.removeAttribute("src");


  modalVideo.load();


  modal.classList.remove("open");


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


if (modalClose) {

  modalClose.addEventListener(
    "click",
    closeProject
  );

}


if (modal) {

  modal.addEventListener(
    "click",
    (event) => {

      if (event.target === modal) {

        closeProject();

      }

    }
  );

}


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      modal.classList.contains("open")
    ) {

      closeProject();

    }

  }
);


/* =========================
   MOBILE MENU
========================= */

if (
  menuToggle &&
  mainNavigation
) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        mainNavigation
          .classList
          .toggle("open");


      menuToggle
        .classList
        .toggle(
          "open",
          isOpen
        );


      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    }
  );


  mainNavigation
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          mainNavigation
            .classList
            .remove("open");


          menuToggle
            .classList
            .remove("open");


          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}


/* =========================
   CONTACT FORM
========================= */

if (
  contactForm &&
  formStatus
) {

  contactForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const submitButton =
        contactForm.querySelector(
          ".form-submit"
        );


      const formData =
        new FormData(contactForm);


      const messageData = {

        name:
          String(
            formData.get("name") || ""
          ).trim(),

        email:
          String(
            formData.get("email") || ""
          ).trim(),

        phone:
          String(
            formData.get("phone") || ""
          ).trim(),

        message:
          String(
            formData.get("message") || ""
          ).trim()

      };


      submitButton.disabled =
        true;


      submitButton.textContent =
        "SENDING...";


      formStatus.textContent =
        "";


      try {

        const response =
          await fetch(

            `${SUPABASE_URL}` +
            `/rest/v1/contact_messages`,

            {

              method:
                "POST",

              headers: {

                apikey:
                  SUPABASE_KEY,

                "Content-Type":
                  "application/json",

                Prefer:
                  "return=minimal"

              },

              body:
                JSON.stringify(
                  messageData
                )

            }

          );


        if (!response.ok) {

          const details =
            await response.text();


          throw new Error(

            `Contact form error ` +
            `(${response.status}): ` +
            details

          );

        }


        contactForm.reset();


        formStatus.textContent =
          "Thank you. Your message was sent successfully.";

      } catch (error) {

        console.error(error);


        formStatus.textContent =
          "Something went wrong. Please email Dfinna@gmail.com.";

      } finally {

        submitButton.disabled =
          false;


        submitButton.textContent =
          "SEND MESSAGE";

      }

    }
  );

}


/* =========================
   START WEBSITE
========================= */

loadProjects();