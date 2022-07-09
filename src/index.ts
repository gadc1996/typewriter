export default class Typewriter {
  paragraphs: Array<string>
  typedText: string
  currentIndex: number = 0;

  constructor(paragraphs: Array<string>) {
    this.paragraphs = paragraphs
    this.typedText = ''
  }

  addCharacter(character: string): void {
    this.typedText += character
  }

  removeCharacter(): void {
    this.typedText = this.typedText.substring(0, this.currentIndex--)
  }

  async typeFordward(paragraph: string): Promise<void> {
    this.addCharacter(paragraph[this.currentIndex++])
    await new Promise(resolve => {
      setTimeout(async () => {
        this.currentIndex < paragraph.length && await this.typeFordward(paragraph)
        resolve(null)
      }, 80)
    })
  }

  async typeBackwards(): Promise<void> {
    this.removeCharacter()
    await new Promise(resolve => {
      setTimeout(async () => {
        this.currentIndex >= 0 && await this.typeBackwards()
        resolve(null)
      }, 50)
    })
  }
  
  resetIndex() {
    this.currentIndex = 0
  }

  async sleep(): Promise<void> {
    await new Promise(resolve => setTimeout(() => resolve(null), 2000))
  }

  async start(): Promise<void> {
    while(true) {
      for (let paragraph of this.paragraphs) {
        await this.typeFordward(paragraph)
        .then(async() => await this.sleep())
        .then(async() => await this.typeBackwards())
        .then(async() => await this.resetIndex())
      }
    }
  }
}
