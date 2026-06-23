fetch("./form.html")
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  })
  .then(data => {
    // Insert the modal HTML into the body
    document.body.insertAdjacentHTML('beforeend', data);

    const modal = document.getElementById("quoteModal");
    const form = document.getElementById("quoteForm");
    const btn = document.getElementById("quoteBtn"); // Button on the page
    const btn2 = document.getElementById("quoteBtnNav"); // Button in navigation
    const span = modal.querySelector(".close");

    if (!modal || !form) return;

    // Open modal function
    function openModal(e) {
      if (e) e.preventDefault();
      modal.style.display = "flex";
    }

    // Attach to both buttons safely (handles if a page is missing one of the buttons)
    if (btn) btn.addEventListener("click", openModal);
    if (btn2) btn2.addEventListener("click", openModal);

    // Close modal on X click
    if (span) span.addEventListener("click", () => modal.style.display = "none");

    // Close modal if clicked outside the white box
    window.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

    // Form submission and Price Calculation
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      // Get values from the new form
      const tripType = document.getElementById("tripType").value;
      const distance = document.getElementById("distance").value;
      const learners = parseInt(document.getElementById("learners").value);

      // --- YOUR PRICING LOGIC ---
      // 1. Base Monthly Price per learner (assuming Two-Way, Nearby)
      let pricePerLearner = 600; 

      // 2. Adjust for Distance
      if (distance === "medium") pricePerLearner += 200; // e.g., R800
      if (distance === "far") pricePerLearner += 400;    // e.g., R1000

      // 3. Adjust for One-way vs Two-way (One-way is usually 70% of the price, not 50%)
      if (tripType === "oneway") {
        pricePerLearner = Math.floor(pricePerLearner * 0.7);
      }

      // 4. Multiply by number of kids and apply Sibling Discounts
      let totalMonthlyPrice = pricePerLearner * learners;
      
      if (learners === 2) {
          totalMonthlyPrice = Math.floor(totalMonthlyPrice * 0.90); // 10% discount
      } else if (learners >= 3) {
          totalMonthlyPrice = Math.floor(totalMonthlyPrice * 0.85); // 15% discount
      }

      // Display the result
      const resultElement = document.getElementById("quoteResult");
      resultElement.innerText = `Estimated Monthly Rate: R${totalMonthlyPrice}. Sending request...`;
      resultElement.style.color = "#333";

      // Append calculated price to form data before sending to Formspree
      const formData = new FormData(form);
      formData.append("Estimated_Monthly_Price", `R${totalMonthlyPrice}`);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          resultElement.innerText = `Success! Your estimate is R${totalMonthlyPrice}/month. We'll contact you shortly!`;
          resultElement.style.color = "green";
          form.reset();
          setTimeout(() => { modal.style.display = "none"; resultElement.innerText = ""; }, 5000);
        } else {
          resultElement.innerText = "Oops! Problem sending. Please check your internet connection.";
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