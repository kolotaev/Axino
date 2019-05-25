class Config {
    constructor(foo) {
        this.foo = foo;
    }

    static self() {
        return this || null;
    }
}

const a = new Config('ff');
a.self();
