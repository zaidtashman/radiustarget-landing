document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('access-modal');
    const openBtn = document.getElementById('btn-request-access');
    const closeBtn = document.getElementById('close-modal-btn');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const form = document.getElementById('request-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const statusMsg = document.getElementById('form-status');

    // Functions to handle transition classes for smooth animation
    function showModal() {
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before adding opacity classes
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
            panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
        }, 10);
    }

    function hideModal() {
        backdrop.classList.add('opacity-0');
        panel.classList.remove('opacity-100', 'translate-y-0', 'sm:scale-100');
        panel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();

            // Reset the submit button state
            submitBtn.disabled = false;
            btnText.textContent = "Join";
            btnSpinner.classList.add('hidden');

            // Reset visibility state of form fields
            Array.from(form.children).forEach(child => {
                child.classList.remove('hidden');
            });

            // Re-show the top header (Rocket icon & "Join Waitlist")
            const modalHeader = form.previousElementSibling;
            if (modalHeader) modalHeader.classList.remove('hidden');

            // Hide and clear the status message
            statusMsg.classList.add('hidden');
            statusMsg.innerHTML = '';
        }, 300); // Wait for transition to finish
    }

    // Event Listeners
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
    }

    // Close on clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.closest('#modal-panel') === null) {
                hideModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });

    // Form Submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // UI Loading State
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            btnSpinner.classList.remove('hidden');
            statusMsg.classList.add('hidden');

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company_role: document.getElementById('company_role').value,
                geo_needs: document.getElementById('geo_needs').value
            };

            try {
                const response = await fetch('https://radiustarget.com/api/request-access', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // 1. Hide the top header (Rocket icon) so it doesn't clash with the success checkmark
                    const modalHeader = form.previousElementSibling;
                    if (modalHeader) modalHeader.classList.add('hidden');

                    // 2. Hide everything in the form EXCEPT the status message
                    Array.from(form.children).forEach(child => {
                        if (child.id !== 'form-status') {
                            child.classList.add('hidden');
                        }
                    });

                    // 3. Inject the highly-polished success message
                    statusMsg.innerHTML = `
                        <div class="py-6 flex flex-col items-center justify-center text-center animate-fade-in">
                            <!-- Styled to match the rocket icon's aesthetic -->
                            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6 transition-all transform hover:scale-105">
                                <i class="fa-solid fa-check text-green-600 text-3xl"></i>
                            </div>
                            
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                            
                            <p class="text-sm text-gray-600 leading-relaxed mb-6">
                                Onboarding instructions will be emailed to <br>
                                <span class="font-semibold text-gray-900 text-base">${formData.email}</span> shortly.
                            </p>
                            
                            <!-- Subtle gray box for the spam warning -->
                            <div class="bg-gray-50 rounded-lg p-4 w-full border border-gray-100 text-left">
                                <p class="text-xs text-gray-500 flex items-start">
                                    <i class="fa-solid fa-circle-info mt-0.5 mr-2 text-gray-400"></i>
                                    <span>Please <em class="font-medium text-gray-700">check your spam or junk</em> folder if you don’t see the email in your inbox.</span>
                                </p>
                            </div>
                        </div>
                    `;

                    // Make sure the status message itself is visible
                    statusMsg.className = "w-full block";
                    statusMsg.classList.remove('hidden');

                    // --- NEW: Auto-close the modal after 5000ms ---
                    setTimeout(hideModal, 5000);

                } else {
                    throw new Error(result.error || 'Something went wrong');
                }
            } catch (error) {
                // Error State
                statusMsg.textContent = "Error: " + error.message;
                statusMsg.className = "text-center text-sm font-medium mt-4 p-3 bg-red-50 text-red-700 rounded-lg";
                statusMsg.classList.remove('hidden');

                // Reset Button on Error
                submitBtn.disabled = false;
                btnText.textContent = "Join";
                btnSpinner.classList.add('hidden');
            }
        });
    }
});
