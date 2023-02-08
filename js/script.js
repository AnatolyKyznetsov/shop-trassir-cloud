const switchersInit = () => {
    let switchers = document.querySelectorAll('.js-switcher');

    switchers.forEach(item => {
        let buttons = item.querySelectorAll('.js-switcherBtn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                let blocks = document.querySelectorAll('.js-switcherBlock'),
                    name = btn.dataset.name;

                blocks.forEach(elem => {
                    if (elem.dataset.block == name) {
                        elem.classList.add('is-active');
                    } else {
                        elem.classList.remove('is-active');
                    }
                });

                buttons.forEach(elem => {
                    if (elem == btn) {
                        return false;
                    }

                    elem.classList.remove('is-active');
                    btn.classList.add('is-active');
                });
            });
        });
    });
}

const productsSlidersInit = () => {
    let sliders = document.querySelectorAll('.js-productsSlider');

    sliders.forEach(item => {
        new Swiper(item, {
            slideClass: 'js-catalogCard',
            slidesPerView: 'auto',
            spaceBetween: 16,
            mousewheel: {
                forceToAxis: true,
                invert: false,
                thresholdDelta: 25,
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true,
            },
            breakpoints: {
                576: {
                    spaceBetween: 32,
                },
            }
        });
    });
}

const analystSliderInit = () => {
    let slider = document.querySelector('.js-analystSlider');

    new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        mousewheel: {
            forceToAxis: true,
            invert: false,
            thresholdDelta: 25,
        },
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        },
        breakpoints: {
            1280: {
                spaceBetween: 32,
                slidesPerView: 4,
            },
            992: {
                spaceBetween: 32,
                slidesPerView: 3,
            },
            576: {
                spaceBetween: 32,
                slidesPerView: 2,
            },
        }
    });
}

const offerSliderInit = () => {
    let slider = document.querySelector('.js-offerSlider');

    if (!slider) {
        return false;
    }

    let timer = null,
        paginationBullets = null; 

    function sliderAutoPlay(slider) {
        clearInterval(timer);

        timer = setInterval(() => {
            slider.slideNext();
        }, 5000);
    }

    function bulletChange(index) {
        let bulletNextIndex = index + 1 >= paginationBullets.length ? 0 : index + 1,
            nextBullet = slider.querySelector('.swiper-pagination-bullet.is-next');

        if (nextBullet) {
            nextBullet.classList.remove('is-next');
        }

        paginationBullets[bulletNextIndex].classList.add('is-next');
    } 

    const swiper = new Swiper(slider, {
        speed: 600,
        loop: true,
        slidesPerView: 1,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        navigation: {
            nextEl: '.js-offerSliderNext',
            prevEl: '.js-offerSliderPrev',
        },
        on: {
            init: function() {
                paginationBullets = slider.querySelectorAll('.swiper-pagination-bullet');
                sliderAutoPlay(this);
                bulletChange(0);
            },
        },
    });

    swiper.on('slideChange', e => {
        bulletChange(e.realIndex);
        sliderAutoPlay(swiper);
    });

    slider.addEventListener('mouseenter', () => {
        slider.classList.add('is-paused');
        clearInterval(timer);
    });

    slider.addEventListener('mouseleave', () => {
        slider.classList.remove('is-paused');
        sliderAutoPlay(swiper);
    });
}

const tariffSliderInit = () => {
    let slider = document.querySelector('.js-tariffSlider');

    new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: true,
        mousewheel: {
            forceToAxis: true,
            invert: false,
            thresholdDelta: 25,
        },
        breakpoints: {
            576: {
                spaceBetween: 24,
                centeredSlides: false,
            },
        },
        on: {
            init: function() {
                this.slideTo(2);
            },
        },
    });
}

const searchInit = () => {
    let search = document.querySelector('.js-search');

    if (!search) {
        return false;
    }

    let searchOpen = document.querySelector('.js-searchOpen'),
        searchResults = document.querySelector('.js-searchResults'),
        searchClear = document.querySelector('.js-searchClear'),
        searchInput = document.querySelector('.js-searchInput');

    function closeSearch(e) {
        if (!e.target.closest('.js-searchOpen') &&
             !e.target.closest('.js-search')) {
            search.classList.remove('is-active');
            document.removeEventListener('click', closeSearch);

            setTimeout(() => {
                searchInput.value = '';
                searchInput.parentNode.classList.remove('is-active');
                searchResults.innerHTML = '';
            }, 500);
        }
    }

    searchInput.addEventListener('input', () => {
        if (searchInput.value) {
            searchInput.parentNode.classList.add('is-active');
        } else {
            searchInput.parentNode.classList.remove('is-active');
        }
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.parentNode.classList.remove('is-active');
    });

    searchOpen.addEventListener('click', () => {
        search.classList.add('is-active');
        document.addEventListener('click', closeSearch);
    });
}

