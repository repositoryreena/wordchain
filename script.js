document.addEventListener("DOMContentLoaded", () => {
    const wordInput = document.getElementById("wordInput");
    const playButton = document.getElementById("playButton");
    const playedWords = document.getElementById("playedWords");
  
    let lastLetter = "";
    const playedWordSet = new Set();
  
    playButton.addEventListener("click", async () => {
      const playerWord = wordInput.value.trim().toLowerCase();
  
      if (!playerWord) {
        alert("Please enter a word.");
        return;
      }
  
      if (playedWordSet.has(playerWord)) {
        alert("This word has already been played. Try another word.");
        return;
      }
  
      if (lastLetter && playerWord.charAt(0) !== lastLetter) {
        alert(`Word must start with '${lastLetter}'. Try again.`);
        return;
      }
  
      const wordPair = document.createElement("div");
      wordPair.classList.add("word-pair");
  
      const playerWordBox = createWordBox(playerWord, "player");
      wordPair.appendChild(playerWordBox);
      playedWords.appendChild(wordPair);
  
      playedWordSet.add(playerWord);
      lastLetter = playerWord.charAt(playerWord.length - 1);
      wordInput.value = "";
  
      await performComputerTurn();
    });
  
    async function performComputerTurn() {
      const computerWord = await getComputerWord(lastLetter);
  
      const wordPair = document.createElement("div");
      wordPair.classList.add("word-pair");
  
      const computerWordBox = createWordBox(computerWord, "computer");
      wordPair.appendChild(computerWordBox);
      playedWords.appendChild(wordPair);
  
      playedWordSet.add(computerWord);
      lastLetter = computerWord.charAt(computerWord.length - 1);
    }
  
    async function getComputerWord(startingLetter) {
      const response = await fetch(`https://api.datamuse.com/words?sp=${startingLetter}*`);
      const data = await response.json();
  
      const validWords = data.filter(word => !playedWordSet.has(word.word));
      const randomIndex = Math.floor(Math.random() * validWords.length);
      return validWords[randomIndex].word;
    }
  
    function createWordBox(word, player) {
      const wordBox = document.createElement("div");
      wordBox.classList.add("word-box");
      wordBox.classList.add(player);
  
      wordBox.textContent = word;
  
      return wordBox;
    }
  });
  