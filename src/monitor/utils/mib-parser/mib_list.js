function getOid(child_oid_object, oid_object) {
  // add the previous oid object (that called this function) to the current oid_object
  if (child_oid_object != null) {
    oid_object.addChild(child_oid_object);
  }

  var origin_tab = oid_object.getOrigin().split(' ');
  var oid = origin_tab[origin_tab.length - 1];
  var origin_name = origin_tab[0];

  // if the parent oid is in the list
  var oid_object_in_list = $.grep(oid_list, function (e) {
    return e.getName() == origin_name;
  });
  if (oid_object_in_list.length == 1) {
    oid = getOid(oid_object, oid_object_in_list[0]) + '.' + oid;
  } else {
    if (oid_object.getName() == 'org') {
      //TODO
      var aa;
    }
    //if there is no parent, add the oid in the root list  (if not already present)
    oid_object.root = true;
    if (root.indexOf(oid_object) < 0) {
      root.push(oid_object);
    }
    //if this mib is importing other mib, setting the origin of the mib as the origin for this oid
    var oid_name_in_import = $.grep(oid_object.mib.import_mibs, function (e) {
      return e.import_name == origin_name;
    });
    if (oid_name_in_import.length == 1) {
      var parent_name = oid_object.origin.split(' ')[0];
      oid = oid_name_in_import[0].mib + '.' + parent_name + '.' + oid;
      //if the mib isn't importing any mib, we are at the top
    } else {
      oid = '1.' + oid;
    }
  }
  return oid;
}

function generateOid() {
  for (var i in oid_list) {
    if (oid_list.hasOwnProperty(i)) {
      oid_list[i].setOid(getOid(null, oid_list[i]));
      oid_autocomplete.push(oid_list[i].getOid());
    }
  }
}

function Sequence(sequence_name, sequence_objects) {
  this.sequence_name = sequence_name;
  this.sequence_objects = sequence_objects;
}

function TextualConventionSyntax(syntax_type, syntax_value) {
  this.syntax_type = syntax_type;
  this.syntax_value = syntax_value;
}

function TextualConventionsyntaxValue(value_name, value_value, value_description) {
  this.value_name = value_name;
  this.value_value = value_value;
  this.value_description = value_description;
}

module.exports = {
  Sequence: Sequence,
  generateOid: generateOid,
  TextualConventionSyntax: TextualConventionSyntax,
  TextualConventionsyntaxValue: TextualConventionsyntaxValue,
  getOid: getOid,
};
