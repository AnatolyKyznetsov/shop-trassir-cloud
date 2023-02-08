class ProductsCompare {
    constructor() {
        this.cards = document.querySelector('.js-compareCards');

        this.init();
    }

    init() {
        this.squeezeCard();
        this.cardsSlider();
        this.selectLines();
        this.dropdownChars();
        this.changeView();
    }

    squeezeCard() {
        const top = window.getComputedStyle(this.cards).top.replace('px', '');

        document.addEventListener('scroll', () => {
            const position = this.cards.getBoundingClientRect().top;

            if (position - 1 <= top) {
                this.cards.classList.add('is-sticky');
            } else {
                this.cards.classList.remove('is-sticky');
            }
        });
    }

    cardsSlider() {
        let currentIndex = 0,
            slidesPerView = 4;

        const slider = this.cards.querySelector('.js-compareSlider');
        const sliderWrapper = slider.querySelector('.swiper-wrapper');

        const setIndexes = (slider) => {
            const lines = document.querySelectorAll('.js-compareLineSlider');

            function setItemsIndex(line) {
                const items = line.querySelectorAll('.js-compareLineItem');

                items.forEach((item, index) => {
                    item.dataset.index = index;
                });
            }

            lines.forEach(line => {
                setItemsIndex(line);
            });

            swiper.slides.forEach((slide, index) => {
                slide.dataset.index = index;
            });
        }

        const isSlide = (item) => {
            return item.closest('.swiper');
        } 

        const changeSlidesPerView = () => {
            const pinBtn = document.querySelectorAll('.js-compareSlidePin:not(.is-active)');

            swiper.params.slidesPerView = slidesPerView;
            swiper.update();

            pinBtn.forEach(item => {
                if (slidesPerView === 1) {
                    item.classList.add('is-disabled')
                } else {
                    item.classList.remove('is-disabled')
                }
            });
        }

        const removeCard = (card) => {
            const items = document.querySelectorAll(`.js-compareLineItem[data-connect="${card.dataset.connect}"]`);

            if (isSlide(card)) {
                swiper.removeSlide(currentIndex);
                setIndexes();
            } else {
                card.remove();
                slidesPerView++;
                changeSlidesPerView();
            }

            items.forEach(item => {
                item.remove();
            });
        }

        const pinCard = card => {
            let slide = swiper.slides[currentIndex];

            const cardsFixedBlock = this.cards.querySelector('.js-compareCardsFixed');
            const items = document.querySelectorAll(`.js-compareLineItem[data-connect="${card.dataset.connect}"]`);
            const inBasketClassName = card.classList.contains('in-basket') ? 'in-basket' : '';

            slide.className = `catalog-card js-catalogCard catalog-card_compare ${inBasketClassName}`;
            slide.removeAttribute('style');
            slide.removeAttribute('role');
            slide.removeAttribute('aria-label');

            slide = slide.cloneNode(true);

            cardsFixedBlock.append(slide);
            addCardEvents(swiper, slide);
            catalogCardAddEvents(slide);

            swiper.removeSlide(currentIndex);
            slidesPerView--;
            changeSlidesPerView();

            items.forEach(item => {
                const newParent = item.closest('.js-compareLineInner').querySelector('.js-compareLineFixed');

                newParent.append(item);
            });

            setIndexes();
        }

        const unPinCard = (card) => {
            const index = card.dataset.index;
            const items = document.querySelectorAll(`.js-compareLineItem[data-connect="${card.dataset.connect}"]`);

            swiper.addSlide(index, card.outerHTML);
            swiper.slideTo(0);

            slidesPerView++;
            changeSlidesPerView();

            addCardEvents(swiper, swiper.slides[index]);
            catalogCardAddEvents(swiper.slides[index]);
            card.remove();

            items.forEach(item => {
                const lineSlider = item.closest('.js-compareLineInner').querySelector('.js-compareLineSlider');
                const nextItem = lineSlider.querySelector(`.js-compareLineItem[data-index="${index}"]`);

                lineSlider.insertBefore(item, nextItem);
            });

            setIndexes();
        }

        const setPosition = () => {
            const lineSliders = document.querySelectorAll('.js-compareLineSlider');

            lineSliders.forEach(item => {
                item.style.transform = sliderWrapper.style.transform;
                item.style.transitionDuration = sliderWrapper.style.transitionDuration;
            });
        }

        const addCardEvents = (slider, slide) => {
            const pinBtn = slide.querySelector('.js-compareSlidePin');
            const removeBtn = slide.querySelector('.js-compareSlideRemove');

            removeBtn.addEventListener('click', () => {
                if (isSlide(slide)) {
                    currentIndex = slider.clickedIndex;
                }

                removeCard(slide);
            });

            pinBtn.addEventListener('click', () => {
                pinBtn.classList.toggle('is-active');

                if (isSlide(slide)) {
                    currentIndex = slider.clickedIndex;
                    pinCard(slide);
                } else {
                    unPinCard(slide);
                }
            });
        }

        const swiper = new Swiper(slider, {
            speed: 200,
            slideClass: 'js-catalogCard',
            slidesPerView: slidesPerView,
            spaceBetween: 32,
            mousewheel: {
                forceToAxis: true,
                invert: false,
                thresholdDelta: 25,
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                draggable: true,
            },
            on: {
                init: function() {
                    const lines = document.querySelectorAll('.js-compareLineSlider');

                    function setItemsAttr(line) {
                        const items = line.querySelectorAll('.js-compareLineItem');
        
                        items.forEach((item, index) => {
                            item.dataset.connect = `slide_${index}`;
                            item.dataset.index = index;
                        });
                    }
        
                    lines.forEach(line => {
                        setItemsAttr(line);
                    });
        
                    this.slides.forEach((slide, index) => {
                        slide.dataset.connect = `slide_${index}`;
                        slide.dataset.index = index;

                        addCardEvents(this, slide);
                    });
                }
            }
        });

        swiper.on('sliderMove', setPosition);
        swiper.on('setTranslate', setPosition);
    }

    selectLines() { 
        const lines = document.querySelectorAll('.js-compareLine');
        
        lines.forEach((line, index) => {
            const checkbox = line.querySelector('.js-compareLineCheckbox');

            line.dataset.id = `line_${index}`;

            const selectLine =  () => {
                const selectedList = document.querySelector('.js-compareSelectedChar');
                const isAnyFixed = selectedList.lastElementChild.classList.contains('is-selected');

                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    const clone = line.cloneNode(true);
                    clone.addEventListener('click', selectLine);
                    clone.classList.add('is-selected');
                    selectedList.append(clone);

                    if (Math.ceil(window.pageYOffset) < Math.ceil(document.documentElement.scrollHeight / 2)  &&
                    isAnyFixed && !selectedList.classList.contains('is-closed')) {
                        window.scrollTo(0, window.pageYOffset + clone.offsetHeight + 1);
                    }
                } else {
                    const selectedLine = selectedList.querySelector(`.js-compareLine[data-id="line_${index}"]`);

                    selectedLine.remove();
                    if (Math.ceil(window.pageYOffset) < Math.ceil(document.documentElement.scrollHeight / 2)) {
                        window.scrollTo(0, window.pageYOffset + selectedLine.offsetHeight + 1);
                    }
                }

            }

            line.addEventListener('click', selectLine);
        });
    }

    dropdownChars() {
        const head = document.querySelector('.js-compareDropdownHead');
        const content = document.querySelector('.js-compareDropdownContent');

        if (!head || !content) {
            return false;
        }

        head.addEventListener('click', () => {
            content.style.maxHeight = `${content.scrollHeight}px`;

            setTimeout(() => {
                head.classList.toggle('is-closed');
                content.classList.toggle('is-closed');
            }, 100);

            setTimeout(() => {
                content.style.maxHeight = '';
            }, 300);
        });
    }

    changeView() {
        const switcher = document.querySelector('.js-compareChangeView');
        
        if (!switcher) {
            return false;
        }

        const isCharsEqual = (line) => {
            let chars = [];

            const items = line.querySelectorAll('.js-compareLineItem');

            items.forEach(item => {
                chars.push(item.textContent.trim());
            });

            chars = chars.filter((item, pos) => chars.indexOf(item) == pos);

            return chars.length === 1;
        }

        switcher.addEventListener('change', () => {
            const lines = document.querySelectorAll('.js-compareLine');

            lines.forEach(line => {
                if (switcher.value === 'all') {
                    line.classList.remove('is-hidden');

                } else if (switcher.value === 'diff') {
                    const hideLine = isCharsEqual(line);

                    if (hideLine) {
                        line.classList.add('is-hidden');
                    }
                }
            });
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductsCompare()
});