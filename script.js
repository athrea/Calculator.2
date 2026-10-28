// =====================================
// MODE KALKULATOR
// =====================================

function switchMode(mode) {
    const basicCalculator = document.getElementById("basicCalculator");
    const geometryCalculator = document.getElementById("geometryCalculator");
    const basicMode = document.getElementById("basicMode");
    const geometryMode = document.getElementById("geometryMode");

    if (mode === "basic") {
        basicCalculator.hidden = false;
        geometryCalculator.hidden = true;

        basicMode.classList.add("active");
        geometryMode.classList.remove("active");
    } else {
        basicCalculator.hidden = true;
        geometryCalculator.hidden = false;

        basicMode.classList.remove("active");
        geometryMode.classList.add("active");

        updateGeometryFields();
    }
}


// =====================================
// PENGATURAN INPUT BANGUN RUANG
// =====================================

function updateGeometryFields() {
    const shape = document.getElementById("shape").value;
    const operation = document.getElementById("geometryOperation").value;
    const inputsContainer = document.getElementById("geometryInputs");
    const resultBox = document.getElementById("geometryResult");

    const fields = {
        cube: {
            volume: [
                ["side", "Panjang sisi", "sisi"]
            ],
            surface: [
                ["side", "Panjang sisi", "sisi"]
            ]
        },

        cuboid: {
            volume: [
                ["length", "Panjang", "panjang"],
                ["width", "Lebar", "lebar"],
                ["height", "Tinggi", "tinggi"]
            ],
            surface: [
                ["length", "Panjang", "panjang"],
                ["width", "Lebar", "lebar"],
                ["height", "Tinggi", "tinggi"]
            ]
        },

        cylinder: {
            volume: [
                ["radius", "Jari-jari alas", "jari-jari"],
                ["height", "Tinggi tabung", "tinggi"]
            ],
            surface: [
                ["radius", "Jari-jari alas", "jari-jari"],
                ["height", "Tinggi tabung", "tinggi"]
            ]
        },

        sphere: {
            volume: [
                ["radius", "Jari-jari bola", "jari-jari"]
            ],
            surface: [
                ["radius", "Jari-jari bola", "jari-jari"]
            ]
        },

        cone: {
            volume: [
                ["radius", "Jari-jari alas", "jari-jari"],
                ["height", "Tinggi kerucut", "tinggi"]
            ],
            surface: [
                ["radius", "Jari-jari alas", "jari-jari"],
                ["slant", "Garis pelukis", "garis-pelukis"]
            ]
        },

        prism: {
            volume: [
                ["baseArea", "Luas alas segitiga", "luas"],
                ["height", "Tinggi prisma", "tinggi"]
            ],
            surface: [
                ["baseArea", "Luas alas segitiga", "luas"],
                ["basePerimeter", "Keliling alas segitiga", "keliling"],
                ["height", "Tinggi prisma", "tinggi"]
            ]
        },

        pyramid: {
            volume: [
                ["side", "Panjang sisi alas persegi", "sisi"],
                ["height", "Tinggi tegak limas", "tinggi"]
            ],
            surface: [
                ["side", "Panjang sisi alas persegi", "sisi"],
                ["slant", "Tinggi sisi tegak", "tinggi-sisi"]
            ]
        }
    };

    inputsContainer.innerHTML = "";

    resultBox.textContent = "Hasil akan muncul di sini.";

    const selectedFields = fields[shape][operation];

    selectedFields.forEach(function (field) {
        const id = field[0];
        const labelText = field[1];
        const placeholderText = field[2];

        const label = document.createElement("label");
        label.htmlFor = "geo-" + id;
        label.textContent = labelText + ":";

        const input = document.createElement("input");

        input.type = "number";
        input.id = "geo-" + id;
        input.className = "geometry-input";
        input.placeholder = "Masukkan " + placeholderText;
        input.min = "0";
        input.step = "any";
        input.required = true;

        inputsContainer.appendChild(label);
        inputsContainer.appendChild(input);
    });
}


// =====================================
// MENGHITUNG BANGUN RUANG
// =====================================

