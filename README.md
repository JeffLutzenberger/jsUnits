jsUnits is a library to match and parse various engineering unit systems. 

For example, the library will recognize "3 ft 3 in" and convert it into internal units (inches) "39"  

Currently the Internal Unit System is English (lbs and inches). 

Example Usage (after including jsUnits.js):

  - Parse a length
      jsUnits.ParseLength(s);
  - Match a length
      var bValid = s.match( jsUnits.feetInchesRegEx );
  - Parse a Pressure (force/area)
      jsUnits.ParseForcePerArea(s); 

