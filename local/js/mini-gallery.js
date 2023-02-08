document.addEventListener('DOMContentLoaded', () => {
    let miniGalleries = document.querySelectorAll('.js-miniGallery'); 

    function initMiniGaleries(parent) {
        if (KrakenGallery) {       
            new KrakenGallery(parent, '.js-miniGalleryImg');
        }

        new SimpleBar(parent, { autoHide: false });

        let simplebarContent = parent.querySelector('.simplebar-content-wrapper'),
            promGalleryImg = document.querySelectorAll('.js-miniGalleryImg'),
            targetImg = null;
            
        let scrollBooster = new ScrollBooster({
            viewport: simplebarContent,
            scrollMode: 'native',
            direction: 'horizontal',
            emulateScroll: false,
            pointerMode: 'mouse',
        });

        function addPointer() {
            if (targetImg) {
                targetImg.style.pointerEvents = '';
                targetImg = null;
            }
        }

        promGalleryImg.forEach(elem => {
            elem.addEventListener('mousedown', () => {
                targetImg = elem;
            });

            elem.onload = () => {
                scrollBooster.updateMetrics();
            }
        });

        simplebarContent.addEventListener('scroll', () => {
            if (targetImg) {
                targetImg.style.pointerEvents = 'none';
            }
        });

        simplebarContent.addEventListener('mouseup', addPointer);
        simplebarContent.addEventListener('mouseleave', addPointer);
    }

    miniGalleries.forEach(item => {
        initMiniGaleries(item);
    });
});