function calculateGeometry() {
    const shape = document.getElementById("shape").value;
    const operation = document.getElementById("geometryOperation").value;
    const resultBox = document.getElementById("geometryResult");

    // Mengambil nilai input
    function getValue(id) {
        const input = document.getElementById("geo-" + id);

        if (!input || input.value.trim() === "") {
            return NaN;
        }

        return Number(input.value);
    }

    // Memeriksa semua input
    const inputs = document.querySelectorAll(
        "#geometryInputs input"
    );

    for (const input of inputs) {
        const value = input.value.trim();

        if (value === "" || !Number.isFinite(Number(value)) ||
            Number(value) <= 0) {
            resultBox.textContent =
                "Error: Masukkan semua ukuran dengan angka lebih dari 0.";
            return;
        }
    }

    const side = getValue("side");
    const length = getValue("length");
    const width = getValue("width");
    const height = getValue("height");
    const radius = getValue("radius");
    const slant = getValue("slant");
    const baseArea = getValue("baseArea");
    const basePerimeter = getValue("basePerimeter");

    let result;
    let shapeName;
    let operationName;
    let unit;

    // Nama bangun ruang
    const shapeNames = {
        cube: "Kubus",
        cuboid: "Balok",
        cylinder: "Tabung",
        sphere: "Bola",
        cone: "Kerucut",
        prism: "Prisma Segitiga",
        pyramid: "Limas Segiempat"
    };

    shapeName = shapeNames[shape];

    // =================================
    // RUMUS VOLUME
    // =================================

    if (operation === "volume") {
        operationName = "Volume";
        unit = "satuan³";

        switch (shape) {
            case "cube":
                // V = s³
                result = side ** 3;
                break;

            case "cuboid":
                // V = p × l × t
                result = length * width * height;
                break;

            case "cylinder":
                // V = π × r² × t
                result = Math.PI * radius ** 2 * height;
                break;

            case "sphere":
                // V = 4/3 × π × r³
                result = (4 / 3) * Math.PI * radius ** 3;
                break;

            case "cone":
                // V = 1/3 × π × r² × t
                result = (1 / 3) * Math.PI * radius ** 2 * height;
                break;

            case "prism":
                // V = luas alas × tinggi prisma
                result = baseArea * height;
                break;

            case "pyramid":
                // V = 1/3 × luas alas × tinggi
                result = (1 / 3) * side ** 2 * height;
                break;
        }
    }

    // =================================
    // RUMUS LUAS PERMUKAAN
    // =================================

    else {
        operationName = "Luas Permukaan";
        unit = "satuan²";

        switch (shape) {
            case "cube":
                // L = 6 × s²
                result = 6 * side ** 2;
                break;

            case "cuboid":
                // L = 2(pl + pt + lt)
                result = 2 * (
                    length * width +
                    length * height +
                    width * height
                );
                break;

            case "cylinder":
                // L = 2πr(r + t)
                result = 2 * Math.PI * radius * (radius + height);
                break;

            case "sphere":
                // L = 4πr²
                result = 4 * Math.PI * radius ** 2;
                break;

            case "cone":
                // L = πr(r + s)
                result = Math.PI * radius * (radius + slant);
                break;

            case "prism":
                // L = 2 × luas alas + keliling alas × tinggi prisma
                result = 2 * baseArea + basePerimeter * height;
                break;

            case "pyramid":
                // L = sisi alas² + 4 × luas segitiga
                // Luas empat sisi tegak = 2 × sisi alas × tinggi sisi
                result = side ** 2 + 2 * side * slant;
                break;
        }
    }

    // Memeriksa hasil perhitungan
    if (!Number.isFinite(result)) {
        resultBox.textContent =
            "Error: Hasil perhitungan terlalu besar atau tidak valid.";
        return;
    }

    // Membulatkan tampilan hasil tanpa mengubah
    // perhitungan aslinya
    const formattedResult = Number(result.toPrecision(10))
        .toLocaleString("id-ID", {
            maximumFractionDigits: 8
        });

    // Menampilkan hasil
    resultBox.innerHTML = `
        <div>${shapeName}</div>
        <div>${operationName}</div>
        <div style="font-size: 24px; margin-top: 10px;">
            ${formattedResult} ${unit}
        </div>
    `;
}


// =====================================
// MENAMPILKAN INPUT AWAL
// =====================================

// Menyiapkan pilihan bangun ruang saat halaman dibuka
updateGeometryFields();
