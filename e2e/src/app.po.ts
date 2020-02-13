import { browser, by, element } from 'protractor';

export class AppPage {
  public navigateTo(destination: string) {
    return browser.get(destination);
  }

  public getTitle() {
    return browser.getTitle();
  }

  public getPageOneTitleText() {
    return element(by.tagName('app-home'))
      .element(by.deepCss('ion-title'))
      .getText();
  }
}
