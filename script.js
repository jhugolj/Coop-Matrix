const principles = [
    "Adesão Livre e Voluntária",
    "Gestão Democrática",
    "Participação Econômica",
    "Autonomia e Independência",
    "Educação, Formação e Informação",
    "Intercooperação",
    "Interesse pela Comunidade"
];

const tableBody = document.getElementById('comparisonRows');
const form = document.getElementById('comparisonForm');

function createComparisonRow(principleA, principleB) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="radio" name="comparison_${principleA}_${principleB}" value="A" checked> ${principleA}</td>
        <td><input type="radio" name="comparison_${principleA}_${principleB}" value="B"> ${principleB}</td>
        <td>
            <input type="checkbox" name="equal_${principleA}_${principleB}" value="1"> Sim
        </td>
        <td>
            <select name="av_${principleA}_${principleB}" required style="text-align: center;">
                <option value="" disabled selected><strong>Quanto mais importante?</option>
                <option value="2">2</option>
                <option value="3">3 - Importância moderada</option>
                <option value="4">4</option>
                <option value="5">5 - Forte importância</option>
                <option value="6">6</option>
                <option value="7">7 - Importância muito forte</option>
                <option value="8">8</option>
                <option value="9">9 - Extrema importância</option>
            </select>
        </td>
    `;

    const equalCheckbox = row.querySelector(`[name="equal_${principleA}_${principleB}"]`);
    const importanceSelect = row.querySelector(`[name="av_${principleA}_${principleB}"]`);

    equalCheckbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            importanceSelect.disabled = true;
        } else {
            importanceSelect.disabled = false;
        }
    });

    return row;
}

principles.forEach((principleA, indexA) => {
    principles.slice(indexA + 1).forEach(principleB => {
        const comparisonRow = createComparisonRow(principleA, principleB);
        tableBody.appendChild(comparisonRow);
    });
});

function buildMatrix() {
    const n = principles.length;
    let matrix = Array.from({ length: n }, () => Array(n).fill(1));

    principles.forEach((principleA, indexA) => {
        principles.slice(indexA + 1).forEach((principleB, indexB) => {
            const selected = document.querySelector(`input[name="comparison_${principleA}_${principleB}"]:checked`).value;
            const isEqual = document.querySelector(`input[name="equal_${principleA}_${principleB}"]`).checked;
            const value = parseFloat(document.querySelector(`select[name="av_${principleA}_${principleB}"]`).value);

            const i = principles.indexOf(principleA);
            const j = principles.indexOf(principleB);

            if (isEqual) {
                matrix[i][j] = 1;
                matrix[j][i] = 1;
            } else if (selected === 'A') {
                matrix[i][j] = value;
                matrix[j][i] = 1 / value;
            } else {
                matrix[i][j] = 1 / value;
                matrix[j][i] = value;
            }
        });
    });

    return matrix;
}

function displayMatrix(matrix) {
    let result = '<h3>Matriz de Comparação Pareada</h3><table border="1"><thead><tr><th></th>';

    principles.forEach(principle => {
        result += `<th>${principle}</th>`;
    });

    result += '</tr></thead><tbody>';

    matrix.forEach((row, i) => {
        result += `<tr><th>${principles[i]}</th>`;
        row.forEach(value => {
            result += `<td>${value.toFixed(2)}</td>`;
        });
        result += '</tr>';
    });

    result += '</tbody></table>';
    document.getElementById('matrixResult').innerHTML = result;
}

document.getElementById('buildMatrixButton').addEventListener('click', function() {
    const matrix = buildMatrix();
    displayMatrix(matrix);
});

document.getElementById('calculateResultsButton').addEventListener('click', function() {
    const matrix = buildMatrix();
    const weights = calculateAHP(matrix);
    displayResults(weights);
});

function calculateAHP(matrix) {
    const n = matrix.length;
    let sumColumns = Array(n).fill(0);
    let normalizedMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    let weights = Array(n).fill(0);

    // Soma das colunas
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            sumColumns[j] += matrix[i][j];
        }
    }

    // Normalização da matriz
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            normalizedMatrix[i][j] = matrix[i][j] / sumColumns[j];
        }
    }

    // Cálculo dos pesos (média das linhas da matriz normalizada)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            weights[i] += normalizedMatrix[i][j];
        }
        weights[i] /= n;
    }

    // Cálculo do coeficiente de consistência (CR)
    let lambdaMax = 0;
    for (let i = 0; i < n; i++) {
        let rowSum = 0;
        for (let j = 0; j < n; j++) {
            rowSum += matrix[i][j] * weights[j];
        }
        lambdaMax += rowSum / weights[i];
    }
    lambdaMax /= n;

    const ci = (lambdaMax - n) / (n - 1);
    const ri = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    const cr = ci / ri[n];

    return { weights, cr };
}
result += '</ul>';
    result += `<p><strong>Coeficiente de Consistência (CR):</strong> ${cr.toFixed(4)}</p>`;
    if (cr > 0.1) {
        result += '<p style="color:red;"><strong>A matriz de comparação de pares não é consistente. Por favor, revise suas comparações.</strong></p>';
    }
    document.getElementById('results').innerHTML = result;
}
function displayResults({ weights, cr }) {
    let result = '<h2>Resultados da Identidade Cooperativa</h2>';
    result += '<p><strong>Pesos dos Princípios Organizacionais:</strong></p><ul>';
    weights.forEach((weight, i) => {
        result += <li><strong>${principles[i]}</strong>:<br>${(weight * 100).toFixed(2)}%</li>;
    });}

    result += '</ul>';
    result += `<p><strong>Coeficiente de Consistência (CR):</strong> ${cr.toFixed(4)}</p>`;
    if (cr > 0.1) {
        result += '<p style="color:red;"><strong>A matriz de comparação de pares não é consistente. Por favor, revise suas comparações.</strong></p>';
    }
    document.getElementById('results').innerHTML = result;
}

function saveAndDownloadODS() {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    const odsContent = generateODSContent(data);
    const odsBlob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
    const odsUrl = URL.createObjectURL(odsBlob);

    const a = document.createElement('a');
    a.href = odsUrl;
    a.download = 'comparison_results.ods';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(odsUrl);
}

document.getElementById('saveDownloadButton').addEventListener('click', saveAndDownloadODS);

function generateODSContent(data) {
    let odsContent = `<?xml version="1.0" encoding="UTF-8"?>
        <office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                                 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
                                 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                                 xmlns:calcext="urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0"
                                 xmlns:tableooo="http://openoffice.org/2009/table"
                                 office:version="1.2">
            <office:body>
                <office:spreadsheet>
                    <table:table table:name="ComparisonResults" table:style-name="ta1">
                        <table:table-column table:number-columns-repeated="4" table:style-name="co1"/>
                        <table:table-row>
                            <table:table-cell table:style-name="ce1" office:value-type="string">
                                <text:p>Princípio A</text:p>
                            </table:table-cell>
                            <table:table-cell table:style-name="ce1" office:value-type="string">
                                <text:p>Princípio B</text:p>
                            </table:table-cell>
                            <table:table-cell table:style-name="ce1" office:value-type="string">
                                <text:p>São iguais?</text:p>
                            </table:table-cell>
                            <table:table-cell table:style-name="ce1" office:value-type="string">
                                <text:p>Pontuação</text:p>
                            </table:table-row>`;

    for (const key in data) {
        const [prefix, principleA, principleB] = key.split('_');
        if (prefix === 'comparison') {
            const selectedPrinciple = data[key] === 'A' ? principleA : principleB;
            const otherPrinciple = data[key] === 'A' ? principleB : principleA;
            const areEqual = data[`equal_${principleA}_${principleB}`] === 'yes';
            const score = data[`av_${principleA}_${principleB}`];

            odsContent += `
                <table:table-row>
                    <table:table-cell table:style-name="ce1" office:value-type="string">
                        <text:p>${selectedPrinciple}</text:p>
                    </table:table-cell>
                    <table:table-cell table:style-name="ce1" office:value-type="string">
                        <text:p>${otherPrinciple}</text:p>
                    </table:table-cell>
                    <table:table-cell table:style-name="ce1" office:value-type="string">
                        <text:p>${areEqual ? 'Sim' : 'Não'}</text:p>
                    </table:table-cell>
                    <table:table-cell table:style-name="ce1" office:value-type="float">
                        <text:p>${score}</text:p>
                    </table:table-cell>
                </table:table-row>`;
        }
    }

    odsContent += `</table:table>
                </office:spreadsheet>
            </office:body>
        </office:document-content>`;

    return odsContent;
}
