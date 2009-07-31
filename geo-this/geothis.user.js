// ==UserScript==
// @name           Geo this! Adding a Geolocation button to posts with YQL and Placemaker
// @namespace      http://thinkphp.ro/
// @include        */addentry.*
// ==/UserScript==


var tx = document.getElementById('message');

    if(tx) {

           var b = document.createElement('input');

               b.type = 'button';

               b.value = 'geo this!';

               b.addEventListener('click',function(e){

                         var t = e.target.previousSibling;

                         var url = 'http://query.yahooapis.com/v1/public/yql';

                         var v = t.value.replace(/"/g,'\\"'); 

                             v = t.value.replace(/\n/g,' '); 

                         var data = 'q=SELECT * FROM geo.placemaker WHERE documentContent="'+

                                     encodeURIComponent(v)+'" and documentType="text/plain"'+

                                     'and appid=""&format=json&env='+ 

                                     'http://datatables.org/alltables.env'; 

                         GM_xmlhttpRequest({
                                     method: "POST",
                                     url: url,
                                     headers: {'Content-type':'application/x-www-form-urlencoded'},
                                     data: encodeURI(data),
                                     onload: function(xhr) {

                                             var o = eval('(' + xhr.responseText + ')');

                                                     if(o.query.results && o.query.results.matches) {

                                                                var out = 'Geolocations:';

                                                                var res = []; 

                                                               //if we have multiple geolocations then for 
                                                               if(typeof o.query.results.matches.match.length === 'number') {

                                                                    for(var i=0,j=o.query.results.matches.match.length;i<j;i++) {

                                                                                   var cur = o.query.results.matches.match[i];

                                                                                        res.push('\n\n<-- match:'+cur.reference.text+' -->\n'+

                             
                                                                                             '<span class="vcard">\n<span class="adr">\n'+

                 
                                                                                              '<span class="locality">'+cur.place.name+'</span>\n'+

 
                                                                                              '</span>\n(<span class="geo">\n'+


                                                                                              '<span class="latitude">'+ cur.place.centroid.latitude + '</span>,\n'+

                    
                                                                                              '<span class="longitude">'+ cur.place.centroid.longitude + '</span>,\n</span>)\n</span>');


                                                                    }//endfor

                                                                  out += res.join(", "); 

                                                                //if we have single geolocation then do it 
                                                                } else if(typeof o.query.results.matches.match.length === 'undefined') {

                                                                                    var cur = o.query.results.matches.match;

                                                                                        res.push('\n\n<-- match:'+cur.reference.text+' -->\n'+

                             
                                                                                             '<span class="vcard">\n<span class="adr">\n'+

                 
                                                                                              '<span class="locality">'+cur.place.name+'</span>\n'+

 
                                                                                              '</span>\n(<span class="geo">\n'+


                                                                                              '<span class="latitude">'+ cur.place.centroid.latitude + '</span>,\n'+

                    
                                                                                              '<span class="longitude">'+ cur.place.centroid.longitude + '</span>,\n</span>)\n</span>');

                                                                           out += res; 
                                                                }




                                                      //otherwise couldn`t find any locations for this text
                                                      } else {

                                                                   out = '<!-- No Found Geo Location -->';
                                                      }

                                                  tx.value = tx.value + '\n\n' + out;

                                          }
                         });            



               },true); 

       tx.parentNode.insertBefore(b,tx.nextSibling);      
    
    }//endif
