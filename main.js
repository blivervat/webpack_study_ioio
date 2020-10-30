import './src/assets/css/index.less';
class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
console.log('aaa');
const dog = new Animal('dog');