export class MessageQueue<MessageModel> {
    public name: string;
    private messages: MessageModel[] = [];
    private consumers: ((message: MessageModel | null) => void)[] = [];

    constructor(name: string) {
      this.name = name;
    }
  
    sendMessage(message: MessageModel): void {
      if (this.consumers.length > 0) {
        const consumer = this.consumers.shift();
        if (consumer) {
          consumer(message);
        }
      } else {
        this.messages.push(message);
      }
    }
  
    consumeMessage(timeout: string = '10000'): Promise<MessageModel | null> {
      return new Promise((resolve, reject) => {
        if (this.messages.length > 0) {
          resolve(this.messages.shift()!);
        } else {
          const timer = setTimeout(() => {
            resolve(null);
          }, parseInt(timeout));
  
          this.consumers.push((message) => {
            clearTimeout(timer);
            resolve(message);
          });
        }
      });
    }
  }