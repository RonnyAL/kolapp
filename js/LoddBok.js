class LoddBok {
    constructor(letter = "A", number = 1, color = "red", maxNum = 99, minNum = 1) {
        this.letter = letter;
        this.number = number;
        this.color = color;
        this.maxNum = maxNum;
        this.minNum = minNum;
    }

    set let(letter) {
        if (letter.length <= 0) return false;
        let re = /^[A-ZÆØÅa-zæøå]?$/;
        if (re.test(letter)) {
            this.letter = letter.toUpperCase();
            return true;
        }
        return false;
    }

    set num(number) {
        let int = parseInt(number);
        if (isNaN(int)) return false;
        if (int > this.maxNum) {
            this.number = this.maxNum;
        } else if (int < this.minNum) {
            this.number = this.minNum;
        } else {
            this.number = int;
        }
        return true;
    }

    get let() {
        return this.letter;
    }

    get num() {
        return this.padNum();
    }

    addNum() {
        let num = this.number;
        console.log(num);
        if ((num+1) <= this.maxNum && (num+1) >= this.minNum) {
            this.number++;
        }
        return this.padNum();
    }

    subtractNum() {
        let num = this.number;
        console.log(num);
        if ((num-1) <= this.maxNum && (num-1) >= this.minNum) {
            this.number--;
        }
        return this.padNum();
    }

    padNum() {
        if (this.number < 10) {
            return "0" + this.number;
        } else {
            return this.number;
        }
    }
}