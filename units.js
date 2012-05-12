/*
 * Currently we parse things like:
 *   - 8'
 *   - 8' 8"
 *   - 8' 8 1/8"
 *   - 8 1/8"
 *   - 8 m
 *   - 8 meters
 *   - 8 feet
 *   - 8 ft
 *   - 8 inches
 *   - 8 in
 *   - 8 ft 8 in
 *   - 8 ft 8 inches
 *   - 8 feet 8 in
 *   - 8 feet 8 inches
 *  var whiteSpace = /(\s{0,1})/;
 *  var posNegInteger = /-{0,1}\d/;
 *  var posNegDecimal = /-{0,1}\d*\.{0,1}\d/;
 */

// matches 4.4 " or 4.4 inches or 4.4 in
var inchesRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
var inchesSplit = new RegExp( /(\"|in|inch|inches)/ );
// matches 1/4 " or 1/4 inches or 1/4 in
var inchFracRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
// matches 4.4 ' or 4.4 feet or 4 ft
var feetRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\'|ft|feet)(\s{0,})$/ );
var feetSplit = new RegExp( /(\'|ft|feet)/ );
// matches 4' 4" or 4ft 4in or 4feet 4inches
var feetInchesRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*((\s{0,})|(\s{0,1})(\"|in|inch|inches)(\s{0,}))$/ );
// matches 4' 4 1/4" or 4ft 4 1/4in or 4feet 4 1/4inches
var feetInchesInchFracRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*(\s{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
// matches -42 or 42
var integerRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(\s{0,1})$/ );
// matches -42.0 or 42
var decimalRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})$/ );
// matches 42 m or 42 meters
var meterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(m|meter|meters)(\s{0,})$/ );
var metersSplit = new RegExp( /(m|meter|meters)/ );
// matches 42 cm or 42 centimeters
var centimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})((cm)|(centimeter)|(centimeters))(\s{0,})$/ );
var centimetersSplit = new RegExp( /(cm|centimeter|centimeters)/ );
// matches 42 mm or 42 millimeters
var millimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(mm|millimeter|millimeters)(\s{0,})$/ );
var millimetersSplit = new RegExp( /(mm|millimeter|millimeters)/ );

function parseInch(s)
{
    var tokens = s.split(inchesSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Inches: " + s );
        return 0;
    }
    return Number(tokens[0]);
}

function parseInchFraction(s)
{
    var tokens = s.split(inchesSplit);
    if( tokens.length > 0 ){
        tokens = tokens[0].split(/\//);
        if( tokens.length > 1 ){
            var numerator = tokens[0];
            var denomenator = parseInch(tokens[1]);
            if( !isNaN(numerator) && !isNaN(denomenator) ){
                return Number(numerator)/Number(denomenator);
            }
        }
    }
    throw("Error Parsing Inch Fraction: " + s );
    return 0;
}
function parseFeet(s)
{
    var tokens = s.split(feetSplit);
    if( tokens.length <= 0 || isNaN(tokens[0]) ){
        throw("Error Parsing Feet: " + s );
        return 0;
    }   
    return Number(tokens[0]*12);
}

function wsParseLength( s, blank_unit )
{
    if(s.match( integerRegEx ) || s.match( decimalRegEx )){
        if( blank_unit && (blank_unit === "inches" || blank_unit === "in") )
        {
            return Number(s);
        }
        else
            return Number( s ) * 12;
    }
    if( s.match( inchesRegEx ) ){
        return parseInch(s);
    }
    if( s.match( inchFracRegEx )){
        return parseInchFraction(s);
    }
    if( s.match( feetRegEx ) ){
        return parseFeet(s);
    }
    if( s.match( feetInchesRegEx ) ){
        var tokens = s.split(feetSplit);
        try{
            var feet = Number(tokens[0]);
            var inches = parseInch(tokens[2]); //why is this not 1?
            return feet*12 + inches;
        }catch(er)
        {
            //throw("Error Parsing Feet Inches: " + s + " " + er );
            return 0;
        }
    }
    if( s.match( feetInchesInchFracRegEx ) ){
        var tokens = s.split(feetSplit);
        //for( var index in tokens ) alert(tokens[index]);
        var feet = Number(tokens[0]);
        var tokens = tokens[2].split(" ");
        //for( var index in tokens ) alert(tokens[index]);        
        var inches = Number(tokens[1]);
        var inchFrac = parseInchFraction(tokens[2]);
        return feet*12 + inches + inchFrac;
    }
    if( s.match( meterRegEx ) ){
        //alert( s );
        var tokens = s.split(metersSplit);
        var meters = Number(tokens[0]);
        return meters*39.370078;
    }
    if( s.match( centimeterRegEx ) ){
        //alert( s );
        var tokens = s.split(centimetersSplit);
        var cm = Number(tokens[0]);
        return cm*0.39370078;
    }
    if( s.match( millimeterRegEx ) ){
        //alert( s );
        var tokens = s.split(millimetersSplit);
        var mm = Number(tokens[0]);
        return mm*0.039370078;
    }
    return NaN;
}

function showInches( num )
{
    return Math.round(num) + '"';
}
function showFeetInches( num )
{
    //assume num is in inches (internal unit)
    var feet = Math.floor(num/12);
    var inches = num - feet*12;
    //if( feet == 0 ) return Math.round(inches) + " in ";
    //else if( inches == 0 ) return feet + " ft ";
    //else
    //return feet + " ft " + Math.round(inches) + " in ";
    return feet + "' " + Math.round(inches) + '" ';
}

function showFeetInchesCodes( num )
{
    //assume num is in inches (internal unit)
    var feet = Math.floor(num/12);
    var inches = num - feet*12;
    //if( feet == 0 ) return Math.round(inches) + " in ";
    //else if( inches == 0 ) return feet + " ft ";
    //else
    //return feet + " ft " + Math.round(inches) + " in ";
    return feet + "&#39; " + Math.round(inches) + '&#34; ';
}

/*
 * Forces
 */
var lbsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,})$/ );
var lbsSplit = new RegExp( /(lb|lbs|pound|pounds)/ );
// matches 42 k, 42.0 k or 42 kips or 42.0 kips
var kipsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,})$/ );
var kipsSplit = new RegExp( /(k|kip|kips)/ );
// matches 42 tons, 42.0 ton
var tonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ton|tons)(\s{0,})$/ );
var tonsSplit = new RegExp( /(ton|tons)/ );
// matches 42 n, 42.0 newton or 42 newtons
var newtonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,})$/ );
var newtonsSplit = new RegExp( /(n|newton|newton)/ );
// matches 42 k, 42.0 k or 42 kips or 42.0 kips
var kNRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|kns|killonewton|killonewtons)(\s{0,})$/ );
var kNSplit = new RegExp( /(kn|killonewton|killonewtons)/ );

