
/* =========================================================
   DANA PANEL - PROFILE PAGE
   ========================================================= */


/* ---------- Storage ---------- */

const STORAGE_KEYS = {
  profile: "danapanel_profile"
};


/* ---------- Default Profile ---------- */

const defaultProfile = {
  firstName: "Oleya",
  lastName: "Fazely",
  email: "oleya@example.com",
  phone: "+93 700 000 000",
  role: "Administrator",
  bio: "Administrator at DanaPanel.",
  avatar: ""
};


/* ---------- Load Data ---------- */

function loadProfile() {
  try {
    const savedProfile = localStorage.getItem(
      STORAGE_KEYS.profile
    );

    if (!savedProfile) {
      return { ...defaultProfile };
    }

    const parsedProfile = JSON.parse(savedProfile);

    return {
      ...defaultProfile,
      ...parsedProfile
    };

  } catch (error) {
    console.error("Could not load profile:", error);

    return { ...defaultProfile };
  }
}


/* ---------- Save Data ---------- */

function saveProfile(profile) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify(profile)
    );

    return true;

  } catch (error) {
    console.error("Could not save profile:", error);

    showToast(
      "Could not save the profile. The image may be too large.",
      "bi-exclamation-circle-fill"
    );

    return false;
  }
}


/* ---------- Get Initials ---------- */

function getInitials(firstName, lastName) {
  const first = firstName?.trim().charAt(0) || "";
  const last = lastName?.trim().charAt(0) || "";

  return `${first}${last}`.toUpperCase();
}


/* ---------- Update Text ---------- */

function setText(selector, value) {
  document
    .querySelectorAll(selector)
    .forEach((element) => {
      element.textContent = value;
    });
}


/* ---------- Toast ---------- */

