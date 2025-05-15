const elementsToToggle = {
  "Navbar": "#header, .navbar",
  "Sidebar": ".sidebar_hacky_thing",
  "News Quotes": ".news",
  "Footer": "#foot_bar, #footer, .footer_stuff",
  "Shoutbox": "#shoutbox",
  "Forum Stats": "#prostats_table",
  "Board Statistics": "#boardstats_e",
  "Dinks Lore": "#rand_quote_main_17",
  "Pinned": "#latest_threads_main_16",
  "Latest Posts": "#latest_threads_main_2",
  "Shitposting": "#latest_threads_main_18",
  "Core Tab": "#cat_1_e",
  "Community Tab": "#cat_5_e",
  "Events Tab": "#cat_104_e",
  "TTT Tab": "#cat_3_e",
  "PH Tab": "#cat_4_e",
  "Discord Tab": "#cat_84_e",
  "Murder Tab": "#cat_54_e",
  "Archives Tab": "#cat_27_e",
  "Staff Zone Tab": "#cat_35_e",
  "Staff Online": "#staff_online_box_main_13",
  "Top Poster": "#top_poster_main_15",
  "Board Statistics": "table:has(#boardstats_e)"

};
  
  document.addEventListener('DOMContentLoaded', () => {
    const toggleListLeft = document.getElementById('toggleListLeft');
    const toggleListRight = document.getElementById('toggleListRight');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
  
    chrome.storage.sync.get('visibilitySettings', (data) => {
      const settings = data.visibilitySettings || {};
  
      const labels = Object.keys(elementsToToggle);
      const middle = Math.ceil(labels.length / 2);
  
      labels.forEach((label, index) => {
        const div = document.createElement('div');
        div.classList.add('form-check', 'form-switch', 'mb-2');
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input');
        checkbox.id = label;
        checkbox.checked = settings[label] || false;
  
        const labelEl = document.createElement('label');
        labelEl.classList.add('form-check-label');
        labelEl.htmlFor = label;
        labelEl.textContent = label;
  
        div.appendChild(checkbox);
        div.appendChild(labelEl);
  
        if (index < middle) {
          toggleListLeft.appendChild(div);
        } else {
          toggleListRight.appendChild(div);
        }
      });
    });
  
    saveButton.addEventListener('click', async () => {
      const settings = {};
  
      for (const label of Object.keys(elementsToToggle)) {
        const checkbox = document.getElementById(label);
        settings[label] = checkbox.checked;
      }
  
      await chrome.storage.sync.set({ visibilitySettings: settings });
  
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          type: "update-visibility",
          settings: settings
        });
      }
  
      showToast();
    });
  
    resetButton.addEventListener('click', async () => {
  if (confirm('Are you sure you want to reset all settings?')) {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        alert('Reset failed: ' + chrome.runtime.lastError.message);
      } else {
        // Uncheck all toggles in the popup
        Object.keys(elementsToToggle).forEach(label => {
          const checkbox = document.getElementById(label);
          if (checkbox) checkbox.checked = false;
        });

        // Tell content script to reset layout
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          if (tab && tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: "update-visibility",
              settings: {}
            });
          }
        });

        // Optional: flash a toast or success message
        showToast();
      }
    });
  }
});

  });
  
  function showToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 1500);
  }
}

  