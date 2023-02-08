const catalogCardAddEvents = (card) => {
    if (card.classList.contains('is-init'))  {
        return false;
    }

    let addBtn = card.querySelector('.js-catalogCardAdd'),
        counterInput = card.querySelector('.js-counterInput');

    addBtn.addEventListener('click', () => {
        counterInput.value = 1;
        card.classList.add('in-basket');
    });

    counterInput.addEventListener('change', () => {
        if (counterInput.value == 0) {
            card.classList.remove('in-basket');
        }
    });

    card.classList.add('is-init');
}

const catalogCardsInit = () => {
    let cards = document.querySelectorAll('.js-catalogCard');

    cards.forEach(card => {
        catalogCardAddEvents(card);
    });
}

document.addEventListener('DOMContentLoaded', catalogCardsInit);
