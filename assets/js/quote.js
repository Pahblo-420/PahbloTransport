fetch("form.html")
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  })
  .then(data => {
    // Insert the modal HTML into the body
    document.body.insertAdjacentHTML('beforeend', data);

    const modal = document.getElementById("quoteModal");
    const form = document.getElementById("quoteForm");
    const btn = document.getElementById("quoteBtn");
    const btn2 = document.getElementById("quoteBtnNav");
    const span = modal.querySelector(".close");

    if (!modal || !form) return;

    // Open modal function
    function openModal(e) {
      e.preventDefault();
      modal.style.display = "block";
    }

    // Attach to both buttons
    if (btn) btn.addEventListener("click", openModal);
    if (btn2) btn2.addEventListener("click", openModal);

    // Close modal on X click
    if (span) span.addEventListener("click", () => modal.style.display = "none");

    // Close modal if clicked outside
    window.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

    // Form submission
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      // Calculate price
      const grade = parseInt(document.getElementById("grade").value);
      const frequency = document.getElementById("frequency").value;
      let basePrice = 50;

      if (grade >= 10) basePrice += 20;
      if (frequency === "daily") basePrice += 30;

      const resultElement = document.getElementById("quoteResult");
      resultElement.innerText = `Estimated Price: R${basePrice}.00. Sending request...`;
      resultElement.style.color = "black";

      // Send to Formspree
      const formData = new FormData(form);
      formData.append("price", `R${basePrice}.00`);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          resultElement.innerText = `Success! R${basePrice}.00 estimate sent. We'll contact you soon!`;
          resultElement.style.color = "green";
          form.reset();
          setTimeout(() => { modal.style.display = "none"; }, 4000);
        } else {
          resultElement.innerText = "Oops! Problem sending. Please check your internet.";
          resultElement.style.color = "red";
        }
      })
      .catch(() => {
        resultElement.innerText = "Error: Could not connect to the server.";
        resultElement.style.color = "red";
      });
    });
  })
  .catch(error => console.error("Error loading form:", error));