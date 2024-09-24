;(function(){

    'use-strict'

    const form = document.querySelector('.validator--form');
    let inputUser = document.querySelector('#user-name');
    let inputEmail = document.querySelector('#email');
    let inputSetor = document.querySelector('#setor');
    let inputSubject = document.querySelector('#tipo-solicitacao');
    let textArea = document.querySelector('#complaint');
    let inputDataProblema = document.querySelector('#data-problema');
    let inputComportamento = document.querySelector('#comportamento');
    const feedbackMessageError = document.querySelector('.feedbackMessageError');
    const btnClose = document.querySelector('.btn--close');
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const sections = ['section-solicitante', 'section-solicitacao', 'section-detalhes'];
    let currentSectionIndex = 0;

    function nextSection() {
        if (!validateCurrentSection()) {
            return;
        }
        if (currentSectionIndex < sections.length - 1) {
            document.getElementById(sections[currentSectionIndex]).classList.remove('active');
            currentSectionIndex++;
            document.getElementById(sections[currentSectionIndex]).classList.add('active');
        }
    }

    function previousSection() {
        if (currentSectionIndex > 0) {
            document.getElementById(sections[currentSectionIndex]).classList.remove('active');
            currentSectionIndex--;
            document.getElementById(sections[currentSectionIndex]).classList.add('active');
        }
    }

    function validateCurrentSection() {
        let isValid = true;
        let errorMessage = '';

        if (currentSectionIndex === 0) {
            if (!inputUser.value) {
                errorMessage += 'Nome completo é obrigatório. ';
                isValid = false;
            } else if (inputUser.value.length < 3) {
                errorMessage += 'O nome precisa ter pelo menos 3 caracteres. ';
                isValid = false;
            }

            if (!inputEmail.value) {
                errorMessage += 'E-mail é obrigatório. ';
                isValid = false;
            } else if (!emailRegex.test(inputEmail.value)) {
                errorMessage += 'O e-mail informado é inválido. ';
                isValid = false;
            }

            if (!inputSetor.value) {
                errorMessage += 'Setor é obrigatório. ';
                isValid = false;
            }
        }

        if (currentSectionIndex === 1) {
            if (!inputSubject.value) {
                errorMessage += 'Tipo de solicitação é obrigatório. ';
                isValid = false;
            }
            if (!textArea.value) {
                errorMessage += 'Descrição do problema é obrigatória. ';
                isValid = false;
            }
        }

        if (currentSectionIndex === 2) {
            if (!inputDataProblema.value) {
                errorMessage += 'Data e hora do problema são obrigatórias. ';
                isValid = false;
            }
            if (!inputComportamento.value) {
                errorMessage += 'Descrição do comportamento observado é obrigatória. ';
                isValid = false;
            }
            if (!document.querySelector('#responsabilidade').checked) {
                errorMessage += 'É necessário concordar com os termos do site. ';
                isValid = false;
            }
        }

        if (!isValid) {
            showError(errorMessage);
        }

        return isValid;
    }

    function showError(msg) {
        const spanElement = document.querySelector('.span--1');
        spanElement.innerHTML = '';
        const createdElement = document.createElement('p');
        createdElement.textContent = msg;

        feedbackMessageError.classList.add('show');
        spanElement.appendChild(createdElement);

        function hideFeedBack() {
            feedbackMessageError.classList.remove('show');
            createdElement.remove();
        }

        btnClose.addEventListener('click', hideFeedBack);
    }

    document.querySelectorAll('.btn-next').forEach((btn) => {
        btn.addEventListener('click', nextSection);
    });

    document.querySelectorAll('.btn-back').forEach((btn) => {
        btn.addEventListener('click', previousSection);
    });

    form.addEventListener('submit', function (e) {
        if (!validateCurrentSection()) {
            e.preventDefault();
        } else {
            form.submit();
        }
    });

})();