const burgerMenuInit = () => {
    let burger = document.querySelector('.js-burger'),
        header = document.querySelector('.js-header');

    if (!burger) {
        return false;
    }

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        header.classList.toggle('burger-opened');
    });
}

const productCountersInit = () => {
    function quantityOfSameProducts(id, quantity) {
        if (!id) {
            return false;
        }

        let inputs = document.querySelectorAll(`input.js-counterInput[data-product_id="${id}"]`);

        inputs.forEach(item => {
            item.value = quantity;
        });
    }

    document.addEventListener('click', e => {
        let target = e.target;

        // Убрать 1 товар из корзины
        if (target.classList.contains('js-counterMinus')) {
            let input = target.nextElementSibling,
                quantity = Number(input.value);
            
            if (quantity > 0) {
                --quantity;


                input.value = quantity;

                let event = new Event('change');
                input.dispatchEvent(event);

                quantityOfSameProducts(input.dataset.product_id, quantity);
                // addToBasket
            }
        }

        // Добавить 1 товар в корзину
        if (target.classList.contains('js-counterPluse')) {
            let input = target.previousElementSibling,
                quantity = Number(input.value);

            ++quantity;

            input.value = quantity;

            let event = new Event('change');
            input.dispatchEvent(event);

            quantityOfSameProducts(input.dataset.product_id, quantity);
            // addToBasket
        }

        // Стираем ноль при клике на инпут
        if (target.classList.contains('js-counterInput')) {
            let quantity = Number(target.value);

            target.select();

            if (quantity == 0) {
                target.value = '';
            }
        }
    });

    // Возможность ввода только цифр
    document.addEventListener('input', e => {
        let target = e.target;

        if (target.classList.contains('js-counterInput')) {
            target.value = target.value.replace(/[^\d]/g,'');
        }
    });

    // Потеря фокуса с нрпута кол-ва
    document.addEventListener('focusout', e => {
        let target = e.target;

        if (target.classList.contains('js-counterInput')) {
            let quantity = Number(target.value);
            
            if (quantity == '') {
                quantity = 0;
            }

            let event = new Event('change');
            target.dispatchEvent(event);

            quantityOfSameProducts(target.dataset.product_id, quantity);
            // addToBasket
        }
    });

    // Измененние кол-ва с клавиатуры, перемещение фокуса
    document.addEventListener('keyup', e => {
        let target = e.target;

        if (target.classList.contains('js-counterInput')) {
            if (e.keyCode == 13) {
                target.blur();
                // addToBasket
            }
        }
    });
}

const customSelectInit = () => {
    $('.js-customSelect').select2({
        minimumResultsForSearch: Infinity
    });

    $('.js-customSelect').on('select2:select', function() {
        let event  = new Event('change');
        $(this)[0].dispatchEvent(event);
    });

    $('.js-customSelect').on('select2:open', function() {
        if (SimpleBar) {
            setTimeout(() => {
                new SimpleBar(document.querySelector('.select2-results__options'), { autoHide: false });
            }, 10);
        }
    });
}

const dropdownInit = () => {
    const blocks = document.querySelectorAll('.js-dpordownBlock');

    blocks.forEach(block => {
        const head = block.querySelector('.js-dpordownHead');
        const content = block.querySelector('.js-dpordownContent');
    
        head.addEventListener('click', () => {
            content.style.maxHeight = `${content.scrollHeight}px`;
    
            setTimeout(() => {
                block.classList.toggle('is-closed');
            }, 100);
    
            setTimeout(() => {
                content.style.maxHeight = '';
            }, 300);
        });  
    });
}

document.addEventListener('DOMContentLoaded', () => {
    switchersInit();
    productsSlidersInit();
    analystSliderInit();
    offerSliderInit();
    tariffSliderInit();
    searchInit();
    burgerMenuInit();
    productCountersInit();
    customSelectInit();
    dropdownInit();
});