document.addEventListener("DOMContentLoaded", function() {
    const minSlider = document.getElementById("minPrice");
    const maxSlider = document.getElementById("maxPrice");
    const range = document.getElementById("sliderRange");
    const minValueLabel = document.getElementById("minValue");
    const maxValueLabel = document.getElementById("maxValue");

    if (!minSlider || !maxSlider || !range) return;

    const maxPriceValue = 3000;

    function updateSlider(e) {
        let min = parseInt(minSlider.value);
        let max = parseInt(maxSlider.value);

        if (min > max - 100) {
            if (e && e.target.id === "minPrice") {
                minSlider.value = max - 100;
                min = max - 100;
            } else {
                maxSlider.value = min + 100;
                max = min + 100;
            }
        }

        minValueLabel.textContent = "$" + min;
        maxValueLabel.textContent = "$" + max;

        const percentMin = (min / maxPriceValue) * 100;
        const percentMax = (max / maxPriceValue) * 100;

        range.style.left = percentMin + "%";
        range.style.right = (100 - percentMax) + "%";

        if (e && typeof applyFiltersAndSort === "function") {
            applyFiltersAndSort();
        }
    }

    window.updateSliderUI = () => updateSlider();

    minSlider.addEventListener("input", updateSlider);
    maxSlider.addEventListener("input", updateSlider);

    updateSlider();
});