function showToast(
  message,
  icon = "bi-check-circle-fill"
) {
  let toastContainer =
    document.getElementById("toastContainer");

  if (!toastContainer) {
    toastContainer = document.createElement("div");

    toastContainer.id = "toastContainer";

    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";

    toastContainer.style.zIndex = "9999";

    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");

  toast.className =
    "toast align-items-center border-0";

  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi ${icon} me-2"></i>
        ${message}
      </div>

      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bootstrapToast =
    new bootstrap.Toast(toast, {
      delay: 3000
    });

  bootstrapToast.show();

  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}


/* ---------- Remove Custom Validation ---------- */

function clearCustomValidation(form) {
  form
    .querySelectorAll("input, textarea, select")
    .forEach((control) => {
      control.setCustomValidity("");
    });
}


/* =========================================================
   PROFILE PAGE
   ========================================================= */

function initProfilePage() {

  const form =
    document.getElementById("profileForm");

  if (!form) {
    return;
  }


  /* ---------- Get Elements ---------- */

  const avatarInput =
    document.getElementById("avatarInput");

  const profileAvatar =
    document.querySelector("[data-profile-avatar]");


  /* ---------- Load Profile ---------- */

  let profile = loadProfile();


  /* ---------- Render Avatar ---------- */

  function renderProfileAvatar() {

    if (!profileAvatar) {
      return;
    }

    profileAvatar.innerHTML = "";

    if (profile.avatar) {

      const image =
        document.createElement("img");

      image.src = profile.avatar;
      image.alt = "Profile picture";

      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "cover";
      image.style.borderRadius = "50%";

      profileAvatar.appendChild(image);

    } else {

      profileAvatar.textContent =
        getInitials(
          profile.firstName,
          profile.lastName
        );
    }
  }


  /* ---------- Fill Form ---------- */

  function fillProfileForm() {

    if (form.elements.firstName) {
      form.elements.firstName.value =
        profile.firstName;
    }

    if (form.elements.lastName) {
      form.elements.lastName.value =
        profile.lastName;
    }

    if (form.elements.email) {
      form.elements.email.value =
        profile.email;
    }

    if (form.elements.phone) {
      form.elements.phone.value =
        profile.phone;
    }

    if (form.elements.role) {
      form.elements.role.value =
        profile.role;
    }

    if (form.elements.bio) {
      form.elements.bio.value =
        profile.bio;
    }


    /* Profile card */

    setText(
      "[data-profile-name]",
      `${profile.firstName} ${profile.lastName}`
    );

    setText(
      "[data-profile-role]",
      profile.role
    );


    /* Top navigation */

    setText(
      "[data-admin-name]",
      `${profile.firstName} ${profile.lastName}`
    );

    setText(
      "[data-admin-role]",
      profile.role
    );


    /* Top avatar */

    document
      .querySelectorAll(
        "[data-admin-avatar]"
      )
      .forEach((avatar) => {

        avatar.innerHTML = "";

        if (profile.avatar) {

          const image =
            document.createElement("img");

          image.src = profile.avatar;
          image.alt = "Profile picture";

          image.style.width = "100%";
          image.style.height = "100%";
          image.style.objectFit = "cover";
          image.style.borderRadius = "50%";

          avatar.appendChild(image);

        } else {

          avatar.textContent =
            getInitials(
              profile.firstName,
              profile.lastName
            );
        }
      });


    renderProfileAvatar();
  }


  /* =======================================================
     AVATAR UPLOAD
     ======================================================= */

  avatarInput?.addEventListener(
    "change",
    () => {

      const file =
        avatarInput.files?.[0];

      if (!file) {
        return;
      }


      /* Allowed image types */

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];


      /* Maximum size: 2 MB */

      const maxSize =
        2 * 1024 * 1024;


      if (
        !validTypes.includes(file.type) ||
        file.size > maxSize
      ) {

        avatarInput.value = "";

        showToast(
          "Choose a JPG, PNG or WebP image under 2 MB.",
          "bi-exclamation-circle-fill"
        );

        return;
      }


      /* Read image */

      const reader =
        new FileReader();


      reader.addEventListener(
        "load",
        () => {

          profile.avatar =
            reader.result;

          renderProfileAvatar();


          /* Also update top avatar */

          document
            .querySelectorAll(
              "[data-admin-avatar]"
            )
            .forEach((avatar) => {

              avatar.innerHTML = "";

              const image =
                document.createElement("img");

              image.src =
                profile.avatar;

              image.alt =
                "Profile picture";

              image.style.width = "100%";
              image.style.height = "100%";
              image.style.objectFit = "cover";
              image.style.borderRadius = "50%";

              avatar.appendChild(image);
            });


          showToast(
            "New photo preview is ready.",
            "bi-image-fill"
          );
        }
      );


      reader.readAsDataURL(file);
    }
  );


  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      /* Clear previous custom errors */

      clearCustomValidation(form);


      /* Name validation */

      const namePattern =
        /^[A-Za-zÀ-ÿ' -]{2,30}$/;


      const firstName =
        form.elements.firstName.value.trim();

      const lastName =
        form.elements.lastName.value.trim();


      if (!namePattern.test(firstName)) {

        form.elements.firstName.setCustomValidity(
          "Enter at least two letters."
        );
      }


      if (!namePattern.test(lastName)) {

        form.elements.lastName.setCustomValidity(
          "Enter at least two letters."
        );
      }


      /* Phone validation */

      const phone =
        form.elements.phone.value.trim();

      const phonePattern =
        /^[0-9+\-() ]{7,20}$/;


      if (!phonePattern.test(phone)) {

        form.elements.phone.setCustomValidity(
          "Enter a valid phone number."
        );
      }


      /* Show Bootstrap validation */

      form.classList.add(
        "was-validated"
      );


      /* Stop if invalid */

      if (!form.checkValidity()) {

        showToast(
          "Please correct the highlighted fields.",
          "bi-exclamation-circle-fill"
        );

        return;
      }


      /* Get form values */

      const formData =
        new FormData(form);


      /* Update profile */

      profile = {
        ...profile,

        firstName:
          formData
            .get("firstName")
            .trim(),

        lastName:
          formData
            .get("lastName")
            .trim(),

        email:
          formData
            .get("email")
            .trim()
            .toLowerCase(),

        phone:
          formData
            .get("phone")
            .trim(),

        role:
          formData.get("role"),

        bio:
          formData
            .get("bio")
            .trim()
      };


      /* Save */

      const saved =
        saveProfile(profile);


      if (!saved) {
        return;
      }


      /* Update page */

      fillProfileForm();


      /* Success */

      showToast(
        "Profile changes saved.",
        "bi-check-circle-fill"
      );
    }
  );


  /* =======================================================
     REMOVE CUSTOM VALIDATION WHILE TYPING
     ======================================================= */

  form
    .querySelectorAll(
      "input, textarea, select"
    )
    .forEach((control) => {

      control.addEventListener(
        "input",
        () => {
          control.setCustomValidity("");
        }
      );

      control.addEventListener(
        "change",
        () => {
          control.setCustomValidity("");
        }
      );
    });


  /* ---------- Initial Render ---------- */

  fillProfileForm();
}


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initProfilePage();

  }
);

