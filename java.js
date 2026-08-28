/* =========================================
   STUDENT PROFILE JAVASCRIPT
========================================= */
/* -----------------------------------------
   1. SHOW TOAST MESSAGE
----------------------------------------- */
function showToast(message) {
    document.getElementById("toastMessage").textContent = message;
    const toastElement = document.getElementById("successToast");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
/* -----------------------------------------
   2. EDIT PROFILE
----------------------------------------- */
const saveProfile = document.getElementById("saveProfile");
saveProfile.addEventListener("click", function () {
    const firstName =
        document.getElementById("firstNameInput").value.trim();
    const lastName =
        document.getElementById("lastNameInput").value.trim();
    const email =
        document.getElementById("emailInput").value.trim();
    const phone =
        document.getElementById("phoneInput").value.trim();
    // Validation
    if (firstName === "" || lastName === "") {
        alert("Please enter your first and last name.");
        return;
    }
    if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
    }
    // Update profile
    document.getElementById("studentName").textContent =
        firstName + " " + lastName;
    document.getElementById("firstNameText").textContent =
        firstName;
    document.getElementById("lastNameText").textContent =
        lastName;
    document.getElementById("emailText").textContent =
        email;
    document.getElementById("phoneText").textContent =
        phone;
    // Save to LocalStorage
    const profileData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };
    localStorage.setItem(
        "studentProfile",
        JSON.stringify(profileData)
    );
    // Close modal
    const modalElement =
        document.getElementById("editModal");
    const modal =
        bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    showToast("Profile updated successfully!");
});
/* -----------------------------------------
   3. LOAD PROFILE FROM LOCAL STORAGE
----------------------------------------- */
window.addEventListener("DOMContentLoaded", function () {
    const savedProfile =
        localStorage.getItem("studentProfile");
    if (savedProfile) {
        const profile =
            JSON.parse(savedProfile);
        document.getElementById("firstNameInput").value =
            profile.firstName;
        document.getElementById("lastNameInput").value =
            profile.lastName;
        document.getElementById("emailInput").value =
            profile.email;
        document.getElementById("phoneInput").value =
            profile.phone;
        document.getElementById("studentName").textContent =
            profile.firstName + " " + profile.lastName;
        document.getElementById("firstNameText").textContent =
            profile.firstName;
        document.getElementById("lastNameText").textContent =
            profile.lastName;
        document.getElementById("emailText").textContent =
            profile.email;
        document.getElementById("phoneText").textContent =
            profile.phone;
    }
});
/* -----------------------------------------
   4. PROFILE IMAGE CHANGE
----------------------------------------- */
const imageInput =
    document.getElementById("imageInput");
const profileImage =
    document.getElementById("profileImage");
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    // Check image type
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }
    // Check size
    if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        profileImage.src =
            event.target.result;
        // Save image
        localStorage.setItem(
            "studentProfileImage",
            event.target.result
        );
        showToast("Profile picture updated!");
    };
    reader.readAsDataURL(file);
});
/* -----------------------------------------
   5. LOAD PROFILE IMAGE
----------------------------------------- */
window.addEventListener("DOMContentLoaded", function () {
    const savedImage =
        localStorage.getItem("studentProfileImage");
    if (savedImage) {
        profileImage.src = savedImage;
    }
});
/* -----------------------------------------
   6. DARK MODE
----------------------------------------- */
const themeBtn =
    document.getElementById("themeBtn");
const darkModeSwitch =
    document.getElementById("darkModeSwitch");
function enableDarkMode() {
    document.body.classList.add("dark-mode");
    darkModeSwitch.checked = true;
    themeBtn.innerHTML =
        '<i class="bi bi-sun"></i>';
    localStorage.setItem(
        "darkMode",
        "enabled"
    );
}
function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    darkModeSwitch.checked = false;
    themeBtn.innerHTML =
        '<i class="bi bi-moon"></i>';
    localStorage.setItem(
        "darkMode",
        "disabled"
    );
}
themeBtn.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});
darkModeSwitch.addEventListener("change", function () {
    if (this.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});
/* Load theme */
if (
    localStorage.getItem("darkMode") === "enabled"
) {
    enableDarkMode();
}
/* -----------------------------------------
   7. PASSWORD SHOW / HIDE
----------------------------------------- */
const passwordButtons =
    document.querySelectorAll(".password-toggle");
passwordButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const inputId =
            this.getAttribute("data-target");
        const input =
            document.getElementById(inputId);
        if (input.type === "password") {
            input.type = "text";
            this.innerHTML =
                '<i class="bi bi-eye-slash"></i>';
        } else {
            input.type = "password";
            this.innerHTML =
                '<i class="bi bi-eye"></i>';
        }
    });
});
/* -----------------------------------------
   8. PASSWORD STRENGTH
----------------------------------------- */
const newPassword =
    document.getElementById("newPassword");
