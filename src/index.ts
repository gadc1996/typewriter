interface Options {
  forwardSpeed: number;
  backwardSpeed: number;
  sleep: number;
}

const Defaults: Options = {
  forwardSpeed: 30,
  backwardSpeed: 30,
  sleep: 30
};

export default class Typewriter {
  private options: Options;
  private paragraphs: Array<string>;
  private currentIndex: number = 0;

  typedText: string = '';

  constructor(paragraphs: Array<string>, options: Options) {
    this.paragraphs = paragraphs;
    this.options = { ...Defaults, ...options };
  }

  private addCharacter(character: string): void {
    this.typedText += character;
  }

  private removeCharacter(): void {
    this.typedText = this.typedText.substring(0, this.currentIndex--);
  }

  private async typeFordward(paragraph: string): Promise<void> {
    this.addCharacter(paragraph[this.currentIndex++]);
    await new Promise((resolve) => {
      setTimeout(async () => {
        this.currentIndex < paragraph.length && (await this.typeFordward(paragraph));
        resolve(null);
      }, this.options.forwardSpeed);
    });
  }

  private async typeBackwards(): Promise<void> {
    this.removeCharacter();
    await new Promise((resolve) => {
      setTimeout(async () => {
        this.currentIndex >= 0 && (await this.typeBackwards());
        resolve(null);
      }, this.options.backwardSpeed);
    });
  }

  private resetIndex() {
    this.currentIndex = 0;
  }

  private async sleep(): Promise<void> {
    await new Promise((resolve) => setTimeout(() => resolve(null), this.options.sleep));
  }

  async start(): Promise<void> {
    while (true) {
      for (let paragraph of this.paragraphs) {
        await this.typeFordward(paragraph)
          .then(async () => await this.sleep())
          .then(async () => await this.typeBackwards())
          .then(async () => await this.resetIndex());
      }
    }
  }
}
