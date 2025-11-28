// Seletores do HTML

let inputNumeros = document.getElementById("numeros");
let inputResultado = document.getElementById("resultado");

// Bubble Sort
function bubbleSort() {

    let numeros = inputNumeros.value.split(",").map(Number);
    let tamanho = numeros.length;
    
    console.log('Array original (Bubble Sort): ' + numeros);
    
    for(let i = 0; i < tamanho - 1; i++) {

        for(let j = 0; j < tamanho - i - 1; j++){

            if(numeros[j] > numeros[j+1]) {

                let temp = numeros[j];
                numeros[j] = numeros[j + 1];
                numeros[j+1] = temp;
            }
        }
    }
    
    console.log('Array ordenado (Bubble Sort): ' + numeros);
    inputResultado.value = "Array ordenado com Bubble Sort: \n\n" + numeros;
}

// Selection Sort
function selectionSort(){

    let numeros = inputNumeros.value.split(",").map(Number);
    let tamanho = numeros.length;

    console.log("Array original (Selection Sort): " + numeros);

    for(let i = 0; i < tamanho - 1; i++){

        let minimo = i;

        for(let j = i + 1; j < tamanho; j++){

            if(numeros[j] < numeros[minimo]){
                minimo = j;
            }

        }

        let temp = numeros[i];
        numeros[i] = numeros[minimo];
        numeros[minimo] = temp;
    }

    console.log("Array ordenado (Selection Sort): " + numeros);
    inputResultado.value = "Array ordenado com Selection Sort: \n\n" + numeros;
}

// Insertion Sort

function insertionSort(){

    let numeros = inputNumeros.value.split(",").map(Number);
    let tamanho = numeros.length;

    console.log("Array original (Insertion Sort): " + numeros);

    for(let i = 0; i < tamanho; i++){

        let chave = numeros[i];
        let j = i - 1;

        while(j >= 0 && numeros[j] > chave) {
            numeros[j + 1] = numeros[j];
            j = j - 1;
        }

        numeros[j + 1] = chave;
    }

    console.log("Array ordenado (Insertion Sort): " + numeros);
    inputResultado.value = "Array ordenado com Insertion Sort: \n\n" + numeros;
}

function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (let j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    let i = 0, j = 0;
    let k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }


}

function mergeSort(arr, left, right) {

    if (left >= right)
        return;

    const mid = Math.floor(left + (right - left) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

function executarMergeSort(){
    let numeros = inputNumeros.value.split(",").map(Number);
    let tamanho = numeros.length;

    console.log("Array original (Merge Sort): " + numeros);

    mergeSort(numeros, 0, tamanho - 1); 

    console.log("Array ordenado (Merge Sort): " + numeros);
    inputResultado.value = "Array ordenado com Merge Sort: \n\n" + numeros;
}
