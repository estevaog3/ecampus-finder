const puppeteer = require("puppeteer");

const Login = {
  url: "https://ecampus.ufam.edu.br/ecampus/home/login",

  async init(url, viewPort) {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.setViewport(viewPort || { width: 1080, height: 720 });
    if (url) {
      this.url = url;
    }
  },

  async signIn(username, password) {
    if (!this.page) {
      await this.init();
    }
    await this.page.goto(this.url);
    await this.page.waitFor("input#usuario");
    await this.page.type("input#usuario", username);
    await this.page.type("input#senha", password);
    await this.page.click("input#enviar");
    this.isLogged = true;
  },

  async close() {
    await this.browser.close();
    this.isLogged = false;
  },
};

module.exports = Login;
