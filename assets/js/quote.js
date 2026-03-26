// quote.js
// Load the modal HTML into the page
fetch("form.html")
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  })
  .then(data => {
    document.body.insertAdjacentHTML('beforeend', data);

    // Modal elements
    const modal = document.getElementById("quoteModal");
    const btn = document.getElementById("quoteBtn");
    const span = modal.querySelector(".close");

    // Open modal
    btn.addEventListener("click", function(e) {
      e.preventDefault(); // Prevent page jump
      modal.style.display = "block";
    });

    // Close modal
    span.onclick = () => modal.style.display = "none";
    window.onclick = e => { if (e.target == modal) modal.style.display = "none"; }

    // Form submit
    const form = document.getElementById("quoteForm");
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const grade = parseInt(document.getElementById("grade").value);
      const frequency = document.getElementById("frequency").value;

      let basePrice = 50;
      if (grade >= 10) basePrice += 20;
      if (frequency === "weekly") basePrice *= 5;

      document.getElementById("quoteResult").innerText =
        `Estimated Price: R${basePrice}.00 for ${frequency} transport`;
    });
  });