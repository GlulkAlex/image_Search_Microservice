"use strict";
// helper
// pad string with char
/** str.replace("Microsoft","W3Schools");
* 'class="rg_meta"'.replace(/./g,"_"); => '_______________'
*/
function replace_With(
  source_Str//: str
  ,replace_Char//: str
) {
  "use strict";
  var result = "";//[];
  //>>> defaults <<<//
  if (replace_Char) {} else {replace_Char = "_";}
  //>>> defaults end <<<//

  source_Str
    .split("")
    .forEach((item, index) => {result += replace_Char;})

  return result;
}

// helper
function pad_With(
  source_Str//: str
  ,replace_Char//: str
) {
  "use strict";
  var result = "";//[];
  var source_Str_Length = source_Str.length;
  var index = 0;
  //>>> defaults <<<//
  if (replace_Char) {} else {replace_Char = "_";}
  //>>> defaults end <<<//
  for(;index < source_Str_Length;index++){result += replace_Char;}

  return result;
}

// "url": <a href="/url?q=http://weknowyourdreamz.com/fox.html&amp; ... "
// after "/url?q=" and before "&amp;" | '"'
// "thumbnail": <img height="94" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:
// <cite title="weknowyourdre ... "
// DONE - retrieve tags (start/end) for DIV
// DONE - retrieve tag's attribute ("class")
// DONE - retrieve tag's content (.innerHTML)
// DONE - work with streams (data chunks)
// input: data stream / chunks
// stream processing => ? many accumulators ?
// output: js object / key => value dictionary

