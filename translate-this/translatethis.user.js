// ==UserScript==
// @name           Google Language API Translator Tooltip
// @author         Adrian
// @namespace      http://thinkphp.ro/
// @description    Translates selected text into a tooltip.
// @include        *
// ==/UserScript==

const HREF_NO = 'javascript: void(0)';

var body = getTag('body')[0];

var  languagesGoogle = ''+
'<option value="auto">Auto Detect</option>'+
'<option value="sq">Albanian</option>'+
'<option value="ar">Arabic</option>'+
'<option value="bg">Bulgarian</option>'+
'<option value="ca">Catalan</option>'+
'<option value="zh-CN">Chinese (Simplified)</option>'+
'<option value="zh-TW">Chinese (Traditional)</option>'+
'<option value="hr">Croatian</option>'+
'<option value="cs">Czech</option>'+
'<option value="da">Danish</option>'+
'<option value="nl">Dutch</option>'+
'<option value="en">English</option>'+
'<option value="et">Estonian</option>'+
'<option value="tl">Filipino</option>'+
'<option value="fi">Finnish</option>'+
'<option value="fr">French</option>'+
'<option value="gl">Galician</option>'+
'<option value="de">German</option>'+
'<option value="el">Greek</option>'+
'<option value="iw">Hebrew</option>'+
'<option value="hi">Hindi</option>'+
'<option value="hu">Hungarian</option>'+
'<option value="id">Indonesian</option>'+
'<option value="it">Italian</option>'+
'<option value="ja">Japanese</option>'+
'<option value="ko">Korean</option>'+
'<option value="lv">Latvian</option>'+
'<option value="lt">Lithuanian</option>'+
'<option value="mt">Maltese</option>'+
'<option value="no">Norwegian</option>'+
'<option value="pl">Polish</option>'+
'<option value="pt">Portuguese</option>'+
'<option value="ro">Romanian</option>'+
'<option value="ru">Russian</option>'+
'<option value="sr">Serbian</option>'+
'<option value="sk">Slovak</option>'+
'<option value="sl">Slovenian</option>'+
'<option value="es">Spanish</option>'+
'<option value="sv">Swedish</option>'+
'<option value="th">Thai</option>'+
'<option value="tr">Turkish</option>'+
'<option value="uk">Ukrainian</option>'+
'<option value="vi">Vietnamese</option>';


var txtSel;

var imgLookup;

images();


document.addEventListener('mouseup',showLookupIcon,false);
document.addEventListener('mousedown',mouseDownCleaning,false);

function mouseDownCleaning(e) {

         var divLookup = getId('divLookup');

         var divDic = getId('divDic');

         if(divDic) {

                 if(!clickedInsideID(e.target,'divDic')) {

                         divDic.parentNode.removeChild(divDic);    
                 }  
         }


         if(divLookup) {

                divLookup.parentNode.removeChild(divLookup);
         }
}



function showLookupIcon(e) {

         var divDic = getId('divDic');

         var divLookup = getId('divLookup');

         txtSel = getSelection();

         if(!txtSel || txtSel == "") {

             if(divLookup) {

                       divLookup.parentNode.removeChild(divLookup);
             }

             if(divDic) {

                   if(!clickedInsideID(e.target,'divDic')) {

                       divDic.parentNode.removeChild(divDic);
                   }
             }


             return;
         } 


             if(divDic) {

                   if(!clickedInsideID(e.target,'divDic')) {

                       divDic.parentNode.removeChild(divDic);
                   }

                return;
             }


         if(divLookup) {

               divLookup.parentNode.removeChild(divLookup);  
         }

         divLookup = createElement('div',{'id':'divLookup',style:'background-color: #B6DB6F;color: #000000; position:absolute; top:'+(e.clientY+window.pageYOffset+5)+'px; left:'+(e.clientX+window.pageXOffset)+'px; padding:3px; z-index:10000;'});

         divLookup.appendChild(imgLookup.cloneNode(false));

         divLookup.addEventListener('mouseover', lookup, false);

         body.appendChild(divLookup);
       
}





