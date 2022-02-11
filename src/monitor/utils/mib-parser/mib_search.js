function SearchEngine() {
  this.oid_search_object_name = [];
  this.oid_search_object_description = [];
  this.oid_search_syntax_name = [];
  this.oid_search_oid = [];
  this.search_all = true;
  this.search_oid = true;
  this.search_name = true;
  this.search_syntax = true;
  this.search_index = true;
  this.search_description = true;
}

SearchEngine.prototype.searchFields = function (
  search_all,
  search_oid,
  search_name,
  search_syntax,
  search_index,
  search_description
) {
  this.search_all = search_all;
  this.search_oid = search_oid;
  this.search_name = search_name;
  this.search_syntax = search_syntax;
  this.search_index = search_index;
  this.search_description = search_description;
};

SearchEngine.prototype.searchMib = function (text) {
  var result = new Array();
  var score = 0;
  var oid_object;
  var text_splitted = text.split(' ');
  for (var i in oid_list) {
    if (oid_list.hasOwnProperty(i)) {
      score = 0;
      oid_object = oid_list[i];
      for (var j in text_splitted) {
        if (text_splitted.hasOwnProperty(j)) {
          score += this.searchOidObject(text_splitted[j].trim(), oid_object);
        }
      }
      if (score > 0) {
        result.push({ oid: oid_object.getOid(), score: score });
      }
    }
  }
  return result;
};

SearchEngine.prototype.add_oid_object = function (oid_object) {
  if (
    $.grep(this.oid_search_object_name, function (e) {
      return e == oid_object.getName();
    }).length == 0
  ) {
    this.oid_search_object_name.push(oid_object.getName());
  }
  if (
    $.grep(this.oid_search_oid, function (e) {
      return e == oid_object.getOid();
    }).length == 0
  ) {
    this.oid_search_oid.push(oid_object.getOid());
  }
  if (oid_object.getParam()) {
    var odesc = oid_object.getDescription();
    for (var i in odesc) {
      if (odesc.hasOwnProperty(i)) {
        if (
          odesc[i].length >= 3 &&
          $.grep(this.oid_search_object_description, function (e) {
            return e == odesc[i];
          }).length == 0
        ) {
          this.oid_search_object_description.push[odesc[i]];
        }
      }
    }
    if (
      $.grep(this.oid_search_syntax_name, function (e) {
        return e == oid_object.getSyntax();
      }).length == 0
    ) {
      this.oid_search_syntax_name.push(oid_object.getSyntax());
    }
  }
};

SearchEngine.prototype.searchOidObject = function (text, oid_object) {
  var score = 0;
  var re = new RegExp(text, 'i');
  var re_strict = new RegExp('(?:^| )' + text + '(?: |$)', 'i');
  if (this.search_all || this.search_oid) {
    if (oid_object.getOid() == text) {
      score += 15;
    } else if (oid_object.getOid().indexOf(text) >= 0) {
      score += 10;
    }
  }
  if (this.search_all || this.search_name) {
    if (re_strict.test(oid_object.getName())) {
      score += 15;
    } else if (re.test(oid_object.getName())) {
      score += 10;
    }
  }
  if (oid_object.getParam()) {
    if (this.search_all || this.search_syntax) {
      if (re.test(oid_object.getParam().syntax.getType())) {
        score += 3;
      }
    }

    if (this.search_all || this.search_description) {
      if (re_strict.test(oid_object.getParam().getDescription())) {
        score += 6;
      } else if (re.test(oid_object.getParam().getDescription())) {
        score += 4;
      }
    }
    if (this.search_all || this.search_index) {
      if (re.test(oid_object.getParam().getIndex())) {
        score += 3;
      }
    }
    //TODO
    //        if (re.test(oid_object.getParam().getStatus())) {
    //            score += 2;
    //        }
  }
  return score;
};

module.exports = {
  SearchEngine: SearchEngine,
};
