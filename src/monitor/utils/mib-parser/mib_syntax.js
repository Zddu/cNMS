function Syntax() {
  this.stype = '';
  this.values = [];
  this.mib = '';
}
Syntax.prototype.setType = function (stype) {
  this.stype = stype;
};
Syntax.prototype.getType = function () {
  return this.stype;
};
Syntax.prototype.setValues = function (values) {
  this.values = values;
};
Syntax.prototype.getValues = function () {
  return this.values;
};
Syntax.prototype.setMib = function (mib) {
  this.mib = mib;
};
Syntax.prototype.getMib = function () {
  return this.mib;
};

module.exports = {
  Syntax: Syntax,
};
