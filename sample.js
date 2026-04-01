const feedbackForm = document.getElementById("feedbackForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!feedbackForm.reportValidity()) {
        formStatus.textContent = "Please fill out all required fields.";
        formStatus.className = "form-status error";
        return;
    }

    const endpoint = feedbackForm.action;
    if (endpoint.includes("your-form-id")) {
        formStatus.textContent = "Add your real Formspree form ID in sample.html to enable submissions.";
        formStatus.className = "form-status error";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    formStatus.textContent = "Sending feedback...";
    formStatus.className = "form-status";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: new FormData(feedbackForm)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        feedbackForm.reset();
        formStatus.textContent = "Feedback submitted successfully.";
        formStatus.className = "form-status success";
    } catch (error) {
        console.error("Feedback submission failed:", error);
        formStatus.textContent = "Submission failed. Check your Formspree endpoint or internet connection.";
        formStatus.className = "form-status error";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Feedback";
    }
});
