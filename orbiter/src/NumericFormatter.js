//==============================================================================
// A COLLECTION OF NUMERIC FORMATTING FUNCTIONS
//==============================================================================
/** @class */
net.user1.utils.NumericFormatter = new Object();

net.user1.utils.NumericFormatter.dateToLocalHrMinSec = function (date) {
  var timeString = net.user1.utils.NumericFormatter.addLeadingZero(date.getHours()) + ":" 
                 + net.user1.utils.NumericFormatter.addLeadingZero(date.getMinutes()) + ":" 
                 + net.user1.utils.NumericFormatter.addLeadingZero(date.getSeconds());
  return timeString;
}
    
net.user1.utils.NumericFormatter.dateToLocalHrMinSecMs = function (date) {
  return net.user1.utils.NumericFormatter.dateToLocalHrMinSec(date) + "." + net.user1.utils.NumericFormatter.addTrailingZeros(date.getMilliseconds());
}
    
net.user1.utils.NumericFormatter.addLeadingZero = function (n) {
  return ((n>9)?"":"0")+n;
}
    
net.user1.utils.NumericFormatter.addTrailingZeros = function (n) {
  var ns = n.toString();
  
  if (ns.length == 1) {
    return ns + "00";
  } else if (ns.length == 2) {
    return ns + "0";
  } else {
    return ns;
  }
}

net.user1.utils.NumericFormatter.msToElapsedDayHrMinSec = function (ms) {
  var sec = Math.floor(ms/1000);
 
  var min = Math.floor(sec/60);
  sec = sec % 60;
  var timeString = net.user1.utils.NumericFormatter.addLeadingZero(sec);
  
  var hr = Math.floor(min/60);
  min = min % 60;
  timeString = net.user1.utils.NumericFormatter.addLeadingZero(min) + ":" + timeString;
  
  var day = Math.floor(hr/24);
  hr = hr % 24;
  timeString = net.user1.utils.NumericFormatter.addLeadingZero(hr) + ":" + timeString;
  
  if (day > 0) {      
    timeString = day + "d " + timeString;
  }
  
  return timeString;
};