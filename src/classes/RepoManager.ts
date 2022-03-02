import { ChairWoom } from "..";
import axios from "axios";

export default class RepoManager {
  constructor(private bot: ChairWoom) {
    
  }

  public getUpdates() {
    axios.get(this.bot.config.core.repo.url).then((value) => {
      let data = JSON.parse(value.data);
    }).catch((err) => {
      this.bot.console.error("Error while fetching the repositories! Error:\n"+err);
    })
  }
}