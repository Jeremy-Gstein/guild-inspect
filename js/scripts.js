document.addEventListener("DOMContentLoaded", function() {
      const raidFramesContainer = document.getElementById("raidFramesContainer");
      const playerNameInput = document.getElementById("playerName");
      const playerRealmInput = document.getElementById("playerRealm");
      const playerClassSelect = document.getElementById("playerClass");
      const popup = document.getElementById("popup");

      // Class colors
      const classColors = {
        DeathKnight: "#C41E3A",
        DemonHunter: "#A330C9",
        Druid: "#FF7C0A",
        Evoker: "#33937F",
        Hunter: "#AAD372",
        Mage: "#3FC7EB",
        Monk: "#00FF98",
        Paladin: "#F48CBA",
        Priest: "#FFFFFF",
        Rogue: "#FFF468",
        Shaman: "#0070DD",
        Warlock: "#8788EE",
        Warrior: "#C69B6D"
      };

      // Predefined raid group
      const predefinedRaidGroup = [
        { name: "Shodo", class: "Paladin", realm: "Proudmoore" },
        { name: "Mishern", class: "Shaman", realm: "Proudmoore" },
        { name: "Bouziedk", class: "DeathKnight", realm: "Proudmoore" },
        { name: "Hypixyl", class: "Priest", realm: "Proudmoore" },
        { name: "Liliru", class: "Evoker", realm: "Proudmoore" },
        { name: "Spectralguy", class: "Priest", realm: "Proudmoore" },
        { name: "Fidz", class: "Druid", realm: "Proudmoore" },
        { name: "Demonann", class: "DemonHunter", realm: "Proudmoore" },
        { name: "Freyalyse", class: "Hunter", realm: "Proudmoore" },
        { name: "Safari", class: "Druid", realm: "Proudmoore" },
        { name: "Draasin", class: "Evoker", realm: "Proudmoore" },
        { name: "Hatedthat", class: "Druid", realm: "Proudmoore" },
        { name: "Swagasian", class: "Rogue", realm: "Proudmoore" },
        { name: "Sinisong", class: "Mage", realm: "Proudmoore" },
        { name: "Sickflash", class: "Paladin", realm: "Proudmoore" },
        { name: "Salban", class: "Warrior", realm: "Proudmoore" },
        { name: "Pheus", class: "Shaman", realm: "Proudmoore" },
        { name: "Orbitall", class: "Shaman", realm: "Proudmoore" },
        { name: "Sanghai", class: "Monk", realm: "Proudmoore" }, 
        // Add more players as needed
      ];

      // Simulating initial players
      const players = [...predefinedRaidGroup];

      // Create raid frames
      function renderRaidFrames() {
        raidFramesContainer.innerHTML = "";
        players.forEach(player => {
          const raidFrame = document.createElement("div");
          raidFrame.className = "raid-frame";
          raidFrame.textContent = player.name;
          raidFrame.style.backgroundColor = classColors[player.class];

          const manaBar = document.createElement("div");
          manaBar.className = "mana-bar";
          manaBar.style.backgroundColor = classColors[player.class];
          raidFrame.appendChild(manaBar);

          // Add click event listener
          raidFrame.addEventListener("click", () => handleRaidFrameClick(player));

          raidFramesContainer.appendChild(raidFrame);
        });
      }

      // Function to handle raid frame click
      function handleRaidFrameClick(player) {
        // Use the character name and realm for the API request
        const apiUrl = `https://raider.io/api/v1/characters/profile?region=us&realm=${player.realm}&name=${player.name}&fields=mythic_plus_recent_runs`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            displayCharacterInfo(player, data);
          })
          .catch(error => console.error('Error fetching data:', error));
      }

      function displayCharacterInfo(player, character) {
        // Generate HTML for recent runs
        const recentRunsHTML = generateRecentRunsHTML(character.mythic_plus_recent_runs);

        // Display the character information in the popup
        const popupContent = `
          <span onclick="closePopup()" style="cursor: pointer; position: absolute; top: 10px; right: 10px; font-size: 20px;">&times;</span>
          <h2>${player.name} - ${player.class}</h2>
          <img src="${character.thumbnail_url}" alt="Character Thumbnail">
          <p>Race: ${character.race}</p>
          <p>Class: ${character.class}</p>
          <p>Spec: ${character.active_spec_name}</p>
          <p>Role: ${character.active_spec_role}</p>
          <p>Achievement Points: ${character.achievement_points}</p>
          <p>Last Crawled At: ${character.last_crawled_at}</p>
          <p>Profile URL: <a href="${character.profile_url}" target="_blank">${character.profile_url}</a></p>
          
          <h3>Mythic Plus Recent Runs</h3>
          ${recentRunsHTML}
        `;

        // Set the popup content
        popup.innerHTML = popupContent;

        // Show the popup
        popup.style.display = "block";

        // Add an event listener to close the popup when clicking outside of it
        document.addEventListener("click", handleOutsideClick);

        // Function to close the popup
        function handleOutsideClick(event) {
          if (!popup.contains(event.target)) {
            // Click outside the popup, close it
            closePopup();
            // Remove the event listener after closing the popup
            document.removeEventListener("click", handleOutsideClick);
          }
        }
      }

      // Function to generate HTML for recent runs
      function generateRecentRunsHTML(recentRuns) {
        return recentRuns.map(run => `
          <p>Dungeon: ${run.dungeon}</p>
          <p>Mythic Level: ${run.mythic_level}</p>
          <p>Completed At: ${run.completed_at}</p>
          <p>Clear Time (ms): ${run.clear_time_ms}</p>
          <p>Par Time (ms): ${run.par_time_ms}</p>
          <p>Num Keystone Upgrades: ${run.num_keystone_upgrades}</p>
          
          <p>Affixes:</p>
          <ul>
            ${run.affixes.map(affix => `<li>${affix.name}: ${affix.description}</li>`).join('')}
          </ul>

          <p>URL: <a href="${run.url}" target="_blank">${run.url}</a></p>
          <hr>
        `).join('');
      }

      // Function to add a new player
      window.addPlayer = function() {
        const playerName = playerNameInput.value.trim();
        const playerClass = playerClassSelect.value;
        const playerRealm = playerRealmInput.value.trim();
        if (playerName && playerClass && playerRealm) {
          const newPlayer = { id: players.length + 1, name: playerName, class: playerClass, realm: playerRealm };
          players.push(newPlayer);
          playerNameInput.value = ""; // Clear input fields
          playerClassSelect.value = "";
          playerRealmInput.value = "";
          renderRaidFrames();
        }
      };

      // Function to close the popup
      window.closePopup = function() {
        const popup = document.getElementById("popup");
        popup.style.display = "none";
      };

      // Initial rendering
      renderRaidFrames();
    });