export function showCustomConfirm(message, callback) {
    const confirmModal = document.getElementById('custom-confirm');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    confirmMessage.textContent = message;
    confirmModal.classList.remove('hidden');
    confirmModal.classList.add('visible');

    confirmYes.onclick = () => {
        confirmModal.classList.remove('visible');
        confirmModal.classList.add('hidden');
        callback(true);
    };

    confirmNo.onclick = () => {
        confirmModal.classList.remove('visible');
        confirmModal.classList.add('hidden');
        callback(false);
    };
}

export function showCustomAlert(message) {
    const alertModal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertOk = document.getElementById('alert-ok');

    alertMessage.textContent = message;
    alertModal.classList.remove('hidden');
    alertModal.classList.add('visible');

    alertOk.onclick = () => {
        alertModal.classList.remove('visible');
        alertModal.classList.add('hidden');
    };
}
