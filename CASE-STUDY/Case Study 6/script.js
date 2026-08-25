/**
 * Case Study 6: Simple JavaScript Logic
 * Developer: ANISH SINGH (PRN: 24070521214)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // TASK 2: PARAGRAPH VOWEL COUNTER
  // ==========================================
  const paragraphInput = document.getElementById('paragraph-input');
  const totalVowelsCount = document.getElementById('total-vowels-count');
  const countA = document.getElementById('count-a');
  const countE = document.getElementById('count-e');
  const countI = document.getElementById('count-i');
  const countO = document.getElementById('count-o');
  const countU = document.getElementById('count-u');
  const highlightedOutput = document.getElementById('highlighted-output');

  // Presets
  const SAMPLES = {
    s1: "JavaScript is a powerful web language. It provides built-in methods to manipulate strings and inspect vowels.",
    s2: "The quick brown fox jumps over the lazy dog."
  };

  paragraphInput.value = SAMPLES.s1;
  countVowels();

  paragraphInput.addEventListener('input', countVowels);

  document.getElementById('preset-1').addEventListener('click', () => {
    paragraphInput.value = SAMPLES.s1;
    countVowels();
  });

  document.getElementById('preset-2').addEventListener('click', () => {
    paragraphInput.value = SAMPLES.s2;
    countVowels();
  });

  document.getElementById('clear-text').addEventListener('click', () => {
    paragraphInput.value = '';
    countVowels();
  });

  function countVowels() {
    const text = paragraphInput.value;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    let total = 0;
    let htmlDisplay = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const lower = char.toLowerCase();

      if (vowels.includes(lower)) {
        counts[lower]++;
        total++;
        htmlDisplay += `<span class="vh-mark">${escapeHTML(char)}</span>`;
      } else if (char === '\n') {
        htmlDisplay += '<br>';
      } else {
        htmlDisplay += escapeHTML(char);
      }
    }

    totalVowelsCount.textContent = total;
    countA.textContent = counts.a;
    countE.textContent = counts.e;
    countI.textContent = counts.i;
    countO.textContent = counts.o;
    countU.textContent = counts.u;

    highlightedOutput.innerHTML = text ? htmlDisplay : '<span style="color:#94a3b8; font-style:italic;">No text entered.</span>';
  }

  // ==========================================
  // TASK 1: STRING REVERSER & PALINDROME
  // ==========================================
  const reverserInput = document.getElementById('reverser-input');
  const reverserResult = document.getElementById('reverser-result');
  const palindromeStatus = document.getElementById('palindrome-status');
  const palText = document.getElementById('pal-text');
  const btnRevChar = document.getElementById('btn-rev-char');
  const btnRevWord = document.getElementById('btn-rev-word');

  let currentRevMode = 'char';

  btnRevChar.addEventListener('click', () => {
    currentRevMode = 'char';
    btnRevChar.classList.add('active');
    btnRevWord.classList.remove('active');
    runReverser();
  });

  btnRevWord.addEventListener('click', () => {
    currentRevMode = 'word';
    btnRevWord.classList.add('active');
    btnRevChar.classList.remove('active');
    runReverser();
  });

  reverserInput.addEventListener('input', runReverser);

  runReverser();

  function runReverser() {
    const input = reverserInput.value;
    let result = '';

    if (currentRevMode === 'char') {
      result = input.split('').reverse().join('');
    } else {
      result = input.split(' ').reverse().join(' ');
    }

    reverserResult.textContent = result || '(empty)';

    // Palindrome check
    const cleanStr = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRev = cleanStr.split('').reverse().join('');
    const isPal = cleanStr.length > 0 && cleanStr === cleanRev;

    if (isPal) {
      palindromeStatus.className = 'pal-status is-pal';
      palText.textContent = 'Yes! It is a Palindrome';
    } else {
      palindromeStatus.className = 'pal-status not-pal';
      palText.textContent = 'Not a Palindrome';
    }
  }

  // ==========================================
  // SECTION 3: STRING METHODS
  // ==========================================
  const methodInput = document.getElementById('method-input');
  const methodSelect = document.getElementById('method-select');
  const param1 = document.getElementById('param-1');
  const param2 = document.getElementById('param-2');
  const labelParam1 = document.getElementById('label-param-1');
  const labelParam2 = document.getElementById('label-param-2');
  const evalCodeText = document.getElementById('eval-code-text');
  const evalOutputText = document.getElementById('eval-output-text');

  methodSelect.addEventListener('change', updateMethodLabels);
  methodInput.addEventListener('input', evalMethod);
  param1.addEventListener('input', evalMethod);
  param2.addEventListener('input', evalMethod);

  updateMethodLabels();

  function updateMethodLabels() {
    const m = methodSelect.value;
    if (m === 'substring') {
      labelParam1.textContent = 'Start Index:';
      labelParam2.textContent = 'End Index:';
      param1.value = '0';
      param2.value = '10';
      param2.style.display = 'block';
      labelParam2.style.display = 'block';
    } else if (m === 'indexOf') {
      labelParam1.textContent = 'Search String:';
      param1.value = 'Web';
      param2.style.display = 'none';
      labelParam2.style.display = 'none';
    } else if (m === 'split') {
      labelParam1.textContent = 'Separator:';
      param1.value = ' ';
      param2.style.display = 'none';
      labelParam2.style.display = 'none';
    } else if (m === 'replace') {
      labelParam1.textContent = 'Find Substring:';
      labelParam2.textContent = 'Replace With:';
      param1.value = 'Web';
      param2.value = 'App';
      param2.style.display = 'block';
      labelParam2.style.display = 'block';
    }
    evalMethod();
  }

  function evalMethod() {
    const str = methodInput.value;
    const m = methodSelect.value;
    const p1 = param1.value;
    const p2 = param2.value;

    let res = '';
    let expr = '';

    try {
      if (m === 'substring') {
        const start = parseInt(p1, 10) || 0;
        const end = parseInt(p2, 10) || 0;
        res = str.substring(start, end);
        expr = `str.substring(${start}, ${end})`;
      } else if (m === 'indexOf') {
        res = str.indexOf(p1);
        expr = `str.indexOf("${p1}")`;
      } else if (m === 'split') {
        const arr = str.split(p1);
        res = `[ ${arr.map(x => `"${x}"`).join(', ')} ]`;
        expr = `str.split("${p1}")`;
      } else if (m === 'replace') {
        res = str.replace(p1, p2);
        expr = `str.replace("${p1}", "${p2}")`;
      }
    } catch (e) {
      res = `Error: ${e.message}`;
    }

    evalCodeText.textContent = expr;
    evalOutputText.textContent = typeof res === 'string' && !res.startsWith('[') ? `"${res}"` : res;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
