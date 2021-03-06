module.exports = getItem
/** getItem
 * This function takes the value of the text fields and the radio buttons and converts them to 
 * useable values that getOrders can use.
*/

const axios = require('axios')
const getOrders = require('./getOrders')
const err = require('./err')

function getItem(iSearch, bOs) {
  let item; // Item ID
  let buySell; // Will be either "buy", "sell", or undefined
  const Info = document.getElementById('Info')
  let federation = document.getElementById('fedList').value
  // List of faction region IDs
  const amarrRegions = [
    10000054, // Aridia
    10000036, // Devoid
    10000043, // Domain
    10000067, // Genesis
    10000052, // Kador
    10000065, // Kor-Azor
    10000020, // Tash-Murkon
    10000038  // The Bleak Lands
    ]
  const caldariRegions = [
  10000016, // Lonetrek
  10000033, // The Citadel
  10000002, // The Forge
  10000069  // Black Rise
  ]
  const gallenteRegions = [
  10000064, // Essence
  10000037, // Everyshore
  10000048, // Placid
  10000032, // Sinq Laison
  10000044, // Solitude
  10000068  // Verge Vendor
  ]
  const minmatarRegions = [
  10000042, // Metropolis
  10000030, // Heimatar
  10000028  // Molden Heath
  ]
  const triglavianRegions = [] // Empty for now
  let array;

  // Checking for valid item
  if (iSearch == '') {
    Info.innerText = 'You didn\'t give a item to get the prices of!'
    setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
    return;
  }

  switch (federation) {
    case 'caldari':
      array = caldariRegions.slice(0)
      break;
    case 'amarr':
      array = amarrRegions.slice(0)
      break;
    case 'gallente':
      array = gallenteRegions.slice(0)
      break;
    case 'minmatar':
      array = minmatarRegions.slice(0)
      break;
    case 'triglavian':
      // array = triglavianRegions.slice(0)
      Info.innerText = 'There are no Triglavian regions as of right now!'
      setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
      break;
  }

  // getting the item ID
  axios.get(`https://esi.evetech.net/latest/search/?categories=inventory_type&datasource=tranquility&language=en-us&search=${iSearch}&strict=true`)
          .then(response => {
            try {
              const data = response.data
              item = data.inventory_type[0]
            } catch { // if `data.inventory_type[0]` doesnt exist, this block is run
              Info.innerText = 'That\'s not a valid item!'
              setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
              err('Invalid Item')
              return
            }
            // checking which radio button was selected
            for (let i = 0, length = bOs.length; i < length; i++) {
              if (bOs[i].checked) {
                // assign buySell the value of the checked radio
                buySell = bOs[i].value
                // only one radio can be logically checked, don't check the rest
                break;
              }
            }

            // call getOrders and pass the region ID, the radio button that was clicked, and the item ID
            getOrders(buySell, item, array)
          })
          .catch(error => { 
            err(error, 'Function: getItem()')
            return
          })
}