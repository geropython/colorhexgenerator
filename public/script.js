document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const colors = getDistinctColors(img, 10); // Hasta 10 colores distintos
                displayColors(colors);
            };
        };
        reader.readAsDataURL(file);
    }
});

// Agrupa colores por familias y devuelve hasta N colores distintos
function getDistinctColors(img, maxColors = 10) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorCount = {};
    const binSize = 32;

    for (let i = 0; i < data.length; i += 4) {
        let r = Math.round(data[i] / binSize) * binSize;
        let g = Math.round(data[i + 1] / binSize) * binSize;
        let b = Math.round(data[i + 2] / binSize) * binSize;
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);

        if (data[i + 3] < 128) continue;

        const rgb = `${r},${g},${b}`;
        colorCount[rgb] = (colorCount[rgb] || 0) + 1;
    }

    // Ordenar por frecuencia
    const sortedColors = Object.entries(colorCount)
        .sort((a, b) => b[1] - a[1])
        .map(([rgb]) => {
            const [r, g, b] = rgb.split(',').map(Number);
            return {
                rgb: { r, g, b },
                hex: rgbToHex(r, g, b),
                count: colorCount[rgb]
            };
        });

    // Agrupar por familia de color usando HSL
    const families = {};
    sortedColors.forEach(color => {
        const { r, g, b } = color.rgb;
        const hsl = rgbToHsl(r, g, b);
        let family = getColorFamily(hsl);

        // Solo un color por familia, el más frecuente
        if (!families[family]) {
            families[family] = color;
        }
    });

    // Devuelve hasta maxColors colores, uno por familia
    return Object.values(families).slice(0, maxColors);
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Convierte RGB a HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // gris
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

// Determina la familia de color a partir de HSL
function getColorFamily(hsl) {
    const { h, s, l } = hsl;
    if (l < 15) return 'Negro';
    if (l > 85 && s < 20) return 'Blanco';
    if (s < 20) return 'Gris';
    if (h >= 0 && h < 15) return 'Rojo';
    if (h >= 15 && h < 45) return 'Naranja';
    if (h >= 45 && h < 70) return 'Amarillo';
    if (h >= 70 && h < 170) return 'Verde';
    if (h >= 170 && h < 260) return 'Azul';
    if (h >= 260 && h < 320) return 'Violeta';
    if (h >= 320 && h < 345) return 'Rosa';
    return 'Rojo';
}

// Mostrar los colores dominantes
function displayColors(colors) {
    const colorDisplay = document.getElementById('colorDisplay');
    const hexDisplay = document.getElementById('hexDisplay');
    const imageContainer = document.getElementById('imageContainer');

    colorDisplay.innerHTML = '';
    hexDisplay.innerHTML = '';

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-box-multi';
        colorDiv.style.backgroundColor = color.hex;
        colorDiv.style.border = `3px solid ${color.hex}`;
        colorDiv.title = color.hex;

        const hexText = document.createElement('div');
        hexText.className = 'hex-value-multi';
        hexText.textContent = color.hex;

        // Mostrar la familia de color
        const famText = document.createElement('div');
        famText.className = 'hex-value-multi';
        famText.style.fontSize = '0.85em';
        famText.style.opacity = '0.7';
        famText.textContent = getColorFamily(rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b));

        const wrapper = document.createElement('div');
        wrapper.className = 'color-wrapper';
        wrapper.appendChild(colorDiv);
        wrapper.appendChild(hexText);
        wrapper.appendChild(famText);

        colorDisplay.appendChild(wrapper);
    });

    // Mostrar la imagen con borde del color más dominante
    if (colors.length > 0) {
        const fileInput = document.getElementById('imageUpload');
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageContainer.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '220px';
                img.style.border = `8px solid ${colors[0].hex}`;
                img.style.borderRadius = '12px';
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}

document.getElementById('imageUpload').addEventListener('change', function(){
    const fileName = this.files[0] ? this.files[0].name : 'Ningún archivo seleccionado';
    document.getElementById('file-chosen').textContent = fileName;
});