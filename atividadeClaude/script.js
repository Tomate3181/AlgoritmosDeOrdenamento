// Global variables
let array = [];
let arraySize = 50;
let animationSpeed = 50;
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let timerInterval = null;

// Speed mapping
const speedMap = {
    1: { delay: 200, label: 'Muito Lenta' },
    2: { delay: 100, label: 'Lenta' },
    3: { delay: 50, label: 'Média' },
    4: { delay: 20, label: 'Rápida' },
    5: { delay: 5, label: 'Muito Rápida' }
};

// DOM Elements
const arraySizeSlider = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const animationSpeedSlider = document.getElementById('animationSpeed');
const speedValue = document.getElementById('speedValue');
const generateArrayBtn = document.getElementById('generateArray');
const arrayContainer = document.getElementById('arrayContainer');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const timeElapsedDisplay = document.getElementById('timeElapsed');
const currentAlgorithmDisplay = document.getElementById('currentAlgorithm');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');

// Algorithm buttons
const bubbleSortBtn = document.getElementById('bubbleSort');
const selectionSortBtn = document.getElementById('selectionSort');
const insertionSortBtn = document.getElementById('insertionSort');
const mergeSortBtn = document.getElementById('mergeSort');

// Event Listeners
arraySizeSlider.addEventListener('input', (e) => {
    arraySize = parseInt(e.target.value);
    arraySizeValue.textContent = arraySize;
    generateArray();
});

animationSpeedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    animationSpeed = speedMap[speed].delay;
    speedValue.textContent = speedMap[speed].label;
});

generateArrayBtn.addEventListener('click', generateArray);

bubbleSortBtn.addEventListener('click', () => startSort('Bubble Sort', bubbleSort));
selectionSortBtn.addEventListener('click', () => startSort('Selection Sort', selectionSort));
insertionSortBtn.addEventListener('click', () => startSort('Insertion Sort', insertionSort));
mergeSortBtn.addEventListener('click', () => startSort('Merge Sort', mergeSort));

// Initialize
function init() {
    animationSpeed = speedMap[3].delay;
    generateArray();
}

// Generate random array
function generateArray() {
    if (isSorting) return;
    
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    resetStats();
    renderArray();
    resultContainer.style.display = 'none';
}

// Render array as bars
function renderArray(highlightIndices = [], highlightClass = '') {
    arrayContainer.innerHTML = '';
    
    const maxValue = Math.max(...array);
    const containerHeight = arrayContainer.clientHeight || 350;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        
        const heightPercentage = (value / maxValue) * 100;
        const barHeight = (heightPercentage / 100) * (containerHeight - 20);
        
        bar.style.height = `${barHeight}px`;
        
        if (highlightIndices.includes(index)) {
            bar.classList.add(highlightClass);
        }
        
        arrayContainer.appendChild(bar);
    });
}

// Reset statistics
function resetStats() {
    comparisons = 0;
    swaps = 0;
    updateStats();
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timeElapsedDisplay.textContent = '0ms';
}

// Update statistics display
function updateStats() {
    comparisonsDisplay.textContent = comparisons;
    swapsDisplay.textContent = swaps;
}

// Start timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeElapsedDisplay.textContent = `${elapsed}ms`;
    }, 10);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Disable/Enable buttons
function setButtonsState(disabled) {
    const buttons = [bubbleSortBtn, selectionSortBtn, insertionSortBtn, mergeSortBtn, generateArrayBtn];
    buttons.forEach(btn => btn.disabled = disabled);
}

// Start sorting
async function startSort(algorithmName, sortFunction) {
    if (isSorting) return;
    
    isSorting = true;
    setButtonsState(true);
    resetStats();
    startTimer();
    currentAlgorithmDisplay.textContent = algorithmName;
    resultContainer.style.display = 'none';
    
    await sortFunction();
    
    stopTimer();
    showResult();
    currentAlgorithmDisplay.textContent = `${algorithmName} - Concluído!`;
    isSorting = false;
    setButtonsState(false);
}

// Show sorted result
function showResult() {
    resultContainer.style.display = 'block';
    resultContent.textContent = `[${array.join(', ')}]`;
}

// Sleep function for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Swap array elements with animation
async function swap(i, j) {
    renderArray([i, j], 'swapping');
    await sleep(animationSpeed);
    
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    swaps++;
    updateStats();
    
    renderArray([i, j], 'swapping');
    await sleep(animationSpeed);
}

// Mark elements as sorted
async function markSorted(indices) {
    const bars = arrayContainer.children;
    indices.forEach(i => {
        if (bars[i]) {
            bars[i].classList.add('sorted');
        }
    });
}

// ==================== SORTING ALGORITHMS ====================

// Bubble Sort
async function bubbleSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            updateStats();
            
            renderArray([j, j + 1], 'comparing');
            await sleep(animationSpeed);
            
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
                swapped = true;
            }
        }
        
        await markSorted([n - i - 1]);
        
        if (!swapped) break;
    }
    
    await markSorted([0]);
    renderArray();
}

// Selection Sort
async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            updateStats();
            
            renderArray([minIdx, j], 'comparing');
            await sleep(animationSpeed);
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        
        await markSorted([i]);
    }
    
    await markSorted([n - 1]);
    renderArray();
}

// Insertion Sort
async function insertionSort() {
    const n = array.length;
    
    await markSorted([0]);
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        renderArray([i], 'pivot');
        await sleep(animationSpeed);
        
        while (j >= 0) {
            comparisons++;
            updateStats();
            
            renderArray([j, i], 'comparing');
            await sleep(animationSpeed);
            
            if (array[j] <= key) break;
            
            array[j + 1] = array[j];
            swaps++;
            updateStats();
            
            renderArray([j, j + 1], 'swapping');
            await sleep(animationSpeed);
            
            j--;
        }
        
        array[j + 1] = key;
        
        const sortedIndices = [];
        for (let k = 0; k <= i; k++) {
            sortedIndices.push(k);
        }
        await markSorted(sortedIndices);
    }
    
    renderArray();
}

// Merge Sort
async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
    
    const allIndices = array.map((_, i) => i);
    await markSorted(allIndices);
    renderArray();
}

async function mergeSortHelper(left, right) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    await mergeSortHelper(left, mid);
    await mergeSortHelper(mid + 1, right);
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        updateStats();
        
        renderArray([k], 'comparing');
        await sleep(animationSpeed);
        
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        
        swaps++;
        updateStats();
        
        renderArray([k], 'swapping');
        await sleep(animationSpeed);
        
        k++;
    }
    
    while (i < leftArr.length) {
        array[k] = leftArr[i];
        swaps++;
        updateStats();
        
        renderArray([k], 'swapping');
        await sleep(animationSpeed);
        
        i++;
        k++;
    }
    
    while (j < rightArr.length) {
        array[k] = rightArr[j];
        swaps++;
        updateStats();
        
        renderArray([k], 'swapping');
        await sleep(animationSpeed);
        
        j++;
        k++;
    }
}

// Initialize the application
init();
