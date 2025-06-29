// script.js
document.getElementById('waitlist-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');
  try {
    const res = await fetch('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    if (res.ok) {
      messageDiv.textContent = 'Thank you for joining the waitlist!';
      messageDiv.style.color = 'green';
      document.getElementById('waitlist-form').reset();
    } else {
      messageDiv.textContent = 'There was an error. Please try again.';
      messageDiv.style.color = 'red';
    }
  } catch {
    messageDiv.textContent = 'Network error. Please try again.';
    messageDiv.style.color = 'red';
  }
});