// https://www.google.ru/search?q=cute+owl&tbm=isch <- term = "cute+owl"
//<div class="rg_meta">
//{"cl":6,"id":"JJ6AX2fz8h4wLM:",
//"isu":"wallpaperswide.com","itg":false,"ity":"jpg",
//"oh":720, <- image height
//"ou":"http://wallpaperswide.com/download/cute_owl-wallpaper-1152x720.jpg", <- "url"
//"ow":1152, <- image width
//"pt":"Cute Owl HD desktop wallpaper : Widescreen : High Definition ...", <- "snippet"
//"rid":"2kOGT5u3dPuyQM",
//"ru":"http://wallpaperswide.com/cute_owl-wallpapers.html", <- "context"
//"s":"Wide 16:10","th":177,
//"tu":"https://encrypted-tbn0.gstatic.com/images?q\u003dtbn:ANd9GcRmavtLjp8djM6VjoHB8xr8WOVp8rlsO1Puk4gClrBTZkHR99U8",
// <- "thumbnail"
//"tw":284}
//</div>
// helper
function extract_Div_rg_meta_Content(
  data_Chunk//: str
  //>>> main data accumulator <<<//
  ,extracted_Tags//: (obj | dictionary) | list of (obj | dictionary)
  ,parser_State//: obj | dictionary
  //,current_Tag//: str
  //,open_Tags//: obj | dictionary
  //,processing_State//: obj | dictionary
  //,incomplete_Data//: str
  ,is_Debug_Mode//: bool <- optional
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
    ,"tag_Content": "{\"cl\":6,\"id\":\"JJ6AX2fz8h4wLM:\", ..."//  <- may be incomplete
    // 3 chars after '</' after "open_Tag"
    // no else / others inner tags & divs expected
    ,"close_Tag": "DIV"//</div> <- may never being completed
  };
  var str_Item_Index = 0;
  var i = 0;
  var chunk_Length = data_Chunk.length;
  var current_Char = "";
  //>>> parser's state <<<///
  var open_Tag_Start_Slide_Window = "";//"____"; // | "<div".length == 4
  var tag_Attribute_Slide_Window = "";//"_______________"; // | 'class="rg_meta"'.length == 15
  var open_Tag_End_Slide_Window = "";//"_"; // | ">".length == 1
  var tag_Content = "";// tag_Content - close_Tag_Slide_Window -> drop 5 left chars | "".slice(0, -5)
  var close_Tag_Slide_Window = "";//"_____"; // | "</div".length == 5 | "</".length == 2

  //*** defaults ***//
  if (is_Debug_Mode) {console.log("defaults:");}
  //if (is_Debug_Mode) {console.log("extracted_Tags:", extracted_Tags);}
  if (extracted_Tags) {
    if (is_Debug_Mode) {console.log("extracted_Tags.length:", extracted_Tags.length);}
  } else {
    extracted_Tags = [];//{};
    if (is_Debug_Mode) {console.log("extracted_Tags is empty:", extracted_Tags);}
  }
  /*if (current_Tag) {} else {
    current_Tag = {
      "open_Tag": ""
      ,"tag_Attribute_Name": ""
      ,"tag_Attribute_Value": ""
      ,"tag_Content": ""
      ,"close_Tag": ""
    };
  }*/
  /*if (incomplete_Data) {} else {
    incomplete_Data = "";
  }*/
  //*** defaults end ***//

  //*** initialization ***//
  if (is_Debug_Mode) {console.log("initialization:");}
  if (is_Debug_Mode) {console.log("parser_State:", parser_State);}
  if (parser_State) { // is not null | undefined & is an proper object
    //>>> set <<<//
    open_Tag_Start_Slide_Window = parser_State.open_Tag_Start;
    tag_Attribute_Slide_Window = parser_State.tag_Attribute;
    open_Tag_End_Slide_Window = parser_State.open_Tag_End;
    tag_Content = parser_State.tag_Content;
    close_Tag_Slide_Window = parser_State.close_Tag;
  } else {
  }
  if (is_Debug_Mode) {console.log("open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window);}
  if (is_Debug_Mode) {console.log("open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Content.length:", tag_Content.length);}
  if (is_Debug_Mode) {console.log("close_Tag_Slide_Window:", close_Tag_Slide_Window);}
  //*** initialization end ***//

  for (;i < chunk_Length;i++) {

    current_Char = data_Chunk[i];

    if (
      open_Tag_Start_Slide_Window == "" ||
      open_Tag_Start_Slide_Window.length < 4 ||
      open_Tag_Start_Slide_Window != "<div"
      ) {
      open_Tag_Start_Slide_Window = (open_Tag_Start_Slide_Window + current_Char).slice(-4);
      if (is_Debug_Mode) {
        console.log(
          "add to open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window,
          ".length:", open_Tag_Start_Slide_Window.length);}
    }
    if (
      tag_Attribute_Slide_Window == "" ||
      tag_Attribute_Slide_Window.length < 15 ||
      tag_Attribute_Slide_Window != 'class="rg_meta"'
      ) {
      tag_Attribute_Slide_Window = (tag_Attribute_Slide_Window + current_Char).slice(-15);
      if (false) {
        console.log(
          "add to tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window,
          ".length:", tag_Attribute_Slide_Window.length);}
    }
    if (
      open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window != '>'
      ) {
      open_Tag_End_Slide_Window = current_Char;
      if (is_Debug_Mode) {
        console.log(
          "add to open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window,
          ".length:", open_Tag_End_Slide_Window.length);}
    }
    /*
    if (
      (open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window == '>') &&
      (close_Tag_Slide_Window == "" ||
      close_Tag_Slide_Window.length < 5 ||
      close_Tag_Slide_Window != "</div")
    ) {
      tag_Content += current_Char;
    }
    */
    if (
      (open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window == '>') &&
      (close_Tag_Slide_Window == "" ||
      close_Tag_Slide_Window.length < 5 ||
      close_Tag_Slide_Window != "</div")
    ) {
      tag_Content += current_Char;
      close_Tag_Slide_Window = (close_Tag_Slide_Window + current_Char).slice(-5);
      //if (is_Debug_Mode) {console.log("add to tag_Content.length:", tag_Content.length);}
      if (is_Debug_Mode) {
        console.log(
          "add to close_Tag_Slide_Window:", close_Tag_Slide_Window, ".length:", close_Tag_Slide_Window.length);}
    }

    if (close_Tag_Slide_Window == "</div") {

      extracted_Tags
        .push(
          tag_Content.slice(1, -5)
        )
      ;
      if (is_Debug_Mode) {console.log("push to extracted_Tags.length:", extracted_Tags.length);}
      //>>> reset <<<//
      open_Tag_Start_Slide_Window = "";
      tag_Attribute_Slide_Window = "";
      open_Tag_End_Slide_Window = "";
      tag_Content = "";//tag_Content.slice(0, -5);
      close_Tag_Slide_Window = "";

    } else {
    }
  }
  //>>> reset <<<//
  //TypeError: Cannot assign to read only property 'open_Tag_Start'
  /*
  parser_State.open_Tag_Start = open_Tag_Start_Slide_Window;
  parser_State.tag_Attribute = tag_Attribute_Slide_Window;
  parser_State.open_Tag_End = open_Tag_End_Slide_Window;
  parser_State.tag_Content = tag_Content;
  parser_State.close_Tag = close_Tag_Slide_Window;
  */
  if (is_Debug_Mode) {console.log("return value:");}
  if (is_Debug_Mode) {console.log("open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window);}
  if (is_Debug_Mode) {console.log("open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Content.length:", tag_Content.length);}
  if (is_Debug_Mode) {console.log("close_Tag_Slide_Window:", close_Tag_Slide_Window);}
  //return Promise
  //  .resolve(
  return {
        "extracted_Tags": extracted_Tags
        ,"parser_State": {
          "open_Tag_Start": open_Tag_Start_Slide_Window
          ,"tag_Attribute": tag_Attribute_Slide_Window
          ,"open_Tag_End": open_Tag_End_Slide_Window
          ,"tag_Content": tag_Content
          ,"close_Tag": close_Tag_Slide_Window
        }
      }
  //  )
  ;
}

// TODO custom parser function must:
// TODO - extract from html (body) data for ["url", "snippet", "context", "thumbnail"]
// "context" <- page where image url used (embedded)
// "url" <- for image (currently) is missing in response (for specific GET request) body
//<td style="width:25%;word-wrap:break-word">
//  <a
//    href="/url?q=   <<- context start
//      http://www.catersnews.com/stories/animals/say-cheese-adorable-moment-two-tiny-mice-are-spotted-cuddling-before-bedtime/
//      &amp;   <<- context end
//      sa=U&amp;ved=0ahUKEwjMvYXd-o3MAhXqF5oKHUosDb04HhDBbggzMA8&amp;usg=AFQjCNHfm2XKY0Cyr6-ZM-fbUt8KO-AlJA
//    "
//    target="_blank">
//      <img
//        height="101"
//        src="  <<- thumbnail start, after /url?q=, inside <img
//          https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSPKRdOQ8xYQ8Yt6_W9MFLT7wZnXTVMr55MW-cJsyBeuXMKMHmgBHtkLjMr
//        "  <<- thumbnail end
//        width="150"
//        alt="
//          Image result for mice
//        ">
//  </a>
//  <br> <- 1-st, snippet_Tag.size == 4
//  <cite
//    title="
//      catersnews.com
//    ">
//    catersnews.com
//  </cite>
//  <br>    <<- snippet start after </cite> <- 2-nd, snippet_Tag.size == vary
//    Adorable moment two tiny <b>mice</b>
//  <br>    <<- snippet end <- 3-rd, reset all state to default
//  3000 × 2022 - 894k&nbsp;-&nbsp;jpg
//</td>
// helper
function parse_HTML(
  data_Chunk//: str
  //>>> main data accumulator <<<//
  ,extracted_Tags//: (obj | dictionary) | list of (obj | dictionary)
  ,parser_State//: obj | dictionary
  //,current_Tag//: str
  //,open_Tags//: obj | dictionary
  //,processing_State//: obj | dictionary
  //,incomplete_Data//: str
  ,is_Debug_Mode//: bool <- optional
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
    ,"tag_Content": "{\"cl\":6,\"id\":\"JJ6AX2fz8h4wLM:\", ..."//  <- may be incomplete
    // 3 chars after '</' after "open_Tag"
    // no else / others inner tags & divs expected
    ,"close_Tag": "DIV"//</div> <- may never being completed
  };
  var str_Item_Index = 0;
  var i = 0;
  var chunk_Length = data_Chunk.length;
  var current_Char = "";
  //>>> parser's state <<<///
  var context_Start = "";// "/url?q="
  var context = "";// "http://www.catersnews.com/ ..."
  var context_End = "";// "&amp;"
  var thumbnail_Start = "";// 'src="'
  var thumbnail = "";// "https://encrypted-tbn1.gstatic.com/images?q=tbn:"
  var thumbnail_End = "";// '"'
  var snippet_Start = 0;//"";// '<br>', next after </cite> <- br_Counter = 2
  // TODO skip all in snippet "< ... >"
  var snippet = "";// "Adorable moment two tiny <b>mice</b>"
  var snippet_Tag = "";// "< ... >" <- [0] | .slice(0, 1) == "<" && .slice(-1) == ">"
  var snippet_End = "";// snippet_Tag == '<br>' <- br_Counter = 3

  //*** defaults ***//
  if (is_Debug_Mode) {console.log("defaults:");}
  //if (is_Debug_Mode) {console.log("extracted_Tags:", extracted_Tags);}
  if (extracted_Tags) {
    if (is_Debug_Mode) {console.log("extracted_Tags.length:", extracted_Tags.length);}
  } else {
    extracted_Tags = [];//{};
    if (is_Debug_Mode) {console.log("extracted_Tags is empty:", extracted_Tags);}
  }
  //*** defaults end ***//

  //*** initialization ***//
  if (is_Debug_Mode) {console.log("initialization:");}
  //if (is_Debug_Mode) {console.log("parser_State:", parser_State);}
  if (parser_State) { // is not null | undefined & is an proper object
    //>>> set <<<//
    context_Start = parser_State.context_Start;
    context = parser_State.context;
    context_End = parser_State.context_End;
    thumbnail_Start = parser_State.thumbnail_Start;
    thumbnail = parser_State.thumbnail;
    thumbnail_End = parser_State.thumbnail_End;
    snippet_Start = parser_State.snippet_Start;
    snippet = parser_State.snippet;
    snippet_Tag = parser_State.snippet_Tag;
  } else {
  }
  if (is_Debug_Mode) {console.log("context:", context);}
  if (is_Debug_Mode) {console.log("thumbnail:", thumbnail);}
  if (is_Debug_Mode) {console.log("snippet:", snippet);}
  //*** initialization end ***//

  for (;i < chunk_Length;i++) {

    current_Char = data_Chunk[i];

    if (
      context_Start == "" ||
      context_Start.length < 7 ||
      context_Start != "/url?q="
      ) {
      context_Start = (context_Start + current_Char).slice(-7);
      if (false) {
        console.log(
          "add to context_Start:", context_Start,
          ".length:", context_Start.length);}
      if (false && context_Start == "/url?q=") {
        process.stdout.write("\rcontext.length: ");
      }
    }
    if (
      (context_Start == "/url?q=") &&
      (context == "" ||
      //context.length < 15 ||
      //context != 'class="rg_meta"'
      context_End != '&amp;')
      ) {
      context += current_Char;
      //console.log("\r");console.log("\b\r12");console.log("\b\r345");
      if (false) {
        //console.log("\r");
        //console.log(
        //  "\b\r", context.length);}//, "add to context.length");}//, context);}
        //process.stdout.write("\rcontext.length: " + context.length);}
        process.stdout.write(context.length + ", ");}
    }
    if (
      context_Start == "/url?q=" &&
      (context_End == "" ||
      context_End.length < 5 ||
      context_End != '&amp;')
      ) {
      context_End = (context_End + current_Char).slice(-5);
      if (false) {
        console.log(
          "add to context_End:", context_End,
          ".length:", context_End.length);}
      //>>> post check <<<//
      if (current_Char == ';' && context_End == '&amp;') {
        // drop fist char from the same iteration as / when context_Start complete
        context = context.slice(1, -5);
        if (is_Debug_Mode) { console.log("\ncontext extracted:", context);}
      }
    }

    if (
      context_End == "&amp;" &&
      (thumbnail_Start == "" ||
      thumbnail_Start.length < 5 ||
      thumbnail_Start != 'src="')
      ) {
      thumbnail_Start = (thumbnail_Start + current_Char).slice(-5);
      //>>> guard / margin / delimiter / skip char flag <<<//
      if (thumbnail_Start == 'src="') {
        if (is_Debug_Mode) { console.log("thumbnail_Start completed:", thumbnail_Start);}
        current_Char = undefined;
      }
    }
    if (
      current_Char &&
      thumbnail_Start == 'src="' &&
      thumbnail_End != '"'
    ) {

      if (current_Char == '"' && thumbnail != "") {
        thumbnail_End = current_Char;//'"';
        if (is_Debug_Mode) { console.log("thumbnail extracted:", thumbnail);}
      } else {
        thumbnail += current_Char;
      }
    }

    if (
      thumbnail_End == '"' &&
      snippet_Start < 2
      //(snippet_Start == 0 ||
      //snippet_Start.length < 4 ||
      //snippet_Start != 2)
      ) {
      snippet_Tag = (snippet_Tag + current_Char).slice(-4);
      //>>> guard / margin / delimiter / skip char flag <<<//
      if (snippet_Tag == '<br>') {
        if (is_Debug_Mode) { console.log("snippet_Tag completed:", snippet_Tag);}
        snippet_Start += 1;
        //>>> reset <<<//
        snippet_Tag = "";
        current_Char = undefined;

        if (snippet_Start == 2) {
          if (is_Debug_Mode) { console.log("snippet_Start completed:", snippet_Start);}
        }
      }
    }
    if (
      current_Char &&
      snippet_Start == 2 &&
      snippet_Tag != '<br>'
      //snippet_End != '<br>'
    ) {

      if (current_Char == '<') {
        // possible tag start
        // TODO handle case <snippet_Start><not br tag>
        snippet_Tag = current_Char;//'"';
      } else if (current_Char == '>' && snippet_Tag != "") {
        // possible tag end
        snippet_Tag += current_Char;
        if (is_Debug_Mode) { console.log("snippet_Tag completed:", snippet_Tag);}
        //>>> post check <<<//
        if (snippet_Tag == '<br>') {
          //snippet = context.slice(1, -4);
          if (is_Debug_Mode) { console.log("snippet extracted:", snippet);}
        }
      } else if (
        snippet_Tag == "" ||
        (snippet_Tag.slice(-1) == '>' &&
        snippet_Tag != "<br>")
      ) {
        snippet += current_Char;
      } else {
        snippet_Tag += current_Char;
      }
    }

    if (snippet_Tag == '<br>') {

      extracted_Tags
        .push(
          {"context": context
          ,"thumbnail": thumbnail
          ,"snippet": snippet
          }
        )
      ;
      if (is_Debug_Mode) {console.log("push to extracted_Tags.length:", extracted_Tags.length);}
      //>>> reset <<<//
      context_Start = "";
      context = "";
      context_End = "";
      thumbnail_Start = "";
      thumbnail = "";
      thumbnail_End = "";
      snippet_Start = 0;//"";
      snippet = "";
      snippet_Tag = "";

    } else {
    }
  }
  //>>> result <<<//
  if (is_Debug_Mode) {console.log("return value:");}
  if (is_Debug_Mode) {console.log("context:", context);}
  if (is_Debug_Mode) {console.log("thumbnail:", thumbnail);}
  if (is_Debug_Mode) {console.log("snippet:", snippet);}
  //return Promise
  //  .resolve(
  return {
        "extracted_Tags": extracted_Tags
        ,"parser_State": {
          "context_Start": context_Start
          ,"context": context
          ,"context_End": context_End
          ,"thumbnail_Start": thumbnail_Start
          ,"thumbnail": thumbnail
          ,"thumbnail_End": thumbnail_End
          ,"snippet_Start": snippet_Start
          ,"snippet": snippet
          ,"snippet_Tag": snippet_Tag
        }
      }
  //  )
  ;
}

/*##########################################################################*/
exports.parse_HTML = parse_HTML;
