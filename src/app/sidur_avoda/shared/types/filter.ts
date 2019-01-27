export class Filter {
    value?: any;
    matchMode?: string;
    constructor(_value?: any, matchMode?: string) {
      this.matchMode = matchMode;
      this.value = _value;
    }
  }