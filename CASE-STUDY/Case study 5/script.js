// Case Study 5 - JavaScript Arrays & Loops Script
document.addEventListener('DOMContentLoaded', () => {

    // Initial Array state from Case Study slide
    let arrayData = [25, 10, 45, 5, 30, 15];
    let isAnimating = false;

    // DOM Elements
    const pillsContainer = document.getElementById('arrayPillsContainer');
    const statMinVal = document.getElementById('statMinVal');
    const statMaxVal = document.getElementById('statMaxVal');
    const statCountVal = document.getElementById('statCountVal');
    const statSumVal = document.getElementById('statSumVal');

    const addNumInput = document.getElementById('addNumInput');
    const pushBtn = document.getElementById('pushBtn');
    const unshiftBtn = document.getElementById('unshiftBtn');
    const popBtn = document.getElementById('popBtn');
    const shiftBtn = document.getElementById('shiftBtn');
    const clearBtn = document.getElementById('clearBtn');

    const presetDefaultBtn = document.getElementById('presetDefaultBtn');
    const presetRandomBtn = document.getElementById('presetRandomBtn');
    const presetAscBtn = document.getElementById('presetAscBtn');
    const presetDescBtn = document.getElementById('presetDescBtn');

    const animateMinMaxBtn = document.getElementById('animateMinMaxBtn');
    const animatorStatus = document.getElementById('animatorStatus');
    const animStepText = document.getElementById('animStepText');
    const animMinText = document.getElementById('animMinText');
    const animMaxText = document.getElementById('animMaxText');

    const spliceIdx = document.getElementById('spliceIdx');
    const spliceCount = document.getElementById('spliceCount');
    const spliceVal = document.getElementById('spliceVal');
    const executeSpliceBtn = document.getElementById('executeSpliceBtn');

    const sliceStart = document.getElementById('sliceStart');
    const sliceEnd = document.getElementById('sliceEnd');
    const executeSliceBtn = document.getElementById('executeSliceBtn');
    const sliceResultBox = document.getElementById('sliceResultBox');
    const sliceResultVal = document.getElementById('sliceResultVal');

    const btnMap = document.getElementById('btnMap');
    const btnFilter = document.getElementById('btnFilter');
    const btnReduce = document.getElementById('btnReduce');
    const btnForEach = document.getElementById('btnForEach');

    const mapCustomExpr = document.getElementById('mapCustomExpr');
    const applyCustomMapBtn = document.getElementById('applyCustomMapBtn');
    const filterCustomExpr = document.getElementById('filterCustomExpr');
    const applyCustomFilterBtn = document.getElementById('applyCustomFilterBtn');

    const methodResultLabel = document.getElementById('methodResultLabel');
    const methodResultVal = document.getElementById('methodResultVal');

    const codeContent = document.getElementById('codeContent');
    const consoleTerminal = document.getElementById('consoleTerminal');
    const clearConsoleBtn = document.getElementById('clearConsoleBtn');

    // -------------------------------------------------------------
    // Logging Utility
    // -------------------------------------------------------------
    function log(msg, type = 'info', tag = 'JS_ARRAY') {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span class="log-tag">[${tag}]</span>
            <span class="log-msg">${escapeHtml(msg)}</span>
        `;
        consoleTerminal.appendChild(line);
        consoleTerminal.scrollTop = consoleTerminal.scrollHeight;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function updateCode(codeStr) {
        codeContent.textContent = codeStr;
    }

    // -------------------------------------------------------------
    // Core Render Function
    // -------------------------------------------------------------
    function renderArray(highlightIndex = -1) {
        pillsContainer.innerHTML = '';

        if (arrayData.length === 0) {
            pillsContainer.innerHTML = '<div style="color: var(--text-muted); font-style: italic;">Array is currently empty [ ]. Use buttons below to add numbers.</div>';
            statMinVal.textContent = 'N/A';
            statMaxVal.textContent = 'N/A';
            statCountVal.textContent = '0';
            statSumVal.textContent = '0';
            return;
        }

        // Calculate Min and Max
        const minVal = Math.min(...arrayData);
        const maxVal = Math.max(...arrayData);
        const sumVal = arrayData.reduce((acc, curr) => acc + curr, 0);

        statMinVal.textContent = minVal;
        statMaxVal.textContent = maxVal;
        statCountVal.textContent = arrayData.length;
        statSumVal.textContent = sumVal;

        // Render Pills
        arrayData.forEach((val, idx) => {
            const pill = document.createElement('div');
            pill.className = 'array-pill';
            pill.id = `pill-${idx}`;

            const isMin = (val === minVal);
            const isMax = (val === maxVal);

            if (isMin && isMax) {
                pill.classList.add('is-both');
            } else if (isMin) {
                pill.classList.add('is-min');
            } else if (isMax) {
                pill.classList.add('is-max');
            }

            if (idx === highlightIndex) {
                pill.classList.add('is-scanning');
            }

            pill.innerHTML = `
                <div class="idx-badge">[${idx}]</div>
                <div class="val-text">${val}</div>
            `;
            pillsContainer.appendChild(pill);
        });
    }

    // -------------------------------------------------------------
    // Case Study 5: Find Min and Max Step-by-Step Loop Animation
    // -------------------------------------------------------------
    async function animateMinMaxLoop() {
        if (isAnimating || arrayData.length === 0) return;
        isAnimating = true;
        animateMinMaxBtn.disabled = true;
        animatorStatus.style.display = 'flex';

        log('Starting Step-by-Step Loop to find Min and Max...', 'info', 'MIN_MAX_LOOP');

        let currentMin = arrayData[0];
        let currentMax = arrayData[0];

        animMinText.textContent = currentMin;
        animMaxText.textContent = currentMax;
        animStepText.textContent = `Initialized: currentMin = ${currentMin}, currentMax = ${currentMax} (at index 0)`;

        renderArray(0);

        updateCode(
`// Finding Min and Max using JavaScript Loop
const arr = [${arrayData.join(', ')}];
let min = arr[0];
let max = arr[0];

for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
}
console.log('Min:', min, 'Max:', max);`
        );

        await new Promise(r => setTimeout(r, 900));

        for (let i = 0; i < arrayData.length; i++) {
            const val = arrayData[i];
            renderArray(i);

            let changed = [];
            if (val < currentMin) {
                currentMin = val;
                changed.push(`new MIN = ${currentMin}`);
            }
            if (val > currentMax) {
                currentMax = val;
                changed.push(`new MAX = ${currentMax}`);
            }

            animMinText.textContent = currentMin;
            animMaxText.textContent = currentMax;

            let stepMsg = `Step ${i + 1}/${arrayData.length}: Checking arr[${i}] = ${val}. `;
            if (changed.length > 0) {
                stepMsg += `Updated: ${changed.join(', ')}!`;
            } else {
                stepMsg += `No change (min: ${currentMin}, max: ${currentMax}).`;
            }

            animStepText.textContent = stepMsg;
            log(stepMsg, changed.length > 0 ? 'success' : 'info', `LOOP_STEP_${i}`);

            await new Promise(r => setTimeout(r, 850));
        }

        renderArray(-1);
        animStepText.textContent = `Completed! Minimum Value: ${currentMin}, Maximum Value: ${currentMax}`;
        log(`Final Result -> Minimum: ${currentMin}, Maximum: ${currentMax}`, 'success', 'MIN_MAX_COMPLETE');

        isAnimating = false;
        animateMinMaxBtn.disabled = false;
    }

    // -------------------------------------------------------------
    // Requirement A: Array Manipulation Handlers
    // -------------------------------------------------------------
    pushBtn.addEventListener('click', () => {
        const val = parseInt(addNumInput.value) || Math.floor(Math.random() * 90) + 10;
        arrayData.push(val);
        addNumInput.value = '';
        renderArray();
        log(`push(${val}) -> Array length is now ${arrayData.length}`, 'success', 'PUSH');
        updateCode(`const arr = [${arrayData.join(', ')}];\narr.push(${val}); // Adds to end`);
    });

    unshiftBtn.addEventListener('click', () => {
        const val = parseInt(addNumInput.value) || Math.floor(Math.random() * 90) + 10;
        arrayData.unshift(val);
        addNumInput.value = '';
        renderArray();
        log(`unshift(${val}) -> Array length is now ${arrayData.length}`, 'success', 'UNSHIFT');
        updateCode(`const arr = [${arrayData.join(', ')}];\narr.unshift(${val}); // Adds to start`);
    });

    popBtn.addEventListener('click', () => {
        if (arrayData.length === 0) return;
        const removed = arrayData.pop();
        renderArray();
        log(`pop() -> Removed element ${removed}`, 'warning', 'POP');
        updateCode(`const arr = [${arrayData.join(', ')}];\nconst removed = arr.pop(); // Returns ${removed}`);
    });

    shiftBtn.addEventListener('click', () => {
        if (arrayData.length === 0) return;
        const removed = arrayData.shift();
        renderArray();
        log(`shift() -> Removed element ${removed}`, 'warning', 'SHIFT');
        updateCode(`const arr = [${arrayData.join(', ')}];\nconst removed = arr.shift(); // Returns ${removed}`);
    });

    clearBtn.addEventListener('click', () => {
        arrayData = [];
        renderArray();
        log(`Cleared all elements from array`, 'warning', 'CLEAR');
        updateCode(`let arr = []; // Empty array`);
    });

    // Preset Buttons
    presetDefaultBtn.addEventListener('click', () => {
        arrayData = [25, 10, 45, 5, 30, 15];
        renderArray();
        log(`Loaded Slide Preset Array: [25, 10, 45, 5, 30, 15]`, 'info', 'PRESET_DEFAULT');
        updateCode(`const numbers = [25, 10, 45, 5, 30, 15];\nconst min = Math.min(...numbers);\nconst max = Math.max(...numbers);`);
    });

    presetRandomBtn.addEventListener('click', () => {
        arrayData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 95) + 5);
        renderArray();
        log(`Generated Random Array: [${arrayData.join(', ')}]`, 'info', 'PRESET_RANDOM');
        updateCode(`const numbers = [${arrayData.join(', ')}];`);
    });

    presetAscBtn.addEventListener('click', () => {
        arrayData.sort((a, b) => a - b);
        renderArray();
        log(`Sorted array in Ascending order`, 'info', 'SORT_ASC');
        updateCode(`arr.sort((a, b) => a - b); // [${arrayData.join(', ')}]`);
    });

    presetDescBtn.addEventListener('click', () => {
        arrayData.sort((a, b) => b - a);
        renderArray();
        log(`Sorted array in Descending order`, 'info', 'SORT_DESC');
        updateCode(`arr.sort((a, b) => b - a); // [${arrayData.join(', ')}]`);
    });

    // Splice Handler
    executeSpliceBtn.addEventListener('click', () => {
        const idx = parseInt(spliceIdx.value) || 0;
        const delCount = parseInt(spliceCount.value) || 0;
        const newVal = parseInt(spliceVal.value);

        if (isNaN(newVal)) {
            const removed = arrayData.splice(idx, delCount);
            log(`splice(${idx}, ${delCount}) -> Removed: [${removed.join(', ')}]`, 'info', 'SPLICE');
            updateCode(`const removed = arr.splice(${idx}, ${delCount});`);
        } else {
            const removed = arrayData.splice(idx, delCount, newVal);
            log(`splice(${idx}, ${delCount}, ${newVal}) -> Removed: [${removed.join(', ')}], Inserted: ${newVal}`, 'info', 'SPLICE');
            updateCode(`const removed = arr.splice(${idx}, ${delCount}, ${newVal});`);
        }
        renderArray();
    });

    // Slice Handler
    executeSliceBtn.addEventListener('click', () => {
        const start = parseInt(sliceStart.value) || 0;
        const end = parseInt(sliceEnd.value) || arrayData.length;
        const sliced = arrayData.slice(start, end);
        
        sliceResultBox.style.display = 'block';
        sliceResultVal.textContent = JSON.stringify(sliced);

        log(`slice(${start}, ${end}) -> Extracted subset: [${sliced.join(', ')}]`, 'info', 'SLICE');
        updateCode(`const slicedArray = arr.slice(${start}, ${end}); // Returns [${sliced.join(', ')}]`);
    });

    // -------------------------------------------------------------
    // Requirement B: Array Methods (map, filter, reduce, forEach)
    // -------------------------------------------------------------
    btnMap.addEventListener('click', () => {
        const res = arrayData.map(x => x * 2);
        methodResultLabel.textContent = 'map(x => x * 2) Result:';
        methodResultVal.textContent = JSON.stringify(res);
        log(`map(x => x * 2) executed -> [${res.join(', ')}]`, 'success', 'MAP');
        updateCode(`const doubled = arr.map(x => x * 2);\nconsole.log(doubled); // [${res.join(', ')}]`);
    });

    btnFilter.addEventListener('click', () => {
        const res = arrayData.filter(x => x > 20);
        methodResultLabel.textContent = 'filter(x => x > 20) Result:';
        methodResultVal.textContent = JSON.stringify(res);
        log(`filter(x => x > 20) executed -> [${res.join(', ')}]`, 'success', 'FILTER');
        updateCode(`const filtered = arr.filter(x => x > 20);\nconsole.log(filtered); // [${res.join(', ')}]`);
    });

    btnReduce.addEventListener('click', () => {
        const sum = arrayData.reduce((acc, curr) => acc + curr, 0);
        methodResultLabel.textContent = 'reduce((acc, curr) => acc + curr, 0) Result:';
        methodResultVal.textContent = `Total Sum: ${sum}`;
        log(`reduce(sum) executed -> Sum = ${sum}`, 'success', 'REDUCE');
        updateCode(`const sum = arr.reduce((acc, curr) => acc + curr, 0);\nconsole.log(sum); // ${sum}`);
    });

    btnForEach.addEventListener('click', () => {
        methodResultLabel.textContent = 'forEach() Iteration Log:';
        let logDetails = [];
        arrayData.forEach((val, idx) => {
            logDetails.push(`Item #${idx} => ${val}`);
            log(`forEach iteration: arr[${idx}] = ${val}`, 'info', 'FOREACH');
        });
        methodResultVal.textContent = logDetails.join(' | ');
        updateCode(`arr.forEach((val, index) => {\n    console.log(\`Index \${index}: \${val}\`);\n});`);
    });

    // Custom Map Formula
    applyCustomMapBtn.addEventListener('click', () => {
        try {
            const expr = mapCustomExpr.value.trim();
            const fn = new Function('x', `return ${expr};`);
            const res = arrayData.map(x => fn(x));
            methodResultLabel.textContent = `map(x => ${expr}) Result:`;
            methodResultVal.textContent = JSON.stringify(res);
            log(`Custom map(x => ${expr}) -> [${res.join(', ')}]`, 'success', 'CUSTOM_MAP');
            updateCode(`const result = arr.map(x => ${expr});\nconsole.log(result);`);
        } catch (err) {
            log(`Error evaluating custom map formula: ${err.message}`, 'warning', 'ERROR');
        }
    });

    // Custom Filter Condition
    applyCustomFilterBtn.addEventListener('click', () => {
        try {
            const expr = filterCustomExpr.value.trim();
            const fn = new Function('x', `return ${expr};`);
            const res = arrayData.filter(x => fn(x));
            methodResultLabel.textContent = `filter(x => ${expr}) Result:`;
            methodResultVal.textContent = JSON.stringify(res);
            log(`Custom filter(x => ${expr}) -> [${res.join(', ')}]`, 'success', 'CUSTOM_FILTER');
            updateCode(`const result = arr.filter(x => ${expr});\nconsole.log(result);`);
        } catch (err) {
            log(`Error evaluating custom filter expression: ${err.message}`, 'warning', 'ERROR');
        }
    });

    // Event Listeners for Animator & Console
    animateMinMaxBtn.addEventListener('click', animateMinMaxLoop);

    clearConsoleBtn.addEventListener('click', () => {
        consoleTerminal.innerHTML = '';
        log('Console cleared.', 'info', 'SYSTEM');
    });

    // Initial Setup
    renderArray();
    log('Web application initialized with default array: [25, 10, 45, 5, 30, 15]', 'success', 'INIT');
    log('Case Study requirement: Minimum Value = 5, Maximum Value = 45', 'info', 'REQUIREMENT');
});
