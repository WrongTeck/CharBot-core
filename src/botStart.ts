import ChairWoom from "./classes/ChairWoom";
//Creates a new instance of the bot. All begins there!
let bot = new ChairWoom().start();

//Exports the bot for external use
export {
  bot,
}