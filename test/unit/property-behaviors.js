export default class PropertyBehaviors {
  constructor(ctor) {
    this.ctor = ctor;
  }

  shouldBehaveLikeASimpleProperty(name, value) {
    describe(name, () => {
      it(`should set and get the value of ${name}`, (next) => {
        const subject = new this.ctor();
        subject[name](value);
        const result = subject[name]();
        expect(result).to.equal(value);
        next();
      });
    });
  }

  shouldBehaveLikeAMapProperty(name) {
    describe(name, () => {
      it(`should set and get the value of ${name}`, (next) => {
        const value = {foo: 'bar', fizz: 'buzz'};
        const subject = new this.ctor();
        subject[name](value);
        const result = subject[name]();
        expect(result).to.deep.equal(value);
        next();
      });

      it(`should set and get a specific value of ${name}`, (next) => {
        const subject = new this.ctor();
        subject[name]('foo', 'bar');
        expect(subject[name]('foo')).to.equal('bar');
        next();
      });
    });
  }
}