const strengthBar =
    document.getElementById("strengthBar");
const strengthText =
    document.getElementById("strengthText");
newPassword.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;
    if (password.length >= 8) {
        strength++;
    }
    if (/[A-Z]/.test(password)) {
        strength++;
    }
    if (/[0-9]/.test(password)) {
        strength++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }
    if (password.length === 0) {
        strengthBar.style.width = "0%";
        strengthText.textContent =
            "Enter a password";
    }
    else if (strength <= 1) {
        strengthBar.style.width = "25%";
        strengthText.textContent =
            "Weak password";
    }
    else if (strength === 2) {
        strengthBar.style.width = "50%";
        strengthText.textContent =
            "Medium password";
    }
    else if (strength === 3) {
        strengthBar.style.width = "75%";
        strengthText.textContent =
            "Strong password";
    }
    else {
        strengthBar.style.width = "100%";
        strengthText.textContent =
            "Very strong password";
    }
});
/* -----------------------------------------
   9. CONFIRM PASSWORD
----------------------------------------- */
const confirmPassword =
    document.getElementById("confirmPassword");
const passwordMessage =
    document.getElementById("passwordMessage");
confirmPassword.addEventListener("input", function () {
    if (this.value === newPassword.value) {
        passwordMessage.textContent =
            "Passwords match";
        passwordMessage.style.color =
            "green";
    } else {
        passwordMessage.textContent =
            "Passwords do not match";
        passwordMessage.style.color =
            "red";
    }
});
/* -----------------------------------------
   10. CHANGE PASSWORD
----------------------------------------- */
const changePassword =
    document.getElementById("changePassword");
changePassword.addEventListener("click", function () {
    const current =
        document.getElementById("currentPassword").value;
    const newPass =
        document.getElementById("newPassword").value;
    const confirm =
        document.getElementById("confirmPassword").value;
    if (current === "") {
        alert("Enter your current password.");
        return;
    }
    if (newPass.length < 8) {
        alert("New password must contain at least 8 characters.");
        return;
    }
    if (newPass !== confirm) {
        alert("Passwords do not match.");
        return;
    }
    // Demo only
    // In a real project this should be handled by backend.
    const modalElement =
        document.getElementById("passwordModal");
    const modal =
        bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    showToast("Password changed successfully!");
    // Clear fields
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
});
/* -----------------------------------------
   11. TWO FACTOR AUTHENTICATION
----------------------------------------- */
const twoFactor =
    document.getElementById("twoFactor");
twoFactor.addEventListener("change", function () {
    if (this.checked) {
        showToast(
            "Two-factor authentication enabled."
        );
    } else {
        showToast(
            "Two-factor authentication disabled."
        );
    }
});
/* -----------------------------------------
   12. NOTIFICATION SETTINGS
----------------------------------------- */
const notificationSwitches =
    document.querySelectorAll(".notification-switch");
notificationSwitches.forEach(function (switchElement) {
    switchElement.addEventListener("change", function () {
        if (this.checked) {
            showToast("Notification enabled.");
        } else {
            showToast("Notification disabled.");
        }
    });
});
/* -----------------------------------------
   13. NOTIFICATION BUTTON
----------------------------------------- */
document
    .getElementById("notificationBtn")
    .addEventListener("click", function () {
        showToast(
            "You have 3 new notifications."
        );
    });
/* -----------------------------------------
   14. DOCUMENT UPLOAD
----------------------------------------- */
document
    .getElementById("uploadDocument")
    .addEventListener("click", function () {
        const input =
            document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.jpg,.png";
        input.click();
        input.addEventListener("change", function () {
            if (this.files.length > 0) {
                showToast(
                    this.files[0].name +
                    " selected successfully."
                );
            }
        });
    });
/* -----------------------------------------
   15. DOWNLOAD BUTTONS
----------------------------------------- */
const downloadButtons =
    document.querySelectorAll(".document-item button");
downloadButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        showToast(
            "Document download started."
        );
    });
});