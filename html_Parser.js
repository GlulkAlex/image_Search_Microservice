"use strict";
// TODO custom parser function must:
// TODO - extract from html (body) ["url", "snippet", "context", "thumbnail"]
// TODO - retrieve tags (start/end) for DIV
// TODO - retrieve tag's attribute ("class")
// TODO - retrieve tag's content (.innerHTML)
// TODO - work with streams (data chunks)
// helper
function parse_HTML(
  data_Chunk//: str
  ,extracted_Tags//: (obj | dictionary) | list of (obj | dictionary)
  ,current_Tag//: str
  //,open_Tags//: obj | dictionary
  //,processing_State//: obj | dictionary
  ,incomplete_Data//: str
) {// => Promise(obj) <- parse state
  "use strict";

  var result_Obj = {
    // 3 chars after '<'
    // states: empty -> (undefined | "") | partial -> "di" | complete -> "DIV"
    "open_Tag": "DIV"//<div class="rg_meta">
    // 5 chars after ' ' after "open_Tag"
    ,"tag_Attribute_Name": "class"
    // 7 chars after '="' after "tag_Attribute_Name"
    ,"tag_Attribute_Value": "rg_meta"
    // chars after '">' after "tag_Attribute_Value" and before "close_Tag"
    ,"tag_Content": "{\"cl\":6,\"id\":\"JJ6AX2fz8h4wLM:\", ..."
    // 3 chars after '</' after "open_Tag"
    // no else / others inner tags & divs expected
    ,"close_Tag": "DIV"//</div>
  };
  var str_Item_Index = 0;
  var i = 0;
  var chunk_Length = data_Chunk.length;
  var current_Char = "";

  //*** defaults ***//
  if (extracted_Tags) {} else {
    extracted_Tags = [];//{};
  }
  if (current_Tag) {} else {
    current_Tag = {
      "open_Tag": ""
      ,"tag_Attribute_Name": ""
      ,"tag_Attribute_Value": ""
      ,"tag_Content": ""
      ,"close_Tag": ""
    };
  }
  if (incomplete_Data) {} else {
    incomplete_Data = "";
  }
  //*** defaults end ***//

  for (;i < chunk_Length;i++) {
    current_Char = data_Chunk[i];
    if (current_Tag != "") {
      if (current_Char != ">") {
        current_Tag.open_Tag += current_Char;
      } else {
        //>>> open tag -> end(s)
        current_Tag.open_Tag = current_Tag;
        extracted_Tags
          .push(
            current_Tag.open_Tag
          )
        ;
        current_Tag.open_Tag = "";
      }
    } else {
      if (current_Char == "<") {
        //>>> open tag -> possible start
        current_Tag.open_Tag += current_Char;
        if (current_Tag.open_Tag == "DIV") {
        }
      } else {
      }
    }
  }
  //return Promise
  //  .resolve(
  return {
        "extracted_Tags": extracted_Tags
        ,"current_Tag": current_Tag
        ,"incomplete_Data": incomplete_Data
      }
  //  )
  ;
}

/*##########################################################################*/
exports.parse_HTML = parse_HTML;