function parseLbs(s)
{
    var tokens = s.split( lbsSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lbs: " + s );
        return 0;
    }
    return Number(tokens[0]);
}

function parseKips(s)
{
    var tokens = s.split(kipsSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kips: " + s );
        return 0;
    }
    return Number(tokens[0])*1000;
}

function parseTons(s)
{
    var tokens = s.split(tonsSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Tons: " + s );
        return 0;
    }
    return Number(tokens[0])*2000;
}

function parseNewtons(s)
{
    var tokens = s.split(newtonsSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Newtons: " + s );
        return 0;
    }
    return Number(tokens[0])* 0.224808943;
}
function parseKN(s)
{
    var tokens = s.split(kNSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing KN: " + s );
        return 0;
    }
    return Number(tokens[0])* 224.808943;
}

function wsParseForce( s, default_unit )
{
    if(s.match( integerRegEx ) || s.match( decimalRegEx )){
        if( default_unit )
        {
            if( default_unit.match(kipsSplit) )
            {
                return Number(s)*1000;
            }
        }
        return Number(s);
    }
    if( s.match( lbsRegEx ) ){
        return parseLbs(s);
    }
    if( s.match( kipsRegEx )){
        return parseKips(s);
    }
    if( s.match( tonsRegEx ) ){
        return parseTons(s);
    }
    if( s.match( newtonsRegEx ) ){
        return parseNewtons(s);
    }
    if( s.match( kNRegEx ) ){
        return parseKN(s);
    }
    return NaN;
}

function showKips( num )
{
    //assume num is in lbs (internal unit)
    var kip_num = Number(num)*0.001;
    return kip_num.toFixed(2);
}

/*
 * Moments
 */
var lbsInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
var lbsInSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)/ );
var lbsFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
var lbsFtSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)/ );
var kipInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
var kipInSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)/ );
var kipFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
var kipFtSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)/ );
var nMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
var nMSplit = new RegExp( /(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)/ );
var kNMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
var kNMSplit = new RegExp( /(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)/ );

function parseLbsIn(s)
{
    var tokens = s.split( lbsInSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lb in: " + s );
        return 0;
    }
    return Number(tokens[0]);
}

function parseLbsFt(s)
{
    var tokens = s.split( lbsFtSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lb Ft: " + s );
        return 0;
    }
    return Number(tokens[0])*12;
}

function parseKipIn(s)
{
    var tokens = s.split(kipInSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kip In: " + s );
        return 0;
    }
    return Number(tokens[0])*1000;
}

function parseKipFt(s)
{
    var tokens = s.split(kipFtSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kip Ft: " + s );
        return 0;
    }
    return Number(tokens[0])*1000*12;
}

function parseNM(s)
{
    var tokens = s.split(nMSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing N M: " + s );
        return 0;
    }
    return Number(tokens[0])*39.370078* 0.224808943;
}

function parsekNM(s)
{
    var tokens = s.split(kNMSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing KN M: " + s );
        return 0;
    }
    return Number(tokens[0])*1000*39.370078* 0.224808943;
}

