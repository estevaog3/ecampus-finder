const puppeteer = require("puppeteer");

const Login = {
  url: "https://ecampus.ufam.edu.br/ecampus/home/login",

  async init(url, viewPort) {
    this.browser = await puppeteer.launch({ headless: false });
    console.log("creating page...");
    this.page = await this.browser.newPage();
    console.log("page created");
    await this.page.setViewport(viewPort || { width: 1080, height: 720 });
    if (url) {
      this.url = url;
    }
  },

  async signIn() {
    if (!this.page) {
      await this.init();
    }
    await this.page.goto(this.url);
    await this.page.waitFor('a[title="Aluno"]');
    this.isLogged = true;
  },

  async close() {
    await this.browser.close();
    this.isLogged = false;
  },
};

module.exports = Login;
