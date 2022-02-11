function OidObject() {
  this.oid = '';
  this.oname = '';
  this.otype = '';
  this.mib = null;
  this.childs = [];
  this.parameters = null;
  this.origin = '';
  this.root = false;
}

OidObject.prototype.setOid = function (oid) {
  this.oid = oid;
};
OidObject.prototype.getOid = function () {
  return this.oid;
};
OidObject.prototype.setType = function (otype) {
  this.otype = otype;
};
OidObject.prototype.getType = function () {
  return this.otype;
};
OidObject.prototype.setName = function (oname) {
  this.oname = oname;
};
OidObject.prototype.getName = function () {
  return this.oname;
};
OidObject.prototype.getChildByOid = function (oid) {
  var child = $.grep(this.childs, function (e) {
    return e.oid == oid;
  });
  return child[0];
};
OidObject.prototype.addChild = function (child) {
  if (this.childs.indexOf(child) < 0) {
    this.childs.push(child);
  }
};
OidObject.prototype.getChilds = function () {
  return this.childs;
};
OidObject.prototype.getChildByOid = function () {
  return this.childs;
};
OidObject.prototype.getChildsNumber = function () {
  return this.childs.length;
};
OidObject.prototype.setParam = function (parameters) {
  this.parameters = parameters;
};
OidObject.prototype.getParam = function () {
  return this.parameters;
};
OidObject.prototype.setOrigin = function (origin) {
  this.origin = origin;
};
OidObject.prototype.getOrigin = function () {
  return this.origin;
};

// OidObject.prototype.getRow = function () {
//     var ds = '<tr class="oid_row" id="oid_' + this.getOid() + '">'
//         + '<td class="oid_column_button">';
//     if (this.childs.length > 0) {
//         ds += '<a class="btn btn-default btn-sm oid_tree_button"  onclick="display_next(\'' + this.getOid() + '\')" >'
//             + '<i id="i_' + this.getOid() + '" class="fa fa-plus-circle fa-lg"></i>'
//             + '</a></td>';
//     } else {
//         ds += '<a class="btn btn-default btn-sm oid_tree_button" disabled="">'
//             + '<i class="fa fa-dot-circle-o fa-lg"></i>'
//             + '</a></td>';
//     }
//     if (this.parameters) {
//         ds += '<td class="oid_tree_data">' + this.getOid() + '</br>'
//             + '<strong>Name:</strong><span class="oid_name"> ' + this.getName() + '</span></br>'
//             + '<strong> MIB: </strong>'
//             + '<a href="#" onclick="goTo(\'display_detail\', \'' + this.mib.mib_name + '\')">' + this.mib.mib_name
//             + ' <i class="fa fa-external-link"></i></a><br>';
//         if (this.parameters.syntax.getType() != "") {
//             var syntax_type = this.parameters.syntax.getType();
//             var syntax = $.grep(convention_list, function (e) {
//                 return e.getName() == syntax_type;
//             });
//             if (syntax.length > 0) {
//                 ds += '<strong>Syntax: </strong><a href="#a" onclick="display_detail(\'TEXTUAL-CONVENTION\', \'' + syntax[0].getName() + '\')" class="oid_syntax">'
//                     + this.parameters.syntax.getType() + ' <i class="fa fa-info-circle"></i></a></br>';
//             } else {
//                 ds += '<strong>Syntax: </strong><span>' + this.parameters.syntax.getType() + '</span></br>';
//                 if (this.parameters.syntax.getValues().length > 0) {
//                     ds += "<ul>";
//                     for (var i in this.parameters.syntax.getValues()) {
//                         if (this.parameters.syntax.getValues().hasOwnProperty(i)) {
//                             ds += "<li>" + this.parameters.syntax.getValues()[i] + "</li>";
//                         }
//                     }
//                     ds += "</ul>";
//                 }
//             }
//         }
//         if (this.parameters.getIndex() != "") {
//             ds += '<strong>Index:</strong><span class="oid_index"> ' + this.parameters.getIndex() + '</span></br>';
//         }
//         ds += '<strong>Description:</strong><span class="oid_description"> ' + this.parameters.getDescription() + '</span>'
//     } else {
//         ds += '<td class="oid_tree_data">' + this.getOid() + '</br><strong>Name:</strong><span class="oid_name"> ' + this.getName() + '</span>'
//     }
//     ds += '<table id="table_' + this.getOid() + '" class="table table-condensed next_oid_table" style="margin: 0px; display: none;">';
//     for (var i in this.childs) {
//         ds += this.childs[i].getRow();
//     }
//     ds += '</table>'
//         + '</td>'
//         + '</tr>\n';
//     return ds;
// };