function wsParseMoment( s, default_unit )
{
    if(s.match( integerRegEx ) || s.match( decimalRegEx )){
        if( default_unit )
        {
            if( default_unit.match(kipFtSplit) )
            {
                return Number(s)*1000*12;
            }
        }
        return Number(s);
    }
    if( s.match( lbsInRegEx ) ){
        return parseLbsIn(s);
    }
    if( s.match( lbsFtRegEx ) ){
        return parseLbsFt(s);
    }
    if( s.match( kipInRegEx )){
        return parseKipIn(s);
    }
    if( s.match( kipFtRegEx ) ){
        return parseKipFt(s);
    }
    if( s.match( nMRegEx ) ){
        return parseNM(s);
    }
    if( s.match( kNMRegEx ) ){
        return parsekNM(s);
    }
    return NaN;
}

function showKipFt( num )
{
    //assume num is in lbs-in (internal unit)
    return Number(Number(num)/1000/12).toFixed(2);
}

/*
 * Forces per unit length
 */
var lbsPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
var lbsPerInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
var lbsPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
var lbsPerFtSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
var kipPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
var kipPerInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
var kipPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
var kipPerFtSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
var nPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
var nPerMSplit = new RegExp( /(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );
var kNPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
var kNPerMSplit = new RegExp( /(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );

function parseLbsPerIn(s)
{
    var tokens = s.split( lbsPerInSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lb/in: " + s );
        return 0;
    }
    return Number(tokens[0]);
}

function parseLbsPerFt(s)
{
    var tokens = s.split( lbsPerFtSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lb/Ft: " + s );
        return 0;
    }
    return Number(tokens[0])/12;
}

function parseKipPerIn(s)
{
    var tokens = s.split(kipPerInSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kip/In: " + s );
        return 0;
    }
    return Number(tokens[0])*1000;
}

function parseKipPerFt(s)
{
    var tokens = s.split(kipPerFtSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kip/Ft: " + s );
        return 0;
    }
    return Number(tokens[0])*1000/12;
}

function parseNPerM(s)
{
    var tokens = s.split(nPerMSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing N/M: " + s );
        return 0;
    }
    return Number(tokens[0])*39.370078/0.224808943;
}

function parsekNPerM(s)
{
    var tokens = s.split(kNPerMSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing KN/M: " + s );
        return 0;
    }
    return Number(tokens[0])*1000*39.370078/0.224808943;
}

function wsParseForcePerLength( s, default_unit )
{
    if(s.match( integerRegEx ) || s.match( decimalRegEx )){
        if( default_unit )
        {
            if( default_unit.match(kipPerFtSplit) )
            {
                return Number(s)*1000/12;
            }
        }
        return Number(s);
    }
    if( s.match( lbsPerInRegEx ) ){
        return parseLbsPerIn(s);
    }
    if( s.match( lbsPerFtRegEx ) ){
        return parseLbsPerFt(s);
    }
    if( s.match( kipPerInRegEx )){
        return parseKipPerIn(s);
    }
    if( s.match( kipPerFtRegEx ) ){
        return parseKipPerFt(s);
    }
    if( s.match( nPerMRegEx ) ){
        return parseNPerM(s);
    }
    if( s.match( kNPerMRegEx ) ){
        return parsekNPerM(s);
    }
    return NaN;
}

function showKipsPerFt( num )
{
    //assume num is in lbs-in (internal unit)
    return (Number(num)/1000*12).toFixed(2);
}

/*
 * Forces per unit area
 */
var lbsPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch\^2)(\s{0,})$/ );
var lbsPerInInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)/ );
var kipPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)(\s{0,})$/ );
var kipPerInInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in^2|inch\^2)/ );
var ksiRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ksi)$/ );
var ksiSplit = new RegExp( /(ksi)/ );

function parseLbsPerInIn(s)
{
    var tokens = s.split( lbsPerInInSplit );
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Lb/in^2: " + s );
        return 0;
    }
    return Number(tokens[0]);
}

function parseKipPerInIn(s)
{
    var tokens = s.split(kipPerInInSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing Kip/In^2: " + s );
        return 0;
    }
    return Number(tokens[0])*1000;
}

function parseKsi(s)
{
    var tokens = s.split(ksiSplit);
    if( tokens.length <= 0 || isNaN(tokens[0])){
        throw("Error Parsing ksi: " + s );
        return 0;
    }
    return Number(tokens[0])*1000;
}

function wsParseForcePerArea( s, default_unit )
{
    if(s.match( integerRegEx ) || s.match( decimalRegEx )){
        if( default_unit )
        {
            if( default_unit.match(kipPerInInSplit) || default_unit.match(ksiSplit))
            {
                return Number(s)*1000;
            }
        }
        return Number(s);
    }
    if( s.match( lbsPerInInRegEx ) ){
        return parseLbsPerInIn(s);
    }
    if( s.match( kipPerInInRegEx )){
        return parseKipPerInIn(s);
    }
    if( s.match( ksiRegEx ) ){
        return parseKsi(s);
    }
    return NaN;
}

function showKsi( num )
{
    //assume num is in lbs/in-in (internal unit)
    return (Number(num)/1000).toFixed(2) + " ksi";
}
