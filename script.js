// Popup Management
function closePopup() {
    document.getElementById('fraudPopup').classList.add('hidden');
}

// Form Step Navigation
function goToStep2() {
    const fullname = document.getElementById('fullname').value.trim();
    const icnumber = document.getElementById('icnumber').value.trim();
    const appid = document.getElementById('appid').value.trim();
    const amount = document.getElementById('amount').value.trim();

    if (!fullname || !icnumber || !appid || !amount) {
        alert('Sila isi semua maklumat yang diperlukan!');
        return;
    }

    if (icnumber.length !== 12 || isNaN(icnumber)) {
        alert('Nombor IC mesti 12 digit!');
        return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Jumlah bayaran mesti lebih daripada 0!');
        return;
    }

    // Display amount and app ID in step 2
    document.getElementById('displayAmount').textContent = parseFloat(amount).toFixed(2);
    document.getElementById('displayAppId').textContent = appid;

    goToStep(2);
}

function nextStep(stepNumber) {
    goToStep(stepNumber);
}

function prevStep(stepNumber) {
    goToStep(stepNumber);
}

function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.classList.remove('active'));

    // Show selected step
    document.getElementById('step' + stepNumber).classList.add('active');

    // Update progress bar
    updateProgress(stepNumber);
}

function updateProgress(stepNumber) {
    // Update progress items
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index < stepNumber) {
            item.classList.add('active');
        }
    });

    // Update progress line
    const progressLine = document.getElementById('progressLine');
    const progressPercentage = (stepNumber / 4) * 100;
    progressLine.style.width = progressPercentage + '%';
}

// File Upload Management
function fileSelected() {
    const fileInput = document.getElementById('receiptFile');
    const file = fileInput.files[0];

    if (file) {
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('Saiz fail terlalu besar! Maksimum 5MB.');
            fileInput.value = '';
            document.getElementById('uploadStatus').textContent = 'Klik di sini untuk pilih resit';
            return;
        }

        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Hanya format PNG, JPG, JPEG, dan PDF dibenarkan!');
            fileInput.value = '';
            document.getElementById('uploadStatus').textContent = 'Klik di sini untuk pilih resit';
            return;
        }

        // Display file name
        document.getElementById('uploadStatus').textContent = '✓ ' + file.name + ' dipilih';
    }
}

// Submit Receipt
function submitReceipt() {
    const fileInput = document.getElementById('receiptFile');
    const fullname = document.getElementById('fullname').value.trim();
    const appid = document.getElementById('appid').value.trim();

    if (!fileInput.files[0]) {
        alert('Sila pilih resit untuk dimuat naik!');
        return;
    }

    // Display success screen
    document.getElementById('displayCustomerName').textContent = fullname;
    document.getElementById('displayFinalAppId').textContent = appid;

    goToStep(4);

    // Optional: Send data to server
    // submitFormData(fullname, icnumber, appid, amount, fileInput.files[0]);
}

// Reset Form
function resetForm() {
    // Clear all inputs
    document.getElementById('fullname').value = '';
    document.getElementById('icnumber').value = '';
    document.getElementById('appid').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('receiptFile').value = '';
    document.getElementById('uploadStatus').textContent = 'Klik di sini untuk pilih resit';

    // Reset to step 1
    goToStep(1);
}

// Optional: Function to submit form data to server
function submitFormData(fullname, icnumber, appid, amount, file) {
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('icnumber', icnumber);
    formData.append('appid', appid);
    formData.append('amount', amount);
    formData.append('receipt', file);

    // Replace with your actual server endpoint
    fetch('/api/submit-payment', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        goToStep(4);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Terjadi ralat semasa menghantar data. Sila cuba lagi.');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show popup on page load
    const popup = document.getElementById('fraudPopup');
    popup.classList.remove('hidden');

    // Initialize progress
    updateProgress(1);

    // Allow closing popup by clicking outside (optional)
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            // Don't close when clicking outside, only on button
        }
    });
});

// Optional: Keyboard navigation
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeStep = document.querySelector('.form-step.active');
        if (activeStep.id === 'step1') {
            goToStep2();
        }
    }
});
