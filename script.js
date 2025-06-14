document.addEventListener('DOMContentLoaded', () => {
    const inputTextElement = document.getElementById('inputText');
    const decryptButton = document.getElementById('decryptButton');
    const resultsElement = document.getElementById('results');

    function decryptChar(char, shift) {
        let alphabet = '';
        let isUpper = false;

        if (/[A-Z]/.test(char)) {
            alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            isUpper = true;
        } else if (/[a-z]/.test(char)) {
            alphabet = "abcdefghijklmnopqrstuvwxyz";
        }
        else if (/[А-ЯЁ]/.test(char)) {
            alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
            isUpper = true;
        } else if (/[а-яё]/.test(char)) {
            alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        } else {
            return char;
        }

        const alphabetLength = alphabet.length;
        const charIndex = alphabet.indexOf(char);

        if (charIndex === -1) {
            return char;
        }

        let newIndex = (charIndex - shift % alphabetLength + alphabetLength) % alphabetLength;
        return alphabet[newIndex];
    }

    function decryptText(text, shift) {
        return text.split('').map(char => decryptChar(char, shift)).join('');
    }

    decryptButton.addEventListener('click', () => {
        const fullText = inputTextElement.value.trim();
        resultsElement.innerHTML = '';

        if (fullText === '') {
            resultsElement.innerHTML = '<p class="no-results">Пожалуйста, введите текст для дешифрования.</p>';
            return;
        }
        const words = fullText.split(/\s+/).filter(word => word.length > 0);
        const wordsToDecrypt = words.slice(0, Math.min(words.length, 3)).join(' ');

        if (wordsToDecrypt.length === 0) {
            resultsElement.innerHTML = '<p class="no-results">Не удалось определить слова для дешифрования.</p>';
            return;
        }

        const englishAlphabetLength = 26;
        const russianAlphabetLength = 33;
        const containsEnglish = /[A-Za-z]/.test(wordsToDecrypt);
        const containsRussian = /[А-Яа-яЁё]/.test(wordsToDecrypt);

        let maxShift = 0;
        if (containsEnglish && containsRussian) {
            maxShift = Math.max(englishAlphabetLength, russianAlphabetLength);
        } else if (containsEnglish) {
            maxShift = englishAlphabetLength;
        } else if (containsRussian) {
            maxShift = russianAlphabetLength;
        } else {
            resultsElement.innerHTML = '<p class="no-results">Текст не содержит букв для дешифрования.</p>';
            return;
        }

        let hasResults = false;
        for (let shift = 1; shift <= maxShift; shift++) {
            let decryptedPartialText = '';
            decryptedPartialText = wordsToDecrypt.split('').map(char => {
                let alphabet;
                if (/[A-Za-z]/.test(char)) {
                    alphabet = /[A-Z]/.test(char) ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz";
                } else if (/[А-Яа-яЁё]/.test(char)) {
                    alphabet = /[А-ЯЁ]/.test(char) ? "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" : "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
                } else {
                    return char;
                }
                const charIndex = alphabet.indexOf(char);
                if (charIndex === -1) return char;
                let effectiveShift = shift;
                if (/[A-Za-z]/.test(char) && shift > englishAlphabetLength) {
                    effectiveShift = shift % englishAlphabetLength;
                } else if (/[А-Яа-яЁё]/.test(char) && shift > russianAlphabetLength) {
                    effectiveShift = shift % russianAlphabetLength;
                }
                let newIndex = (charIndex - effectiveShift + alphabet.length) % alphabet.length;
                return alphabet[newIndex];
            }).join('');
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `<span><strong>${decryptedPartialText}</strong></span> <span>(Сдвиг: +${shift})</span>`;
            resultsElement.appendChild(resultItem);
            hasResults = true;
        }
        if (!hasResults) {
            resultsElement.innerHTML = '<p class="no-results">Не найдено подходящих дешифровок.</p>';
        }
    });
});