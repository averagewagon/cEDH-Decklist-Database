/* Functions which work with Scryfall */
const SCRYFALL_URL = "https://api.scryfall.com/cards/named?fuzzy=";

// Checks that a commander is valid
async function checkCommander(name) {
  try {
    const url = SCRYFALL_URL + encodeURI(name);
    let response;
    
    const result = await fetch(url)
    .then(resp => {
      response = resp;
      return response.json();
    })
    .then(info => {
      let body = {}
      body.success = (response.status >= 200 && response.status < 300);
      body.info = info;
      return body;
    });
    
    if (result.success) {
      return { success: true, data: result.info };
    } else {
      return { success: false, message: result.info.details };
    }
  } catch (error) {
    console.error(error.message);
    return { success: false, message: "Error fetching from scryfall." };
  }
}

// Checks that the commanders are actual cards
async function getCommanderInfo() {
  try {
    const commanders = qsa("#commander-wrap input");
    const value = { success: true, commanders: [], colors: [] };
    
    const promises = []
    
    for (let i = 0; i < commanders.length; i++) {
      const commander = commanders[i];
      if (!commander.classList.contains("hidden")) {
        const res = checkCommander(commander.value).then(check => {
          if (!check.success) {
            return { success: false, message: commander.value + " is not a valid card name." };
          }
          const scry = check.data;
          commander.value = scry.name;
          const obj = {};
          obj.name = scry.name;
          obj.link = scry.image_uris.normal;
          const colors = [];
          for (let j = 0; j < scry.color_identity.length; j++) {
            colors.push(scry.color_identity[j].toLowerCase());
          }
          return { commander: obj, colors: colors, success: true };
        });
        promises.push(res);
      }
    }
    
    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      if (!res.success) {
        return res;
      }
      value.commanders.push(res.commander);
      for (let j = 0; j < res.colors.length; j++) {
        if (!value.colors.includes(res.colors[j])) {
          value.colors.push(res.colors[j]);
        }
      }
    }
    return value;
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}
