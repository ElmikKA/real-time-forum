import { toggleVisibility } from "../functions/toggleVisibility.js";

export function showCustomConfirm(message, callback) {
    const customeMessage = document.getElementById('custom-confirm-message');

    toggleVisibility('custom-confirm-message', true)

    const modalContent = document.createElement('div');
    modalContent.classList.add('confirm-modal-content');
    modalContent.id = 'custom-confirm';

    const confirmMessage = document.createElement('p');
    confirmMessage.classList.add('confirm-message');
    confirmMessage.textContent = message;

    const confirmYes = document.createElement('button');
    confirmYes.classList.add('confirm-modal-button');
    confirmYes.id = 'confirm-yes';
    confirmYes.textContent = 'YES';

    const confirmNo = document.createElement('button');
    confirmNo.classList.add('confirm-modal-button');
    confirmNo.id = 'confirm-no';
    confirmNo.textContent = 'NO';

    modalContent.appendChild(confirmMessage);
    modalContent.appendChild(confirmYes);
    modalContent.appendChild(confirmNo);

    customeMessage.appendChild(modalContent);

    confirmYes.onclick = () => {
        closeConfirm(true);
    };

    confirmNo.onclick = () => {
        closeConfirm(false);
    };

    function closeConfirm(bool) {
        toggleVisibility('custom-confirm-message', false);
        customeMessage.removeChild(modalContent)
        callback(bool);
    }
}

export function showCustomAlert(message) {
    const customMessage = document.getElementById('custom-alert-message');

    toggleVisibility('custom-alert-message', true)

    const modalContent = document.createElement('div');
    modalContent.classList.add('alert-modal-content');
    modalContent.id = 'custome-alert';

    const closeDiv = document.createElement('div');
    closeDiv.classList.add('close-alert');
    
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-alert-button');
    closeButton.innerHTML = '&times;';

    closeDiv.appendChild(closeButton);

    modalContent.appendChild(closeDiv);

    const alertMessage = document.createElement('p');
    alertMessage.id = 'alert-message';
    alertMessage.textContent = message;

    modalContent.appendChild(alertMessage);

    customMessage.appendChild(modalContent);

    closeButton.onclick = () => {
        closeAlert();
    };

    setTimeout(() => {
        closeAlert();
    }, 5000);

    function closeAlert() {
        toggleVisibility('custom-alert-message', false)
        
        setTimeout(() => {
            customMessage.removeChild(modalContent);
        }, 500);
    }
}
