/* Cyberpunk Admin Panel Interactive Helpers */
document.addEventListener('DOMContentLoaded', () => {
  // Mark message read AJAX
  document.querySelectorAll('.btn-mark-read').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const msgId = btn.getAttribute('data-id');
      try {
        const res = await fetch(`/admin/messages/mark-read/${msgId}`, { method: 'POST' });
        if (res.ok) {
          const badge = document.getElementById(`msg-status-${msgId}`);
          if (badge) {
            badge.textContent = 'READ';
            badge.style.color = '#10B981';
          }
          btn.remove();
        }
      } catch (err) {
        console.error("Failed to mark message read", err);
      }
    });
  });
});