function lookup(e){

         var divResult = null;

         var divDic = getId('divDic');

         var divLookup = getId('divLookup'); 

         var top = divLookup.style.top;

         var left;

             if(e.clientX + window.pageXOffset <= 250) {

                  left = 0;

             } else {

                  left = parseInt(divLookup.style.left) - 250;
             }

             if(!txtSel || txtSel == "") {

                 if(divDic) {
 
                       divDic.parentNode.removeChild(divDic);
                 }
                         
                 return;
             } 

            //cleanup divDic
            if(divDic = getId('divDic')) {

                      divDic.parentNode.removeChild(divDic); 
            } 

            divLookup.parentNode.removeChild(divLookup);


             //create div container
             divDic = createElement('div',{'id':'divDic',style:'background-color: #B6DB6F; color:#000000; position:absolute; top:'+top+'; left:'+left+'px; min-width:250px; min-height:50px; max-width:50%; padding:5px; font-size:small; text-align:left; z-index:10000;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;border: 5px solid #B6DB6F'}); 

             divDic.addEventListener('mousedown', dragHandler, false);
 
             body.appendChild(divDic);

             divResult = createElement('div', {id:'divResult', style:'overflow:auto; padding:3px;'}, null, 'Loading...');

             divDic.appendChild(divResult);   

             //show options link
             divDic.appendChild(createElement('a', {id:'optionsLink', href:HREF_NO, style:'position:absolute; bottom:3px; right:3px; font-size:small; text-decoration: none;color: #393'}, 'click options false', '>>'));


             //request
             var source,destination;
 
                 source = GM_getValue('from') ? GM_getValue('from') : "en";

                 destination = GM_getValue('to') ? GM_getValue('to') : "ro";


             var googleapitranslatquery = "http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q="+escape(txtSel)+"&langpair=" + source + "%7C" + destination;
                
                 GM_xmlhttpRequest({

                          method: "GET",

                          url: googleapitranslatquery,

                          onload: function(resp) {

                             try {
 
                                   translation = resp.responseText.match(/\"translatedText\"\:\"(.*?)\"/)[1];

                                   translation = translation.replace(/\\u0026/g,'&');

                                   divResult.innerHTML = translation;

                                 } catch(e) {

                                   divResult.innerHTML = "error: " + e;
                                 }
 
                          }
 
                 });             

}


//make a request and retrieve data from server on change options
function quickLookup() {

         if(!txtSel || txtSel == "") {

             return;
         } 

         getId('divResult').innerHTML = "Loading...";  

         GM_xmlhttpRequest({

               method: "GET",

               url: "http://www.google.com/translate_t?text=" + txtSel + "&langpair=" + getId('optSelLangFrom').value + "|" + getId('optSelLangTo').value,

               onload: function(resp){

                       try{
                                getId('divResult').innerHTML = resp.responseText.match(/<div id=result_box.*?>(.*?)</)[1];
  
                          } catch(e) {

                                getId('divResult').innerHTML = "error: " + e;  
                          }
               }   
         }); 

}//end function quickLookup



function options(e) {

         var divOptions = getId('divOpt');

             if(!divOptions) {

                 divOptions = createElement('div', {id:'divOpt', style:'background-color: #91BE3D; position:relative; padding: 10px;border:5px solid #91BE3D;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px'});

                 getId('divDic').appendChild(divOptions);

                 getId('optionsLink').style.visibility = 'hidden';

                 //from
                 divOptions.appendChild(createElement('span', null, null,'From:'));
                 divOptions.appendChild(createElement('select', {id:'optSelLangFrom',style:'border: 1px solid #ccc;background: #DDFF96'}, null, languagesGoogle));
                 getId('optSelLangFrom').value = GM_getValue('from') ? GM_getValue('from') : "en";
                 getId('optSelLangFrom').addEventListener('change', quickLookup, false);

                 //to
                 divOptions.appendChild(createElement('span', null, null,' To:'));
                 divOptions.appendChild(createElement('select', {id:'optSelLangTo',style:'border: 1px solid #ccc;background: #DDFF96'}, null, languagesGoogle));
                 getId('optSelLangTo').value = GM_getValue('to') ? GM_getValue('to') : "ro";
                 getId('optSelLangTo').addEventListener('change', quickLookup, false);
                 

                 //save
                 divOptions.appendChild(createElement('span', null, null,'<br/><br/>'));
                 divOptions.appendChild(createElement('a', {href: HREF_NO,style:'background: #B9EC59;text-decoration: none;padding: 5px;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;color: #799F30;font-weight: bold'},'click saveOptions false', 'SAVE'));

                 //cancel
                 divOptions.appendChild(createElement('span', null, null,'&nbsp;'));
                 divOptions.appendChild(createElement('a', {href: HREF_NO,style:'background: #B9EC59;text-decoration: none;padding: 5px;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;color: #799F30;font-weight: bold'},'click options false', 'CANCEL'));

                 //written by
                 divOptions.appendChild(createElement('span', null, null,'<br/>'));
                 divOptions.appendChild(createElement('span',{id:'written_by',style:'margin-top: -4px;font-size: 9px;float: right;color: #fff'},null,'Written by <a href="http://thinkphp.ro" style="color: #fff;text-decoration: none">Adrian Statescu</a>'));

             } else {

                    divOptions.parentNode.removeChild(divOptions);
                    getId('optionsLink').style.visibility = 'visible';
             } 
 
}


function saveOptions(e) {

         var from = getId('optSelLangFrom').value;

         var to = getId('optSelLangTo').value;

         GM_setValue('from',from);

         GM_setValue('to',to);

         getId('divDic').removeChild(getId('divOpt'));

         getId('optionsLink').style.visibility = 'visible';
}




function getTag(name,parent) {

       if(!parent) return document.getElementsByTagName(name);

     return parent.getElementsByTagName(name);
}



function getId(id,parent) {

       if(!parent) return document.getElementById(id);

    return parent.getElementById(id);	
}


function getSelection() {

         var txt = null;

         if(window.getSelection) {

              txt = window.getSelection();

         } else if(document.getSelection) {

              txt = document.getSelection();

         } else if(document.selection) {

              txt = document.selection.createRange().text;
         }
 
   return txt;
}
   

function createElement(typeNode,obj,evtListener,html) {


         var node = document.createElement(typeNode);

             for(var i in obj) {

                 if(obj.hasOwnProperty(i)) {

                      node.setAttribute(i,obj[i]);
                 }
             }

         if(evtListener) {

              var a = evtListener.split(" ");

                  node.addEventListener(a[0],eval(a[1]),eval(a[2]));   
         }

         if(html) node.innerHTML = html;

    return node;
}


function clickedInsideID(target,id) {

         if(target.getAttribute('id') === id)  {

                   return getId(id);
         }//endif


         if(target.parentNode) {

                   while(target = target.parentNode) {

                                  try{

                                     if(target.getAttribute('id') === id) return getId(id);

                                     }catch(e){

                                     }

                   }//end while
         }//endif


     return null;

}//end function



/*
 * Images
 */


function images()
{
	imgLookup = createElement('img',{border:0});

	imgLookup.src = 'data:image/gif,GIF89a%12%00%12%00%B3%00%00%FF%FF%FF%F7%F7%EF%CC%CC%CC%BD%BE%BD%99%99%99ZYZRUR%00%00%00%FE%01%02%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%04%14%00%FF%00%2C%00%00%00%00%12%00%12%00%00%04X0%C8I%2B%1D8%EB%3D%E4%00%60(%8A%85%17%0AG*%8C%40%19%7C%00J%08%C4%B1%92%26z%C76%FE%02%07%C2%89v%F0%7Dz%C3b%C8u%14%82V5%23o%A7%13%19L%BCY-%25%7D%A6l%DF%D0%F5%C7%02%85%5B%D82%90%CBT%87%D8i7%88Y%A8%DB%EFx%8B%DE%12%01%00%3B';
}

//Drag and drop support

var savedTarget = null;
var orgCursor = null;
var dragOK = false;
var dragXOffset = 0;
var dragYOffset = 0;

//set to true we drag
var didDrag = false;


function dragHandler(e) {

         var htype = '-moz-grabbing';

             if(e == null) return;

         var target = e.target;

             orgCursor = target.style.cursor;

         if(target.nodeName.toLowerCase() !== 'div') {

                  return;
         }     

         if(target = clickedInsideID(target,'divDic')) {

                 savedTarget = target;

                 target.style.cursor = htype;

                 dragOK = true;

                 dragXOffset = e.clientX - target.offsetLeft;   

                 dragYOffset = e.clientY - target.offsetTop;


                      target.style.left = e.clientX - dragXOffset + 'px';

                      target.style.right = null;

                      document.addEventListener('mousemove',moveHandler,false);

                      document.addEventListener('mouseup',dragCleanup,false);



                  return false;

         }
}


function moveHandler(e) {

         if(e == null) {return;}

         if(e.button<=1 && dragOK) {

                savedTarget.style.left = e.clientX - dragXOffset + 'px';

                savedTarget.style.top = e.clientY - dragYOffset + 'px';

            return false;
         }
}


function dragCleanup(e) {

          document.removeEventListener('mousemove',moveHandler,false);
 
          document.removeEventListener('mouseup',dragCleanup,false);

          savedTarget.style.cursor=orgCursor;

          dragOK=false;

          didDrag=true;

}



function addGlobalStyle(css) {

         try {

             var elmHead,elmStyle;

                 elmHead = document.getElementsByTagName('head')[0];

                 elmStyle = document.createElement('style');

                 elmStyle.type = 'text/css';

                 elmHead.appendChild(elmStyle);

                 elmStyle.innerHTML = css;

         } catch(e) {

                 if(!document.styleSheets.length) {

                              document.createStyleSheet();  
                 }

                 document.stylesheets[0].cssText += css; 
         } 

}