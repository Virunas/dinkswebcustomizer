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

function applyVisibilitySettings(settings) {
  for (const [label, selector] of Object.entries(elementsToToggle)) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
      let targetElement = el;

      if (label.includes("Tab") || label.includes("Pinned") || label.includes("Latest Posts") || label.includes("Shitposting") || label.includes("Staff Online")) {
        const table = el.closest('table.tborder');
        if (table) {
          targetElement = table;
          const next = table.nextElementSibling;
          if (next && next.tagName === "BR") {
            next.style.display = settings[label] ? "none" : "";
          }
        }
      }

      if (settings[label]) {
        targetElement.style.display = "none";
      } else {
        targetElement.style.display = "";
      }
    });

    if (label === "Sidebar") {
      const forums = document.querySelector('.forums');
      if (forums) {
        forums.style.width = settings[label] ? "100%" : "80%";
      }
    }
  }
}

// 🧠 Immediately apply settings on script load
chrome.storage.sync.get('visibilitySettings', (data) => {
  const settings = data.visibilitySettings || {};
  applyVisibilitySettings(settings);
});

// ✅ Also listen for popup changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "update-visibility") {
    applyVisibilitySettings(message.settings);
  }
});