// OidObject.prototype.search_result = function (text, search_all, search_oid, search_name, search_syntax, search_index, search_description) {
//     var re;
//     var oid = this.getOid();
//     var oid_name = this.getName();
//     if (this.parameters) {
//         var oid_syntax = this.parameters.syntax.getType();
//         var oid_index = this.parameters.getIndex();
//         var oid_description = this.parameters.getDescription();
//     } else {
//         var oid_syntax = "";
//         var oid_index = "";
//         var oid_description = "";
//     }
//     var re_text = text.replace(" ", "|");
//     re = new RegExp('(' + re_text + ')', "gi");

//     if (search_all || search_oid) {
//         oid = oid.replace(re, "<strong>$1</strong>");
//     }
//     if (search_all || search_name) {
//         oid_name = oid_name.replace(re, "<strong>$1</strong>");
//     }
//     if (search_all || search_syntax) {
//         oid_syntax = oid_syntax.replace(re, "<strong>$1</strong>");
//     }
//     if (search_all || search_index) {
//         oid_index = oid_index.replace(re, "<strong>$1</strong>");
//     }
//     if (search_all || search_description) {
//         oid_description = oid_description.replace(re, "<strong>$1</strong>");
//     }

//     var ds = "<article style='padding-top:0;'>"
//         + '<h5>'
//         + '<a href="#" onclick="goTo(\'display_preview\', \'oid_' + this.getOid() + '\')" class="oid_name"> ' + oid_name + ' <i class="fa fa-external-link"></i></a>'
//         + '</h5>'
//         + 'OID: ' + oid + '<br>'
//         + 'MIB: <a href="#" onclick="goTo(\'display_detail\', \'' + this.mib.mib_name + '\')">' + this.mib.mib_name + ' <i class="fa fa-external-link"></i></a><br>';
//     if (this.parameters) {
//         if (this.parameters.syntax.getType() != "") {
//             var syntax_type = this.parameters.syntax.getType();
//             var syntax = $.grep(convention_list, function (e) {
//                 return e.getName() == syntax_type;
//             });
//             if (syntax.length > 0) {
//                 ds += 'Syntax: <a href="#" onclick="display_detail(\'TEXTUAL-CONVENTION\', \'' + syntax[0].getName() + '\')" class="btn oid_syntax">'
//                     + oid_syntax + ' <i class="fa fa-info-circle"></i></a><br>';
//             } else {
//                 ds += 'Syntax: <span>' + oid_syntax + '</span><br>';
//             }
//         }
//         if (this.parameters.getIndex() != "") {
//             ds += '<strong>Index:</strong><span class="oid_index"> ' + this.parameters.getIndex() + '</span></br>';
//         }
//         ds += '<hr><span class="oid_description"> ' + oid_description + '</span>';
//     }
//     ds += '</article>\n';
//     return ds;
// };

function OidObjectParam() {
  this.syntax = new Syntax();
  this.access = '';
  this.ostatus = '';
  this.odescription = '';
  this.oindex = '';
}

OidObjectParam.prototype.setAccess = function (access) {
  this.access = access;
};
OidObjectParam.prototype.getAccess = function () {
  return this.access;
};
OidObjectParam.prototype.setStatus = function (ostatus) {
  this.ostatus = ostatus;
};
OidObjectParam.prototype.getStatus = function () {
  return this.ostatus;
};
OidObjectParam.prototype.setDescription = function (odescription) {
  this.odescription = odescription.replace(/"/g, '');
};
OidObjectParam.prototype.addDescription = function (odescription) {
  this.odescription += ' ' + odescription.replace(/"/g, '');
};
OidObjectParam.prototype.getDescription = function () {
  return this.odescription;
};
OidObjectParam.prototype.setIndex = function (oindex) {
  this.oindex = oindex;
};
OidObjectParam.prototype.getIndex = function () {
  return this.oindex;
};

module.exports = {
  OidObject: OidObject,
  OidObjectParam: OidObjectParam,
};
